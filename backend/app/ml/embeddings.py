"""Sentence-BERT Wrapper for generating embeddings."""
import numpy as np

class EmbeddingEngine:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None

    def _get_model(self):
        if self._model is None:
            import logging
            logger = logging.getLogger(__name__)
            logger.info(f"Loading local SentenceTransformer model: {self.model_name}")
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def encode(self, text: str) -> np.ndarray:
        """Use local model to generate embeddings."""
        try:
            model = self._get_model()
            vec = model.encode(text)
            vec = np.array(vec, dtype=np.float32)
            # Normalize L2
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            return vec
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Local embedding failed: {e}")
            return np.zeros(384, dtype=np.float32)

    def encode_batch(self, texts: list, batch_size: int = 32) -> np.ndarray:
        vectors = []
        for text in texts:
            vectors.append(self.encode(text))
        return np.vstack(vectors)

    def get_dimension(self) -> int:
        """Return embedding dimension."""
        return 384
