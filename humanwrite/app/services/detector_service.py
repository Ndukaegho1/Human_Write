from __future__ import annotations

from typing import Dict, List

from app.models.responses import DetectResponse, DetectSignals
from app.services import text_metrics


class DetectorService:
  def __init__(self) -> None:
    pass

  @staticmethod
  def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))

  @staticmethod
  def _signal_breakdown(text: str) -> Dict[str, float]:
    metrics = text_metrics.compute_all_metrics(text)
    return {
      "lexical_diversity": metrics["lexical_diversity"],
      "sentence_variation": metrics["sentence_variation"],
      "repetition_ratio": metrics["repetition_ratio"],
      "burstiness": metrics["burstiness"],
      "punctuation_variation": metrics["punctuation_variation"],
      "transition_repetition": metrics["transition_repetition"],
      "paragraph_uniformity": metrics["uniformity_score"],
      "word_count": metrics["word_count"],
      "sentence_count": metrics["sentence_count"],
    }

  def _compute_ai_probability(self, signals: Dict[str, float]) -> float:
    components = {
      "lexical_diversity": 1.0 - signals["lexical_diversity"],
      "sentence_variation": 1.0 - signals["sentence_variation"],
      "repetition_ratio": signals["repetition_ratio"],
      "burstiness": 1.0 - signals["burstiness"],
      "punctuation_variation": 1.0 - signals["punctuation_variation"],
      "transition_repetition": min(1.0, signals["transition_repetition"] * 1.2),
      "paragraph_uniformity": signals["paragraph_uniformity"],
    }

    weights = {
      "lexical_diversity": 0.2,
      "sentence_variation": 0.15,
      "repetition_ratio": 0.2,
      "burstiness": 0.18,
      "punctuation_variation": 0.12,
      "transition_repetition": 0.13,
      "paragraph_uniformity": 0.02,
    }

    total_weight = sum(weights.values())
    ai_prob = sum(components[key] * weights[key] for key in components) / total_weight
    return self._clamp(ai_prob)

  def _determine_confidence(self, word_count: float, ai_prob: float, signals: Dict[str, float]) -> str:
    length_factor = min(1.0, max(0.2, word_count / 180.0))
    polarity = abs(ai_prob - 0.5) * 2.0
    signal_focus = max(signals["sentence_variation"], signals["lexical_diversity"], signals["punctuation_variation"])
    confidence = (0.62 * length_factor) + (0.28 * polarity) + (0.10 * signal_focus)
    confidence = max(0.0, min(1.0, confidence))

    if confidence < 0.40:
      return "low"
    if confidence < 0.68:
      return "medium"
    return "high"

  def _verdict(self, ai_score: int) -> str:
    if ai_score >= 78:
      return "Likely AI-assisted"
    if ai_score >= 60:
      return "Possibly AI-assisted"
    if ai_score <= 22:
      return "Likely human-written"
    if ai_score <= 40:
      return "Possibly human-written"
    return "Mixed characteristics"

  def _explanation(self, signals: Dict[str, float], ai_prob: float) -> str:
    reasons: List[str] = []
    if signals["sentence_variation"] < 0.25:
      reasons.append("sentence length variation is low and style is highly uniform")
    if signals["repetition_ratio"] > 0.15:
      reasons.append("repeated word usage is relatively high")
    if signals["lexical_diversity"] < 0.45:
      reasons.append("vocabulary is not very diverse")
    if signals["burstiness"] < 0.3:
      reasons.append("burstiness is low, suggesting less natural rhythm")
    if signals["punctuation_variation"] < 0.2:
      reasons.append("punctuation patterns are limited")
    if signals["transition_repetition"] > 0.2:
      reasons.append("transition phrases are repeated or over-regular")
    if signals["paragraph_uniformity"] > 0.7:
      reasons.append("paragraph structure is uniformly similar")

    if not reasons:
      return (
        "The text has a mixed profile with no single strong AI fingerprint; keep in mind this is a "
        "heuristic, probabilistic estimate."
      )

    joined = ", ".join(reasons)
    return (
      f"The text shows signs like {joined}. This is a heuristic, probabilistic estimate and not absolute proof."
    )

  def detect(self, text: str) -> DetectResponse:
    signals = self._signal_breakdown(text)
    ai_prob = self._compute_ai_probability(signals)
    ai_prob = self._clamp(ai_prob)
    ai_score = int(round(ai_prob * 100))
    human_score = max(0, 100 - ai_score)

    confidence = self._determine_confidence(signals["word_count"], ai_prob, signals)

    detection = DetectResponse(
      success=True,
      ai_score=ai_score,
      human_score=human_score,
      confidence=confidence,
      signals=DetectSignals(
        lexical_diversity=round(signals["lexical_diversity"], 3),
        sentence_variation=round(signals["sentence_variation"], 3),
        repetition_ratio=round(signals["repetition_ratio"], 3),
        burstiness=round(signals["burstiness"], 3),
        uniformity_flag=signals["paragraph_uniformity"] > 0.65,
        punctuation_variation=round(signals["punctuation_variation"], 3),
        transition_repetition=round(signals["transition_repetition"], 3),
        paragraph_uniformity=round(signals["paragraph_uniformity"], 3),
      ),
      verdict=self._verdict(ai_score),
      explanation=self._explanation(signals, ai_prob),
    )
    return detection
