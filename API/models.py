from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    insights = relationship("Insight", back_populates="user")

class Insight(Base):
    __tablename__ = "insights"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # <-- Asegúrate de tener esto
    filename = Column(String(150))
    csv_filename = Column(String(150))
    dashboard_json = Column(Text)
    alerts_json = Column(Text)
    suppliers_json = Column(Text)
    compliance_json = Column(Text)
    risk_scores_json = Column(Text)
    disruption_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="insights")

class Dashboard(Base):
    __tablename__ = "dashboards"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_suppliers = Column(Integer)
    average_risk_score = Column(Float)
    compliance_issues_count = Column(Integer)
    on_time_delivery_percentage = Column(Float)
    recent_alerts = Column(Text)
    high_risk_suppliers_count = Column(Integer)
    average_delivery_delay_days = Column(Float)
    critical_materials_shortage = Column(Text)
    supplier_region_distribution = Column(Text)
    supplier_dependency_index = Column(Float)
    last_incident_date = Column(String(350))  # <-- Longitud definida
    esg_non_compliance_count = Column(Integer)
    financial_risk_score = Column(Float)
    supply_chain_disruption_events = Column(Integer)
    inventory_turnover_rate = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    priority = Column(String(120))         # <-- Longitud definida
    sku = Column(String(150))              # <-- Longitud definida
    product_type = Column(String(200))    # <-- Longitud definida
    availability = Column(Integer)
    stock_levels = Column(Integer)
    lead_time = Column(Integer)
    description = Column(Text)
    solutions = Column(Text)
    risk_type = Column(Text)
    risk_reason = Column(Text)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))            # <-- Longitud definida
    location = Column(String(100))        # <-- Longitud definida
    risk_score = Column(Float)
    status = Column(String(50))           # <-- Longitud definida
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Compliance(Base):
    __tablename__ = "compliance"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    supplier = Column(String(100))        # <-- Longitud definida
    category = Column(String(100))        # <-- Longitud definida
    risk_score = Column(Float)
    reason = Column(Text)
    level = Column(String(20))            # <-- Longitud definida
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Disruption(Base):
    __tablename__ = "disruption"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    detected = Column(Boolean)
    summary = Column(Text)
    causes = Column(Text)
    affected_suppliers = Column(Text)
    recommendations = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}