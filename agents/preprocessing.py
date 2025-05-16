import re
# Replace 'research' with the correct module or ensure it is installed
 # Adjust the import based on your project structure

  # Import genai for LLM interaction
from fastapi import APIRouter


router = APIRouter()

# @router.post("/get_preprocess_text/")
def preprocess_text(inputs: str) -> str:
    """
    Preprocess the input text by removing unwanted characters and patterns.

    Args:
        text (str): The input text to preprocess.

    Returns:
        str: The cleaned and preprocessed text.
    """
    text = inputs
    # Remove newline characters and backslashes
    text = re.sub(r'\\n|\\n\\n|\\', ' ', text)
    # Remove asterisks
    text = re.sub(r'\*', '', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

