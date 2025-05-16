"""Python script to identify supply chain risks using Google GenAI API.
This script defines a function to analyze supply chain risk management problems
"""
from google import genai  # Import genai for LLM interaction
from agents.idenfiyRisk import identify_risk_response
from fastapi import APIRouter

router = APIRouter()

@router.get("/assessing_risk_response/")
def assessing_risk_response() -> str:
    """
    Analyzes the potential impact and likelihood of occurrence for 
    identified risks in a supply chain risk management problem.
    Args:
        None
    Returns:
        str: The LLM-generated response containing the risk assessment for each identified risk.
    """
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        Given the following identified and categorized risks within the supply chain:

        ---
        {identify_risk_response()}
        ---

        Your task is to perform a risk assessment for each of these identified risks. For each risk, you should:

        1.  **Analyze the potential impact:** Describe the potential consequences or disruptions this risk could cause to the supply chain, including operational, financial, and reputational impacts.
        2.  **Analyze the likelihood of occurrence:** Based on the provided information (if available) and general knowledge of supply chain vulnerabilities, assess the probability of this risk occurring.
        3.  **Suggest potential mitigation strategies:** Propose actionable steps or strategies that can be implemented to reduce the likelihood and/or impact of this risk.

        Present your risk assessment in a clear and structured format for each risk.

        **Output Format:**

        **Risk:** [Description of the Risk]
        **Severity:** [High/Medium/low] (from previous analysis)

        **Risk Assessment:**

        * **Potential Impact:** [Detailed description of potential consequences]
        * **Likelihood of Occurrence:** [Assessment of probability - e.g., High, Medium, Low, with brief justification if possible]
        Ensure the output is in the same language as the user's input.
        ---

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