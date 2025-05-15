from google import genai  # Import genai for LLM interaction
from agents.llm import get_response

def identify_risk_response() -> str:  
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        Given the following information gathered about a supply chain risk management problem:

        ---
        {get_response()}
        ---

        Your task is to analyze this information and identify the potential risks involved.
        For each identified risk, categorize its severity level into one of the following categories:

        * **(High):** Risks with a high likelihood of occurrence and/or a high potential impact on the supply chain.
        * **(Medium):** Risks with a moderate likelihood of occurrence and/or a moderate potential impact on the supply chain.
        * **(Low):** Risks with a low likelihood of occurrence and/or a low potential impact on the supply chain.

        Present your analysis in a clear and structured format,
        listing each identified risk along with its corresponding severity level.
        If possible, briefly explain your reasoning for the assigned severity level based on the provided information.
        **Output Format:**

        Risk 1: [Description of Risk 1] - Severity: [Alto/Medio/Bajo] (Reasoning: [Brief explanation])
        Risk 2: [Description of Risk 2] - Severity: [Alto/Medio/Bajo] (Reasoning: [Brief explanation])
        Ensure the output is in the same language as the user's input.
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


