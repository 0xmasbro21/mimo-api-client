# Architecture

```text
OpenAI client / coding tool
        |
        v
Local MiMo Gateway :8787
        |
        | retry + timeout + redaction + local auth
        v
Xiaomi MiMo OpenAI-compatible endpoint
https://token-plan-sgp.xiaomimimo.com/v1
```

## Components

- `src/server.ts`: Express API gateway
- `src/mimoClient.ts`: upstream MiMo HTTP client with retry and timeout
- `src/config.ts`: strict env parsing via Zod
- `src/cli.ts`: terminal smoke-test interface
- `src/redact.ts`: safe logging utility

## Operational notes

Use a local API key if exposing outside localhost. Keep Xiaomi API key in env or secret manager. Do not log request headers.
