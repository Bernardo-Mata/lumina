"""
backendRequest.py

This module provides a FastAPI backend for processing user text and generating
comprehensive supply chain risk management plans using a Google LLM (Gemini).
It includes endpoints for receiving user input, storing it, and returning a
preprocessed LLM-generated response. The response is cleaned to remove unwanted
characters for better readability.

Endpoints:
    - POST /process-text/: Receives and stores user text.
    - GET /get-response/: Returns a cleaned LLM-generated risk management plan.

Functions:
    - process_text: Stores user input for later processing.
    - get_response: Generates a risk management plan using the LLM.
    - preprocess_text: Cleans and returns the LLM output.
"""


from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from .models import User, Insight, Dashboard, Alert, Supplier, Compliance, RiskScore, Disruption
from .database import SessionLocal
from .auth import get_current_user, create_access_token
import os
import json
import docx
import PyPDF2
import time
from google import genai
from google.genai import types
import re

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
UPLOAD_FOLDER = "uploaded_docs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# Duplicate get_db() definition removed to avoid redefinition error.

# ----------- MODELOS -----------

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

# ----------- REGISTRO -----------

@router.post("/register-user")
async def register_user(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered", "user_id": db_user.id}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# ----------- CARGAR DOCUMENTO -----------

@router.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        with open(save_path, "wb") as f:
            contents = await file.read()
            f.write(contents)
        return {"success": True, "filename": file.filename, "message": "the file has been saved successfully."}
    except Exception as e:
        return {"success": False, "error": f"Error al guardar el archivo: {str(e)}"}

# ----------- FUNCIÓN PARA LEER DOCUMENTO -----------

def read_uploaded_document(filename):
    filename = os.path.basename(filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    suffix = os.path.splitext(filename)[-1].lower()
    try:
        if suffix == ".pdf":
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        elif suffix in [".csv", ".txt"]:
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
        elif suffix in [".doc", ".docx"]:
            doc = docx.Document(path)
            text = "\n".join([p.text for p in doc.paragraphs])
        elif suffix == ".json":
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            return None, "Tipo de archivo no soportado."
        return text, None
    except Exception as e:
        return None, f"Error leyendo el archivo: {str(e)}"

# ----------- FUNCIÓN get_unified_llm_response -----------

client = genai.Client(api_key='AIzaSyBS0ERWhkYDIaMifZD1IWpFWGNtSyfZUPo')

def get_unified_llm_response(filename):
    text, error = read_uploaded_document(filename)
    if error:
        return {"error": error}
    prompt = (
    "You are an expert assistant in supply chain risk management. "
    "Analyze the following document and return a JSON object with the following fields. "
    "For each section, return the data as an array of objects, where each object matches a row in the corresponding database table. "
    "Use the exact field names and types as specified below. "
    "If a field is missing, use null or an empty string. "
    "Return ONLY the JSON object, with all sections as top-level fields. Do NOT include explanations or extra text.\n\n"

    "1. dashboard: Array of objects, each with:\n"
    "   - total_suppliers (integer)\n"
    "   - average_risk_score (number)\n"
    "   - compliance_issues_count (integer)\n"
    "   - on_time_delivery_percentage (number, 0-100)\n"
    "   - recent_alerts (string)\n"
    "   - high_risk_suppliers_count (integer)\n"
    "   - average_delivery_delay_days (number)\n"
    "   - critical_materials_shortage (string)\n"
    "   - supplier_region_distribution (string)\n"
    "   - supplier_dependency_index (number)\n"
    "   - last_incident_date (string, ISO format)\n"
    "   - esg_non_compliance_count (integer)\n"
    "   - financial_risk_score (number)\n"
    "   - supply_chain_disruption_events (integer)\n"
    "   - inventory_turnover_rate (number)\n"
    "Example:\n"
    "[{\"total_suppliers\": 10, \"average_risk_score\": 75.2, ...}]\n\n"

    "2. alerts: Array of objects, each with:\n"
    "   - priority (string: High, Medium, Low)\n"
    "   - sku (string)\n"
    "   - product_type (string)\n"
    "   - availability (integer)\n"
    "   - stock_levels (integer)\n"
    "   - lead_time (integer)\n"
    "   - description (string)\n"
    "   - solutions (string)\n"
    "Example:\n"
    "[{\"priority\": \"High\", \"sku\": \"DISH0\", \"product_type\": \"Main Course\", \"availability\": 7, \"stock_levels\": 3, \"lead_time\": 12, \"description\": \"Very low stock and high lead time. Risk of supply disruption.\", \"solutions\": \"Increase inventory levels; Negotiate faster deliveries with suppliers\"}]\n\n"

    "3. suppliers: Array of objects, each with:\n"
    "   - name (string)\n"
    "   - location (string)\n"
    "   - risk_score (number)\n"
    "   - status (string)\n"
    "Example:\n"
    "[{\"name\": \"Supplier A\", \"location\": \"USA\", \"risk_score\": 80, \"status\": \"Active\"}]\n\n"

    "4. compliance: Array of objects, each with:\n"
    "   - summary (string)\n"
    "Example:\n"
    "[{\"summary\": \"All suppliers have submitted required documents.\"}]\n\n"

    "5. risk_scores: Array of objects, each with:\n"
    "   - supplier (string)\n"
    "   - category (string)\n"
    "   - risk_score (number)\n"
    "   - reason (string)\n"
    "   - level (string: Low, Medium, or High)\n"
    "Example:\n"
    "[{\"supplier\": \"Supplier A\", \"category\": \"Logistics\", \"risk_score\": 78, \"reason\": \"High risk due to financial instability\", \"level\": \"Medium\"}]\n\n"

    "6. disruption: Array of objects, each with:\n"
    "   - detected (boolean)\n"
    "   - summary (string)\n"
    "   - causes (string)\n"
    "   - affected_suppliers (string)\n"
    "   - recommendations (string)\n"
    "Example:\n"
    "[{\"detected\": true, \"summary\": \"Significant delays and low inventory detected due to supplier strike.\", \"causes\": \"Supplier strike; Low inventory; Delayed shipments\", \"affected_suppliers\": \"Supplier A; Supplier B\", \"recommendations\": \"Increase safety stock; Diversify suppliers; Negotiate alternative logistics\"}]\n\n"

    "Instructions:"
    "- If a field is missing or cannot be found in the document, ESTIMATE or PREDICT a reasonable value based on the available data and your expertise. Do NOT leave fields as null."
    "- For numeric fields, provide your best estimate."
    "- For categorical fields (like status), use the most likely value based on context."
    "- For arrays, generate plausible example data if not present."
    "- All objects in arrays must have ALL fields filled with a value (never null)."
    "- Do NOT repeat the same supplier or alert unless the document clearly indicates duplicates."
    "- Return ONLY the JSON object, with all sections as top-level fields. Do NOT include explanations or extra text."
    "- All output must be in English."

    f"Document to analyze:\n{text}"
)
    response = client.models.generate_content(
        model='gemini-2.0-flash-001',
        contents=prompt,
        config=types.GenerateContentConfig(top_p=0.2),
    )
    return response.text


def robust_json_parse(llm_response):
    # Try direct parse
    try:
        return json.loads(llm_response)
    except Exception:
        pass
    # Try to extract first JSON object or array
    json_match = re.search(r'\{[\s\S]*\}|\[[\s\S]*\]', llm_response)
    if json_match:
        json_str = json_match.group(0)
        try:
            return json.loads(json_str)
        except Exception:
            pass
        # Try fixing single quotes
        json_str_fixed = json_str.replace("'", '"')
        try:
            return json.loads(json_str_fixed)
        except Exception:
            pass
    return None

# ----------- ENDPOINTS DASHBOARD, ALERTS, ETC -----------
def insert_tabular_data_from_llm(llm_json, db, current_user):
    for dashboard in llm_json.get("dashboard", []):
        db.add(Dashboard(**filter_model_fields(Dashboard, {**dashboard, "user_id": current_user.id})))
    for alert in llm_json.get("alerts", []):
        db.add(Alert(**filter_model_fields(Alert, {**alert, "user_id": current_user.id})))
    for supplier in llm_json.get("suppliers", []):
        db.add(Supplier(**filter_model_fields(Supplier, {**supplier, "user_id": current_user.id})))
    for compliance in llm_json.get("compliance", []):
        db.add(Compliance(**filter_model_fields(Compliance, {**compliance, "user_id": current_user.id})))
    for risk_score in llm_json.get("risk_scores", []):
        db.add(RiskScore(**filter_model_fields(RiskScore, {**risk_score, "user_id": current_user.id})))
    for disruption in llm_json.get("disruption", []):
        db.add(Disruption(**filter_model_fields(Disruption, {**disruption, "user_id": current_user.id})))
    db.commit()

    
@router.get("/api/dashboard")
def dashboard_insights(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "dashboard" not in llm_json:
        raise HTTPException(status_code=400, detail="No dashboard data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    dashboards = db.query(Dashboard).filter(Dashboard.user_id == current_user.id).all()
    return [d.as_dict() for d in dashboards]

@router.get("/api/alerts")
def alerts_insights(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "alerts" not in llm_json:
        raise HTTPException(status_code=400, detail="No alerts data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    alerts = db.query(Alert).filter(Alert.user_id == current_user.id).all()
    return [a.as_dict() for a in alerts]

@router.get("/api/suppliers")
def suppliers_endpoint(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "suppliers" not in llm_json:
        raise HTTPException(status_code=400, detail="No suppliers data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    suppliers = db.query(Supplier).filter(Supplier.user_id == current_user.id).all()
    return [s.as_dict() for s in suppliers]

@router.get("/api/compliance")
def compliance_endpoint(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "compliance" not in llm_json:
        raise HTTPException(status_code=400, detail="No compliance data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    compliance = db.query(Compliance).filter(Compliance.user_id == current_user.id).all()
    return [c.as_dict() for c in compliance]

@router.get("/api/risk_scores")
def risk_scores_endpoint(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "risk_scores" not in llm_json:
        raise HTTPException(status_code=400, detail="No risk_scores data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    risk_scores = db.query(RiskScore).filter(RiskScore.user_id == current_user.id).all()
    return [r.as_dict() for r in risk_scores]

@router.get("/api/disruption")
def disruption_endpoint(
    filename: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    llm_response = get_unified_llm_response(filename)
    llm_json = robust_json_parse(llm_response)
    if not llm_json or "disruption" not in llm_json:
        raise HTTPException(status_code=400, detail="No disruption data found in LLM response.")
    insert_tabular_data_from_llm(llm_json, db, current_user)
    disruption = db.query(Disruption).filter(Disruption.user_id == current_user.id).all()
    return [d.as_dict() for d in disruption]

# ----------- GUARDAR INSIGHTS -----------

@router.post("/guardar-insight")
async def guardar_insight(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    insight = Insight(
        user_id=current_user.id,
        filename=data.get("filename", ""),
        csv_filename=data.get("csv_filename", ""),
        dashboard_json=json.dumps(data.get("dashboard", []), ensure_ascii=False),
        alerts_json=json.dumps(data.get("alerts", []), ensure_ascii=False),
        suppliers_json=json.dumps(data.get("suppliers", []), ensure_ascii=False),
        compliance_json=json.dumps(data.get("compliance", []), ensure_ascii=False),
        risk_scores_json=json.dumps(data.get("risk_scores", []), ensure_ascii=False),
        disruption_json=json.dumps(data.get("disruption", []), ensure_ascii=False),
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return {"message": "Insight guardado", "insight_id": insight.id}

def filter_model_fields(model, data):
    return {k: v for k, v in data.items() if k in model.__table__.columns.keys() and k != "id"}

@router.post("/guardar-insight-tabular")
async def guardar_insight_tabular(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    for dashboard in data.get("dashboard", []):
        db.add(Dashboard(**filter_model_fields(Dashboard, {**dashboard, "user_id": current_user.id})))
    for alert in data.get("alerts", []):
        db.add(Alert(**filter_model_fields(Alert, {**alert, "user_id": current_user.id})))
    for supplier in data.get("suppliers", []):
        db.add(Supplier(**filter_model_fields(Supplier, {**supplier, "user_id": current_user.id})))
    for compliance in data.get("compliance", []):
        db.add(Compliance(**filter_model_fields(Compliance, {**compliance, "user_id": current_user.id})))
    for risk_score in data.get("risk_scores", []):
        db.add(RiskScore(**filter_model_fields(RiskScore, {**risk_score, "user_id": current_user.id})))
    for disruption in data.get("disruption", []):
        db.add(Disruption(**filter_model_fields(Disruption, {**disruption, "user_id": current_user.id})))
    db.commit()
    return {"message": "All sections saved successfully"}

@router.get("/api/insights")
def get_user_insights(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    insights = db.query(Insight).filter(Insight.user_id == current_user.id).all()
    return [i.as_dict() for i in insights]

