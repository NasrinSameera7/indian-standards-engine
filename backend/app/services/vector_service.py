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
        # Stub: Fetch from DB and pass to build_index
        pass

    def search(self, query_text: str, top_k: int = 10) -> list[tuple[int, float]]:
        """Encode query, search FAISS."""
        self.ensure_index_loaded()
        query_embedding = self.embedding_service.generate_embedding(query_text)
        return self.index_manager.search(query_embedding, top_k)

    def ensure_index_loaded(self):
        """Load from disk if not in memory."""
        if not self.index_manager.is_loaded():
            self.index_manager.load()
