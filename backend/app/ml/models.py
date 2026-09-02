"""ML Model registry with lazy loading and singleton pattern."""
import threading
from sentence_transformers import SentenceTransformer

class ModelRegistry:
    _instance = None
    _lock = threading.Lock()
    _models: dict = {}
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance
    
    def get_embedding_model(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2') -> SentenceTransformer:
        if model_name not in self._models:
            with self._lock:
                if model_name not in self._models:
                    self._models[model_name] = SentenceTransformer(model_name)
        return self._models[model_name]
    
    def preload(self, model_name: str):
        self.get_embedding_model(model_name)
