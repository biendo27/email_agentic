---
title: Runnable foundation for Email Agentic
status: in-progress
date: 2026-10-16
---

# Runnable foundation for Email Agentic

## Outcome

Create a fresh web frontend and Python Agent backend project that a maintainer can run, inspect and use immediately to build the supplied Web Research Agent incrementally. Publish the verified base to the public repository `biendo27/email_agentic`.

## Constraints and decisions

- Prioritize readable Python and TypeScript, explicit control flow and reviewable module contracts.
- Provide a React/TypeScript/Vite web frontend in `apps/web/` and retain the Agent backend in `apps/backend/src/email_agentic/`. Browser clients never receive provider or OAuth secrets.
- Keep all repository prose in English and scoped to product and engineering information.
- Product target remains all product requirements, seven agent roles, six Tool Harness stages, evaluation, injection defenses, approval and Grafana monitoring. Bootstrap does not claim these features are implemented.
- Use Python 3.12, uv, FastAPI, LangGraph, Pydantic, OpenAI-compatible private gateway, PostgreSQL and Neo4j. OpenRouter embedding is optional and configured separately.
- Code standards: explicit control flow and validated typed boundaries. Backend: Ruff, Pyright and pytest. Frontend: ESLint, Prettier, TypeScript strict mode, Vitest and Vite build. Python modules use snake_case; frontend modules and docs use kebab-case.
- Target a modest self-hosted machine with about 8 GB RAM. No remote host access is in scope. Local Docker daemon currently unavailable.
- Secrets remain in ignored local configuration. No credential values, private reference materials or personal message data are published.

## Bootstrap scope and non-goals

Implement a real health API, a responsive web workspace with actual backend liveness/error/refresh behavior, typed configuration, safe offline config diagnostics, an explicit opt-in gateway smoke command, reproducible dependencies, local quality gates and CI, Docker/Compose definitions, GitHub change templates, requirement/evidence mapping, conventions, architecture and the first slice handoff. Do not generate pretend research output, seven empty agents, a fabricated completed eval set, or a production-readiness claim. Do not implement full business flows or deploy to the VPS during bootstrap.

## Acceptance

1. `uv sync --project apps/backend --locked` installs a Python 3.12 environment from the lockfile.
2. Health API and CLI run without cloud credentials. Missing integration config is reported accurately and without secret values.
3. Gateway smoke makes a real request only when explicitly invoked and configured; no request is made during startup or default CI.
4. Backend and frontend lint, formatting, type checks, behavior tests and production builds pass. Docker configuration is rendered and inspected; daemon-dependent verification is reported separately if unavailable.
5. README gives exact startup steps, current feature status, documentation navigation and one concrete next task.
6. Product requirements are mapped to planned acceptance evidence, with original sample metrics clearly separated from adopted targets.
7. Repository is reviewed for defects and publishable content, pushed to the authorized public target, and GitHub CI is checked.
8. Documentation, templates and repository records use English and contain only relevant product and engineering information.
9. The web workspace reaches the real backend through the same-origin proxy, handles unavailable/invalid responses accurately, and shows planned research functionality as unavailable. Responsive and keyboard behavior are verified.
10. Local commands, Compose and CI cover both frontend and backend; no business feature or live integration is claimed from scaffolding.

## Work ownership

- Backend foundation: settled source/config/tests under `apps/backend/src/`, `apps/backend/tests/` and the backend Python manifests.
- Frontend worker: `apps/web/` only, including source, behavior tests, locked dependencies, build tooling and web Docker configuration.
- Controller: shared Makefile, Compose, CI and ignore files; integration and verification.
- Documentation worker: `README.md`, `AGENTS.md`, `docs/`, `apps/backend/evals/README.md`, `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`.
- Controller: plan records, extracted-source reconciliation, review integration, verification, Git initialization, journal and publication.

## Phases

| Phase | Dependency | Evidence |
|---|---|---|
| Runtime and developer tooling | Contract | [Runtime report](../reports/runtime-foundation.md) |
| Conventions and incremental handoff | Contract | [Documentation report](../reports/docs-foundation.md) |
| Web frontend and API boundary | Backend health contract | [Frontend delivery](phase-02-web-foundation.md) |
| Integration and review | Frontend, backend and documentation | [Review findings](../reports/foundation-review.md) |
| Publish and onboard | Review | Remote URL and CI run |

[Backend checklist](phase-01-foundation.md) and [web checklist](phase-02-web-foundation.md) own delivery completion.

## Rollback

No existing project files are replaced. Keep generated local configuration untracked. Stop any processes started for checks. Never remove Docker volumes during routine shutdown. Publication uses a normal initial commit and push; do not force-push an existing repository.
