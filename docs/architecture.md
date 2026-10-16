# Planned architecture and trust boundaries

This document records product intent and architectural decisions. The foundation provides HTTP liveness, configuration diagnostics and a gateway smoke check; see [src/email_agentic](../src/email_agentic). The business flows below are not implemented yet.

## One application, two kinds of graph

Use one Python/FastAPI application with LangGraph to make orchestration, state, tool calls and approval decisions explicit. A role requires a responsibility, input/output contract, tool scope and observable behavior; it need not call an LLM for every operation. Multiple roles do not require separate services.

LangGraph determines the next execution step. Neo4j stores business relationships among companies, domains, products, contacts, meetings and their provenance. PostgreSQL is planned for durable checkpoints, approval, operation status and audit metadata. Business schemas, migrations and checkpoint integration are not implemented. Add embeddings only when retrieval evidence justifies them; configure embedding and generation providers separately.

Primary references describe the concepts: [LangGraph workflow modeling](https://docs.langchain.com/oss/python/langgraph/thinking-in-langgraph), [persistence](https://docs.langchain.com/oss/python/langgraph/persistence), and [Neo4j property graphs](https://neo4j.com/docs/getting-started/whats-neo4j/). The stack and boundary choices are project decisions, not mandatory standards from these sources.

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

State should identify the run/message, company resolution, sources/claims, draft version, pending action, approval and operation status, without secrets. Define concrete schemas during implementation. Approval must bind to the exact content/version, action, destination and scope; changes invalidate the prior approval.

`approved` is not `executed`. A timeout after sending may leave an `unknown` outcome that requires reconciliation before retry. Operation identity, deduplication and durable status must prevent duplicate sends/writes on replay. Verify restart and resume with a real process restart. [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) can rerun code before an interrupt; separate preparation, approval and side effects. A checkpoint alone cannot guarantee exactly-once behavior in an external service.

## Trust boundaries

Email, web pages and external database records are untrusted data. Requests embedded in them cannot change instructions, widen tool scopes or access secrets. Authority comes from application policy and valid user decisions.

Tools receive schemas and trusted permission context, pass the [six registry stages](requirements.md#six-tool-harness-stages), and enforce timeouts/budgets with structured results/errors. Separate read-only tools from side-effect tools. Audit and trace records must be redacted; never publish credentials or raw inbox content.

## Observability and production intent

Planned telemetry includes linked request/run/tool traces, agent/tool success and failure, latency, measured tokens/cost and Grafana on a separate port. Dependency readiness and business instrumentation are not implemented. [Grafana LGTM](https://grafana.com/docs/opentelemetry/docker-lgtm/) is intended for development/demo/testing; its Compose definition does not prove production monitoring.

Production readiness requires recovery, authentication, backup/restore, privacy and operational evidence. No remote deployment or public demo endpoint is established. Define authentication and permitted exposed data before publishing a demo endpoint.
