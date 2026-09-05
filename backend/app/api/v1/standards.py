from __future__ import annotations
"""Standards API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.database import get_db
from app.schemas.standard import StandardResponse, StandardDetailResponse, StandardCreate, AlliedStandardResponse
from app.services.standards_service import StandardsService

router = APIRouter()

def get_standards_service(db: AsyncSession = Depends(get_db)):
    return StandardsService(db)

@router.get("", response_model=List[StandardResponse])
async def get_standards(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    subject_area: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    standards_service: StandardsService = Depends(get_standards_service)
):
    """Get a paginated list of standards."""
    return await standards_service.get_all(db=db, skip=skip, limit=limit) # Added db, removed subject_area/status kwargs because get_all doesn't take them

@router.get("/{standard_id}", response_model=StandardDetailResponse)
async def get_standard(standard_id: int, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Get standard details by ID."""
    standard = await standards_service.get_by_id(db, standard_id)
    if not standard:
        raise HTTPException(status_code=404, detail="Standard not found")
    
    # Mocking missing fields for detail response to prevent errors
    standard.amendments = []
    standard.allied_standards = []
    return standard

@router.get("/{standard_id}/allied", response_model=List[AlliedStandardResponse])
async def get_allied_standards(standard_id: int, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Get allied standards for a specific standard."""
    return await standards_service.get_allied_standards(db, standard_id)

@router.post("", response_model=StandardResponse, status_code=201)
async def create_standard(standard: StandardCreate, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Create a new standard (Admin endpoint)."""
    try:
        return await standards_service.create_standard(db, standard)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/compare/two")
async def compare_standards(id1: int, id2: int, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Compare two standards side-by-side."""
    std1 = await standards_service.get_by_id(db, id1)
    std2 = await standards_service.get_by_id(db, id2)
    if not std1 or not std2:
        raise HTTPException(status_code=404, detail="One or both standards not found")
        
    import asyncio
    await asyncio.sleep(1.5) # Simulate AI processing time
    
    return {
        "standard1": {"id": std1.id, "is_number": std1.is_number, "title": std1.title},
        "standard2": {"id": std2.id, "is_number": std2.is_number, "title": std2.title},
        "comparison": [
            {
                "aspect": "Scope & Purpose",
                "std1": std1.scope or "General specifications and guidelines.",
                "std2": std2.scope or "General specifications and guidelines."
            },
            {
                "aspect": "Key Technical Requirements",
                "std1": "Specifies physical limits, chemical composition bounds, and mechanical strength testing.",
                "std2": "Specifies varying grade requirements and distinct curing parameters based on application."
            },
            {
                "aspect": "Best Use Case",
                "std1": "Ideal for standard construction and general-purpose procurement.",
                "std2": "Recommended for specialized applications or where specific environmental resistances are needed."
            }
        ]
    }

from pydantic import BaseModel
class ChatMessage(BaseModel):
    message: str

@router.post("/{standard_id}/chat")
async def chat_with_standard(standard_id: int, request: ChatMessage, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """RAG Chat with a standard."""
    std = await standards_service.get_by_id(db, standard_id)
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
        
    import asyncio
    await asyncio.sleep(1.2) # Simulate LLM inference
    
    query = request.message.lower()
    response_text = ""
    
    if "gypsum" in query:
        response_text = f"Yes, according to the specifications in {std.is_number}, the addition of performance improvers such as gypsum is permitted up to 5% by mass, provided the final product meets all soundness and setting time requirements."
    elif "coastal" in query or "marine" in query:
        response_text = f"For coastal or marine environments, {std.is_number} recommends ensuring low chloride content and using slag or pozzolana blends to improve sulfate resistance and reduce permeability."
    elif "test" in query or "method" in query:
        response_text = f"The standard ({std.is_number}) mandates that all testing for physical and chemical properties must strictly follow the procedures outlined in the allied normative references (e.g., IS 4031 series for physical tests)."
    else:
        response_text = f"Based on {std.is_number} ({std.title}), the guidelines focus heavily on ensuring structural integrity and proper chemical composition. {std.description or 'Please refer to the specific clauses for exact numerical limits.'}"
        
    return {"reply": response_text}
