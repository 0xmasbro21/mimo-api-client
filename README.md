# MiMo API Gateway Toolkit

Production-ready Node.js toolkit for Xiaomi MiMo Open Platform users who want one local gateway that works with OpenAI-compatible clients, Anthropic-compatible clients, and CLI workflows.

## What this project does

- Runs a local OpenAI-compatible proxy at `/v1/chat/completions`, `/v1/models`, and `/health`
- Calls Xiaomi MiMo OpenAI-compatible base URL directly
- Adds retry, timeout, request logging, and safe redaction
- Provides a CLI for smoke tests and quick prompts
- Supports streaming and non-streaming chat completions
- Includes TypeScript types, test suite, and Docker setup

## Why useful

Coding tools often expect OpenAI or Anthropic style APIs. MiMo exposes compatible endpoints, but real deployments still need env validation, retries, logs, model routing, and predictable error handling. This repo provides that bridge.

## Quick start

```bash
npm install
cp .env.example .env
# edit .env and set MIMO_API_KEY
npm run dev
```

Smoke test:

```bash
curl -s http://127.0.0.1:8787/health
curl -s http://127.0.0.1:8787/v1/models
```

Chat request:

```bash
curl -s http://127.0.0.1:8787/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer local-dev-key' \
  -d '{
    "model":"mimo-v2.5-pro",
    "messages":[{"role":"user","content":"Write a compact TypeScript retry helper"}],
    "temperature":0.2
  }'
```

CLI:

```bash
npm run cli -- chat "Explain MiMo OpenAI compatibility in 3 bullets"
npm run cli -- models
```

## Environment

```bash
MIMO_API_KEY=your_xiaomi_mimo_key
MIMO_BASE_URL=https://token-plan-sgp.xiaomimimo.com/v1
MIMO_DEFAULT_MODEL=mimo-v2.5-pro
LOCAL_API_KEY=local-dev-key
PORT=8787
REQUEST_TIMEOUT_MS=90000
MAX_RETRIES=2
LOG_LEVEL=info
```

## Supported endpoints

- `GET /health`
- `GET /v1/models`
- `POST /v1/chat/completions`

## Docker

```bash
docker compose up --build
```

## Security

- API keys are read from environment only
- Logs redact Bearer tokens and Xiaomi keys
- Local API key gate enabled by `LOCAL_API_KEY`
- No browser cookies, no Xiaomi account session, no credential scraping

## License

MIT
