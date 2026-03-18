from __future__ import annotations

import math
import re
from typing import Dict, List

from app.utils.text_cleaner import (
  count_syllables,
  count_sentences,
  normalize_text,
  split_into_paragraphs,
  split_into_sentences,
  tokenize_words,
)


def tokenize_punctuation(text: str) -> List[str]:
  from app.utils.text_cleaner import punctuation_profile

  return punctuation_profile(text)


def word_count(text: str) -> int:
  return len(tokenize_words(text))


def sentence_lengths(text: str) -> List[int]:
  return [len(tokenize_words(sentence)) for sentence in split_into_sentences(text)]


def average(values: List[float]) -> float:
  return sum(values) / max(1, len(values))


def average_sentence_length(text: str) -> float:
  lengths = sentence_lengths(text)
  return average([float(length) for length in lengths]) if lengths else 0.0


def sentence_length_variation(text: str) -> float:
  lengths = sentence_lengths(text)
  if not lengths or len(lengths) == 1:
    return 0.0
  mean = average([float(length) for length in lengths])
  if mean <= 0:
    return 0.0
  variance = average([(length - mean) ** 2 for length in [float(length) for length in lengths]])
  std = math.sqrt(variance)
  cv = std / mean
  return min(1.0, cv / 2.2)


def lexical_diversity(text: str) -> float:
  words = tokenize_words(text)
  if not words:
    return 0.0
  return len(set(words)) / max(1, len(words))


def repetition_ratio(text: str) -> float:
  words = tokenize_words(text)
  if not words:
    return 0.0
  repeats = 0
  counts: Dict[str, int] = {}
  for word in words:
    counts[word] = counts.get(word, 0) + 1
    if counts[word] > 1:
      repeats += 1
  return min(1.0, repeats / max(1, len(words)))


def punctuation_diversity(text: str) -> float:
  marks = tokenize_punctuation(text)
  if not marks:
    return 0.0
  unique_marks = len(set(marks))
  max_diversity = 8
  return min(1.0, unique_marks / max_diversity)


def paragraph_uniformity_signal(text: str) -> float:
  paragraphs = split_into_paragraphs(text)
  if len(paragraphs) <= 1:
    return 0.0
  means = [average_sentence_length(p) for p in paragraphs]
  if len(means) <= 1:
    return 0.0
  overall = average(means)
  if overall <= 0:
    return 0.0
  variance = average([(m - overall) ** 2 for m in means])
  std = math.sqrt(variance)
  cv = std / overall
  return max(0.0, 1.0 - min(1.0, cv))


def burstiness_score(text: str) -> float:
  variation = sentence_length_variation(text)
  if variation <= 0:
    return 0.0
  return variation


def predictability_style_score(text: str) -> float:
  transitions = [
    "in addition",
    "furthermore",
    "moreover",
    "therefore",
    "as a result",
    "in conclusion",
    "to summarize",
    "on the other hand",
    "firstly",
    "secondly",
    "thirdly",
  ]
  lower = normalize_text(text).lower()
  if not lower:
    return 0.0
  repeats = 0
  for phrase in transitions:
    repeats += len(re.findall(rf"\b{re.escape(phrase)}\b", lower))
  max_possible = max(1, len(lower.split()) // 20)
  return min(1.0, repeats / max_possible)


def readability_score(text: str) -> float:
  words = tokenize_words(text)
  if not words:
    return 0.0
  sentence_count = count_sentences(text)
  avg_sentence_len = max(1.0, average([len(tokenize_words(s)) for s in split_into_sentences(text)]))
  total_syllables = sum(count_syllables(word) for word in words)
  avg_syllables = total_syllables / max(1, len(words))
  score = 206.835 - 1.015 * avg_sentence_len - 84.6 * avg_syllables
  return max(0.0, min(100.0, round(score, 2)))


def compute_all_metrics(text: str) -> Dict[str, float]:
  normalized = normalize_text(text)
  sentence_count = count_sentences(normalized)

  return {
    "word_count": float(word_count(normalized)),
    "readability": float(readability_score(normalized)),
    "lexical_diversity": float(lexical_diversity(normalized)),
    "sentence_variation": float(sentence_length_variation(normalized)),
    "repetition_ratio": float(repetition_ratio(normalized)),
    "burstiness": float(burstiness_score(normalized)),
    "punctuation_variation": float(punctuation_diversity(normalized)),
    "uniformity_score": float(paragraph_uniformity_signal(normalized)),
    "transition_repetition": float(predictability_style_score(normalized)),
    "sentence_count": float(sentence_count),
  }
