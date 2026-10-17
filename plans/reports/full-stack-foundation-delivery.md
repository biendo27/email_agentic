# Full-stack foundation delivery

The runnable development foundation is published at [biendo27/email_agentic](https://github.com/biendo27/email_agentic).

## Delivered

- Symmetric application ownership: `apps/web/` and `apps/backend/`, with independent dependency lockfiles and containers.
- Backend HTTP, configuration and gateway-client packages; unit tests mirror responsibilities and API integration tests have their own suite.
- Frontend app composition, runtime-status API/hook/component feature, shared presentation, colocated unit/component tests and separate browser integration suite.
- Backend-owned `evals/` contract with honest planned status; no invented business data or eval score.
- [Codebase conventions](../../docs/codebase-conventions.md), linked from README and AGENTS: placement, naming, import direction, runtime validation, error handling and test/eval ownership.
- Root setup/check/dev commands, Compose, technical product backlog and first integrated slice contract.

## Verification

Application revision: `5425d373f44cd18933c8f180bcb2c8ffd6226fcf`.

[GitHub Actions run 38995248132](https://github.com/biendo27/email_agentic/actions/runs/38995248132) completed successfully with backend, web and browser jobs.

Local gates passed: 29 backend tests, 15 web tests, four actual browser-to-backend tests, lint/format/types, package/web production builds and Compose rendering. Manual backend-stop/restart recovery and three responsive renders also passed. See the [review evidence](full-stack-foundation-review.md).

Docker application verification used Python and web images built from the application revision. Both ran without provider configuration on an isolated Docker bridge with alias `app` for backend resolution. Backend UID was 10001 and web UID was 101. The browser loaded the compiled web application through nginx, displayed `Backend reachable`, and received `{"status":"alive"}` with HTTP 200 and `Cache-Control: no-store`. No database or model call was needed. Test containers/network and all manually started servers were stopped and removed; database volumes were untouched.

Only liveness, diagnostics, explicit gateway smoke plumbing and the development foundation are implemented. No live gateway request, Google OAuth, database business integration, seven-role orchestration, research quality, approval, durable resume, telemetry dashboard or deployment is claimed. The full infrastructure stack has not been exercised.

## Start implementation

Use [the root README](../../README.md) for startup and [the first-slice contract](../../docs/first-slice.md) for the next integrated feature: authorized email selection, bounded read-only research, accurate run state and a cited draft reviewed in the web UI. Configure providers locally; never publish credentials or raw inbox content.
