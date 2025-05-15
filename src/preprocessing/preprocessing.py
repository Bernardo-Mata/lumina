import re

def preprocess_text(text: str) -> str:
    """
    Preprocess the input text by removing unwanted characters and patterns.

    Args:
        text (str): The input text to preprocess.

    Returns:
        str: The cleaned and preprocessed text.
    """
    # Remove newline characters and backslashes
    text = re.sub(r'\\n|\\n\\n|\\', ' ', text)
    # Remove asterisks
    text = re.sub(r'\*', '', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text
