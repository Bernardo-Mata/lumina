import re
# Replace 'research' with the correct module or ensure it is installed
from agents.llm import get_response  # Adjust the import based on your project structure

  # Import genai for LLM interaction
from fastapi import APIRouter


router = APIRouter()

@router.post("/get-preprocess_text/")
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

