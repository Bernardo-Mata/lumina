"""
    This module provides a function to generate mitigation strategies for risks
"""
from google import genai  # Import genai for LLM interaction
from agents.riskScore import score_risk_response

def mitigation_strategy_response() -> str:
    """
    Proposes specific and actionable mitigation strategies for each scored risk
    in a supply chain risk management problem.
    Args:
        None
    Returns:
        str: The LLM-generated response containing the proposed mitigation strategies
        for each scored risk.
    """
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        Given the following scored risks within the supply chain:

        ---
        {score_risk_response()}
        ---

        Your task is to propose specific and actionable mitigation strategies for each of these risks. For each risk, consider the following:

        1.  **Review the risk assessment:** Understand the potential impact, likelihood of occurrence, and assigned risk score.
        2.  **Identify potential mitigation approaches:** Brainstorm various strategies to either reduce the likelihood of the risk occurring, minimize its potential impact if it does occur, or both.
        3.  **Propose specific actions:** For each identified approach, outline concrete and implementable actions.

        Present your proposed mitigation strategies in a clear and structured format for each risk.

        **Output Format:**

        **Risk:** [Description of the Risk]
        **Risk Score:** [Assigned Risk Score]

        **Mitigation Strategies:**

        * **Strategy 1:** [Name of the strategy (e.g., Diversification of Suppliers)]
            * **Actions:**
                * [Specific Action 1 (e.g., Identify and onboard at least two alternative suppliers for critical components.)]
                * [Specific Action 2 (e.g., Establish clear criteria for evaluating and qualifying new suppliers.)]
                * [...]
        * **Strategy 2:** [Name of the strategy (e.g., Enhanced Inventory Management)]
            * **Actions:**
                * [Specific Action 1 (e.g., Implement a safety stock policy based on demand variability and lead times.)]
                * [Specific Action 2 (e.g., Utilize predictive analytics to forecast potential demand fluctuations.)]
                * [...]
        * [...]

        ---
        Repeat this format for each scored risk in the input.
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