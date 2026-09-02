from __future__ import annotations
from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    user_session_id: Optional[str] = None
    details_json: Optional[Any] = None
    ip_address: Optional[str] = None
    timestamp: datetime

class AuditLogFilter(BaseModel):
    action: Optional[str] = None
    entity_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    page: int = 1
    page_size: int = 50
