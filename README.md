# Email Agentic

A Web Research Agent for preparing customer meetings from email and calendar context, delivered through independently verifiable features.

**Current status: development foundation.** The project includes a health API, typed configuration, offline diagnostics, an explicit gateway smoke command, quality gates and Docker definitions. Email ingestion, research, seven agent roles, approval, reports, memory and business dashboards are planned. Dependency installation and a passing health check do not prove these features work.

## Run locally

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and use Python 3.12. uv can manage the project Python version. Docker is only needed for optional infrastructure.

```sh
uv sync --locked
cp .env.example .env
make check
make dev
```

In another terminal:

```sh
curl --fail http://127.0.0.1:8000/healthz
```

`{"status":"alive"}` confirms HTTP liveness only. Startup requires no credentials; the health check does not contact gateways or databases. Stop the server with `Ctrl+C`.

[Makefile](Makefile), [pyproject.toml](pyproject.toml) and [CI](.github/workflows/checks.yaml) own the executable commands and checks.

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

[compose.yaml](compose.yaml) owns services, ports, profiles and volumes. Follow [local-runtime.md](docs/local-runtime.md) for prerequisites, startup and limits, including password requirements for all real-config Compose commands. The API uses port 8000; Grafana uses a separate port. Compose does not configure business checkpoints or telemetry automatically.

## Documentation

- [First slice](docs/first-slice.md): one selected email, cited research and a Markdown draft for review.
- [Architecture and trust boundaries](docs/architecture.md): planned system boundaries and the distinction between LangGraph and Neo4j.
- [Requirements and evidence](docs/requirements.md): full backlog, six Tool Harness stages and functional milestones.
- [Contribution workflow](docs/development.md): issue, bounded plan, implementation, evidence review and PR.
- [Evaluation](evals/README.md): cases, traces, holdout and the limits of foundation tests.

Start an **Integrated slice** issue using the first-slice contract. Complete its acceptance evidence before expanding the feature scope.
