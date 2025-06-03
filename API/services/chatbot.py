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
from API.reporting import get_user_full_report
from fastapi import Depends
from sqlalchemy.orm import Session
from API.database import SessionLocal
from API.auth import get_current_user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EMBEDDING_MODEL = "models/embedding-001"         
LLM_MODEL = "gemini-2.0-flash-001"              



prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are an expert assistant in data engineering and supply chain risk management, with full access to search the entire internet for up-to-date information.\n"
        "You have access to the following CONTEXT, which is a JSON representation of the user's entire supply chain database.\n"
        "Whenever the user asks about the database, its structure, suggestions, or any question related to the data or its context, always answer based on the CONTENT of the CONTEXT provided below. "
        "Do NOT describe the database schema, columns, or table names unless explicitly asked. "
        "If the user asks about the database, provide insights, summaries, or examples based on the actual data values present in the CONTEXT.\n"
        "If the question is not about the database, answer as best as possible using your expertise and the context if relevant.\n\n"
        "Context:\n{context}\n\n"
        "Instructions:\n"
        "- For every user question, search the internet for the most relevant, recent, and authoritative information if needed.\n"
        "- Provide clear, step-by-step answers, including code snippets, explanations, and references when possible.\n"
        "- If the user asks for a function to extract a database and convert it to JSON, provide a complete, ready-to-use example in the requested programming language.\n"
        "- If the user asks for something else, do your best to help, searching the web as needed.\n"
        "- Always return your answer in English.\n"
        "- If you cannot find an answer, explain what you tried and suggest alternative approaches.\n\n"
        "User question: {question}\n"
        "Answer:"
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

# Ejemplo de función para obtener el contexto real usando get_user_full_report
def get_context_from_full_report(db, current_user):
    # Llama la función y convierte el resultado a string JSON
    report = get_user_full_report(db=db, current_user=current_user)
    return json.dumps(report, ensure_ascii=False, indent=2, default=str)

async def ask_chatbot(db, current_user, question):
    context = get_context_from_full_report(db, current_user)
    prompt = prompt_template.format(context=context, question=question)
    llm, retriever = build_chain_from_json(context)
    # Recupera contexto relevante
    # docs = retriever.get_relevant_documents(question)
    result = await llm.ainvoke(prompt)
    return result.content if hasattr(result, "content") else result

router = APIRouter()

# Variable global para guardar la última respuesta
last_response = {"answer": None}

class ChatRequest(BaseModel):
    question: str

@router.post("/chatbot/ask")
async def chatbot_ask(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    answer = await ask_chatbot(db, current_user, request.question)
    last_response["answer"] = answer
    return {"answer": answer}

@router.get("/chatbot/last")
async def chatbot_last():
    if last_response["answer"] is not None:
        return {"answer": last_response["answer"]}
    return {"answer": "No hay respuesta previa disponible."}