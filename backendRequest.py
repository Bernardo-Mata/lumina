"""
This module sets up the FastAPI backend for handling text
processing and LLM-based research endpoints.
It configures CORS, defines the main FastAPI app,
and includes routers for modular functionality.
"""

import sys
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from agents import llm, research,idenfiyRisk,assessingRisk,mitigationStrategy,riskScore,scrmPlan  # Importing routers from agents module

# Obtén la ruta absoluta al directorio que contiene la carpeta "Agent"
ruta_carpeta_agent = os.path.abspath(os.path.join(os.path.dirname(__file__), 'agents'))
sys.path.append(ruta_carpeta_agent)


# Crear una instancia de FastAPI
app = FastAPI()
"""Main FastAPI application instance."""


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins if needed
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow specific methods
    allow_headers=["*"],  # Allow specific headers
)

@app.get("/")
def read_root():
    """
    GET endpoint for the root path.
    Returns a welcome message.
    """
    return {"message": "Hello"}


app.include_router(llm.router)
app.include_router(research.router)
app.include_router(idenfiyRisk.router)
app.include_router(assessingRisk.router)
app.include_router(mitigationStrategy.router)
app.include_router(riskScore.router)
app.include_router(scrmPlan.router)
# app.include_router(preprocessing.router)

