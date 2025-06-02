from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
import os
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EMBEDDING_MODEL = "models/embedding-001"         # SOLO para embeddings
LLM_MODEL = "gemini-2.0-flash-001"               # SOLO para el chatbot

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "Eres un asistente experto en cadena de suministro. "
        "Responde de forma clara y precisa usando solo la información proporcionada. "
        "Si la pregunta no tiene respuesta en los datos, responde 'No tengo esa información'.\n\n"
        "Contexto:\n{context}\n\n"
        "Pregunta del usuario: {question}\n"
        "Respuesta:"
    )
)

def build_chain_from_json(json_data):
    # Convierte el JSON a una lista de documentos de Langchain
    docs = [Document(page_content=json.dumps(json_data, ensure_ascii=False))]
    embeddings = GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=GOOGLE_API_KEY
    )
    vectorstore = FAISS.from_documents(docs, embeddings)
    retriever = vectorstore.as_retriever()
    llm = ChatGoogleGenerativeAI(
        model=LLM_MODEL,
        google_api_key=GOOGLE_API_KEY,
        temperature=0.2
    )
    # No se usa memoria/conversación aquí
    return llm, retriever

async def ask_chatbot(json_data, question):
    llm, retriever = build_chain_from_json(json_data)
    # Recupera contexto relevante
    docs = retriever.get_relevant_documents(question)
    context = "\n".join([doc.page_content for doc in docs])
    prompt = prompt_template.format(context=context, question=question)
    result = await llm.ainvoke(prompt)
    return result.content if hasattr(result, "content") else result

router = APIRouter()

# Variable global para guardar la última respuesta
last_response = {"answer": None}

class ChatRequest(BaseModel):
    json_data: dict
    question: str

@router.post("/chatbot/ask")
async def chatbot_ask(request: ChatRequest):
    answer = await ask_chatbot(request.json_data, request.question)
    last_response["answer"] = answer
    return {"answer": answer}

@router.get("/chatbot/last")
async def chatbot_last():
    if last_response["answer"] is not None:
        return {"answer": last_response["answer"]}
    return {"answer": "No hay respuesta previa disponible."}