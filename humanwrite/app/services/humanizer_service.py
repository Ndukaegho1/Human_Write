from __future__ import annotations

import asyncio

from app.core.config import AppSettings, get_settings
from app.models.requests import HumanizeRequest
from app.models.responses import HumanizeResponse, HumanizeStats
from app.services.openai_service import OpenAIRewriteError, OpenAIService
from app.services import text_metrics
from app.utils.text_cleaner import split_into_chunks


class HumanizerService:
  def __init__(self, settings: AppSettings | None = None) -> None:
    self.settings = settings or get_settings()
    self._openai: OpenAIService | None = None

  def _get_openai_client(self) -> OpenAIService:
    if self._openai is None:
      self._openai = OpenAIService(self.settings)
    return self._openai

  def _prompt_by_mode(self, mode: str) -> str:
    if mode == "light":
      return (
        "Perform a light refinement. Keep sentence structure close to the original. "
        "Improve clarity and fluency while making only minimal natural edits."
      )
    if mode == "strong":
      return (
        "Apply a strong humanization pass. Rephrase significantly for natural rhythm and variety, "
        "while preserving meaning and factual content."
      )
    return (
      "Perform a balanced rewrite that improves natural flow, sentence rhythm, and readability "
      "without over-expanding content."
    )

  def _build_system_prompt(self, tone: str, mode: str, preserve_meaning: bool) -> str:
    return (
      "You are an expert English writing editor and style coach. "
      "Rewrite the provided text so it sounds naturally written by a human, with smooth transitions and varied sentence rhythm. "
      f"{'Preserve the meaning, intent, and facts exactly.' if preserve_meaning else 'Keep meaning aligned as much as possible.'} "
      "Do not add fabricated facts, citations, external events, or unsupported claims. "
      "Do not use a robotic tone. Do not be overly concise unless the input is concise. "
      f"Target tone style: {tone}. "
      "Use clear, confident language and avoid repetitive phrasing."
    )

  def _build_user_prompt(self, text: str, tone: str, mode: str) -> str:
    return (
      f"Rewrite the text in {tone} tone.\n\n"
      f"{self._prompt_by_mode(mode)}\n\n"
      f"Input text:\n\"\"\"\n{text}\n\"\"\"\n\n"
      "Return only the rewritten paragraph with no labels."
    )

  def _temperature_from_strength(self, mode: str, strength: int) -> float:
    base = 0.2 + (strength / 100) * 0.75
    if mode == "strong":
      return base + 0.08
    if mode == "light":
      return base - 0.08
    return base

  def _max_tokens_for_chunk(self, text: str, strength: int) -> int:
    word_count = len(text.split())
    multiplier = 1.2 + (strength / 100) * 0.8
    estimate = int(word_count * 2 * multiplier)
    return max(160, min(self.settings.openai_max_tokens, max(1, estimate)))

  async def _rewrite_chunk(self, chunk: str, tone: str, mode: str, strength: int, preserve_meaning: bool) -> str:
    system_prompt = self._build_system_prompt(tone, mode, preserve_meaning)
    user_prompt = self._build_user_prompt(chunk, tone, mode)
    temperature = self._temperature_from_strength(mode, strength)
    max_tokens = self._max_tokens_for_chunk(chunk, strength)
    return await self._get_openai_client().rewrite(
      system_prompt,
      user_prompt,
      temperature=temperature,
      max_tokens=max_tokens,
    )

  async def rewrite_text(self, payload: HumanizeRequest) -> HumanizeResponse:
    chunks = split_into_chunks(payload.text)
    tasks = [
      self._rewrite_chunk(
        chunk=chunk,
        tone=payload.tone,
        mode=payload.mode,
        strength=payload.strength,
        preserve_meaning=payload.preserve_meaning,
      )
      for chunk in chunks
    ]

    rewritten_chunks = await asyncio.gather(*tasks)
    rewritten = "\n\n".join(chunk.strip() for chunk in rewritten_chunks if chunk and chunk.strip())

    original_stats = text_metrics.compute_all_metrics(payload.text)
    rewritten_stats = text_metrics.compute_all_metrics(rewritten)

    return HumanizeResponse(
      success=True,
      original_text=payload.text,
      humanized_text=rewritten,
      tone=payload.tone,
      mode=payload.mode,
      stats=HumanizeStats(
        original_word_count=int(original_stats["word_count"]),
        rewritten_word_count=int(rewritten_stats["word_count"]),
        readability_before=float(original_stats["readability"]),
        readability_after=float(rewritten_stats["readability"]),
      ),
    )

  async def humanize(self, payload: HumanizeRequest) -> HumanizeResponse:
    try:
      return await self.rewrite_text(payload)
    except OpenAIRewriteError:
      raise
