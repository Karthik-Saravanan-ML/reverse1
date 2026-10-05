from openai import AsyncOpenAI
from config import settings
from llm.provider import LLMProvider

class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
    
    async def generate(self, system_prompt: str, user_message: str, temperature: float = 0.1, max_tokens: int = 2048) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    async def is_available(self) -> bool:
        return bool(settings.OPENAI_API_KEY)
