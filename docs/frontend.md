# Frontend conventions and boundaries

The React/TypeScript/Vite application lives in [apps/web](../apps/web). Its current behavior is limited to a real backend liveness request with loading, success, failure and refresh states, plus an explicit research-unavailable state. It does not contain real research runs, business metrics or approval actions yet.

See [codebase conventions](codebase-conventions.md) for the concrete source/test layout and import directions.

## Structure and state

Keep the entry point, application UI and API boundary small and explicit. [Source](../apps/web/src), [package scripts](../apps/web/package.json), [TypeScript configuration](../apps/web/tsconfig.app.json) and [Vite configuration](../apps/web/vite.config.ts) own the current structure and behavior. Split components, hooks or feature modules only when they acquire distinct responsibilities; do not create empty layers for future requirements.

Use strict types and explicit state variants for loading, success and failure. Keep asynchronous work in effects or user actions, clean up requests and prevent stale results from replacing newer ones. Local UI state represents presentation, not permission or durable execution truth. The backend owns run state, tool policy, provider credentials, approval enforcement and persistence.

## API and content boundaries

Use relative same-origin requests. Development Vite and the production nginx proxy route `/healthz` to the backend. New business endpoints and schemas will be defined per feature; the liveness endpoint does not provide research or readiness status.

Treat JSON as untrusted until runtime validation checks its structure and values. Return controlled UI errors for network failures, non-success status and invalid payloads. Type assertions alone are insufficient validation. Never put LLM/Gmail/Calendar keys, refresh tokens or backend credentials in frontend environment variables, bundles, logs or browser storage.

Render external message/research content as data and use safe links; do not inject raw HTML. A later approval UI must present the exact version/action/destination and submit a decision for backend verification. A browser click cannot grant tool scope or bypass backend approval checks.

## Quality and verification

Use [root Make targets](../Makefile): `make setup`, `make dev-web` and `make check-web`. Package scripts own ESLint, Prettier, TypeScript, Vitest and production build checks; `make check` verifies both frontend and backend. Keep npm's committed lockfile reproducible with `npm ci`.

Use semantic headings, buttons and landmarks, visible keyboard focus, readable contrast, and accessible loading/error status messages. Interactive controls need clear labels and disabled/in-progress behavior that prevents conflicting actions.

Test user-visible behavior and application-owned API validation at the smallest reliable layer: loading, actual response shape, non-success status, malformed payload, network failure and refresh/recovery. Tests may isolate fetch at the boundary; a mock is not proof of a working backend or browser proxy. Review real browser behavior and layout when UI changes, and verify a real frontend-to-backend request before claiming integration works. Keep future research features unavailable until their backend contracts and evidence exist.

## Browser integration suite

Install Chromium once with `npm --prefix apps/web run browser:install`, then run `make check-e2e` from the repository root. The suite starts and stops its own real Python API on 8000 and Vite on 5173. Stop development servers first; it refuses to reuse an occupied server. No provider credentials or database containers are required.

[Browser tests](../apps/web/tests/e2e/health-connection.spec.ts) verify the actual proxy response, reachable UI, unavailable research controls, keyboard refresh and overflow at 375/768/1440 pixels. Unit/component tests separately cover malformed responses, timeout, cancellation and error/retry. Automated browser tests do not prove Google/LLM integration or research quality. Browser traces and output are ignored.
