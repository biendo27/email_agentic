# Email Agentic backend

Python/FastAPI backend for Email Agentic. The current foundation implements liveness, typed configuration, offline diagnostics and an explicitly invoked gateway smoke check. Business workflows remain planned.

Run commands from the repository root using the [root README](../../README.md) and [Makefile](../../Makefile). This keeps the ignored root `.env` as the configuration source.

- `src/email_agentic/api/`: HTTP application composition and routes.
- `src/email_agentic/core/`: typed configuration.
- `src/email_agentic/integrations/`: outbound provider protocols.
- `src/email_agentic/cli.py`: command composition.
- `tests/unit/`: isolated configuration, CLI and integration-client tests.
- `tests/integration/api/`: in-process HTTP contract tests.
- `evals/`: agent outcome evaluation contract; no completed business dataset yet.

See [codebase conventions](../../docs/codebase-conventions.md) for import rules, naming and future feature placement. `make check-be` runs the backend quality gates and package build.
