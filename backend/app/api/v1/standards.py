from __future__ import annotations
"""Standards API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.database import get_db
from app.schemas.standard import StandardResponse, StandardDetailResponse, StandardCreate, AlliedStandardResponse
from app.services.standards_service import StandardsService

router = APIRouter()

def get_standards_service():
    return StandardsService()

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
    return await standards_service.get_all(db=db, skip=skip, limit=limit, subject_area=subject_area, status=status)

@router.get("/{standard_id}", response_model=StandardDetailResponse)
async def get_standard(standard_id: int, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Get standard details by ID."""
    standard = await standards_service.get_by_id(db=db, standard_id=standard_id)
    if not standard:
        raise HTTPException(status_code=404, detail="Standard not found")
    return standard

@router.get("/{standard_id}/allied", response_model=List[AlliedStandardResponse])
async def get_allied_standards(standard_id: int, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Get allied standards for a specific standard."""
    return await standards_service.get_allied_standards(db=db, standard_id=standard_id)

@router.post("", response_model=StandardResponse, status_code=201)
async def create_standard(standard: StandardCreate, db: AsyncSession = Depends(get_db), standards_service: StandardsService = Depends(get_standards_service)):
    """Create a new standard (Admin endpoint)."""
    try:
        return await standards_service.create(db=db, data=standard)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
