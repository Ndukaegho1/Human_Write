from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import get_settings
from app.routes.detect import router as detect_router
from app.routes.health import router as health_router
from app.routes.humanize import router as humanize_router

settings = get_settings()

app = FastAPI(
  title="HumanWrite AI Service",
  version="1.0.0",
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.cors_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
  return JSONResponse(
    status_code=422,
    content={
      "success": False,
      "error": "Invalid request payload",
      "details": exc.errors(),
    },
  )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
  return JSONResponse(status_code=exc.status_code, content={"success": False, "error": exc.detail})


@app.exception_handler(Exception)
async def fallback_exception_handler(request: Request, exc: Exception) -> JSONResponse:
  return JSONResponse(
    status_code=500,
    content={"success": False, "error": "Internal server error"},
  )


app.include_router(health_router)
app.include_router(detect_router)
app.include_router(humanize_router)
