import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv
from fastapi import APIRouter


load_dotenv(dotenv_path=".env.examples")  

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS = True,   
    MAIL_SSL_TLS = False,   
    USE_CREDENTIALS = True
)

async def send_high_risk_alert(to_email: EmailStr, alert_info: str):
    message = MessageSchema(
        subject="¡Alerta de High Risk detectada!",
        recipients=[to_email],
        body=f"Se ha detectado un riesgo alto en la cadena de suministro:\n\n{alert_info}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

router = APIRouter()

@router.post("/test-email")
async def test_email(to_email: str):
    await send_high_risk_alert(to_email, "Esta es una prueba de alerta de High Risk.")
    return {"message": "Correo de prueba enviado"}