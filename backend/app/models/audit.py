from __future__ import annotations
from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=True)
    entity_id = Column(Integer, nullable=True)
    user_session_id = Column(String, nullable=True)
    details_json = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, server_default=func.now(), index=True)
