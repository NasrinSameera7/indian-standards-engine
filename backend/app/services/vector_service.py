from __future__ import annotations
"""Vector Service for search."""
import logging
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession
from app.ml.faiss_index import FAISSIndexManager
from app.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class VectorService:
    def __init__(self):
        self.index_manager = FAISSIndexManager()
        self.embedding_service = EmbeddingService()

    async def build_index(self, db: AsyncSession):
        """Load all embeddings from DB, build FAISS index."""
        from sqlalchemy import select
        from app.models.standard import StandardEmbedding
        result = await db.execute(select(StandardEmbedding))
        embeddings_records = result.scalars().all()
        
        if not embeddings_records:
            return
            
        vectors = []
        ids = []
        for record in embeddings_records:
            vectors.append(np.frombuffer(record.embedding_vector, dtype=np.float32))
            ids.append(record.standard_id)
            
        vectors_np = np.vstack(vectors)
        self.index_manager.build_index(vectors_np, ids)
        logger.info(f"Loaded {len(ids)} vectors from DB into FAISS.")

    def search(self, query_text: str, top_k: int = 10) -> list[tuple[int, float]]:
        """Encode query, search FAISS."""
        self.ensure_index_loaded()
        query_embedding = self.embedding_service.generate_embedding(query_text)
        
        # Check if the API returned zeros (rate limit)
        if not np.any(query_embedding):
            return []
            
        return self.index_manager.search(query_embedding, top_k)

    def ensure_index_loaded(self):
        """Load from disk if not in memory."""
        if not self.index_manager.is_loaded():
            self.index_manager.load()
