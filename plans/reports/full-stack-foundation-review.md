# Full-stack foundation review

## Scope and result

Reviewed the pending backend relocation, concrete source/test boundaries, React workspace, API validation/request lifecycle, local commands, Compose, CI and technical documentation. The foundation has real HTTP liveness behavior; research and external business integrations remain planned. No unresolved blocking defect was found in the reviewed foundation scope.

The earlier runtime/documentation/review reports describe the initial backend snapshot. Current structure and conventions are owned by [codebase conventions](../../docs/codebase-conventions.md).

## Evidence

- Backend: Ruff lint/format, strict Pyright, 29 pytest tests and wheel/source-distribution builds passed after relocation and internal restructuring.
- Web: strict type-aware ESLint, Prettier, strict TypeScript, 15 Vitest tests and Vite production build passed.
- Browser integration: four Playwright tests passed against actual Python API and Vite servers. They cover real `/healthz` status/body, unavailable research controls, keyboard refresh and no horizontal overflow at 375/768/1440 pixels.
- Additional real failure/recovery check: stopped the owned backend process, refreshed the page and observed `Backend unavailable`, controlled error text and enabled retry. Restarted the backend and refreshed to HTTP 200, `{"status":"alive"}` and `Backend reachable`.
- Render checker: 375x812, 768x1024 and 1440x900 produced zero errors and zero warnings. Desktop and mobile screenshots were visually inspected. Refresh hover and keyboard focus were checked. No overlays exist in this foundation.
- Local evergreen Markdown links were resolved against current files without broken targets. Provider requests were not made during these checks.
- Compose definitions rendered successfully. The Docker daemon later became available: both images built, ran as non-root users, and the built browser UI reached the backend through the nginx container proxy. `/healthz` returned HTTP 200 and `Cache-Control: no-store`. The full database/observability stack remains unverified.

Screenshots, browser traces and private working artifacts stay outside tracked repository content. CI/publication evidence is recorded in the [delivery record](full-stack-foundation-delivery.md).

## Confirmed fixes and review decisions

- Backend configuration, outbound gateway and HTTP routing have explicit owning packages; tests mirror unit responsibilities and separate the actual in-process HTTP contract.
- Frontend composition, API validation, request lifecycle and feature presentation have separate owners. Cancellation and stale-result protection survive React effect cleanup. API bodies and arbitrary network error text cannot become UI messages.
- Agent evals now belong to `apps/backend/evals/`; no fabricated business dataset or passing-quality claim was introduced. No root eval suite exists.
- Make, Docker, docs and tests use the new backend application entry point. Root configuration loading remains explicit.
- Browser suites do not reuse unrelated port owners, and their managed servers stop on completion. Additional manual-check servers were also stopped.
- The public liveness route returns a static status and accesses no private/business data. Adding authentication solely to this route would not protect any existing private resource. Authentication and authorization remain required when private business endpoints are implemented.
- Python architecture boundaries are documented review rules, not claimed as Ruff/Pyright-enforced. Frontend feature-to-app imports are restricted by ESLint.

## Visual review

The rendered page reads calm, restrained and operational, matching the brief. Earlier refinements removed redundant status/footer copy, reduced empty-panel height and replaced generic empty-state text with an explicit no-runs state.

| Criterion | Score | Visible evidence |
|---|---|---|
| Brief fidelity | 2 | Warm neutral workspace, restrained teal and compact evidence path |
| Hierarchy | 2 | Single page heading, distinct research and connection panels |
| Spacing | 2 | Repeated spacing scale separates headings, content and controls |
| Alignment | 2 | Shared panel edges and consistent content insets |
| Typography | 2 | One system family and clear heading/body/status sizes |
| Color | 2 | Text labels retain meaning independently of status color |
| Depth and shape | 2 | Fine borders and consistent radius without heavy shadows |
| States | 1 | Loading/error/disabled/focus/hover verified; active press styling remains minimal |
| Responsiveness | 2 | Stacked mobile panels, no overflow and full-height touch control |
| Restraint | 2 | No decorative gradients, fabricated metrics or unnecessary animations |
| Copy | 1 | Empty and unavailable states are specific; the page headline remains broad |
| Craft | 2 | Consistent line icons, page title/favicon and visible focus treatment |

Total: 22/24. The two acceptable items above do not block the current technical foundation.

## Limits

Passing foundation tests does not establish research quality, citation support, OAuth, tool calling, structured model output, approval, durable resume, database connectivity, delivery correctness or production readiness. Those requirements retain separate acceptance evidence in the backlog.
