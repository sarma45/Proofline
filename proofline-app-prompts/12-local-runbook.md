# 12 — Local Runbook

## Prerequisites

- Docker + Docker Compose
- Node.js LTS (or Go/Python if api chosen otherwise — document one stack)
- GitHub App credentials for a **dev** app (or Action-only Stage 1 path)
- Optional: ngrok/cloudflared for webhook ingress

## Bring-up

```bash
cp .env.example .env   # fill secrets; never commit
docker compose up -d postgres minio
# run migrations
# start api + worker + web
```

Services:

- API: `http://localhost:8080`
- Web: `http://localhost:3000`
- MinIO console: documented port
- Postgres: documented port

## Seed

- Org + user + project
- Optional: sample policy
- Load fixture repos or point at a public test repo

## First passport path

1. Register GitHub App installation against local API webhook URL
2. Open PR on connected repo (or use fixture PR simulation)
3. Confirm webhook delivery recorded once
4. Worker produces passport
5. Open UI → Change Passport
6. Submit review decision
7. Export JSON

## Tests

```bash
# unit + integration
# fixture suite (11-fixtures-and-acceptance.md)
```

## Kill switch

Document env flags:

- `WORKERS_ENABLED=false`
- `GITHUB_INTEGRATION_ENABLED=false`

## Troubleshooting

- Signature failures → check webhook secret
- Duplicate comments → check delivery dedupe + idempotency
- Partial evidence → provider timeout fixtures
- Cross-tenant → attempt with second org token must 403
