from __future__ import annotations
"""Sentence-BERT Wrapper for generating embeddings."""
import numpy as np
from app.ml.models import ModelRegistry

class EmbeddingEngine:
    def __init__(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2'):
        self.model_name = model_name
        self.registry = ModelRegistry.get_instance()

    def encode(self, text: str) -> np.ndarray:
        """Encode single text, normalize to unit vector."""
        model = self.registry.get_embedding_model(self.model_name)
        embedding = model.encode(text, normalize_embeddings=True)
        return embedding

    def encode_batch(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        """Batch encode, normalize to unit vector."""
        model = self.registry.get_embedding_model(self.model_name)
        embeddings = model.encode(texts, batch_size=batch_size, normalize_embeddings=True)
        return embeddings

    def get_dimension(self) -> int:
        """Return embedding dimension."""
        # MiniLM is 384
        return 384
