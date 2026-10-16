# Requirements and acceptance evidence

The full product scope below remains planned; the foundation does not satisfy business acceptance. Requirement sources: supplied Web Research Agent materials, slides 2-4, and Tool Harness.pdf, pages 4 and 6. Do not redistribute private reference documents or images in this repository.

## Traceability

| Requirement | Planned acceptance evidence | Milestone |
|---|---|---|
| Morning email checks and new-customer identification | Process relevant messages, skip old/unrelated messages, and deduplicate triggers. | 1, 3 |
| Web, company database and calendar research; calendar trigger | Trace authorized sources, database records and meetings; calendar events start the correct run. | 1, 3 |
| Company, domain, products, recent news, contacts and meeting points | Supported claims, source/news dates, correct company identity and explicit missing data. | 1, 3 |
| PDF, Word, Markdown and Email outputs | Consistent content; review rendered layout/links; email remains a draft before approval. | 4 |
| Approval before sending, official reports, notifications and KB persistence | Bind decisions to action/version/destination; rejection has no side effect; content changes invalidate approval. | 2, 4 |
| Sent status, retry, unknown outcomes and replay/deduplication | Reconcile external outcomes, avoid blind retries after timeouts, and prevent duplicate actions after replay/restart. | 2, 4 |
| Preferences/history memory | Scoped retrieval, provenance/retention, and approval for business-memory writes. | 3 |
| Seven substantive roles | Trace each [role's](architecture.md#seven-required-roles) inputs, outputs and tool permissions; empty classes are insufficient. | 1-4 |
| Prompt-injection defense | Email/web instructions cannot change policy, access secrets or widen scopes. | All |
| Six Tool Harness stages | Test denial paths, audit/execute order and trace redaction. | 1-4 |
| Evaluation on six sample companies | Expected evidence, holdout cases, success/failure traces and measured results. | 5 |
| Grafana on a separate port | Display real agent/request/tool success/failure, latency/cost and trace links. | 5 |
| Demo endpoint | Reproducible flow, authentication/privacy boundaries and restart/recovery evidence. | 5 |

## Six Tool Harness stages

The Tool Registry architecture diagram in Tool Harness.pdf, page 6, defines these stages. They require explicit boundary implementation; installing a dependency does not provide compliance.

| Order | Source stage | Planned contract/evidence |
|---|---|---|
| 1 | Validate Schema | Reject invalid input before invoking the tool; return structured validation errors. |
| 2 | Check Authentication | Verify identity/credentials through the system; block missing/expired credentials; external content cannot supply trusted identity. |
| 3 | Check Scopes | Allowlist role, action and destination; reject requests outside scope even if requested by the model. |
| 4 | Check Rate Limit | Enforce real provider/run budgets, request timeouts and bounded handling of 429/retries. |
| 5 | Audit Log | Record a redacted attempt/context before action; fail closed when required audit storage fails; update outcome/unknown status afterward. |
| 6 | Execute Tool | Execute only after gates pass; verify structured results/errors, timeouts, operation identity and replay semantics. |

Page 4 separately describes five lifecycle capabilities: Discover -> Choose -> Execute -> Handle errors -> Return structured results. These do not replace the six registry gates. Discovery exposes only permitted tools; selection does not grant execution permission.

## Functional milestones

| Milestone | Observable acceptance |
|---|---|
| 1. [Read-only email to Markdown draft](first-slice.md) | A real cited research run, rejected unsupported conclusions, and success/failure traces. |
| 2. Approval and durable runtime | Restart at approval and resume; rejection has no action; replay does not duplicate actions. |
| 3. Company database/Neo4j, calendar and memory | Real relationship queries, calendar triggers and scoped preferences/history. |
| 4. Outputs and approved delivery | Reviewed PDF/Word/Markdown/email; approval for sends/notifications/KB writes; accurate status, retry and unknown handling. |
| 5. Evaluation, Grafana and demo/recovery | Six company cases, holdout results, dashboards from real traces, demo endpoint and restart/recovery evidence. |

Apply Harness gates from the first tool integration. Implement approval and replay handling before side effects. Verify provider integration and output rendering in the relevant milestone. Report passed, failed and unverified requirements separately; do not silently drop scope or present a demo as production-ready.

## Metrics

The slide values **98%, 42 seconds, 12 sources and 30 days** are **SAMPLE** values, not adopted project objectives. Measure latency, cost and source coverage before setting thresholds; determine freshness from the use case. Do not fabricate passing evaluations or publish raw inbox data. See the [evaluation contract](../evals/README.md).
