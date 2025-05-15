"""
    This module provides a function to generate mitigation strategies for risks
    identified in a supply chain risk management problem using a large language model (LLM).
"""
from google import genai  # Import genai for LLM interaction
from agents.idenfiyRisk import identify_risk_response
from agents.assessingRisk import assessing_risk_response
from agents.riskScore import score_risk_response
from agents.mitigationStrategy import mitigation_strategy_response


def scrm_plan_response() -> str:
    """
    Generates a comprehensive risk management plan for a supply chain risk management problem.
    Args:
        None
    Returns:
        str: The LLM-generated response containing the risk management plan.
    """
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        You are an expert in supply chain risk management.
          Your task is to develop a comprehensive risk management plan based on a user-provided supply chain risk problem.
        Follow these steps sequentially:

        **Step 1: Risk Identification:** Analyze the information gathered in the following output: {identify_risk_response} and identify the potential risks involved. For each identified risk, categorize its severity level into one of the following categories: Alto (High), Medio (Medium), Bajo (Low). Briefly explain your reasoning for the assigned severity level.

        **Step 2: Risk Assessment:** For each risk identified in following output: {assessing_risk_response}, analyze its potential impact (operational, financial, reputational) and the likelihood of its occurrence (High, Medium, Low).

        **Step 3: Risk Scoring:** Assign a risk score to each assessed risk based on this output: {score_risk_response}. The risk score should reflect the overall level of risk based on the analysis of its potential impact and likelihood of occurrence. Use a qualitative scoring system (e.g., Very High, High, Medium, Low, Very Low) or a numerical scoring system (e.g., on a scale of 1 to 10, where 10 is the highest risk). Clearly indicate the scoring system you are using. For each risk, provide the risk score and briefly justify your assigned score based on the previously analyzed impact and likelihood.

        **Step 4: Risk Mitigation Strategies:** For each scored risk in the output: {mitigation_strategy_response}, propose specific and actionable mitigation strategies. For each strategy, outline concrete and implementable actions to reduce the likelihood and/or impact of the risk.

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
            "max_output_tokens": 150,
            "top_p": 0.8,
            "top_k": 40,
        }
    )

    return response.text