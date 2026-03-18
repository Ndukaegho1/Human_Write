# HumanWrite (Next.js + MongoDB + Firebase + OpenAI + Stripe)

This scaffold contains:

- Next.js App Router with TypeScript + Tailwind CSS
- Firebase Authentication integration points
- MongoDB Atlas collections and usage flow
- Humanizer + Detector API routes
- Billing via Stripe Checkout/webhooks
- Admin analytics endpoint
- Reusable UI placeholders for premium SaaS flows

## Quick start

1. copy `.env.example` to `.env.local` and fill credentials
2. run `npm install`
3. run `npm run dev`

## Full stack compose (Next.js + Python microservice)

1. make sure `humanwrite/.env` contains your Python service key (`OPENAI_API_KEY`), or keep it in `humanwrite/.env.example` temporarily.
2. set `PYTHON_SCORER_URL` to the python endpoint in `.env.example` (pre-filled as `http://humanwrite-api:8000/api`).
3. run:

```bash
docker compose up --build
```

This starts:

- `humanwrite-api` on port `8000`
- `humanwrite-web` on port `3000`

Stop with:

```bash
docker compose down
```

## Important integration points

- `/api/auth/sync` creates or syncs user profile with `firebase_uid`.
- `/api/humanize` saves rewrite requests and results.
- `/api/detector` computes multi-signal heuristic score and returns required object:
  - aiScorePercent
  - humanScorePercent
  - confidencePercent
  - riskLevel
  - flaggedSentences
  - reasons
- `/api/billing/*` supports plan retrieval + Stripe checkout + webhook.
- `/api/history/*` plus delete/favorite/save endpoints support history management.

## TODO hooks

- Replace placeholder rewrite logic with production prompts and safety filters.
- Replace sentence scoring with better NLP and optional Python scoring microservice.
- Add secure Firebase token refresh middleware and route guards for admin role.
