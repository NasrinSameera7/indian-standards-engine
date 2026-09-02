"""Sentence-BERT Wrapper for generating embeddings."""
import numpy as np
from app.ml.models import ModelRegistry

class EmbeddingEngine:
    def __init__(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2'):
        self.model_name = model_name
        self.registry = ModelRegistry(model_name)

    def encode(self, text: str) -> np.ndarray:
        """Encode single text, normalize to unit vector."""
        return self.registry.encode(text, normalize_embeddings=True)

    def encode_batch(self, texts, batch_size: int = 32) -> np.ndarray:
        """Batch encode, normalize to unit vector."""
        return self.registry.encode(texts, batch_size=batch_size, normalize_embeddings=True)

    def get_dimension(self) -> int:
        """Return embedding dimension."""
        return 384
