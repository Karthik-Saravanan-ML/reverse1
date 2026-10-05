from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.1,
        max_tokens: int = 2048
    ) -> str: ...
    
    @abstractmethod
    async def is_available(self) -> bool: ...
