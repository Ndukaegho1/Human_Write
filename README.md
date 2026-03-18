# HumanWrite

HumanWrite is a full-stack AI writing platform built with a Next.js frontend and a FastAPI support service. The current app includes AI text humanization, AI detection, summarization, grammar correction, plagiarism-risk estimation, voice-profile tooling, usage history, Firebase-backed authentication, MongoDB persistence, and Paystack billing.

## Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS + Framer Motion
- Firebase Auth + Firebase Admin
- MongoDB
- OpenAI
- FastAPI + Uvicorn
- Docker Compose

## What the app includes

- Humanizer flow with multi-variant rewrites, ranking, and saved history
- AI detector flow backed by local heuristics with optional Python-service scoring
- Summarizer, grammar checker, and plagiarism-risk tools
- Voice profile and writing-sample endpoints for personalization
- Pricing, checkout, webhook handling, and subscription state
- Admin analytics and user-management endpoints

## Repository layout

```text
.
|- app/                 Next.js pages and route handlers
|- components/          Reusable UI building blocks
|- lib/                 Auth, billing, env, data, and scoring utilities
|- models/              MongoDB document types
|- scripts/             Small maintenance scripts
|- humanwrite/          FastAPI service for rewrite and detection support
|  |- app/
|  |- requirements.txt
|  `- README.md
|- docker-compose.yml   Local multi-service development setup
`- Dockerfile.web       Frontend container image
```

## Environment setup

The repo currently expects you to create local env files manually. The app can boot in guest mode with empty Firebase, MongoDB, billing, and OpenAI values, but authenticated features, saved history, billing, and personalized rewrites need real credentials.

Create `.env.local` in the repo root:

```bash
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

OPENAI_API_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=
PAYSTACK_CURRENCY=NGN
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=
APP_URL=http://localhost:3000
PYTHON_SCORER_URL=http://127.0.0.1:8000/api
```

Create `humanwrite/.env` for the FastAPI service:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT_SECONDS=30
OPENAI_MAX_TOKENS=1200
APP_HOST=0.0.0.0
APP_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
APP_ENV=development
```

## Local development

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root.

3. Set up the Python service:

   ```bash
   cd humanwrite
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Create `humanwrite/.env`.

5. Start the FastAPI service from `humanwrite/`:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. Start the Next.js app from the repo root:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000`.

## Docker development

For a single-command local setup:

```bash
docker compose up --build
```

This starts:

- `humanwrite-web` on `http://localhost:3000`
- `humanwrite-api` on `http://localhost:8000`

The compose setup is aimed at development, not production hardening. It bind-mounts the repo and runs the web app in dev mode.

## Important routes

Frontend pages:

- `/humanizer`
- `/detector`
- `/summarizer`
- `/grammar-checker`
- `/plagiarism-checker`
- `/dashboard`
- `/pricing`
- `/settings`
- `/admin`

Next.js API routes:

- `/api/humanize`
- `/api/detector`
- `/api/history/*`
- `/api/voice-profile`
- `/api/writing-samples`
- `/api/billing/*`
- `/api/admin/*`
- `/api/summarizer`
- `/api/grammar-checker`
- `/api/plagiarism-checker`

FastAPI service routes:

- `GET /api/health`
- `POST /api/humanize`
- `POST /api/detect`
- `POST /api/humanize-and-detect`

## Notes and current behavior

- The Next.js `/api/humanize` and `/api/detector` routes support guest mode. Signing in enables persistence, history, voice-profile personalization, and usage tracking.
- The FastAPI service is used as the external scorer at `PYTHON_SCORER_URL`.
- Current billing flow uses Paystack for checkout and webhook processing. Stripe helpers are present in the codebase but are not the active checkout path.
- Some utility routes such as summarization and grammar checking can fall back to lightweight local behavior if `OPENAI_API_KEY` is missing.
- The plagiarism checker is an internal overlap-based estimate in its current MVP form. It does not query external plagiarism databases.
- Authenticated-only features still include voice profile, writing samples, history, settings sync, billing, and admin tools.
- Backend-specific details live in `humanwrite/README.md`.
