from __future__ import annotations
"""FAISS Index Manager for vector search."""
import os
import faiss
import numpy as np
import pickle
import logging

logger = logging.getLogger(__name__)

class FAISSIndexManager:
    def __init__(self, dimension: int = 384, index_path: str = 'data/faiss_index/standards.index'):
        self.dimension = dimension
        self.index_path = index_path
        self.index: faiss.IndexFlatIP | None = None
        self.id_map: list[int] = []
        self.map_path = f"{index_path}.idmap"

    def build_index(self, embeddings: np.ndarray, standard_ids: list[int]):
        """Create new index, normalize vectors, add to index."""
        self.index = faiss.IndexFlatIP(self.dimension)
        self.id_map = []
        if len(embeddings) > 0:
            faiss.normalize_L2(embeddings)
            self.index.add(embeddings)
            self.id_map.extend(standard_ids)

    def search(self, query_embedding: np.ndarray, top_k: int = 10) -> list[tuple[int, float]]:
        """Return list of (standard_id, score)."""
        if not self.is_loaded():
            logger.warning("Search called before index loaded or empty index.")
            return []
            
        if self.index.ntotal == 0:
            return []

        # query_embedding expected to be 1D or 2D (1, dim), and already normalized
        if query_embedding.ndim == 1:
            query_embedding = np.expand_dims(query_embedding, axis=0)
            
        distances, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1 and idx < len(self.id_map):
                results.append((self.id_map[idx], float(distances[0][i])))
                
        return results

    def save(self):
        """Save index and id_map to disk."""
        if self.index is None:
            return
            
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.map_path, 'wb') as f:
            pickle.dump(self.id_map, f)

    def load(self):
        """Load from disk."""
        if os.path.exists(self.index_path) and os.path.exists(self.map_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.map_path, 'rb') as f:
                self.id_map = pickle.load(f)
            logger.info("FAISS index loaded successfully.")
        else:
            logger.warning("FAISS index or id_map not found on disk.")
            self.index = faiss.IndexFlatIP(self.dimension)
            self.id_map = []

    def add_vectors(self, embeddings: np.ndarray, standard_ids: list[int]):
        """Add to existing index."""
        if self.index is None:
            self.index = faiss.IndexFlatIP(self.dimension)
            
        if len(embeddings) > 0:
            faiss.normalize_L2(embeddings)
            self.index.add(embeddings)
            self.id_map.extend(standard_ids)

    def is_loaded(self) -> bool:
        return self.index is not None
