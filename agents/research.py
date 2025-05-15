"""
This module provides FastAPI endpoints and utility functions for processing user text,
generating LLM-based responses for supply chain risk management, and preprocessing
the resulting text to remove unwanted characters.
"""

import re
from google import genai  # Import genai for LLM interaction
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel

router = APIRouter()

class TextInput(BaseModel):
    """
    Pydantic model for receiving text input from the user.
    """
    text: str

# In-memory storage for processed texts
processed_texts = []

@router.post("/process-text/")
def process_text(input: TextInput):
    """
    Receives user text input, validates it, and stores it in memory.

    Args:
        input (TextInput): The input text from the user.

    Returns:
        str: The original input text.
    """
    if not input.text:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío")
    processed_texts.append(input.text)
    return input.text

def get_response() -> str:
    """
    Generates a supply chain risk management response using the last processed text.

    Returns:
        str: The LLM-generated response.

    Raises:
        HTTPException: If no processed texts are available.
    """
    if not processed_texts:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")
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

def preprocess_text() -> str:
    """
    Preprocess the LLM response text by removing unwanted characters and patterns.

    Returns:
        str: The cleaned and preprocessed text.
    """
    text = get_response()
    text = re.sub(r'\\n|\\n\\n|\\', ' ', text)
    text = re.sub(r'\*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text