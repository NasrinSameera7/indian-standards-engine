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
        
        standards_text = ""
        testing_protocols = []
        for std in standards:
            year = std.latest_year or std.year_of_publication or 2015
            standards_text += f"• {std.is_number}:{year} - {std.title}\n"
            
            # Dynamically suggest realistic testing codes based on the title
            if "cement" in std.title.lower():
                testing_protocols.append(f"IS 4031 (Parts 1-15): Methods of physical tests for hydraulic cement.")
                testing_protocols.append(f"IS 4032: Method of chemical analysis of hydraulic cement.")
            elif "water" in std.title.lower():
                testing_protocols.append(f"IS 14543: Packaged Drinking Water - Specification.")
                testing_protocols.append(f"IS 3025: Methods of sampling and test (physical and chemical) for water.")
            elif "steel" in std.title.lower() or "concrete" in std.title.lower():
                testing_protocols.append(f"IS 1786: High strength deformed steel bars and wires for concrete reinforcement.")
                
        if not standards_text:
            standards_text = "No specific Indian Standards were selected."
            
        testing_text = "\n".join([f"• {p}" for p in testing_protocols]) if testing_protocols else "• Refer to the respective BIS manuals for specific physical and chemical testing protocols."

        sections = [
            {"heading": "1. NOTICE INVITING TENDER (NIT)", "content": f"Tender Reference Number: {request.tender_reference or 'N/A'}\nBids are invited for: {request.title}\n\nEstimated Value: ₹{request.estimated_value or 'N/A'}\nEarnest Money Deposit (EMD): ₹{request.emd_amount or 'N/A'}\nBid Submission Deadline: {request.bid_deadline or 'N/A'}\n\nThis tender is issued in accordance with the standard procurement guidelines of the Government of India." },
            {"heading": "2. SCHEDULE OF REQUIREMENTS", "content": f"The consignee/delivery location for this procurement is:\n{request.delivery_location or 'As per final PO'}\n\nScope of Work/Supply:\n{request.original_query or request.title}\n\n{request.additional_requirements or ''}".strip()},
            {"heading": "3. TECHNICAL SPECIFICATIONS & STANDARDS", "content": "The execution, materials, and products shall strictly comply with the latest active revisions of the following Indian Standards (BIS):\n\n" + standards_text + "\nAll materials and workmanship must adhere to the physical, chemical, and structural requirements defined in these applicable IS codes. Products must bear the BIS ISI mark where mandatory under Govt Quality Control Orders (QCO)."},
            {"heading": "4. QUALITY ASSURANCE & TESTING", "content": "Mandatory sampling and laboratory testing must be conducted according to the IS guidelines prior to dispatch and approval. The following specific testing methodologies are mandated:\n\n" + testing_text + "\n\nThe purchaser reserves the right to depute third-party inspecting agencies (e.g., RITES, DGS&D) for pre-dispatch inspection."},
            {"heading": "5. GENERAL CONDITIONS OF CONTRACT (GCC)", "content": "1. Packaging & Marking: All consignments must be appropriately packed and permanently marked with manufacturer details and IS reference numbers.\n2. Warranty: As per standard Govt terms, minimum 12 months from the date of commissioning or 18 months from delivery, whichever is earlier.\n3. Payment Terms: 100% payment upon successful delivery, inspection, and acceptance by the consignee."}
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
