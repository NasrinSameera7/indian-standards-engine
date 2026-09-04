"""API v1 router aggregation."""
from fastapi import APIRouter
from app.api.v1.search import router as search_router
from app.api.v1.standards import router as standards_router
from app.api.v1.specifications import router as specs_router
from app.api.v1.audit import router as audit_router
from app.api.v1.sync import router as sync_router
from app.api.v1.seed import router as seed_router
from app.api.v1.compliance import router as compliance_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(search_router, prefix="/search", tags=["Search"])
api_router.include_router(standards_router, prefix="/standards", tags=["Standards"])
api_router.include_router(specs_router, prefix="/specifications", tags=["Specifications"])
api_router.include_router(compliance_router, prefix="/compliance", tags=["Compliance"])
api_router.include_router(audit_router, prefix="/audit", tags=["Audit Log"])
api_router.include_router(sync_router, prefix="/sync", tags=["Sync"])
api_router.include_router(seed_router, prefix="/system", tags=["System"])
