import re
from typing import List

_SENTENCE_PATTERN = re.compile(r"[^.!?]+[.!?]?")
_WORD_PATTERN = re.compile(r"[A-Za-z0-9']+")
_PUNCTUATION_PATTERN = re.compile(r"[.,!?;:\-—()\[\]\"“”']", re.UNICODE)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def split_into_sentences(text: str) -> List[str]:
    raw = [s.strip() for s in _SENTENCE_PATTERN.findall(text) if s.strip()]
    if not raw:
        return [text.strip()] if text and text.strip() else []
    return raw


def split_into_paragraphs(text: str) -> List[str]:
    parts = [p.strip() for p in re.split(r"\n{2,}", text.strip()) if p.strip()]
    return parts if parts else ([text.strip()] if text.strip() else [])


def split_into_chunks(text: str, max_chars: int = 2800) -> List[str]:
    paragraphs = split_into_paragraphs(text)
    chunks: List[str] = []
    current = ""

    for paragraph in paragraphs:
        piece = (paragraph + "\n\n") if paragraph else ""
        if len(piece) > max_chars:
            sentences = split_into_sentences(paragraph)
            for sentence in sentences:
                candidate = (sentence + " ") if sentence else ""
                if len(current) + len(candidate) > max_chars and current:
                    chunks.append(current.strip())
                    current = candidate
                else:
                    current += candidate
            continue

        if len(current) + len(piece) > max_chars and current:
            chunks.append(current.strip())
            current = piece
        else:
            current += piece

    if current.strip():
        chunks.append(current.strip())

    return chunks


def tokenize_words(text: str) -> List[str]:
    return _WORD_PATTERN.findall(text.lower())


def count_words(text: str) -> int:
    return len(tokenize_words(text))


def count_sentences(text: str) -> int:
    return max(1, len(split_into_sentences(text))) if text.strip() else 0


def count_syllables(word: str) -> int:
    if not word:
        return 0
    word = re.sub(r"[^a-zA-Z]", "", word.lower())
    if not word:
        return 0
    if word.endswith("es") and len(word) > 2:
        word = word[:-2]
    if word.endswith("ed") and len(word) > 2:
        word = word[:-2]
    vowels = "aeiouy"
    syllables = 0
    prev_is_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_is_vowel:
            syllables += 1
        prev_is_vowel = is_vowel
    return max(1, syllables)


def punctuation_profile(text: str) -> List[str]:
    return _PUNCTUATION_PATTERN.findall(text)
