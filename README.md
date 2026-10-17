# Email Agentic

A web application and agent backend for preparing customer meetings from email and calendar context, delivered through independently verifiable features.

**Current status: full-stack development foundation.** The React/TypeScript web app checks real backend liveness, with loading, failure and refresh states. The Python backend provides a health API, typed configuration, offline diagnostics and an explicit gateway smoke command. Both have quality gates and Docker definitions. Email ingestion, research, seven agent roles, approval, reports, memory and business dashboards remain planned. A healthy connection does not prove those integrations work.

## Run locally

Install [uv](https://docs.astral.sh/uv/getting-started/installation/), Python 3.12 and Node.js 24 with npm. uv can manage the project Python version. Docker is only needed for optional infrastructure.

```sh
make setup
cp .env.example .env
make check
make dev
```

In another terminal, start the web app:

```sh
make dev-web
```

Open [the web app](http://127.0.0.1:5173). Keep the backend running at `http://127.0.0.1:8000`; Vite proxies the relative `/healthz` request to it. Stop both processes with `Ctrl+C` in their terminals. The web server uses a strict port and fails if 5173 is already occupied.

For a direct backend check:

```sh
curl --fail http://127.0.0.1:8000/healthz
```

`{"status":"alive"}` confirms HTTP liveness only. Startup requires no credentials; the health check does not contact gateways or databases.

[Makefile](Makefile), [backend configuration](apps/backend/pyproject.toml), [web package scripts](apps/web/package.json) and [CI](.github/workflows/checks.yaml) own installation and checks. `make check-be` and `make check-web` run each side separately; `make check` runs both.

For the real browser-to-backend suite, stop development servers and run:

```sh
npm --prefix apps/web run browser:install
make check-e2e
```

The suite manages its own backend and web servers and checks desktop/mobile layouts and keyboard refresh. See [codebase conventions](docs/codebase-conventions.md) for source, tests and eval placement.

## Configure and test the gateway

Edit the local configuration using [.env.example](.env.example). Never publish credentials or private email content.

```sh
make doctor
```

This checks configuration presence offline and exits with code 1 when required gateway settings are missing. It does not verify credentials or connectivity. To test an OpenAI-compatible gateway, configure `LLM_BASE_URL`, `LLM_API_KEY` and `LLM_MODEL`, then explicitly run:

```sh
make llm-smoke
```

The smoke command makes a real provider request and may incur cost. Embedding configuration is separate and optional. Configuring OpenRouter does not establish free model availability, quota or compatibility. The foundation does not require embeddings.

## Optional infrastructure

[compose.yaml](compose.yaml) owns services, ports, profiles and volumes. Follow [local-runtime.md](docs/local-runtime.md) for prerequisites, startup and limits, including password requirements for all real-config Compose commands. The web UI uses port 5173, the API uses port 8000 and Grafana uses a separate port. Compose does not configure business checkpoints or telemetry automatically.

## Documentation

- [Codebase structure and conventions](docs/codebase-conventions.md): source responsibilities, import boundaries, naming and test/eval ownership.
- [Frontend](docs/frontend.md): UI boundaries, API validation, accessibility and behavior checks.
- [First slice](docs/first-slice.md): select one authorized email, track research and review a cited Markdown draft in the UI.
- [Architecture and trust boundaries](docs/architecture.md): planned system boundaries and the distinction between LangGraph and Neo4j.
- [Requirements and evidence](docs/requirements.md): full backlog, six Tool Harness stages and functional milestones.
- [Contribution workflow](docs/development.md): issue, bounded plan, implementation, evidence review and PR.
- [Evaluation](apps/backend/evals/README.md): cases, traces, holdout and the limits of foundation tests.

Start an **Integrated slice** issue using the first-slice contract. Complete its acceptance evidence before expanding the feature scope.
