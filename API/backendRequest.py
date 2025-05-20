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
        "Incluye insights clave, riesgos principales, oportunidades de mejora y recomendaciones. "
        "Incluye valores cuantitativos claros y precisos como: promedios, totales, porcentajes, conteos y métricas clave. "
        "Por ejemplo: total de proveedores, promedio de riesgo, porcentaje de entregas a tiempo, número de incidencias de cumplimiento, etc. "
        "Devuelve la respuesta en formato JSON con los siguientes campos: "
        "total_suppliers, average_risk_score, compliance_issues_count, on_time_delivery_percentage, recent_alerts (lista), summary, main_risks, improvement_opportunities, recommendations.\n\n"
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

# Ejemplo de uso:
#print(get_structured_dashboard_response())

