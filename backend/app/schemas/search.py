from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel
from .standard import StandardResponse, AmendmentResponse, AlliedStandardResponse

class SearchRequest(BaseModel):
    query: str
    top_k: int = 10
    include_allied: bool = True
    language_hint: Optional[str] = None

class FileSearchRequest(BaseModel):
    top_k: int = 10
    include_allied: bool = True

class CertificationInfo(BaseModel):
    is_mandatory: bool
    certification_type: str
    description: str

class SearchResultItem(BaseModel):
    standard: StandardResponse
    relevance_score: float
    rank: int
    match_type: str
    amendments: List[AmendmentResponse] = []
    allied_standards: List[AlliedStandardResponse] = []
    certification_info: Optional[CertificationInfo] = None

class SearchResponse(BaseModel):
    query: str
    detected_language: str
    results: List[SearchResultItem]
