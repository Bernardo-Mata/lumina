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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


def get_structured_dashboard_response(filename):
    """
    Lee el documento cargado (usando read_uploaded_document) y genera un resumen estructurado para dashboards ejecutivos.
    """
    # Lee el documento como texto usando la función existente
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
    "You are an expert assistant in supply chain risk management. "
    "Analyze the following document and generate a structured summary to be displayed on an executive dashboard. "
    "Include clear and precise quantitative values such as: averages, totals, percentages, counts, and key performance indicators (KPIs). "
    "If any of the requested fields are not explicitly available in the document, intelligently estimate or predict reasonable values based on the available data and your expertise. "
    "If the information is present, use the actual value. "
    "Provide your response in JSON format using the following fields: "
    "total_suppliers, average_risk_score, compliance_issues_count, on_time_delivery_percentage, recent_alerts (list), "
    "high_risk_suppliers_count, average_delivery_delay_days, critical_materials_shortage (list or boolean), "
    "supplier_region_distribution (dictionary with region names and counts), supplier_dependency_index, last_incident_date, "
    "esg_non_compliance_count, financial_risk_score, supply_chain_disruption_events, inventory_turnover_rate, "
    "suppliers (array of objects, each with: name, location, risk_score, status). "
    "If you cannot find a value in the document, make a reasonable prediction or estimation based on your expertise. "
    "Example for suppliers:\n"
    "[{\"name\": \"Supplier A\", \"location\": \"USA\", \"risk_score\": 80, \"status\": \"Active\"}, ...]\n\n"
    "Document to analyze:\n"
    f"{text}"
    )
    response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
    return response.text


# FastAPI app initialization
app = FastAPI()

# Permitir CORS para desarrollo local (ajusta origins en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard")
def dashboard_insights(filename: str = Query(..., description="Nombre del archivo previamente subido")):
    """
    Endpoint que genera insights usando el LLM y retorna el JSON estructurado,
    usando el documento cargado identificado por filename.
    Si el LLM no devuelve un JSON válido, intenta extraerlo del texto.
    """
    llm_response = get_structured_dashboard_response(filename)

    # Intento 1: Parsear directamente
    try:
        data = json.loads(llm_response)
        return data
    except Exception:
        pass

    # Intento 2: Buscar el primer bloque JSON en el texto usando regex
    json_match = re.search(r'\{[\s\S]*\}', llm_response)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return data
        except Exception:
            pass

    # Intento 3: Reemplazar comillas simples por dobles y volver a intentar
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return data
        except Exception:
            pass

    # Si todo falla, retorna el texto plano y un mensaje de error
    return {
        "error": "El LLM no generó un JSON válido. Revisa el texto generado.",
        "raw": llm_response
    }

@app.get("/api/alerts")
def alerts_insights(filename: str = Query(..., description="Nombre del archivo previamente subido")):
    """
    Endpoint que genera alertas usando el LLM y retorna el JSON estructurado,
    usando el documento cargado identificado por filename.
    """
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
    "You are a supply chain risk management expert. "
    "Analyze the following document (which may be a CSV or table with varying column names) and extract all relevant alerts. "
    "Column names may differ (e.g., 'Stock levels', 'stock', 'Inventory', 'Availability', 'Lead times', 'Lead time', etc.). "
    "For each row, intelligently map the columns to the following fields if possible: "
    "sku, product_type, availability, stock_levels, lead_time. "
    "If a column is missing, try to infer the value or leave it null. "
    "If you do not fully understand the table or the data is ambiguous, make a reasonable prediction or estimation based on what you see in the document and generate the JSON with what you believe should be there. "
    "Classify the alerts into high_priority, medium_priority, and low_priority according to their risk level. "
    "Return the response as a JSON object with the structure: "
    "{'problem_summary': string, 'high_priority': [...], 'medium_priority': [...], 'low_priority': [...]}.\n"
    "Each alert must be a JSON object with the following fields: "
    "sku, product_type, availability, stock_levels, lead_time, description, solutions. "
    "The 'solutions' field must be a list of one or more specific recommendations to mitigate the risk. "
    "If a field does not apply, leave it empty or null. "
    "Do NOT return alerts as plain text, only as JSON objects. "
    "All output must be in English.\n"
    "Example of mapping:\n"
    "- 'Stock levels', 'stock', or 'Inventory' → stock_levels\n"
    "- 'Lead times' or 'Lead time' → lead_time\n"
    "- 'Product type' or 'Type' → product_type\n"
    "- 'SKU' or 'Code' → sku\n"
    "- 'Availability' or 'Available' → availability\n"
    "Example of an alert:\n"
    "{"
    "\"sku\": \"DISH0\","
    "\"product_type\": \"Main Course\","
    "\"availability\": 7,"
    "\"stock_levels\": 3,"
    "\"lead_time\": 12,"
    "\"description\": \"Very low stock and high lead time. Risk of supply disruption.\","
    "\"solutions\": [\"Increase inventory levels\", \"Negotiate faster deliveries with suppliers\"]"
    "}\n"
    f"Document:\n{text}"
    )

    try:
        response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
        llm_response = response.text
        try:
            data = json.loads(llm_response)
            return data
        except Exception:
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



