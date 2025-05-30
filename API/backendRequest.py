"""
backendRequest.py

This module provides a FastAPI backend for processing user text and generating
comprehensive supply chain risk management plans using a Google LLM (Gemini).
It includes endpoints for receiving user input, storing it, and returning a
preprocessed LLM-generated response. The response is cleaned to remove unwanted
characters for better readability.

Endpoints:
    - POST /process-text/: Receives and stores user text.
    - GET /get-response/: Returns a cleaned LLM-generated risk management plan.

Functions:
    - process_text: Stores user input for later processing.
    - get_response: Generates a risk management plan using the LLM.
    - preprocess_text: Cleans and returns the LLM output.
"""


from typing import List, Dict, Any
from google import genai
from google.genai import types
from fastapi import APIRouter

from fastapi import UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse
import json
import re
import io
import os
import PyPDF2
import docx
import time
# Configura tu API Key de Google GenAI
client = genai.Client(api_key='AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo')
# FastAPI app initialization
router = APIRouter()

# # Permitir CORS para desarrollo local (ajusta origins en producción)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Ruta del archivo CSV
CSV_PATH = ""
UPLOAD_FOLDER = "uploaded_docs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Clase para estructurar la respuesta para los dashboards
class DashboardData:
    def __init__(self, records: List[Dict[str, Any]]):
        self.total_suppliers = len(records)
        self.risk_scores = self._extract_risk_scores(records)
        self.compliance_issues = self._extract_compliance_issues(records)
        self.recent_alerts = self._extract_recent_alerts(records)
        self.on_time_delivery = self._extract_on_time_delivery(records)

    def _extract_risk_scores(self, records):
        # Ejemplo: extraer promedios o lista de puntajes de riesgo
        scores = [float(r.get("risk_score", 0)) for r in records if "risk_score" in r]
        return {
            "average": sum(scores) / len(scores) if scores else 0,
            "scores": scores
        }

    def _extract_compliance_issues(self, records):
        # Ejemplo: contar issues de cumplimiento
        return sum(1 for r in records if r.get("compliance_issue", "").lower() == "yes")

    def _extract_recent_alerts(self, records):
        # Ejemplo: filtrar alertas recientes
        return [
            {
                "type": r.get("alert_type", ""),
                "location": r.get("location", ""),
                "timestamp": r.get("timestamp", "")
            }
            for r in records if r.get("alert_type")
        ]

    def _extract_on_time_delivery(self, records):
        # Ejemplo: calcular porcentaje de entregas a tiempo
        deliveries = [r.get("on_time_delivery", "0") for r in records]
        deliveries = [float(d) for d in deliveries if d.replace('.', '', 1).isdigit()]
        return sum(deliveries) / len(deliveries) if deliveries else 0

    def as_dict(self):
        return {
            "total_suppliers": self.total_suppliers,
            "risk_scores": self.risk_scores,
            "compliance_issues": self.compliance_issues,
            "recent_alerts": self.recent_alerts,
            "on_time_delivery": self.on_time_delivery
        }


