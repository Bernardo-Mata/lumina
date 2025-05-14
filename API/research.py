# research.py
import sys
import os
from api.backendRequest import get_last_processed_text
from api.backendRequest import process_text
from api.backendRequest import TextInput
 # Import processed_texts if used
from google import genai  # Import genai for LLM interaction
from fastapi import HTTPException


# Obtén la ruta al directorio padre
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Añade el directorio padre a sys.path si no está ya
if parent_dir not in sys.path:
    sys.path.append(parent_dir)


try:
    input_text = get_last_processed_text()
    last_text = input_text["last_processed_text"]
    print(last_text)
except HTTPException as e:
    print(f"Error: {e.detail}")
processed_result = process_text(TextInput(text=input_text))  # Ensure proper input format


def get_response():
    if not processed_result:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    #research prompt
    prompt = f"""
        Conduct a comprehensive search across the internet
        for all available information regarding the following
        supply chain risk management
        problem provided by the user: {processed_result}.
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
