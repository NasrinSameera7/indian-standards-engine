from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class SpecGenerateRequest(BaseModel):
    title: str = Field(..., description="Title of the specification")
    standard_ids: list[int] = Field(..., description="List of standard IDs to include")
    original_query: str | None = None
    additional_requirements: str | None = None
    tender_reference: str | None = None
    estimated_value: str | None = None
    emd_amount: str | None = None
    bid_deadline: str | None = None
    delivery_location: str | None = None

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
