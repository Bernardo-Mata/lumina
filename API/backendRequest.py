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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import re
import csv

# Configura tu API Key de Google GenAI
client = genai.Client(api_key='AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo')

# Ruta del archivo CSV
CSV_PATH = "database/supply_chain_data.csv"

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


def get_structured_dashboard_response():
    """
    Lee el archivo CSV y genera un resumen estructurado para dashboards ejecutivos.
    """
    # Lee el CSV como texto
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "Eres un asistente experto en gestión de riesgos de cadena de suministro. "
        "Analiza el siguiente archivo CSV y genera un resumen estructurado para mostrar en un dashboard ejecutivo. "
        # "Incluye insights clave, riesgos principales, oportunidades de mejora y recomendaciones. "
        "Incluye valores cuantitativos claros y precisos como: promedios, totales, porcentajes, conteos y métricas clave. "
        "Por ejemplo: total de proveedores, promedio de riesgo, porcentaje de entregas a tiempo, número de incidencias de cumplimiento, etc. "
        "Devuelve la respuesta en formato JSON con los siguientes campos: "
        "total_suppliers, average_risk_score, compliance_issues_count, on_time_delivery_percentage, recent_alerts (lista)\n\n"
        f"Archivo CSV:\n{csv_content}"
    )

    response = client.models.generate_content(
    model='gemini-2.0-flash-001', contents=prompt)
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
def dashboard_insights():
    """
    Endpoint que genera insights usando el LLM y retorna el JSON estructurado.
    Si el LLM no devuelve un JSON válido, intenta extraerlo del texto.
    """
    llm_response = get_structured_dashboard_response()

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

def get_alerts_summary():
    """
    Lee el archivo CSV y genera un resumen de alertas clasificadas por prioridad usando el LLM.
    """
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "Eres un asistente experto en gestión de riesgos de cadena de suministro. "
        "Analiza el siguiente archivo CSV y extrae todas las alertas, clasificándolas por prioridad: "
        "alta (roja), media (amarilla), baja (verde). "
        "Devuelve la respuesta en formato JSON con los siguientes campos: "
        "high_priority (lista de alertas), medium_priority (lista), low_priority (lista). "
        "Cada alerta debe tener: type, location, timestamp, y una breve descripción.\n\n"
        "Devuelve la respuesta en Ingles.\n\n"
        f"Archivo CSV:\n{csv_content}"
    )

    response = client.models.generate_content(
        model='gemini-2.0-flash-001', contents=prompt
    )
    return response.text

@app.get("/api/alerts-summary")
def alerts_summary():
    """
    Endpoint que genera un resumen de alertas clasificadas por prioridad usando el LLM.
    """
    llm_response = get_alerts_summary()

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

def get_suppliers_llm():
    """
    Uses the LLM to analyze the supply chain CSV and generate a JSON table with supplier name, location, risk score, and status.
    """
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        csv_content = f.read()

    prompt = (
        "You are an expert assistant in supply chain risk management. "
        "Analyze the following CSV file and extract a table of all suppliers. "
        "For each supplier, provide the following fields: name, location, risk_score, and status. "
        "Return the result as a JSON array, where each element is an object with these fields. "
        "Example:\n"
        "[{\"name\": \"Supplier A\", \"location\": \"USA\", \"risk_score\": 80, \"status\": \"Active\"}, ...]\n\n"
        "CSV file:\n"
        f"{csv_content}"
    )

    response = client.models.generate_content(
        model='gemini-2.0-flash-001', contents=prompt
    )
    return response.text

@app.get("/api/suppliers")
def suppliers_endpoint():
    """
    Endpoint that uses the LLM to extract supplier data from the CSV and returns it as a JSON array.
    """
    llm_response = get_suppliers_llm()

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
        model='gemini-2.0-flash-001', contents=prompt
    )
    return response.text

@app.get("/api/compliance")
def compliance_endpoint():
    """
    Endpoint that uses the LLM to extract a compliance summary from the CSV and returns it as a JSON array of strings.
    """
    llm_response = get_compliance_summary()

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
        model='gemini-2.0-flash-001', contents=prompt
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
        model='gemini-2.0-flash-001', contents=prompt
    )
    return response.text

@app.get("/api/risk-scores")
def risk_scores_endpoint():
    """
    Endpoint that uses the LLM to extract supplier risk scores from the CSV and returns them as a JSON array.
    """
    llm_response = get_risk_scores_summary()

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

