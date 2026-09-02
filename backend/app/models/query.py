from __future__ import annotations
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class SearchQuery(Base):
    __tablename__ = "search_queries"

    id = Column(Integer, primary_key=True, index=True)
    raw_input = Column(Text, nullable=False)
    normalized_input = Column(Text, nullable=True)
    input_language = Column(String, default='en')
    input_type = Column(String, default='TEXT')
    file_name = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    user_session_id = Column(String, nullable=True)

    results = relationship("SearchResult", back_populates="query")

class SearchResult(Base):
    __tablename__ = "search_results"

    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("search_queries.id"), nullable=False)
    standard_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    relevance_score = Column(Float, nullable=False)
    rank = Column(Integer, nullable=False)
    match_type = Column(String, default='SEMANTIC')

    query = relationship("SearchQuery", back_populates="results")
    standard = relationship("IndianStandard")
