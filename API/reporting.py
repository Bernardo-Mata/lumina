from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .models import Dashboard, Alert, Supplier, Compliance, Disruption
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

@router.get("/api/user_suppliers")
def get_user_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    suppliers = db.query(Supplier).filter(Supplier.user_id == current_user.id).all()
    return [s.as_dict() for s in suppliers]

@router.get("/api/user_compliance")
def get_user_compliance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    compliance = db.query(Compliance).filter(Compliance.user_id == current_user.id).all()
    return [c.as_dict() for c in compliance]

@router.get("/api/user_disruption")
def get_user_disruption(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    disruption = db.query(Disruption).filter(Disruption.user_id == current_user.id).all()
    return [d.as_dict() for d in disruption]

