from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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
    return {"message": processed_texts}

# Definir el modelo de datos para el texto recibido
class TextInput(BaseModel):
    text: str

# In-memory storage for processed texts
processed_texts = []

# Ruta POST para recibir texto
@app.post("/process-text/")
def process_text(input: TextInput):
    if not input.text.strip():
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío")
    
    # Store the processed text in memory
    processed_texts.append(input.text)
    
    return {"original_text": input.text, "stored_texts": processed_texts}

# Ruta GET para obtener el último texto procesado
@app.get("/get-array/")
def get_last_processed_text():
    if not processed_texts:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    return {"last_processed_text": processed_texts[-1]}

