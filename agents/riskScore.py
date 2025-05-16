"""Python script to identify supply chain risks using Google GenAI API.
This script defines a function to analyze supply chain risk management problems
"""
from google import genai  # Import genai for LLM interaction
from agents.assessingRisk import assessing_risk_response
from fastapi import APIRouter

router = APIRouter()

@router.get("/score_risk_response/")
def score_risk_response() -> str:
    """
    Assigns a risk score to each assessed risk in a supply chain risk management problem.
    Args:
        None
    Returns:
        str: The LLM-generated response containing the risk score
        and justification for each assessed risk.
    """
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        Given the following assessed risks within the supply chain:

        ---
        {assessing_risk_response()}
        ---

        Your task is to assign a risk score to each of these assessed risks. The risk score should reflect the overall level of risk based on the analysis of its potential impact and likelihood of occurrence.

        You can use a qualitative scoring system (e.g., Very High, High, Medium, Low, Very Low) or a numerical scoring system (e.g., on a scale of 1 to 10, where 10 is the highest risk). Please clearly indicate the scoring system you are using.

        For each risk, provide the risk score and briefly justify your assigned score based on the previously analyzed impact and likelihood.

        **Output Format:**

        **Risk:** [Description of the Risk]
        **Severity:** [High/Medium/Low] (from previous analysis)
        **Potential Impact:** [Brief summary of potential consequences]
        **Likelihood of Occurrence:** [Brief summary of probability]

        **Risk Score:** [Assigned Risk Score (e.g., High or 7/10)]
        **Justification:** [Brief explanation of why this score was assigned based on impact and likelihood]

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