"""Sync API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from app.services.sync_service import BISSyncService

router = APIRouter()

def get_sync_service():
    return BISSyncService(bis_base_url="", db_session_factory=None)

@router.post("/trigger")
async def trigger_sync(
    background_tasks: BackgroundTasks,
    sync_service: BISSyncService = Depends(get_sync_service)
):
    """Trigger BIS synchronization in the background."""
    background_tasks.add_task(sync_service.sync)
    return {"status": "started"}

@router.get("/status")
async def get_sync_status(sync_service: BISSyncService = Depends(get_sync_service)):
    """Get the status of the last synchronization."""
    try:
        return await sync_service.get_last_sync_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
