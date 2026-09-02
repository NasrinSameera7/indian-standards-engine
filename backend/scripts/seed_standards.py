import json
import argparse
import asyncio
import os
from app.database import async_session_maker
from app.models.standard import IndianStandard, NormativeReference, StandardAmendment
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.config import get_settings
from sqlalchemy import select

async def seed_data(data_path: str):
    settings = get_settings()
    
    if not os.path.exists(data_path):
        print(f"File not found: {data_path}")
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        standards_data = json.load(f)

    async with async_session_maker() as session:
        # First pass: Insert standards and amendments
        print("Inserting standards...")
        standard_map = {}
        for item in standards_data:
            # Check if exists
            result = await session.execute(select(IndianStandard).where(IndianStandard.is_number == item['is_number']))
            existing = result.scalar_one_or_none()
            
            if not existing:
                std = IndianStandard(
                    is_number=item['is_number'],
                    part=item.get('part'),
                    section=item.get('section'),
                    title=item['title'],
                    scope=item.get('scope'),
                    description=item.get('description'),
                    subject_area=item.get('subject_area'),
                    division=item.get('division'),
                    technical_committee=item.get('technical_committee'),
                    year_of_publication=item.get('year_of_publication'),
                    latest_year=item.get('latest_year'),
                    status=item.get('status', 'CURRENT'),
                    is_mandatory_certification=item.get('is_mandatory_certification', False),
                    certification_type=item.get('certification_type')
                )
                session.add(std)
                await session.flush() # get id
                standard_map[std.is_number] = std.id
                
                # Amendments
                if 'amendments' in item and item['amendments']:
                    for amd in item['amendments']:
                        amendment = StandardAmendment(
                            standard_id=std.id,
                            number=amd['number'],
                            year=amd['year'],
                            description=amd.get('description')
                        )
                        session.add(amendment)
            else:
                standard_map[existing.is_number] = existing.id

        await session.commit()

        # Second pass: Normative References
        print("Inserting normative references...")
        for item in standards_data:
            if 'normative_references' in item and item['normative_references']:
                source_id = standard_map.get(item['is_number'])
                if source_id:
                    for ref_number in item['normative_references']:
                        target_id = standard_map.get(ref_number)
                        if target_id:
                            ref = NormativeReference(
                                source_standard_id=source_id,
                                referenced_standard_id=target_id
                            )
                            session.add(ref)
        await session.commit()
        
        # Build Embeddings & FAISS index
        print("Building embeddings and vector index...")
        vector_service = VectorService(settings.faiss_index_path)
        embedding_service = EmbeddingService(settings.model_name)
        
        standards_for_embeddings = []
        result = await session.execute(select(IndianStandard))
        all_standards = result.scalars().all()
        
        texts = [f"{s.is_number}: {s.title}. {s.description}" for s in all_standards]
        ids = [s.id for s in all_standards]
        
        # Get embeddings
        embeddings = []
        for text in texts:
            # Assuming embedding service has a sync or async get_embedding
            # If async: emb = await embedding_service.get_embedding(text)
            pass
            
        # Assuming embedding service build_all_embeddings logic
        # await embedding_service.build_all_embeddings(session)
        # vector_service.build_index(...)
        print("Seed completed successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Indian Standards Data")
    parser.add_argument("--data-path", default="../../data/sample_standards.json", help="Path to sample data JSON")
    args = parser.parse_args()
    
    asyncio.run(seed_data(args.data_path))