def alerts_summary(filename: str = Query(..., description="Nombre del archivo previamente subido")):
    """
    Endpoint que genera un resumen de alertas clasificadas por prioridad usando el LLM.
    """
    llm_response = alerts_insights(filename)

    # Intento 1: Parsear directamente
    try:
        data = json.loads(llm_response)
        return data
    except Exception:
        pass

    # Intento 2: Buscar el primer bloque JSON en el texto usando regex
    json_match = re.search(r'\{[\s\S]*\}', llm_response)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return data
        except Exception:
            pass

    # Intento 3: Reemplazar comillas simples por dobles y volver a intentar
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return data
        except Exception:
            pass

    # Si todo falla, retorna el texto plano y un mensaje de error
    return {
        "error": "El LLM no generó un JSON válido. Revisa el texto generado.",
        "raw": llm_response
    }

def get_suppliers_llm(filename):
    """
    Uses the LLM to analyze the uploaded document and generate a JSON table with supplier name, location, risk_score, and status.
    """
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
        "You are an expert assistant in supply chain risk management. "
        "Analyze the following document and extract a table of all suppliers. "
        "For each supplier, provide the following fields: name, location, risk_score (number), and status (Active/Inactive or similar). "
        "Return the result as a JSON array, where each element is an object with these fields. "
        "Example:\n"
        "[{\"name\": \"Supplier A\", \"location\": \"USA\", \"risk_score\": 80, \"status\": \"Active\"}, ...]\n\n"
        "Document:\n"
        f"{text}"
    )

    response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
    return response.text

