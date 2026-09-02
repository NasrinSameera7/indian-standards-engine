"""Model Registry - Lazy loading to reduce memory on startup."""

class ModelRegistry:
    _instance = None
    _model = None

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name

    def get_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def encode(self, texts, **kwargs):
        model = self.get_model()
        return model.encode(texts, **kwargs)
