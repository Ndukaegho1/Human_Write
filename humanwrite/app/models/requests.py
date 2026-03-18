from typing import Literal

from pydantic import BaseModel, Field, field_validator

Tone = Literal[
  "academic",
  "professional",
  "casual",
  "simple",
  "analytical",
  "confident",
  "persuasive",
  "polished",
  "friendly",
]

Mode = Literal["light", "balanced", "strong"]


class HumanizeRequest(BaseModel):
  text: str = Field(min_length=1, description="Raw input text to rewrite")
  tone: Tone = "professional"
  mode: Mode = "balanced"
  strength: int = Field(default=60, ge=0, le=100, description="Humanization intensity from 0 to 100")
  preserve_meaning: bool = True

  @field_validator("text")
  @classmethod
  def normalize_text(cls, value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
      raise ValueError("text cannot be empty")
    return cleaned


class DetectRequest(BaseModel):
  text: str = Field(min_length=1, description="Text to run AI-vs-human style detection on")

  @field_validator("text")
  @classmethod
  def normalize_text(cls, value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
      raise ValueError("text cannot be empty")
    return cleaned


class CombinedRequest(HumanizeRequest):
  pass
