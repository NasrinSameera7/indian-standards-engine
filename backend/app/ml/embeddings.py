"""Sentence-BERT Wrapper for generating embeddings."""
import numpy as np

class EmbeddingEngine:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"

    def encode(self, text: str) -> np.ndarray:
        """Use HF API because local PyTorch OOMs Render Free tier."""
        import httpx
        try:
            response = httpx.post(self.api_url, json={"inputs": text, "options": {"wait_for_model": True}}, timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    vec = np.array(data, dtype=np.float32)
                    norm = np.linalg.norm(vec)
                    if norm > 0:
                        vec = vec / norm
                    return vec
        except Exception:
            pass
        return np.zeros(384, dtype=np.float32)

    def encode_batch(self, texts: list, batch_size: int = 32) -> np.ndarray:
        vectors = []
        for text in texts:
            vectors.append(self.encode(text))
        return np.vstack(vectors)

    def get_dimension(self) -> int:
        return 384
