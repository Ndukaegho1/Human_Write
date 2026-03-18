# HumanWrite API (FastAPI)

This backend service powers the AI Humanizer and AI Detector for the Next.js frontend.

## Features

- `POST /api/humanize` - rewrite user text with tone/mode/strength controls
- `POST /api/detect` - heuristic AI vs human likelihood scoring
- `POST /api/humanize-and-detect` - humanize text and return detection before/after
- `GET /api/health` - health check

The API is designed to be clean, JSON-first, and frontend-ready.

## Tech stack

- Python
- FastAPI
- Pydantic
- Uvicorn
- OpenAI API
- httpx
- python-dotenv

## Project structure

```text
humanwrite/
  app/
    main.py
    routes/
      humanize.py
      detect.py
      health.py
    services/
      openai_service.py
      humanizer_service.py
      detector_service.py
      text_metrics.py
    models/
      requests.py
      responses.py
    core/
      config.py
    utils/
      text_cleaner.py
  requirements.txt
  .env.example
  README.md
```

## Setup

1. Create and activate a virtual environment

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   # or on macOS/Linux: source .venv/bin/activate
   ```

2. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Copy environment file

   ```bash
   cp .env.example .env
   ```

4. Set your OpenAI key in `.env`

5. Run the API server

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The service will be available at `http://127.0.0.1:8000`.

## Docker (full stack)

The repository includes a single compose file to run frontend + backend:

- `humanwrite-api` (FastAPI)
- `humanwrite-web` (Next.js)

```bash
docker compose up --build -d
```

API endpoint is available at `http://localhost:8000` and frontend at `http://localhost:3000`.

## Example requests

### Humanize

```bash
curl -X POST http://127.0.0.1:8000/api/humanize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The solution provides an excellent opportunity to automate the workflow and optimize output efficiently.",
    "tone": "professional",
    "mode": "balanced",
    "strength": 68,
    "preserve_meaning": true
  }'
```

### Detect

```bash
curl -X POST http://127.0.0.1:8000/api/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "The solution provides an excellent opportunity to automate the workflow and optimize output efficiently."}'
```

### Combined

```bash
curl -X POST http://127.0.0.1:8000/api/humanize-and-detect \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The solution provides an excellent opportunity to automate the workflow and optimize output efficiently.",
    "tone": "professional",
    "mode": "balanced",
    "strength": 68,
    "preserve_meaning": true
  }'
```

## Notes

- Detector scoring is heuristic and probabilistic, not a deterministic truth claim.
- The API returns JSON with explicit `success` flags and structured error responses.
- OpenAI key is consumed via `OPENAI_API_KEY` in config and automatically passed to OpenAI service.
- Humanizer uses `app/services/openai_service.py`, with errors surfaced as clean 502/503 responses.