def get_unified_llm_response(filename):
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}
    prompt = (

        "You are an expert assistant in supply chain risk management. "
        "Analyze the following document and return a SINGLE JSON OBJECT with the following top-level fields, each containing the requested data:\n\n"

        "1. dashboard_summary: An object with key performance indicators (KPIs) and executive metrics. Include:\n"
        "   - total_suppliers (integer)\n"
        "   - average_risk_score (number)\n"
        "   - compliance_issues_count (integer)\n"
        "   - on_time_delivery_percentage (number, 0-100)\n"
        "   - recent_alerts (array of strings)\n"
        "   - high_risk_suppliers_count (integer)\n"
        "   - average_delivery_delay_days (number)\n"
        "   - critical_materials_shortage (array of strings or boolean)\n"
        "   - supplier_region_distribution (object: region name as key, count as value)\n"
        "   - supplier_dependency_index (number)\n"
        "   - last_incident_date (string, ISO format)\n"
        "   - esg_non_compliance_count (integer)\n"
        "   - financial_risk_score (number)\n"
        "   - supply_chain_disruption_events (integer)\n"
        "   - inventory_turnover_rate (number)\n"
        "   - suppliers (array of objects: name, location, risk_score, status)\n\n"

        "2. alerts: An object with the following structure:\n"
        "   - problem_summary (string)\n"
        "   - high_priority (array of alert objects)\n"
        "   - medium_priority (array of alert objects)\n"
        "   - low_priority (array of alert objects)\n"
        "Each alert object must have: sku, product_type, availability, stock_levels, lead_time, description, solutions (array of strings).\n"
        "If a field does not apply, use null or an empty string.\n"
        "Example:\n"
        "{"
        "\"sku\": \"DISH0\","
        "\"product_type\": \"Main Course\","
        "\"availability\": 7,"
        "\"stock_levels\": 3,"
        "\"lead_time\": 12,"
        "\"description\": \"Very low stock and high lead time. Risk of supply disruption.\","
        "\"solutions\": [\"Increase inventory levels\", \"Negotiate faster deliveries with suppliers\"]"
        "}\n\n"

        "3. suppliers: An array of supplier objects, each with:\n"
        "   - name (string)\n"
        "   - location (string)\n"
        "   - risk_score (number)\n"
        "   - status (string, e.g., Active/Inactive)\n"
        "Example:\n"
        "[{\"name\": \"Supplier A\", \"location\": \"USA\", \"risk_score\": 80, \"status\": \"Active\"}, ...]\n\n"

        "4. compliance_summary: An array of 2-5 short bullet points (strings) summarizing compliance status. Focus on:\n"
        "- Whether all suppliers have submitted required documents\n"
        "- How many suppliers have expiring certifications this month\n"
        "- Any major compliance issues detected\n"
        "Example:\n"
        "["
        "\"All suppliers have submitted required documents.\", "
        "\"2 suppliers have expiring certifications this month.\", "
        "\"No major compliance issues detected.\""
        "]\n\n"

        "5. risk_scores: An array of objects, each with:\n"
        "   - supplier (string)\n"
        "   - category (string)\n"
        "   - risk_score (number)\n"
        "   - reason (string, e.g., High risk due to financial instability)\n"
        "   - level (string: Low, Medium, or High)\n"
        "Example:\n"
        "["
        "{\"supplier\": \"Supplier A\", \"category\": \"Logistics\", \"risk_score\": 78, \"level\": \"Medium\"}, "
        "{\"supplier\": \"Supplier B\", \"category\": \"Raw Materials\", \"risk_score\": 92, \"level\": \"High\"}, "
        "{\"supplier\": \"Supplier C\", \"category\": \"Manufacturing\", \"risk_score\": 60, \"level\": \"Low\"}"
        "]\n\n"

        "Instructions:\n"
        "- If a field is missing in the document, estimate or predict a reasonable value based on the available data and your expertise.\n"
        "- Use consistent field names as specified above.\n"
        "- Map column names intelligently (e.g., 'Stock levels', 'stock', 'Inventory' → stock_levels; 'Lead times' or 'Lead time' → lead_time; etc.).\n"
        "- Return ONLY the JSON object, with all sections as top-level fields. Do NOT include explanations or extra text.\n"
        "- All output must be in English.\n\n"

        "6. disruption: An object describing any detected supply chain disruption. "
        "Identify and summarize disruptions based on the following parameters (if present):\n"
        "- Significant delivery delays or transit times much longer than usual.\n"
        "- Lack of availability of key products or critically low inventory levels.\n"
        "- Unexpected increases in transportation, raw material, or production costs.\n"
        "- Supplier alerts about operational, financial, or logistical problems.\n"
        "- External incidents: natural disasters, strikes, geopolitical conflicts, border closures, etc.\n"
        "- Contract or compliance breaches.\n"
        "- Sudden demand changes that cannot be met by supply.\n"
        "- Quality issues or mass returns.\n"
        "Return the disruption section as a JSON object with these fields:\n"
        "   - detected (boolean)\n"
        "   - summary (string, concise description of the disruption or 'No disruption detected')\n"
        "   - causes (array of strings, listing the main causes found)\n"
        "   - affected_suppliers (array of supplier names or empty array)\n"
        "   - recommendations (array of strings with mitigation actions)\n"
        "Example:\n"
        "{"
        "\"detected\": true,"
        "\"summary\": \"Significant delays and low inventory detected due to supplier strike.\","
        "\"causes\": [\"Supplier strike\", \"Low inventory\", \"Delayed shipments\"],"
        "\"affected_suppliers\": [\"Supplier A\", \"Supplier B\"],"
        "\"recommendations\": [\"Increase safety stock\", \"Diversify suppliers\", \"Negotiate alternative logistics\"]"
        "}\n\n"

        "Instructions:\n"
        "- If a field is missing in the document, estimate or predict a reasonable value based on the available data and your expertise.\n"
        "- Use consistent field names as specified above.\n"
        "- Map column names intelligently (e.g., 'Stock levels', 'stock', 'Inventory' → stock_levels; 'Lead times' or 'Lead time' → lead_time; etc.).\n"
        "- Return ONLY the JSON object, with all sections as top-level fields. Do NOT include explanations or extra text.\n"
        "- All output must be in English.\n\n"

        f"Document to analyze:\n{text}"
        
    )
    response = client.models.generate_content(
        model='gemini-2.0-flash-001',
        contents=prompt,
        config=types.GenerateContentConfig(top_p=0.2),
    )
    return response.text


