"""API v1 router aggregation."""
from fastapi import APIRouter
from app.api.v1 import search, standards, specifications, audit, sync

api_router = APIRouter()
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(standards.router, prefix="/standards", tags=["Standards"])
api_router.include_router(specifications.router, prefix="/specifications", tags=["Specifications"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit"])
api_router.include_router(sync.router, prefix="/sync", tags=["Sync"])