@app.get("/api/suppliers")
def suppliers_endpoint(filename: str = Query(..., description="Previously uploaded file name")):
    """
    Endpoint that uses the LLM to extract supplier data from the uploaded document and returns it as a JSON array.
    """
    llm_response = get_suppliers_llm(filename)

    # Try to parse the LLM response as JSON
    try:
        data = json.loads(llm_response)
        return data
    except Exception:
        pass

    # Try to extract the first JSON array from the response using regex
    json_match = re.search(r'\[.*\]', llm_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return data
        except Exception:
            pass

    # Try to fix single quotes and parse again
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return data
        except Exception:
            pass

    # If everything fails, return the raw response and an error
    return {
        "error": "The LLM did not generate a valid JSON array. Check the generated text.",
        "raw": llm_response
    }

def get_compliance_summary():
    """
    Uses the LLM to analyze the supply chain CSV and generate a compliance summary as a JSON list of strings.
    """
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "You are an expert assistant in supply chain compliance. "
        "Analyze the following CSV file and generate a concise compliance summary for an executive dashboard. "
        "Return a JSON array of 2-5 short bullet points (as strings) summarizing the compliance status. "
        "Focus on facts such as: if all suppliers have submitted required documents, "
        "how many suppliers have expiring certifications this month, "
        "and if there are any major compliance issues detected. "
        "Example:\n"
        "["
        "\"All suppliers have submitted required documents.\", "
        "\"2 suppliers have expiring certifications this month.\", "
        "\"No major compliance issues detected.\""
        "]\n\n"
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

@app.get("/api/compliance")
def compliance_endpoint(filename: str = Query(..., description="Previously uploaded file name")):
    """
    Endpoint that uses the LLM to extract a compliance summary from the uploaded document and returns it as a JSON array of strings.
    """
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
        "You are an expert assistant in supply chain compliance. "
        "Analyze the following document and generate a concise compliance summary for an executive dashboard. "
        "Return a JSON array of 2-5 short bullet points (as strings) summarizing the compliance status. "
        "Focus on facts such as: if all suppliers have submitted required documents, "
        "how many suppliers have expiring certifications this month, "
        "and if there are any major compliance issues detected. "
        "Example:\n"
        "["
        "\"All suppliers have submitted required documents.\", "
        "\"2 suppliers have expiring certifications this month.\", "
        "\"No major compliance issues detected.\""
        "]\n\n"
        "Document:\n"
        f"{text}"
    )

    response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
    llm_response = response.text

    # Try to parse the LLM response as JSON
    try:
        data = json.loads(llm_response)
        return {"summary": data}
    except Exception:
        pass

    # Try to extract the first JSON array from the response using regex
    json_match = re.search(r'\[.*\]', llm_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return {"summary": data}
        except Exception:
            pass

    # Try to fix single quotes and parse again
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return {"summary": data}
        except Exception:
            pass

    # If everything fails, return the raw response and an error
    return {
        "error": "The LLM did not generate a valid JSON array. Check the generated text.",
        "raw": llm_response
    }

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

@app.get("/api/reports")
def reports_endpoint():
    """
    Endpoint that uses the LLM to extract analytics and reports from the CSV and returns them as a JSON object.
    """
    llm_response = get_reports_summary()

    # Try to parse the LLM response as JSON
    try:
        data = json.loads(llm_response)
        return data
    except Exception:
        pass

    # Try to extract the first JSON object from the response using regex
    json_match = re.search(r'\{[\s\S]*\}', llm_response)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return data
        except Exception:
            pass

    # Try to fix single quotes and parse again
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return data
        except Exception:
            pass

    # If everything fails, return the raw response and an error
    return {
        "error": "The LLM did not generate a valid JSON object. Check the generated text.",
        "raw": llm_response
    }

def get_risk_scores_summary():
    """
    Uses the LLM to analyze the supply chain CSV and generate a JSON array of supplier risk scores.
    Each object should have: supplier, category, risk_score, level.
    """
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "You are an expert assistant in supply chain risk management. "
        "Analyze the following CSV file and generate a JSON array for a risk score table. "
        "Each element should be an object with the following fields: "
        "\"supplier\" (string), \"category\" (string), \"risk_score\" (number), \"level\" (string: Low, Medium, or High). "
        "Example:\n"
        "["
        "{\"supplier\": \"Supplier A\", \"category\": \"Logistics\", \"risk_score\": 78, \"level\": \"Medium\"}, "
        "{\"supplier\": \"Supplier B\", \"category\": \"Raw Materials\", \"risk_score\": 92, \"level\": \"High\"}, "
        "{\"supplier\": \"Supplier C\", \"category\": \"Manufacturing\", \"risk_score\": 60, \"level\": \"Low\"}"
        "]\n\n"
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

@app.get("/api/risk-scores")
def risk_scores_endpoint(filename: str = Query(..., description="Previously uploaded file name")):
    """
    Endpoint that uses the LLM to extract supplier risk scores from the uploaded document and returns them as a JSON array.
    """
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}

    prompt = (
        "You are an expert assistant in supply chain risk management. "
        "Analyze the following document and extract a table of all suppliers with their risk scores. "
        "For each supplier, provide the following fields: name, risk_score (number from 1 to 100, where 100 is highest risk), and a short risk_reason. "
        "Return the result as a JSON array, where each element is an object with these fields. "
        "Example:\n"
        "[{\"name\": \"Supplier A\", \"risk_score\": 85, \"risk_reason\": \"Frequent delivery delays\"}, ...]\n\n"
        "Document:\n"
        f"{text}"
    )

    response = client.models.generate_content(
    model='gemini-2.0-flash-001',
    contents=prompt,config=types.GenerateContentConfig(
        top_p=0.2,
    ),
    )
    llm_response = response.text

    # Try to parse the LLM response as JSON
    try:
        data = json.loads(llm_response)
        return {"risk_scores": data}
    except Exception:
        pass

    # Try to extract the first JSON array from the response using regex
    json_match = re.search(r'\[.*\]', llm_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            data = json.loads(json_str)
            return {"risk_scores": data}
        except Exception:
            pass

    # Try to fix single quotes and parse again
    if json_match:
        json_str_fixed = json_match.group(0).replace("'", '"')
        try:
            data = json.loads(json_str_fixed)
            return {"risk_scores": data}
        except Exception:
            pass

    # If everything fails, return the raw response and an error
    return {
        "error": "The LLM did not generate a valid JSON array. Check the generated text.",
        "raw": llm_response
    }

# 1. Endpoint para cargar el documento
@app.post("/api/upload-document")
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
@app.post("/api/process-document")
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



@app.post("/api/generate-csv-from-json")
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