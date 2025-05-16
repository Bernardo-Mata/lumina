"""
This module provides a function to generate a simplified and user-friendly explanation
of a supply chain risk management plan using a large language model (LLM).
"""

from fastapi import APIRouter
from google import genai  # Import genai for LLM interaction
from agents.preprocessing import preprocess_text
from agents.research import get_response

router = APIRouter()


@router.get("/get-response/")
def get_llm_response() -> str:
    """
    Generates a simplified and user-friendly explanation of a supply chain risk
    management plan using a large language model (LLM).

    The function retrieves the supply chain risk management plan, constructs a prompt
    instructing the LLM to reformat and explain the plan in plain language, and returns
    the LLM's response. The explanation is organized, concise, and tailored for users
    without a background in supply chain management.

    Returns:
        str: The LLM-generated explanation of the supply chain risk management plan.
    """
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")

    # Research prompt
    prompt = f"""
        You are a communication expert specializing in simplifying complex information. Your task is to take a detailed supply chain risk management plan (provided below) and reformat and explain it in a way that is easily understandable for someone who may not have a background in supply chain management.

        Your goals are to:

        1.  **Organize the information logically:** Structure the plan with clear headings, subheadings, and bullet points to improve readability.
        2.  **Simplify complex language:** Rephrase any technical terms, jargon, or overly academic language into plain and simple English (or the language of the user's original problem, if specified). Provide brief and clear definitions for any essential technical terms that cannot be easily replaced.
        3.  **Summarize key findings:** For each identified risk, briefly summarize its nature, severity, score, and the core of the proposed mitigation strategies in an easily digestible manner.
        4.  **Highlight actionable takeaways:** Emphasize the specific actions recommended in the mitigation strategies so the user understands what steps can be taken.
        5.  **Use analogies or examples:** Where appropriate, use simple analogies or real-world examples to illustrate the risks and the benefits of the proposed mitigation strategies.
        6.  **Maintain a clear and concise writing style:** Avoid unnecessary details or lengthy explanations. Focus on conveying the essential information effectively.
        7.  **Ensure a positive and encouraging tone:** Frame the information in a way that empowers the user to understand and act on the plan.

        Present the following supply chain risk management plan in an easily digestible format for the user:

        Ensure the output is in the same language as the user's input.
        If the user's input is not related to supply chain risk management
        (e.g., general greetings, unrelated definitions), 
        respond with the message:

        "My purpose is to provide solutions for risk management;
        I am not qualified to provide this type of information." 

        Include definitions, problem analysis, potential impact, 
        contributing factors, and any other relevant information
        discovered related to the specified supply chain risk.
        ---
        {get_response()}
        --- 
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
        config={
            "temperature": 0.1,
            "max_output_tokens": 512,
            "top_p": 0.8,
            "top_k": 40,
        }
    )

    llm_response = preprocess_text(response.text)

    return llm_response


