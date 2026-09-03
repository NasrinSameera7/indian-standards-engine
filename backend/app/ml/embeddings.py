"""Sentence-BERT Wrapper for generating embeddings."""
import numpy as np

class EmbeddingEngine:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"

    def get_dimension(self) -> int:
        return 384

    def encode(self, text: str) -> np.ndarray:
        """Call HF Inference API instead of PyTorch to save RAM."""
        import httpx
        try:
            response = httpx.post(self.api_url, json={"inputs": text, "options": {"wait_for_model": True}}, timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    vec = np.array(data, dtype=np.float32)
                    # Normalize L2
                    norm = np.linalg.norm(vec)
                    if norm > 0:
                        vec = vec / norm
                    return vec
        except Exception as e:
            pass
        return np.zeros(384, dtype=np.float32)

    def encode_batch(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        vectors = []
        for text in texts:
            vectors.append(self.encode(text))
        return np.vstack(vectors)

    def get_dimension(self) -> int:
        """Return embedding dimension."""
        return 384
