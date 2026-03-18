import os
from dataclasses import dataclass
from typing import List

from dotenv import load_dotenv

load_dotenv()


def _split_csv(value: str) -> List[str]:
  return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class AppSettings:
  openai_api_key: str
  openai_model: str = "gpt-4o-mini"
  openai_timeout_seconds: int = 30
  openai_max_tokens: int = 1200
  allowed_origins: List[str] = None
  app_host: str = "0.0.0.0"
  app_port: int = 8000
  app_env: str = "development"

  @property
  def has_openai_key(self) -> bool:
    return bool(self.openai_api_key)

  @property
  def cors_origins(self) -> List[str]:
    base = _split_csv(os.getenv("ALLOWED_ORIGINS", ""))
    defaults = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ]
    for origin in defaults:
      if origin not in base:
        base.append(origin)
    return base


def get_settings() -> AppSettings:
  return AppSettings(
    openai_api_key=os.getenv("OPENAI_API_KEY", ""),
    openai_model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    openai_timeout_seconds=int(os.getenv("OPENAI_TIMEOUT_SECONDS", "30")),
    openai_max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "1200")),
    app_host=os.getenv("APP_HOST", "0.0.0.0"),
    app_port=int(os.getenv("APP_PORT", "8000")),
    app_env=os.getenv("APP_ENV", "development"),
    allowed_origins=_split_csv(os.getenv("ALLOWED_ORIGINS", "")),
  )
