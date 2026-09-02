from __future__ import annotations
from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class GeneratedSpecification(Base):
    __tablename__ = "generated_specifications"

    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("search_queries.id"), nullable=True)
    title = Column(String, nullable=False)
    content_json = Column(JSON, nullable=False)
    selected_standard_ids = Column(JSON, nullable=True)
    export_format = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    user_session_id = Column(String, nullable=True)
