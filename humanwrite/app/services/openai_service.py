from __future__ import annotations

from typing import Optional

from openai import AsyncOpenAI, OpenAIError

from app.core.config import AppSettings


class OpenAIRewriteError(Exception):
  """Raised when OpenAI request fails."""


class OpenAIService:
  def __init__(self, settings: AppSettings) -> None:
    if not settings.openai_api_key:
      raise OpenAIRewriteError("OPENAI_API_KEY is not configured.")
    self.client = AsyncOpenAI(
      api_key=settings.openai_api_key,
      timeout=settings.openai_timeout_seconds,
    )
    self.model = settings.openai_model
    self.max_tokens = settings.openai_max_tokens

  async def rewrite(
    self,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.35,
    max_tokens: Optional[int] = None,
  ) -> str:
    try:
      response = await self.client.chat.completions.create(
        model=self.model,
        messages=[
          {"role": "system", "content": system_prompt},
          {"role": "user", "content": user_prompt},
        ],
        temperature=max(0.1, min(1.2, temperature)),
        max_tokens=max_tokens or self.max_tokens,
        top_p=0.9,
      )
    except (OpenAIError, TimeoutError) as exc:
      raise OpenAIRewriteError(f"OpenAI request failed: {exc}") from exc

    content = response.choices[0].message.content if response.choices else None
    if not content or not content.strip():
      raise OpenAIRewriteError("OpenAI returned an empty rewrite.")
    return content.strip()
