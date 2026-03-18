from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.models.requests import DetectRequest
from app.models.responses import DetectResponse
from app.services.detector_service import DetectorService

router = APIRouter(prefix="/api", tags=["detector"])

_detector_service = DetectorService()


@router.post("/detect", response_model=DetectResponse)
async def detect(payload: DetectRequest) -> DetectResponse:
  try:
    return _detector_service.detect(payload.text)
  except Exception as exc:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Detection failed due to an internal error.",
    ) from exc
