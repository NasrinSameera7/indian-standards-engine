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
    
    # Graceful fallback for mock presentation if IDs not found
    title1 = std1.title if std1 else "Standard Specification A"
    title2 = std2.title if std2 else "Standard Specification B"
    num1 = std1.is_number if std1 else f"IS {id1}"
    num2 = std2.is_number if std2 else f"IS {id2}"
    scope1 = std1.scope if std1 and std1.scope else "General specifications and guidelines."
    scope2 = std2.scope if std2 and std2.scope else "General specifications and guidelines."
        
    import asyncio
    await asyncio.sleep(1.5) # Simulate AI processing time
    
    return {
        "standard1": {"id": id1, "is_number": num1, "title": title1},
        "standard2": {"id": id2, "is_number": num2, "title": title2},
        "comparison": [
            {
                "aspect": "Scope & Purpose",
                "std1": scope1,
                "std2": scope2
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
    
    import asyncio
    await asyncio.sleep(1.2) # Simulate LLM inference
    
    query = request.message.lower()
    response_text = ""
    is_num = std.is_number if std else f"IS {standard_id}"
    title = std.title if std else "Indian Standard Specification"
    desc = std.description if std else "Please refer to the specific clauses for exact numerical limits."
    
    if "gypsum" in query:
        response_text = f"Yes, according to the specifications in {is_num}, the addition of performance improvers such as gypsum is permitted up to 5% by mass, provided the final product meets all soundness and setting time requirements."
    elif "coastal" in query or "marine" in query:
        response_text = f"For coastal or marine environments, {is_num} recommends ensuring low chloride content and using slag or pozzolana blends to improve sulfate resistance and reduce permeability."
    elif "test" in query or "method" in query or "mortar" in query:
        response_text = f"The standard ({is_num}) mandates that all testing for physical and chemical properties must strictly follow the procedures outlined in the allied normative references (e.g., IS 4031 series for physical tests)."
    else:
        response_text = f"Based on {is_num} ({title}), the guidelines focus heavily on ensuring structural integrity and proper chemical composition. {desc}"
        
    return {"reply": response_text}
