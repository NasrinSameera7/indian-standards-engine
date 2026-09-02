import json
import asyncio
import os
import numpy as np
from sqlalchemy import select
from app.database import async_session_maker
from app.models.standard import IndianStandard, StandardAmendment, NormativeReference, StandardEmbedding
from app.config import get_settings
from app.ml.embeddings import EmbeddingEngine
from app.ml.faiss_index import FAISSIndexManager

async def seed_data(data_path: str):
    settings = get_settings()
    
    if not os.path.exists(data_path):
        print(f"File not found: {data_path}")
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        standards_data = json.load(f)

    async with async_session_maker() as session:
        print("Inserting standards...")
        standard_map = {}
        for item in standards_data:
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
                await session.flush()
                standard_map[std.is_number] = std.id
            else:
                standard_map[existing.is_number] = existing.id
        
        await session.commit()
        print("Fetching standards to embed...")
        
        result = await session.execute(select(IndianStandard))
        all_standards = result.scalars().all()
        
        print(f"Generating AI embeddings for {len(all_standards)} standards...")
        engine = EmbeddingEngine(settings.EMBEDDING_MODEL)
        
        texts = [f"{s.is_number}: {s.title}. {s.description or ''}" for s in all_standards]
        ids = [s.id for s in all_standards]
        
        # Generate batch embeddings
        embeddings = engine.encode_batch(texts, batch_size=16)
        
        # Save to DB
        print("Saving embeddings to DB...")
        for i, std_id in enumerate(ids):
            result = await session.execute(select(StandardEmbedding).where(StandardEmbedding.standard_id == std_id))
            existing_emb = result.scalar_one_or_none()
            if not existing_emb:
                session.add(StandardEmbedding(
                    standard_id=std_id,
                    embedding_vector=embeddings[i].tobytes(),
                    embedding_model=settings.EMBEDDING_MODEL
                ))
        await session.commit()
        
        # Build FAISS Index
        print("Building FAISS Vector Index...")
        os.makedirs(os.path.dirname(settings.FAISS_INDEX_PATH), exist_ok=True)
        faiss_mgr = FAISSIndexManager(dimension=engine.get_dimension(), index_path=settings.FAISS_INDEX_PATH)
        faiss_mgr.build_index(embeddings, ids)
        faiss_mgr.save()
        
        print("Seed completed successfully!")

if __name__ == "__main__":
    data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "sample_standards.json")
    asyncio.run(seed_data(data_path))
