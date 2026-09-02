"""Specifications API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from io import BytesIO

from app.database import get_db
from app.schemas.specification import SpecGenerateRequest, SpecResponse
from app.services.spec_generator import SpecGeneratorService
from app.services.export_service import ExportService

router = APIRouter()

def get_spec_generator_service(db: AsyncSession = Depends(get_db)):
    return SpecGeneratorService(db)

def get_export_service(db: AsyncSession = Depends(get_db)):
    return ExportService()

@router.post("/generate", response_model=SpecResponse)
async def generate_specification(
    request: SpecGenerateRequest,
    spec_generator: SpecGeneratorService = Depends(get_spec_generator_service)
):
    """Generate a specification document based on selected standards."""
    try:
        return await spec_generator.generate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{spec_id}/export")
async def export_specification(
    spec_id: int,
    format: str = Query(..., regex="^(pdf|docx)$"),
    export_service: ExportService = Depends(get_export_service)
):
    """Export a generated specification as PDF or DOCX."""
    try:
        if format == "pdf":
            file_bytes = await export_service.export_pdf(spec_id)
            media_type = "application/pdf"
            filename = f"specification_{spec_id}.pdf"
        else:
            file_bytes = await export_service.export_docx(spec_id)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename = f"specification_{spec_id}.docx"
            
        return StreamingResponse(
            BytesIO(file_bytes),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
