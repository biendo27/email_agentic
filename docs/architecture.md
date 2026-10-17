# Architecture and trust boundaries

This document records product intent and architectural decisions. The foundation includes a React/TypeScript web app in [apps/web](../apps/web) and one Python agent backend in [apps/backend](../apps/backend). The UI checks real HTTP liveness; the backend provides diagnostics and a gateway smoke command. The business flows below are not implemented yet.

Each application owns its source, tests, dependency manifest/lockfile and Dockerfile: `apps/web` for the browser, `apps/backend` for the agent backend. Root Makefile, Compose, CI and documentation coordinate the applications. Agent outcome evaluations belong to `apps/backend/evals/`. Shared local configuration remains at the repository root; provider credentials are consumed only by the backend.

## Web UI, one agent backend, two kinds of graph

Use React with TypeScript and Vite for the browser application, and one Python/FastAPI application with LangGraph to make orchestration, state, tool calls and approval decisions explicit. A role requires a responsibility, input/output contract, tool scope and observable behavior; it need not call an LLM for every operation. Multiple roles do not require separate services.

The browser handles presentation, interaction and API state. The backend owns LLM/Gmail/Calendar credentials, orchestration, Tool Harness gates, approval enforcement and persistence. Development Vite and production nginx proxy same-origin `/healthz` requests to the backend; future business API contracts will be designed for each feature. No browser bundle, storage or frontend environment variable may contain provider secrets. See [frontend boundaries](frontend.md).

LangGraph determines the next execution step. Neo4j stores business relationships among companies, domains, products, contacts, meetings and their provenance. PostgreSQL is planned for durable checkpoints, approval, operation status and audit metadata. Business schemas, migrations and checkpoint integration are not implemented. Add embeddings only when retrieval evidence justifies them; configure embedding and generation providers separately.

Primary references describe the concepts: [LangGraph workflow modeling](https://docs.langchain.com/oss/python/langgraph/thinking-in-langgraph), [persistence](https://docs.langchain.com/oss/python/langgraph/persistence), and [Neo4j property graphs](https://neo4j.com/docs/getting-started/whats-neo4j/). The stack and boundary choices are project decisions, not mandatory standards from these sources.

## Initial production access and ownership

The first production deployment serves one user. Authentication and explicit backend ownership are required before exposing private email, runs or drafts. Multi-user behavior is deferred and must be implemented and verified separately before widening access.

Separate application identity from Google provider consent: possessing an email identifier, a browser state value or an OAuth callback does not itself authorize access to a run. The backend must bind the authenticated principal to its Google connection, selected messages, runs, drafts and later approvals/operations. Enforce ownership on lookup, polling, download and mutation paths; never trust a client-supplied owner as authority.

The login mechanism, allowed identity, deployment access boundary, OAuth client/redirect flow, credential storage and retention/deletion policy remain design decisions. No authentication middleware, business ownership schema or provider-token storage exists in the foundation. Choose these together before implementing the first private-data path. Avoid introducing a multi-tenant framework solely for a future possibility.

## Seven required roles

Role names come from the supplied Web Research Agent requirements, slides 2-3. The responsibilities below remain implementation contracts.

| Role | Planned responsibility and boundary |
|---|---|
| Email Agent | Read authorized Gmail content and extract customer context; send only through an approved action. |
| Web Research Agent | Retrieve bounded web sources with timestamps and provenance; page content cannot authorize actions. |
| Company Info Agent | Read company information from the database with provenance and missing-data status; KB writes require approval. |
| Calendar Agent | Read authorized Google Calendar context and initiate calendar-based research triggers. |
| Report Generation Agent | Synthesize supported claims, draft reports and output formats; cannot promote a draft to official status itself. |
| Memory Agent | Manage scoped preferences/history with provenance; business-memory persistence requires approval. |
| Human Approval Agent | Present action, content, destination and scope, and record the user's actual decision. |

## State, approval and recovery

Planned flow: morning email or calendar trigger -> identify customer -> retrieve web/database/calendar context -> validate evidence -> draft -> human decision -> authorized action -> record outcome. Missing evidence, rejection and errors have explicit exits.

State should identify the run/message, company resolution, sources/claims, draft version, pending action, approval and operation status, without secrets. Define concrete schemas during implementation. Approval must bind to the exact content/version, action, destination and scope; changes invalidate the prior approval. The later web approval screen presents this binding and submits a user decision; the backend must authenticate, authorize and verify it. A browser button or state value does not grant privileges.

`approved` is not `executed`. A timeout after sending may leave an `unknown` outcome that requires reconciliation before retry. Operation identity, deduplication and durable status must prevent duplicate sends/writes on replay. Verify restart and resume with a real process restart. [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) can rerun code before an interrupt; separate preparation, approval and side effects. A checkpoint alone cannot guarantee exactly-once behavior in an external service.

## Trust boundaries

Email, web pages and external database records are untrusted data. Requests embedded in them cannot change instructions, widen tool scopes or access secrets. Authority comes from application policy and valid user decisions.

Tools receive schemas and trusted permission context, pass the [six registry stages](requirements.md#six-tool-harness-stages), and enforce timeouts/budgets with structured results/errors. Separate read-only tools from side-effect tools. Audit and trace records must be redacted; never publish credentials or raw inbox content.

Research must separate company candidates from an evidence-supported resolution. Sources need provenance, retrieval time and minimum permitted evidence; important claims must map to supporting sources. Missing evidence, ambiguity, permission denial and provider errors cannot become a successful result. Set request/source/time and token/cost budgets before enabling a research path; a sample metric is not an operating limit.

## Observability and production intent

Planned telemetry includes linked request/run/tool traces, agent/tool success and failure, latency, measured tokens/cost and Grafana on a separate port. Dependency readiness and business instrumentation are not implemented. [Grafana LGTM](https://grafana.com/docs/opentelemetry/docker-lgtm/) is intended for development/demo/testing; its Compose definition does not prove production monitoring.

Production readiness requires recovery, authentication, backup/restore, privacy and operational evidence. No remote deployment or public demo endpoint is established. Define authentication and permitted exposed data before publishing a demo endpoint.
