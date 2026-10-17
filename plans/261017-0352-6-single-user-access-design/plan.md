---
title: "Design single-user access and Google connection"
description: "Produce an accepted backend-authoritative contract for one production user and the read-only email-to-research-draft slice."
status: pending
priority: P1
effort: 6h
issue: 6
branch: docs/project-workflow-foundation
tags: [docs, frontend, backend, api, auth]
blockedBy: []
blocks: []
created: 2026-10-17
---

# Design single-user access and Google connection

Issue: [#6](https://github.com/biendo27/email_agentic/issues/6)

Repository paths are relative to the checkout root.

## Execution status

Pending preparation only. Neither design phase has started, no design has been accepted, and no implementation is authorized by committing this plan. Issue #6 remains open.

## Outcome

Deliver maintainer-accepted design contracts for production access/login, backend identity/session/ownership, read-only Google OAuth and credential lifecycle, privacy/retention, bounded search, and the first selection/status/draft-review UI/API. Then split Milestone 1 into implementation issues without implementing the feature in this plan.

Baseline evidence: the foundation exposes liveness only ([current architecture](../../docs/architecture.md)); access/login, ownership, OAuth storage, and retention are open ([open access decisions](../../docs/architecture.md#initial-production-access-and-ownership)); the first slice is blocked on these decisions and concrete search budgets ([M1 prerequisites](https://github.com/biendo27/email_agentic/issues/1)); and the current UI has no research run ([current frontend](../../docs/frontend.md)).

## Constraints and non-goals

- One production user now; preserve a clear migration path to explicit multi-user ownership later without adding a multi-tenant framework.
- The backend owns authority, provider credentials, ownership checks, orchestration, and persistence. Browser state and external content are untrusted.
- Gmail is read-only; Calendar read access is conditional. No send, notification, official publication, approval side effect, or business-knowledge write.
- Do not create Google credentials, deploy, add dependencies/schemas/code, or claim private-data functionality exists.
- Product choices remain unresolved until the maintainer accepts them; the plan supplies comparisons and evidence, not defaults.

## Phases and dependencies

| Phase | Deliverable | Depends on |
|---|---|---|
| [1. Access and provider decision contracts](./phase-01-decision-contracts.md) | Accepted access, ownership, OAuth, retention, search-provider and budget decisions | None |
| [2. Interface contract and implementation breakdown](./phase-02-interface-and-breakdown.md) | Accepted preview, API/state/scenario contract, and bounded Milestone 1 issues | Phase 1 accepted |

Phase 1 owns `docs/architecture.md` and `docs/local-runtime.md`; Phase 2 owns `docs/frontend.md`, M1 issue acceptance and its preview report. `docs/requirements.md` is read-only unless the maintainer explicitly changes product scope.

## Acceptance

- Maintainer decisions are recorded for deployment/login, allowed identity/session/revocation, ownership, OAuth flow/storage/deletion, and search provider/numeric budgets or an explicit gate.
- The design traces input and state from authenticated user through authorized message, run, sources, and retained draft; every private-data route has backend ownership and denial behavior.
- A concrete UI/API preview and scenario matrix cover empty/loading/partial/denied/error/retry/success plus expired/revoked consent and redaction.
- The smallest owning docs contain accepted durable decisions, official provider claims are execution-time verified, and bounded implementation issues preserve integrated acceptance.
- Docs/link/diff checks pass. Implementation, live OAuth, deployment, integration, and browser-provider behavior remain explicitly unverified.

## Compatibility, test matrix, and rollback

- Existing `/healthz`, offline startup/CI, and unavailable research UI remain compatible. Later multi-user work migrates stored owner keys and policy deliberately before access widens.
- Documentation checks validate structure/links; tabletop scenarios validate control flow; preview review validates responsive UI states; future implementation issues own unit, API integration, browser, restart, and live-provider tests.
- Each phase is independently reversible as documented. No rollback touches credentials, databases, deployment, or provider state because this plan creates none.

## Unresolved maintainer decisions

All are Phase 1/2 checkpoints: deployment boundary and login, identity/session/revocation, OAuth client/redirect and credential store, retention/deletion periods, search provider and budgets, UI/API preview, and final issue split. Their presence means issue #6 is ready for design execution, not ready for feature implementation.

## Authoring validation

The authoring pass read issue #6 and the required project docs, enumerated the current web source/tests with `rg --files`, confirmed branch `docs/project-workflow-foundation`, checked every referenced local path, and ran whitespace/placeholder checks on these plan files. No design research, maintainer choice, docs change, GitHub mutation, or feature implementation was executed.

<!-- slug: 6-single-user-access-design -->
