# Runtime foundation

Status: DONE_WITH_CONCERNS

## Delivered

- Python 3.12 src package, FastAPI `/healthz` returning `{"status":"alive"}` without integration loading or readiness claims.
- Pydantic Settings loads ignored local configuration and process environment. Keys/DSN/passwords are SecretStr; URLs reject embedded credentials/query strings; timeout is finite, positive and at most 300 seconds. Blank values count as absent.
- `email-agentic doctor` checks config presence offline, returns 1 when required gateway fields are absent and 2 for invalid config, outputs field names/status only.
- `email-agentic llm-smoke` sends one explicit OpenAI-compatible `/chat/completions` request with chosen model, a small constant prompt, 16 output tokens and configured HTTP timeout. No retries/redirect following; provider text/body and secret values never appear in CLI messages. This checks plain completion only, not tools, structured output or the business workflow.
- Separate optional embedding config; no cloud request during API startup, doctor or CI.
- Locked uv dependencies include LangGraph, Postgres checkpoint/psycopg and Neo4j for future slices. No fabricated graph/report/agent implementation.
- Make setup/check/dev/doctor/llm-smoke/compose-check targets; secretless CI checks; nonroot app Dockerfile.
- Compose Postgres/Neo4j persistent volumes and healthchecks, localhost-bound ports, optional `app` and `observability` profiles. Approximate caps: 512 MiB Postgres, 1536 MiB Neo4j, 512 MiB app, 2 GiB LGTM. These limits are a starting point, not measured capacity.
- App container uses `bolt://neo4j:7687` and separate `COMPOSE_POSTGRES_DSN` (must target `postgres:5432`, with URL-encoded password). No accidental host localhost DSN inheritance.
- LGTM requires a nonblank admin password when its container starts, disables anonymous auth, and keeps upstream healthcheck. Its optional profile does not make Grafana password mandatory to validate/start only databases.

## Verification

- `uv lock` and `uv sync --locked`: pass, CPython 3.12.14, 65 resolved packages, public PyPI registry.
- `uv run --locked pytest`: **29 passed**. Covers liveness without config, absent/blank settings, finite timeout bounds, unsafe URL rejection, environment precedence, secret representation redaction, doctor offline guarantee/exit codes, missing-config smoke network prevention, exact gateway URL/model/auth/timeout, one attempt, redirects/status errors, malformed bodies, transport failures and secret-safe diagnostics.
- `uv run --locked pyright`: **0 errors, 0 warnings** after correcting two test type signatures.
- `make check`: pass in full on final runtime revision (Ruff lint, formatting, strict Pyright, 29 tests, sdist and wheel). One test blank line caught earlier was corrected before this final aggregate run.
- `uv build --no-sources`: source distribution and wheel built successfully.
- `make compose-check`: pass with both optional profiles, `--env-file /dev/null` and `config --quiet`, using validation-only variables; no credentials rendered.
- `docker info --format '{{.ServerVersion}}'`: daemon unavailable, Docker socket missing. No containers, image pull/build, runtime health checks or volume persistence claim. Daemon was not started.
- No server/background process started by this worker. No paid external LLM/embedding request made.

## Current upstream evidence checked 2026-10-16

- PostgreSQL official image supported tags list `18.6-bookworm`; 18+ volume path is `/var/lib/postgresql`: https://hub.docker.com/_/postgres
- Neo4j Community version tag `2026.09.0`, authentication and `/data` persistence: https://neo4j.com/docs/operations-manual/current/docker/introduction/
- LGTM is for development/demo/testing: https://grafana.com/docs/opentelemetry/docker-lgtm/
- Version `0.36.0`: https://github.com/grafana/docker-otel-lgtm/releases/tag/v0.36.0
- Pinned image source confirms `/otel-lgtm/run-all.sh`, `/data` layout, inherited healthcheck and anonymous-auth environment behavior: https://github.com/grafana/docker-otel-lgtm/blob/v0.36.0/docker/Dockerfile and https://github.com/grafana/docker-otel-lgtm/blob/v0.36.0/docker/run-grafana.sh

## Concerns and handoff

- Container runtime/build and real private-gateway connectivity remain unverified here. `/healthz` intentionally asserts only liveness.
- Observability backend is configured; application telemetry/instrumentation and dashboards remain future work.
- Review/controller owns final combined checks, independent review, plan reconciliation, journal and publication. No commit or push by this worker.
- Source settings and public-example/config files triggered broad local hook filename filters; ordinary scoped editing succeeded. Controller created the public example/ignore files; no hook change or real secret-file read occurred.

Unresolved questions: none for foundation scope.
