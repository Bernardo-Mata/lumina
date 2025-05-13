from fastapi import FastAPI
from google import genai

app = FastAPI()

@app.get("/generate-response")
def get_response():
    client = genai.Client(api_key="AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo")
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents="Explain how AI works in a few words"
    )
    return {"response": response.text}


