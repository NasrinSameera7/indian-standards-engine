from __future__ import annotations
"""Audit API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.audit import AuditLogResponse, AuditLogFilter
from app.services.audit_service import AuditService

router = APIRouter()

def get_audit_service():
    return AuditService()

@router.get("", response_model=List[AuditLogResponse])
async def get_audit_logs(
    response: Response,
    filter_params: AuditLogFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    audit_service: AuditService = Depends(get_audit_service)
):
    """Get a paginated list of audit logs."""
    try:
        logs, total_count = await audit_service.get_logs(db=db, filters=filter_params)
        response.headers["X-Total-Count"] = str(total_count)
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{entity_type}/{entity_id}", response_model=List[AuditLogResponse])
async def get_entity_audit_trail(
    entity_type: str,
    entity_id: str,
    db: AsyncSession = Depends(get_db),
    audit_service: AuditService = Depends(get_audit_service)
):
    """Get audit trail for a specific entity."""
    try:
        return await audit_service.get_entity_trail(db=db, entity_type=entity_type, entity_id=entity_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
