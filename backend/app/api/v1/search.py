"""Search API endpoints."""
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.search import SearchRequest
from app.services.search_service import SearchService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.services.ocr_service import OCRService
from app.services.standards_service import StandardsService
from app.services.audit_service import AuditService
from app.ml.multilingual import MultilingualService
from app.config import settings

router = APIRouter()


def _build_search_service(db: AsyncSession) -> SearchService:
    """Build SearchService with all dependencies."""
    from app.ml.embeddings import EmbeddingEngine

    embedding_engine = EmbeddingEngine(settings.EMBEDDING_MODEL)
    multilingual = MultilingualService(
        bhashini_api_key=settings.BHASHINI_API_KEY,
        bhashini_api_url=settings.BHASHINI_API_URL,
    )
    ocr = OCRService(tesseract_cmd=settings.TESSERACT_CMD)
    standards_svc = StandardsService()
    embedding_svc = EmbeddingService(embedding_engine)
    vector_svc = VectorService(embedding_engine, settings.FAISS_INDEX_PATH)
    audit_svc = AuditService()

    return SearchService(
        vector_service=vector_svc,
        multilingual=multilingual,
        ocr=ocr,
        standards=standards_svc,
        embedding=embedding_svc,
        audit=audit_svc,
    )


@router.post("")
async def search(request: SearchRequest, db: AsyncSession = Depends(get_db)):
    """Search for standards by text query."""
    try:
        search_service = _build_search_service(db)
        return await search_service.search_by_text(
            query=request.query,
            top_k=request.top_k,
            include_allied=request.include_allied,
            language_hint=request.language_hint,
            db=db,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def search_upload(
    file: UploadFile = File(...),
    top_k: int = Form(10),
    include_allied: bool = Form(True),
    db: AsyncSession = Depends(get_db),
):
    """Search for standards by uploading a document (PDF/DOCX/image) for OCR extraction."""
    try:
        content = await file.read()
        search_service = _build_search_service(db)
        return await search_service.search_by_file(
            file_bytes=content,
            filename=file.filename,
            top_k=top_k,
            include_allied=include_allied,
            db=db,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
