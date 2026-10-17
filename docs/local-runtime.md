# Local runtime and integration setup

Follow the [README](../README.md) for backend and web startup. [Makefile](../Makefile), the [configuration schema](../apps/backend/src/email_agentic/core/settings.py) and [Compose](../compose.yaml) own executable commands/configuration. Liveness requires no Gmail, calendar, database or embedding integration. Live gateway smoke is explicit and separate from startup/CI.

## Local web development

`make setup` installs locked Python dependencies and runs npm CI for [apps/web](../apps/web). Run `make dev` for the backend on loopback port 8000 and `make dev-web` in another terminal for Vite on loopback port 5173 with strict-port behavior. Stop both processes after use.

The browser requests relative `/healthz`; Vite forwards it to the local backend. No provider secrets belong in Vite variables or browser storage. `make check-web` runs the web quality gates; see [frontend.md](frontend.md). A working liveness UI does not prove research, provider access or persistence.

## Optional Docker infrastructure

Use a running Docker daemon and Compose. Set `POSTGRES_PASSWORD` and `NEO4J_PASSWORD` in local configuration before every real-config `docker compose` invocation, including web/app/LGTM-only startup, `ps`, `logs` and `down`. Compose interpolates the entire file before profile/service filtering, so selecting one service does not bypass these required variables. Neo4j passwords require at least eight characters. Never put values in issues/logs. Database startup does not require an LLM key.

```sh
make compose-check
docker compose up -d postgres neo4j
docker compose ps
```

`make compose-check` supplies validation-only values without real passwords. It validates definitions without starting containers or verifying database connectivity. Check actual service health with `docker compose ps`, then query the database when its adapter is implemented. Ports bind to loopback only. Identify an existing port owner rather than starting duplicate instances on new ports.

To run the web and backend containers instead of the local development servers (the host ports remain 5173 and 8000):

```sh
docker compose --profile app up -d --build web
curl --fail http://127.0.0.1:5173/healthz
```

The web container serves the SPA through unprivileged nginx and proxies same-origin `/healthz` to the backend. Compose waits for backend health before starting it. These container startup/proxy checks remain unverified without a running Docker daemon.

Use loopback in `POSTGRES_DSN` for the host Python process. `COMPOSE_POSTGRES_DSN` uses `postgres:5432` for the app container and a URL-encoded password. The container Neo4j URI uses `neo4j:7687`; local clients use loopback. Declaring a DSN does not create business checkpoints, schemas or persistence integration.

LGTM uses a separate profile. In addition to both database passwords, set `GRAFANA_ADMIN_PASSWORD` before starting it; its startup guard rejects a missing value.

```sh
docker compose --profile observability up -d lgtm
```

Open Grafana at `http://127.0.0.1:3000`; [Compose](../compose.yaml) defines OTLP ports. Application instrumentation and business dashboards are not implemented; a working login does not prove telemetry works. Resource limits are local budgets that require measurement before deployment. [Grafana LGTM](https://grafana.com/docs/opentelemetry/docker-lgtm/) is documented for development/demo/testing.

Stop the stack you started while preserving volumes:

```sh
docker compose --profile app --profile observability down
```

Do not add `--volumes` to routine shutdown. Inspect logs with `docker compose logs --tail=100 SERVICE` and redact private data before sharing. No remote deployment, backup/restore route or public endpoint is established.

## Planned Google OAuth setup

Selected providers: **Gmail and Google Calendar**. This is setup guidance for the next integration; the foundation has no Google client, OAuth app or credential store. There is no OAuth bootstrap command yet.

1. Create/select a Google Cloud project under your control, enable Gmail API and Calendar API, and configure consent/test users for authorized test accounts.
2. Create a Desktop OAuth client for local execution. Use browser consent with a loopback redirect, not the deprecated manual copy/paste OOB flow. A server deployment needs its own suitable client/redirect configuration.
3. Request `https://www.googleapis.com/auth/gmail.readonly` for message bodies. Request `https://www.googleapis.com/auth/calendar.events.readonly` when event context is needed; add calendar-list scope only if calendar selection requires it. Do not request send/modify/write permissions for the first slice.
4. Planned storage: a user configuration directory such as `~/.config/email-agentic/`, or its `XDG_CONFIG_HOME` equivalent, outside the checkout. Keep OAuth client JSON and refresh tokens in separate files accessible only to their owner. Implement the path/configuration contract before documenting it as runnable; the application does not read these files yet. Never commit credentials or paste them into issues; ignore rules alone are insufficient protection.
5. Verify by reading a selected authorized message/event, recording granted scopes without credentials, revoking access and confirming later calls are rejected. Keep real credentials outside default CI.

Setup references: [Gmail Python quickstart](https://developers.google.com/workspace/gmail/api/quickstart/python), [Calendar Python quickstart](https://developers.google.com/workspace/calendar/api/quickstart/python). They are setup references; the foundation does not copy their sample code or include Google client packages.

Verified scope/protocol references: [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [Desktop OAuth](https://developers.google.com/identity/protocols/oauth2/native-app). `gmail.readonly` is restricted and permits broad reading; enforce selected-message limits and data minimization in the application. A public GitHub repository does not establish a verified/public OAuth app. Review current consent, verification and data policies before a multi-user deployment.
