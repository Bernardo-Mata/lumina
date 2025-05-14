from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai

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


@app.get("/generate-response")
def get_response():
    if not processed_texts:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    #research prompt
    prompt = f"""
        Conduct a comprehensive search across the internet
        for all available information regarding the following
        supply chain risk management
        problem provided by the user: {processed_texts[-1]}.
        Ensure the output is in the same language as the user's input.
        If the user's input is not related to supply chain risk management
        (e.g., general greetings, unrelated definitions), 
        respond with the message:

        "My purpose is to provide solutions for risk management;
        I am not qualified to provide this type of information." 

        Include definitions, problem analysis, potential impact, 
        contributing factors, and any other relevant information
        discovered related to the specified supply chain risk.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
        config={
            "temperature": 0.1,
            "max_output_tokens": 512,
            "top_p": 0.8,
            "top_k": 40,
        }
    )

    return {"response": response.text}