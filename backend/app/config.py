from __future__ import annotations
from typing import List, Dict, Tuple, Any, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/indian_standards"
    FAISS_INDEX_PATH: str = "data/faiss_index/standards.index"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    BHASHINI_API_KEY: str = ""
    BHASHINI_API_URL: str = "https://dhruva-api.bhashini.gov.in"
    TESSERACT_CMD: str = "tesseract"
    BIS_BASE_URL: str = "https://www.services.bis.gov.in"
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    SYNC_SCHEDULE_HOURS: int = 24

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()

def get_settings() -> Settings:
    """FastAPI dependency for injecting settings."""
    return settings
