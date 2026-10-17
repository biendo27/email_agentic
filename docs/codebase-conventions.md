# Codebase structure and conventions

Each application owns its source, tests, evaluation assets, dependencies and container. Root files coordinate the two applications. This is a project convention, not a universal vendor folder standard.

## Current layout

```text
apps/
  backend/
    src/email_agentic/
      api/
        app.py                   # FastAPI composition root
        routes/health.py         # HTTP liveness contract
      core/settings.py           # Typed configuration and validation
      integrations/llm_gateway.py # Outbound gateway protocol and safe errors
      cli.py                     # Explicit command entry points
    tests/
      conftest.py                # Isolated configuration environment
      unit/
        core/test_settings.py
        integrations/test_llm_gateway.py
        test_cli.py
      integration/api/test_health.py
    evals/README.md              # Agent outcome evaluation contract
    pyproject.toml
    uv.lock
    Dockerfile
  web/
    src/
      main.tsx                   # React bootstrap
      app/                       # Workspace composition and its tests/styles
      features/runtime-status/
        index.ts                 # Public feature entry
        health-api.ts            # HTTP request and runtime validation
        use-backend-health.ts    # Request lifecycle and UI state
        service-connection.tsx   # Feature presentation
        *.test.ts(x)             # Colocated API/component tests
        service-connection.css
      styles/global.css          # Tokens, reset and shared presentation
      test/setup.ts              # Shared test setup only
    tests/e2e/                   # Real browser-to-backend tests
    package.json
    package-lock.json
    playwright.config.ts
    Dockerfile
```

## Backend responsibilities and imports

- `api/app.py` composes routers. Routes validate HTTP input/output, invoke application behavior and map errors. Keep provider details and business decisions out of routes.
- `core/` owns configuration shared by entry points and integrations. It must not import `api`, `cli` or `integrations`.
- `integrations/` implements external protocols. It may depend on `core`; it must not depend on HTTP routes or CLI presentation.
- `cli.py` is another composition entry point. It may use configuration and integrations, but no other source module imports it.
- Use absolute package imports. Importing modules must not make requests, open connections, write files or execute graphs. Construct resources at explicit entry points or application lifecycle boundaries.
- As business behavior is implemented, add `workflows/` for LangGraph state, nodes and graph composition; `tools/` for the Tool Harness and executable tool contracts; and responsibility-specific integrations for Gmail, Calendar, search and storage. Introduce domain models/services when a feature needs rules independent of HTTP, providers and LangGraph. Do not create these directories until their behavior exists.
- Keep graph nodes thin enough to inspect: validated input, explicit tool/application call, typed state update. Prompts belong beside the agent or workflow that uses them; shared prompts need a real second consumer.
- Application/domain rules must not depend on API or CLI presentation. Workflows call tools/application rules; integration adapters implement external details. Define a small typed interface at that boundary when multiple implementations or isolated testing require one; do not start with a generic repository framework.

These import boundaries are review rules. Ruff and Pyright check their configured syntax, imports and types; they do not establish architectural compliance.

## Frontend responsibilities and imports

- `app/` composes the workspace from feature public entries. It does not contain HTTP parsing or provider logic.
- A feature exposes its supported surface through `index.ts`. Consumers outside that feature import the entry, rather than its internal hook or API client.
- Feature files may import local files and shared presentation. A feature must not import `app/`; ESLint enforces that direction. Avoid feature-to-feature internal imports and move shared code only when real reuse exists.
- API clients validate `unknown` JSON at runtime and expose typed results and controlled errors. Hooks own request lifecycle, cancellation and UI state. Components render that state and user actions.
- Keep feature styles with their component and shared tokens/reset in `styles/`. Do not promote feature-specific classes or helpers to a generic shared folder.
- Local browser state is presentation. The backend owns authorization, durable run state, execution, approval and provider credentials. New endpoints require explicit backend contracts and proxy configuration, not direct browser-to-provider requests.

## Naming and implementation

Python files/functions/variables use `snake_case`; classes use `PascalCase`. TypeScript files use `kebab-case`, components/types use `PascalCase`, and functions/variables use `camelCase`. Use descriptive domain names instead of generic `utils`, `manager` or `service` buckets. Keep repository prose and comments in English.

Type and validate external/API/tool/state boundaries explicitly. Prefer direct branches, small functions and named types over nested comprehensions, casts, broad base classes or clever framework tricks. Catch exceptions at the boundary that can explain or recover from them; never turn an error into an empty successful result. Bound timeouts and retries and redact provider bodies, tokens and private message content.

A valid schema does not establish factual support. Approved is not executed; a timed-out write may have an unknown outcome. Preserve these distinctions in models, UI and evidence when the corresponding behavior is introduced.

## Tests and eval ownership

| Suite | Location | Evidence |
|---|---|---|
| Backend unit | `apps/backend/tests/unit/`, mirroring source responsibility | Configuration, CLI and gateway rules in isolation; provider doubles are explicitly not live-provider evidence |
| Backend API integration | `apps/backend/tests/integration/api/` | Actual FastAPI routing, HTTP status and response contracts in-process; no database/provider readiness claim |
| Web unit/component | `apps/web/src/**/*.test.ts(x)` | Runtime response validation, request lifecycle and rendered interaction states |
| Browser integration | `apps/web/tests/e2e/` | Real Vite proxy, Python API and browser behavior; no mocked backend |
| Agent outcome eval | `apps/backend/evals/` | Planned research quality, citation support, tool policy and side-effect outcomes; no completed dataset yet |

Future database/provider integration tests belong under `apps/backend/tests/integration/<integration>/`. Live tests require explicit selection and test credentials; default CI must not call paid/private services. Test filenames describe behavior without plan IDs or review labels. Shared fixtures live at the narrowest owning scope; root `conftest.py` contains only genuinely shared isolation.

Evals belong to the backend because its agents produce the judged output and actions. They are not pytest unit tests: cases need provenance, expected outcomes, graders, run configuration and evidence. Add datasets/runners as real slices introduce them. Private traces and generated runs remain ignored. A root-level suite would need an independently owned, cross-application evaluation contract; none exists currently.

## Checks and references

[Makefile](../Makefile), [backend manifest](../apps/backend/pyproject.toml), [web scripts](../apps/web/package.json) and [CI](../.github/workflows/checks.yaml) own executable gates. Start with the narrowest useful test; see [development](development.md) for commands and [evals](../apps/backend/evals/README.md) for outcome evidence.

The boundaries draw on [FastAPI's larger applications and routers](https://fastapi.tiangolo.com/tutorial/bigger-applications/), [React's component responsibility guidance](https://react.dev/learn/thinking-in-react), and [LangGraph's application structure](https://docs.langchain.com/oss/python/langgraph/application-structure). The exact directory names, colocated frontend tests and split between unit/integration/evals are project decisions. Framework documentation does not mandate this complete layout.
