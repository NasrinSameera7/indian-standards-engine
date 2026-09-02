from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class SpecGenerateRequest(BaseModel):
    title: str
    standard_ids: List[int]
    original_query: Optional[str] = None
    additional_requirements: Optional[str] = None

class SpecSection(BaseModel):
    heading: str
    content: str

class SpecResponse(BaseModel):
    id: int
    title: str
    sections: List[SpecSection]
    created_at: datetime

class SpecExportRequest(BaseModel):
    spec_id: int
    format: str = 'pdf'
