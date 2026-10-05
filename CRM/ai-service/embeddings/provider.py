from abc import ABC, abstractmethod
import numpy as np

class EmbeddingProvider(ABC):
    @abstractmethod
    def embed_text(self, text: str) -> list[float]: ...
    
    @abstractmethod
    def embed_batch(self, texts: list[str]) -> list[list[float]]: ...
    
    @property
    @abstractmethod
    def dimension(self) -> int: ...