def robust_json_parse(llm_response):
    # Try direct parse
    try:
        return json.loads(llm_response)
    except Exception:
        pass
    # Try to extract first JSON object or array
    json_match = re.search(r'\{[\s\S]*\}|\[[\s\S]*\]', llm_response)
    if json_match:
        json_str = json_match.group(0)
        try:
            return json.loads(json_str)
        except Exception:
            pass
        # Try fixing single quotes
        json_str_fixed = json_str.replace("'", '"')
        try:
            return json.loads(json_str_fixed)
        except Exception:
            pass
    return None





@router.get("/api/dashboard")
def dashboard_insights(filename: str = Query(...)):
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "dashboard_summary" in data:
        return data["dashboard_summary"]
    elif data:
        return {"error": "dashboard_summary not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}

@router.get("/api/alerts")
def alerts_insights(filename: str = Query(...)):
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "alerts" in data:
        return data["alerts"]
    elif data:
        return {"error": "alerts not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}


@router.get("/api/suppliers")
def suppliers_endpoint(filename: str = Query(...)):
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "suppliers" in data:
        return data["suppliers"]
    elif data:
        return {"error": "suppliers not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}


@router.get("/api/compliance")
def compliance_endpoint(filename: str = Query(...)):
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "compliance_summary" in data:
        return {"summary": data["compliance_summary"]}
    elif data:
        return {"error": "compliance_summary not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}

import re
import json

def get_reports_summary():
    """
    Uses the LLM to analyze the supply chain CSV and generate a JSON object with:
    - Monthly risk trend analysis
    - Supplier performance summary
    - Compliance audit logs
    - Custom exportable reports (summary)
    """
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "You are an expert assistant in supply chain analytics. "
        "Analyze the following CSV file and generate a JSON object with the following fields: "
        "\"monthly_risk_trend_analysis\" (string), "
        "\"supplier_performance_summary\" (string), "
        "\"compliance_audit_logs\" (string), "
        "\"custom_exportable_reports\" (string). "
        "Each field should contain a concise summary or insight for an executive report. "
        "Example:\n"
        "{"
        "\"monthly_risk_trend_analysis\": \"Risk scores have increased slightly over the past month, with a spike in week 3.\", "
        "\"supplier_performance_summary\": \"Most suppliers met KPIs, but 2 had delayed shipments.\", "
        "\"compliance_audit_logs\": \"No major compliance issues detected. 2 minor documentation delays.\", "
        "\"custom_exportable_reports\": \"All data is available for export in CSV and PDF formats.\""
        "}\n\n"
        "CSV file:\n"
        f"{csv_content}"
    )

    response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
    return response.text

@router.get("/api/reports")
def reports_endpoint(filename: str = Query(...)):
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "reports" in data:
        return data["reports"]
    elif data:
        return {"error": "reports not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}



@router.get("/api/disruption")
def risk_scores_endpoint(filename: str = Query(...)):   
    llm_response = get_unified_llm_response(filename)
    data = robust_json_parse(llm_response)
    if data and "disruption" in data:
        return {"disruption": data["disruption"]}
    elif data:
        return {"error": "disruption not found", "raw": data}
    else:
        return {"error": "Invalid JSON", "raw": llm_response}

# 1. Endpoint para cargar el documento
@router.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Sube el documento y lo guarda en disco. No llama al LLM.
    """
    suffix = os.path.splitext(file.filename)[-1]
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        with open(save_path, "wb") as f:
            contents = await file.read()
            f.write(contents)
        return {"success": True, "filename": file.filename, "message": "the file has been saved successfully."}
    except Exception as e:
        return {"success": False, "error": f"Error al guardar el archivo: {str(e)}"}

# 2. Función para leer el documento cargado
def read_uploaded_document(filename):
    # Solo el nombre base, sin rutas
    filename = os.path.basename(filename)
    path = os.path.join("uploaded_docs",filename)
    
    suffix = os.path.splitext(filename)[-1].lower()
    
    try:
        if suffix == ".pdf":
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        elif suffix in [".csv", ".txt"]:
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
        elif suffix in [".doc", ".docx"]:
            doc = docx.Document(path)
            text = "\n".join([p.text for p in doc.paragraphs])
        elif suffix == ".json":
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            return None, "Tipo de archivo no soportado."
        return text, None
    except Exception as e:
        return None, f"Error leyendo el archivo: {str(e)}"

# 3. Endpoint para procesar el documento con el LLM
@router.post("/api/process-document")
async def process_document(filename: str = Form(...)):
    """
    Lee el documento cargado y lo procesa con el LLM para generar un JSON.
    """
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
        "Eres un asistente experto en análisis de documentos de cadena de suministro. "
        "Convierte el siguiente documento a un formato JSON estructurado, extrayendo los datos clave relevantes. "
        "Incluye valores cuantitativos claros y precisos como: promedios, totales, porcentajes, conteos y métricas clave. "
        "Por ejemplo: total de proveedores, promedio de riesgo, porcentaje de entregas a tiempo, número de incidencias de cumplimiento, etc. "
        "Devuelve la respuesta en formato JSON con los siguientes campos: "
        "total_suppliers, average_risk_score, compliance_issues_count, on_time_delivery_percentage, recent_alerts (lista)\n\n"
        "Si es un CSV, JSON o tabla, estructura los datos como una lista de objetos JSON. "
        "Si es un PDF o Word, resume y extrae los datos cuantitativos en formato JSON. "
        "ejemplo de lo que puede ir en el JSON:\n"
        "Documento:\n"
        f"{text}"
    )

    try:
        response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
        llm_response = response.text
        # Intenta parsear el JSON generado
        try:
            data = json.loads(llm_response)
            return data
        except Exception:
            # Busca el primer bloque JSON en el texto usando regex
            json_match = re.search(r'\{[\s\S]*\}|\[[\s\S]*\]', llm_response)
            if json_match:
                json_str = json_match.group(0)
                try:
                    data = json.loads(json_str)
                    return data
                except Exception:
                    pass
            return {"error": "El LLM no generó un JSON válido. Revisa el texto generado.", "raw": llm_response}
    except Exception as e:
        return {"error": f"Error procesando con LLM: {str(e)}"}



@router.post("/api/generate-csv-from-json")
async def generate_csv_from_json(form_json: dict = None):
    """
    Recibe un JSON con la información del formulario, usa el LLM para generar un CSV
    con la cantidad de registros indicada en units_available (o similar).
    El CSV se guarda en uploaded_docs/ y también se devuelve como archivo descargable.
    """
    if not form_json:
        return {"error": "No JSON data provided."}

    prompt = (
        "You are an expert in supply chain data simulation. "
        "Given the following JSON with product and company information, generate a realistic CSV file. "
        "The CSV must have as many rows as the value in 'units_available' (or a similar field). "
        "Each row should represent a product unit, including all relevant fields such as: "
        "sku, product_type, unit_price, supplier_name, location, stock, lead_time, units_per_order, "
        "shipping_company, average_shipping_cost, manufacturing_days, manufacturing_cost, "
        "last_quality_inspection, defective_percentage, main_transport_mode, main_route, total_cost, etc. "
        "Also, invent and include additional suppliers and other fields as needed to make the data realistic. "
        "If the JSON mentions only one supplier, generate more suppliers with plausible data. "
        "Return ONLY the CSV, with headers in English, and no explanations or extra text.\n\n"
        f"JSON:\n{json.dumps(form_json, indent=2)}"
    )

    response = client.models.generate_content(
        model='gemini-2.0-flash-001',
        contents=prompt,
        config=types.GenerateContentConfig(top_p=0.2),
    )
    csv_text = response.text

    # Guarda el CSV en uploaded_docs con un nombre único
    filename = f"generated_{int(time.time())}.csv"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(csv_text)

    # Devuelve el nombre del archivo y el CSV como descarga
    return StreamingResponse(
        io.StringIO(csv_text),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "X-Generated-Filename": filename  # Puedes leer este header en el frontend
        }
    )
