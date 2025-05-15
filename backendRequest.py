
# Corrected relative import path
import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agents import llm
from agents import preprocessing
# Obtén la ruta absoluta al directorio que contiene la carpeta "Agent"
ruta_carpeta_agent = os.path.abspath(os.path.join(os.path.dirname(__file__), 'agents'))
sys.path.append(ruta_carpeta_agent)


# Crear una instancia de FastAPI
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins if needed
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow specific methods
    allow_headers=["*"],  # Allow specific headers
)

# Ruta GET para devolver un mensaje de bienvenida
@app.get("/")
def read_root():
    return {"message": "Hola"}

# Definir el modelo de datos para el texto recibido
class TextInput(BaseModel):
    text: str

app.include_router(llm.router)
# app.include_router(preprocessing.router)
