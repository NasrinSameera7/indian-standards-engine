from __future__ import annotations
"""Main Orchestrator: Search Service."""
import logging
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.vector_service import VectorService
from app.ml.multilingual import MultilingualService
from app.services.ocr_service import OCRService
from app.services.standards_service import StandardsService
from app.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, vector_service: VectorService, multilingual: MultilingualService,
                 ocr: OCRService, standards: StandardsService, embedding: EmbeddingService, audit: Any):
        self.vector_service = vector_service
        self.multilingual = multilingual
        self.ocr = ocr
        self.standards = standards
        self.embedding = embedding
        self.audit = audit

    async def search_by_text(self, query: str, top_k: int, include_allied: bool, language_hint: str | None, db: AsyncSession) -> dict:
        # Fallback to basic PostgreSQL text search to bypass Render 512MB RAM limit
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        from app.models.standard import IndianStandard
        
        search_term = f"%{query}%"
        stmt = select(IndianStandard).where(
            (IndianStandard.title.ilike(search_term)) | 
            (IndianStandard.description.ilike(search_term)) |
            (IndianStandard.is_number.ilike(search_term))
        ).limit(top_k)
        
        db_result = await db.execute(stmt)
        standards_list = db_result.scalars().all()
        
        results = []
        for std in standards_list:
            result_item = {
                "standard": std,
                "score": 0.99,  # Mock score for UI
                "amendments": await self.standards.get_amendments(db, std.id),
                "version_info": await self.standards.check_latest_version(db, std.id),
                "certification_info": await self.standards.get_certification_info(db, std.id)
            }
            if include_allied:
                result_item["allied_standards"] = await self.standards.get_allied_standards(db, std.id)
                
            results.append(result_item)
            
        response = self._build_search_response(results, english_query, detected_lang)
        
        return response

    async def search_by_file(self, file_bytes: bytes, filename: str, top_k: int, include_allied: bool, db: AsyncSession) -> dict:
        extracted_text = self.ocr.extract_text(file_bytes, filename)
        return await self.search_by_text(extracted_text, top_k, include_allied, None, db)

    def _build_search_response(self, results: list[dict], query: str, lang: str) -> dict:
        return {
            "query": query,
            "detected_language": lang,
            "results": results
        }
