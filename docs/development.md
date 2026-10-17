# Contribution workflow

Keep changes bounded by observable product behavior, explicit permissions and acceptance evidence. Work from the repository root with the shared Make targets. `apps/backend` and `apps/web` each own their source, tests, dependencies and container definition; keep application-specific configuration within its owner.

## Change workflow

1. Create an **Integrated slice** issue with permitted input, expected output, scope, tool permissions, technical invariants and observable acceptance.
2. Inspect relevant source and tests. For multi-step or risky work, write a short plan under `plans/` covering scope, affected files, verification and rollback.
3. Implement the integrated path across UI interaction, backend state/tools, output and failure handling when the feature spans both applications.
4. Run appropriate checks and retain sanitized success/failure evidence. Review actual output, citation support and side effects alongside lint, types and tests.
5. Open a PR with acceptance results and unresolved risks. Mark requirements complete only when evidence supports them; retain remaining requirements in the backlog.

Coding skills belong to the development environment, not the application runtime. When installed, use `advise` for design decisions, `brainstorm` for unclear outcomes, `plan` for execution plans, `cook` for implementation, `test` for verification, `code-review` for review, `debug` for diagnosis and `github` for issue/PR operations. Check the current installed catalog before selecting a skill; this repository does not install them. Small changes may use a shorter workflow while retaining acceptance and evidence.

Source placement, dependency direction, naming, tests and evals are defined in [codebase conventions](codebase-conventions.md).

## Python conventions

Adopt a subset of the [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html): descriptive names, deliberate exceptions, no mutable default arguments, limited mutable global state, readable comprehensions and docstrings for non-obvious contracts. This is not full Google-style compliance. uv, Ruff, Pyright and pytest are project choices; [backend pyproject.toml](../apps/backend/pyproject.toml) owns their configuration and [Makefile](../Makefile) owns aggregate commands.

- Use `snake_case` for Python modules, functions and variables, `PascalCase` for classes, and kebab-case for new documentation filenames.
- Type API, tool, state and persistence boundaries explicitly. Pydantic validates data structure; valid structure does not establish factual support.
- Prefer clear loops and branches over nested comprehensions or abstractions that obscure control flow.
- Separate business decisions from provider clients and orchestration where a real boundary exists. Do not create speculative folders or base classes.
- Imports must not open connections, call networks, write files or execute graphs. Create resources at explicit entry points or lifecycle boundaries.
- Do not swallow broad exceptions and return empty success. Retry appropriate transient failures with limits; validation and permission denial are not network failures.
- Define node/tool inputs, outputs, permissions, timeouts and errors. Keep secrets and private message bodies out of traces.

A graph checkpoint records execution state. It does not replace domain storage or an external action's transaction and deduplication contract.

## Frontend conventions

Treat the web codebase as a maintained application with explicit boundaries, not a disposable demo. Use strict TypeScript, descriptive domain types, a small API boundary and behavior-focused component tests. Validate untrusted responses at runtime; do not cast JSON directly into a trusted type. Keep credentials and business authority in the backend.

Create components, hooks and feature modules when responsibilities justify them; do not scaffold speculative folder layers or empty abstractions. Keep side effects in explicit React effects or user actions, handle cancellation/stale results, and make loading, errors, refresh and unavailable features visible. Require semantic controls, keyboard access and accessible status messages. See [frontend.md](frontend.md) for the owning web conventions and executable references.

## Test commands

From the repository root:

```sh
uv run --project apps/backend --locked pytest apps/backend/tests/unit/core/test_settings.py
uv run --project apps/backend --locked pytest apps/backend/tests/integration/api
npm --prefix apps/web run test -- src/features/runtime-status
make check
npm --prefix apps/web run browser:install
make check-e2e
make compose-check
```

`make check` is the fast offline application gate. `make check-e2e` is a separate real-browser gate and also runs in CI. It owns ports 8000/5173 for the test duration; stop development servers first. Browser installation is a one-time local prerequisite, repeated when Playwright updates its pinned browser. Neither suite calls Google, LLM or database services.

## Verification and delivery

`make check` runs backend and web quality gates. `make check-be` covers the Python gates and package build; `make check-web` covers ESLint, Prettier, TypeScript, Vitest and the production build. Backend package verification is included in `make check-be`. Start with the smallest useful test for an application-owned invariant. Use integration checks when provider/database contracts change, and select credentialed live checks explicitly. Boundary test doubles are not proof of a live integration. For UI changes, verify loading, success, malformed-response/error and retry behavior at the lowest useful layer; inspect the browser when layout or interaction changes. Component tests alone do not establish a real browser-to-backend connection.

Factual correctness, approval, restart, duplicate prevention and actual delivery require [separate evidence](../apps/backend/evals/README.md). Report pass, fail and unverified results; do not weaken assertions to hide failures. Use focused conventional commits without personal data. Update the owning documentation when behavior, setup, commands or architecture change; phase completion alone does not require documentation changes.
