---
title: "Phase 2: Interface contract and implementation breakdown"
status: pending
---

# Phase 2: Interface contract and implementation breakdown

## Objective and dependency

Turn the accepted Phase 1 authority model into a concrete selection/status/draft-review experience, API/state contract, scenario matrix, and bounded Milestone 1 implementation issues. Depends on every Phase 1 maintainer checkpoint.

## Files

All repository paths are relative to the checkout root.

- Read: accepted `docs/architecture.md`, `docs/local-runtime.md`, `docs/requirements.md`, `docs/frontend.md`, [M1 acceptance](https://github.com/biendo27/email_agentic/issues/1); `apps/web/src/app/app.tsx`, `app.css`, `app.test.tsx`; `apps/web/src/features/runtime-status/service-connection.tsx`, `service-connection.css`, `service-connection.test.tsx`; and `apps/web/tests/e2e/health-connection.spec.ts`.
- Create: `plans/reports/issue-6-interface-preview.html` (self-contained, accessible wireflow and state/API mapping; stateful evidence, not evergreen authority).
- Modify: `docs/frontend.md` (accepted UI/API boundary); update M1 issue acceptance with prerequisite links, budgets, scenarios and implementation dependencies.
- GitHub: update issue #6 evidence links and create only the maintainer-approved bounded Milestone 1 implementation issues.

## Steps and decision checkpoints

1. Model the UI data flow: authenticated load -> Gmail connection state -> bounded authorized-message selection -> start -> status polling -> cited Markdown draft review -> stop. Map empty, loading, partial, denied, expired/revoked consent, provider/rate-limit, retryable, terminal error, and success states.
2. Specify request/response/state schemas and status transitions. The backend derives principal/owner, validates selected-message authorization, returns sanitized errors, and never exposes credentials or raw trace data. Retry must not imply a send, notification, official publication, or business-memory write.
3. Produce a responsive, accessible wireflow using existing frontend conventions. **Checkpoint:** maintainer reviews selection, connection, status, recovery, citation/missing-data, and draft-review behavior before docs are accepted.
4. Build a scenario matrix covering allowed/denied ownership, malformed input, session expiry, consent revocation, redaction, search-budget exhaustion, unsupported claims, and safe rendering of untrusted email/web content. Mark fixture, integration, live-provider, and browser evidence separately.
5. Split Milestone 1 into dependency-ordered issues with one integrated acceptance path. Each issue names behavior, files/contracts, tests, live checks, risks, and blocker links. **Checkpoint:** maintainer approves boundaries before GitHub creation/update.

## Validation and acceptance

- Verify each UI state maps to one backend status/error and recovery action; no browser field grants authority.
- Verify the issue set covers auth/session, Google connection, ownership/persistence, selection/status UI+API, bounded research, and integrated acceptance without parallel ownership of shared files.
- Run `git diff --check -- docs/frontend.md plans/reports/issue-6-interface-preview.html`; check local links and inspect the HTML preview at 375, 768, and 1440 px with keyboard navigation.
- Done when the maintainer accepts the preview and scenario matrix, all implementation issues have measurable acceptance/dependencies, and issue #6 links the evidence. No feature is marked implemented.

## Risk and rollback

- **Medium likelihood / high impact:** UI states hide authorization or provider failures. Mitigate with the state-to-API matrix and denied/expired/revoked walkthroughs.
- **Medium likelihood / medium impact:** issue splitting loses end-to-end acceptance or creates file contention. Mitigate with dependency order, explicit ownership, and a final integrated issue.
- Roll back frontend docs, the M1 issue edit and preview. With maintainer approval, mark rejected implementation issues superseded and link the replacement rather than silently closing them. Phase 1 decisions remain independently valid.
