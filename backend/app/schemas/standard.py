from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class StandardBase(BaseModel):
    is_number: str
    part: Optional[str] = None
    section: Optional[str] = None
    title: str
    scope: Optional[str] = None
    description: Optional[str] = None
    subject_area: Optional[str] = None
    division: Optional[str] = None
    technical_committee: Optional[str] = None
    year_of_publication: Optional[int] = None
    latest_year: Optional[int] = None
    status: str
    superseded_by: Optional[str] = None
    is_mandatory_certification: bool
    certification_type: str

class StandardCreate(StandardBase):
    pass

class StandardResponse(StandardBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class AmendmentResponse(BaseModel):
    id: int
    amendment_number: int
    year: int
    description: Optional[str] = None
    is_latest: bool
    model_config = ConfigDict(from_attributes=True)

class AlliedStandardResponse(BaseModel):
    id: int
    is_number: str
    title: str
    reference_type: str
    year_of_publication: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class StandardDetailResponse(StandardResponse):
    amendments: List[AmendmentResponse] = []
    allied_standards: List[AlliedStandardResponse] = []
    model_config = ConfigDict(from_attributes=True)

class NormativeReferenceCreate(BaseModel):
    source_standard_id: int
    target_standard_id: int
    reference_type: str
