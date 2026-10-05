import httpx
from llm.provider import LLMProvider

class OllamaProvider(LLMProvider):
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model
        self.client = httpx.AsyncClient(timeout=120.0)
    
    async def generate(self, system_prompt: str, user_message: str, temperature: float = 0.1, max_tokens: int = 2048) -> str:
        response = await self.client.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "system": system_prompt,
                "prompt": user_message,
                "stream": False,
                "options": {"temperature": temperature, "num_predict": max_tokens}
            }
        )
        response.raise_for_status()
        return response.json()["response"]
    
    async def is_available(self) -> bool:
        try:
            r = await self.client.get(f"{self.base_url}/api/tags", timeout=5.0)
            return r.status_code == 200
        except:
            return False
