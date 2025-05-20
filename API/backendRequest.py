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

from google import genai  # Import genai for LLM interaction
import re
import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Add the absolute path to the 'agents' directory to sys.path
ruta_carpeta_agent = os.path.abspath(os.path.join(os.path.dirname(__file__), 'agents'))
sys.path.append(ruta_carpeta_agent)

# Create FastAPI app instance
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins if needed
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow specific methods
    allow_headers=["*"],  # Allow specific headers
)

@app.get("/")
def read_root():
    """
    Root endpoint that returns a welcome message.
    """
    return {"message": "Hola"}

class TextInput(BaseModel):
    """
    Pydantic model for receiving user text input.
    """
    text: str

# In-memory storage for processed texts
processed_texts = []

@app.post("/process-text/")
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
    Generates a comprehensive supply chain risk management plan using the LLM
    based on the last user-provided text.

    Returns:
        str: The LLM-generated risk management plan.

    Raises:
        HTTPException: If no processed texts are available.
    """
    if not processed_texts:
        raise HTTPException(status_code=404, detail="No hay textos procesados disponibles")
    
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        You are an expert in supply chain risk management. Your task is to develop a comprehensive risk management plan based on a user-provided supply chain risk problem. Follow these steps sequentially:
        If the user's input is not related to supply chain risk management
        (e.g., general greetings, unrelated definitions), respond with the message:
        "My purpose is to provide solutions for risk management;
        I am not qualified to provide this type of information." 

        Include definitions, problem analysis, potential impact, 
        contributing factors, and any other relevant information
        discovered related to the specified supply chain risk.

        **Step 1: Information Gathering:** Conduct a comprehensive search across the internet for all available information regarding the following supply chain risk management problem provided by the user: {processed_texts[-1]}. Ensure your internal output is in the same language as the user's input and focuses exclusively on supply chain risk management. If the user's input is not related to supply chain risk management, state: "My purpose is to provide solutions for risk management; I am not qualified to provide this type of information." Include definitions, problem analysis, potential impact, contributing factors, and any other relevant information discovered.

        **Step 2: Risk Identification:** Analyze the information gathered in Step 1 and identify the potential risks involved. For each identified risk, categorize its severity level into one of the following categories: Alto (High), Medio (Medium), Bajo (Low). Briefly explain your reasoning for the assigned severity level.

        **Step 3: Risk Assessment:** For each risk identified in Step 2, analyze its potential impact (operational, financial, reputational) and the likelihood of its occurrence (High, Medium, Low).

        **Step 4: Risk Scoring:** Assign a risk score to each assessed risk based on its potential impact and likelihood. Use a clear scoring system (either qualitative like Very High, High, Medium, Low, Very Low, or numerical like 1-10). Justify your assigned score.

        **Step 5: Risk Mitigation Strategies:** For each scored risk in Step 4, propose specific and actionable mitigation strategies. For each strategy, outline concrete and implementable actions to reduce the likelihood and/or impact of the risk.

        Present the final output in a structured format, clearly outlining each identified risk, its severity, assessment (impact and likelihood), score, and proposed mitigation strategies with specific actions.

        **Final Output Format:**

        **Risk:** [Description of Risk]
        **Severity:** [Alto/Medio/Bajo]
        **Potential Impact:** [Description]
        **Likelihood of Occurrence:** [High/Medium/Low]
        **Risk Score:** [Assigned Score]
        **Justification:** [Reason for the score]
        **Mitigation Strategies:**
        * **Strategy 1:** [Name of Strategy]
            * **Actions:** [List of specific actions]
        * **Strategy 2:** [Name of Strategy]
            * **Actions:** [List of specific actions]
        * [...]

        ---
        Repeat this format for each identified risk.

        
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
        config={
            "temperature": 0.1,
            "max_output_tokens": 600,
            "top_p": 0.8,
            "top_k": 40,
        }
    )

    return response.text

@app.get("/get-response/")
def preprocess_text() -> str:
    """
    Calls the LLM to generate a risk management plan and preprocesses the output
    by removing unwanted characters and patterns.

    Returns:
        str: The cleaned and preprocessed LLM output.
    """
    text = get_response()
    # Remove newline characters and backslashes
    text = re.sub(r'\\n|\\n\\n|\\', ' ', text)
    # Remove asterisks
    text = re.sub(r'\*', '', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text