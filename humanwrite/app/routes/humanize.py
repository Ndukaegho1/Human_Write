from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.models.requests import CombinedRequest, HumanizeRequest
from app.models.responses import CombinedResponse, HumanizeResponse
from app.services.detector_service import DetectorService
from app.services.humanizer_service import HumanizerService
from app.services.openai_service import OpenAIRewriteError

router = APIRouter(prefix="/api", tags=["humanizer"])

_humanizer_service = HumanizerService()
_detector_service = DetectorService()


@router.post("/humanize", response_model=HumanizeResponse)
async def humanize(payload: HumanizeRequest) -> HumanizeResponse:
  try:
    return await _humanizer_service.humanize(payload)
  except OpenAIRewriteError as exc:
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail=f"OpenAI rewrite error: {exc}",
    ) from exc
  except ValueError as exc:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail=str(exc),
    ) from exc
  except Exception as exc:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Humanization failed due to an internal error.",
    ) from exc


@router.post("/humanize-and-detect", response_model=CombinedResponse)
async def humanize_and_detect(payload: CombinedRequest) -> CombinedResponse:
  try:
    humanized = await _humanizer_service.humanize(payload)
    before_detection = _detector_service.detect(payload.text)
    after_detection = _detector_service.detect(humanized.humanized_text)
  except OpenAIRewriteError as exc:
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail=f"OpenAI rewrite error: {exc}",
    ) from exc
  except ValueError as exc:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail=str(exc),
    ) from exc
  except Exception as exc:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Combined request failed due to an internal error.",
    ) from exc

  return CombinedResponse(
    success=True,
    original_text=humanized.original_text,
    humanized_text=humanized.humanized_text,
    before_detection=before_detection,
    after_detection=after_detection,
  )
