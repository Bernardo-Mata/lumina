from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .models import Dashboard, Alert
from .database import SessionLocal
from .auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/api/user_dashboards")
def get_user_dashboards(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    dashboards = db.query(Dashboard).filter(Dashboard.user_id == current_user.id).all()
    return [d.as_dict() for d in dashboards]

@router.get("/api/user_alerts")
def get_user_alerts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    alerts = db.query(Alert).filter(Alert.user_id == current_user.id).all()
    return [a.as_dict() for a in alerts]

