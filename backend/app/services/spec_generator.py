from __future__ import annotations
"""Specification Generator Service."""
import logging
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.specification import SpecGenerateRequest
from app.models.specification import GeneratedSpecification

logger = logging.getLogger(__name__)

class SpecGeneratorService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate(self, request: SpecGenerateRequest) -> dict:
        from sqlalchemy import select
        from app.models.standard import IndianStandard
        
        # Fetch the actual standard details from the database
        result = await self.db.execute(select(IndianStandard).where(IndianStandard.id.in_(request.standard_ids)))
        standards = result.scalars().all()
        
        standards_text = "\n".join([f"• {std.is_number}: {std.title}" for std in standards])
        
        if not standards_text:
            standards_text = "No specific Indian Standards were selected."

        sections = [
            {"heading": "SCOPE OF WORK", "content": f"{request.original_query or ''}\n{request.additional_requirements or ''}".strip() or "Standard execution as per specified codes."},
            {"heading": "APPLICABLE STANDARDS", "content": "The execution shall strictly comply with the following Indian Standards:\n\n" + standards_text},
            {"heading": "TECHNICAL REQUIREMENTS", "content": "All materials and workmanship must adhere to the physical, chemical, and structural requirements defined in the applicable IS codes."},
            {"heading": "QUALITY AND TESTING", "content": "Mandatory sampling and laboratory testing must be conducted according to the IS guidelines prior to approval."},
            {"heading": "CERTIFICATION", "content": "Products must bear the BIS ISI mark or relevant CRS certification where mandatory."},
            {"heading": "PACKAGING AND MARKING", "content": "All consignments must be appropriately packed and permanently marked with manufacturer details and IS reference numbers."}
        ]
        
        # Save to DB to get an ID
        spec_record = GeneratedSpecification(
            title=request.title,
            content_json=sections,
            selected_standard_ids=request.standard_ids
        )
        self.db.add(spec_record)
        await self.db.commit()
        await self.db.refresh(spec_record)
        
        return {
            "id": spec_record.id,
            "title": spec_record.title,
            "sections": sections,
            "created_at": spec_record.created_at or datetime.now()
        }
