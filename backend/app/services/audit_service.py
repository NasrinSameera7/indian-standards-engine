from __future__ import annotations
"""Audit Service."""
import logging
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

logger = logging.getLogger(__name__)

class AuditService:
    SEARCH_PERFORMED = "SEARCH_PERFORMED"
    STANDARD_VIEWED = "STANDARD_VIEWED"
    SPEC_GENERATED = "SPEC_GENERATED"
    SPEC_EXPORTED = "SPEC_EXPORTED"
    SYNC_TRIGGERED = "SYNC_TRIGGERED"
    SYNC_COMPLETED = "SYNC_COMPLETED"
    
    def __init__(self, db: AsyncSession = None):
        self.db = db

    async def log(self, db: AsyncSession, action: str, entity_type: str, entity_id: str, 
                  user_session_id: str, details: dict, ip_address: str):
        from app.models.audit import AuditLog
        new_log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=int(entity_id) if entity_id and entity_id.isdigit() else None,
            user_session_id=user_session_id,
            details_json=details,
            ip_address=ip_address
        )
        db.add(new_log)
        await db.commit()

    async def get_logs(self, filter_params: Any) -> tuple[list[Any], int]:
        from app.models.audit import AuditLog
        query = select(AuditLog)
        
        if getattr(filter_params, 'action', None):
            query = query.where(AuditLog.action == filter_params.action)
            
        count_query = select(func.count()).select_from(query.subquery())
        total_count = await self.db.scalar(count_query)
        
        query = query.order_by(desc(AuditLog.timestamp))
        
        # Pagination
        page = getattr(filter_params, 'page', 1)
        page_size = getattr(filter_params, 'page_size', 50)
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await self.db.execute(query)
        return result.scalars().all(), total_count or 0

    async def get_entity_trail(self, entity_type: str, entity_id: str) -> list[Any]:
        from app.models.audit import AuditLog
        query = select(AuditLog).where(AuditLog.entity_type == entity_type)
        if entity_id.isdigit():
            query = query.where(AuditLog.entity_id == int(entity_id))
        query = query.order_by(desc(AuditLog.timestamp))
        result = await self.db.execute(query)
        return result.scalars().all()
