# Web frontend foundation

## Outcome and boundaries

Provide a real React + TypeScript + Vite frontend for the Agent backend. Implement only the available liveness integration; research, reports, run tracking and approval remain planned product features. Provider/OAuth credentials and all permissions stay in the backend.

## Design brief

- Register: Product.
- Scene: maintainer reviewing meeting research on a laptop or mobile device in daylight; calm and focused.
- Direction: restrained operational workspace, because evidence and approval require clear scanning.
- Color: restrained; background oklch(0.98 0.004 90), text oklch(0.24 0.015 180), accent oklch(0.40 0.07 180).
- Type: one system sans family.
- Signature: compact evidence-path row alongside real service connection state.
- Dials: variance 3, motion 2, density 5.

## Execution and verification

- [x] Typed, runtime-validated health client with timeout, cancellation and safe errors.
- [x] Responsive accessible workspace with real loading/success/failure/refresh behavior and honest unavailable business features.
- [x] Frontend lint, formatting, type checks, behavior tests and production build pass.
- [x] Shared local commands, Docker definitions and CI cover web and backend.
- [x] English technical documentation and functional milestones cover frontend interactions.
- [x] Browser checks cover real backend connection, failure/recovery, keyboard and 375/768/1440 layouts; review findings resolved.
- [x] Updated public repository and remote CI verified.

## Integration and rollback

Use loopback 5173 for the web server and 8000 for the backend, with a same-origin health proxy. Stop all processes started for verification. Do not start or claim Docker containers when the daemon is unavailable. Revert the focused frontend integration commit if needed; retain the backend health contract and database volumes.
