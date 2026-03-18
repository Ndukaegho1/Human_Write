from typing import Literal

from pydantic import BaseModel, Field

from app.models.requests import Mode, Tone


class HumanizeStats(BaseModel):
  original_word_count: int
  rewritten_word_count: int
  readability_before: float
  readability_after: float


class HumanizeResponse(BaseModel):
  success: bool = True
  original_text: str
  humanized_text: str
  tone: Tone
  mode: Mode
  stats: HumanizeStats


class DetectSignals(BaseModel):
  lexical_diversity: float = Field(ge=0, le=1)
  sentence_variation: float = Field(ge=0, le=1)
  repetition_ratio: float = Field(ge=0, le=1)
  burstiness: float = Field(ge=0, le=1)
  uniformity_flag: bool
  punctuation_variation: float = Field(default=0.0, ge=0, le=1)
  transition_repetition: float = Field(default=0.0, ge=0, le=1)
  paragraph_uniformity: float = Field(default=0.0, ge=0, le=1)


class DetectResponse(BaseModel):
  success: bool = True
  ai_score: int = Field(ge=0, le=100)
  human_score: int = Field(ge=0, le=100)
  confidence: Literal["low", "medium", "high"]
  signals: DetectSignals
  verdict: str
  explanation: str


class CombinedResponse(BaseModel):
  success: bool = True
  original_text: str
  humanized_text: str
  before_detection: DetectResponse
  after_detection: DetectResponse
