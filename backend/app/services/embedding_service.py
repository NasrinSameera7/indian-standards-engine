"""Service for handling embeddings."""
import logging
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.embeddings import EmbeddingEngine

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2'):
        self.engine = EmbeddingEngine(model_name)

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for a given text."""
        return self.engine.encode(text)

    async def generate_and_store(self, standard_id: int, text: str, db: AsyncSession):
        """Generate embedding and save to StandardEmbedding table."""
        # This is a stub for the DB logic
        embedding = self.generate_embedding(text)
        pass

    async def build_all_embeddings(self, db: AsyncSession):
        """Fetch all standards, generate embeddings, store in DB."""
        # Stub for DB logic
        pass
