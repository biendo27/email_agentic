# Email Agentic web

React + TypeScript + Vite workspace for the Agent backend. Current behavior is a real same-origin health check with loading, error and refresh states. Research execution, report review and approval are planned features.

Use the repository root [README](../../README.md) and shared Makefile for setup and development. [Frontend conventions](../../docs/frontend.md) own maintained UI and API-boundary guidance. This directory owns its npm lockfile, source, behavior tests and Docker image.

- `npm ci`: install locked dependencies.
- `npm run dev`: loopback development server on strict port 5173; proxies health to the backend on 8000.
- `npm run browser:install`: install Chromium for browser tests.
- `npm run test:e2e`: real browser integration; starts/stops backend and web on ports 8000/5173.
- `npm run check`: lint, format, strict types, behavior tests and production build.

No provider credentials or OAuth tokens belong in this application. A successful health check confirms HTTP liveness only.

Source is divided into `app/` composition, `features/runtime-status/` API/hook/UI responsibilities, `styles/` shared presentation and `test/` setup. Unit/component tests are colocated; browser tests live in `tests/e2e/`. See [codebase conventions](../../docs/codebase-conventions.md) for import direction and naming.
