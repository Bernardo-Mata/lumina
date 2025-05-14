from google import genai  # Import genai for LLM interaction
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
import re
router = APIRouter()

# Definir el modelo de datos para el texto recibido
class TextInput(BaseModel):
    text: str
# In-memory storage for processed texts
processed_texts = []

# Ruta POST para recibir texto
@router.post("/process-text/")
def process_text(input: TextInput):
    if not input.text:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío")
    
    # Store the processed text in memory
    processed_texts.append(input.text)
    
    return input.text

@router.get("/get-response/")
def get_response():
    if not processed_texts:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
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
            "max_output_tokens": 150,
            "top_p": 0.8,
            "top_k": 40,
        }
    )

    return response.text


@router.get("/get-preprocess-text/")
def preprocess_text() -> str:
    """
    Preprocess the input text by removing unwanted characters and patterns.

    Args:
        text (str): The input text to preprocess.

    Returns:
        str: The cleaned and preprocessed text.
    """
    text = get_response()
    # Remove newline characters and backslashes
    text = re.sub(r'\\n|\\n\\n|\\', ' ', text)
    # Remove asterisks
    text = re.sub(r'\*', '', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text
