---
title: "Phase 1: Access and provider decision contracts"
status: pending
---

# Phase 1: Access and provider decision contracts

## Objective and dependency

Resolve the security and provider choices that block private-data implementation. This phase has no predecessor; Phase 2 cannot start until the maintainer accepts its decisions. The existing foundation has no auth middleware, ownership schema, Google client, or credential store ([architecture](../../docs/architecture.md#initial-production-access-and-ownership), [planned OAuth setup](../../docs/local-runtime.md#planned-google-oauth-setup)).

## Files

All repository paths are relative to the checkout root.

- Read: `docs/requirements.md`, [M1 acceptance](https://github.com/biendo27/email_agentic/issues/1), `docs/development.md`, and current official deployment/auth, Google OAuth/Gmail, and selected search-provider documentation.
- Modify: `docs/architecture.md` (canonical access, identity, session, ownership, retention decisions) and `docs/local-runtime.md` (accepted OAuth client/redirect, scopes, credential lifecycle, revocation setup).

## Steps and decision checkpoints

1. Compare feasible production access/login options against the actual deployment boundary. Record security, operational burden, session/revocation behavior, and future multi-user migration. **Checkpoint:** maintainer selects deployment access, login mechanism, allowed identity, session lifetime, and revocation behavior.
2. Define backend-derived ownership for Google connections, selected messages, runs, drafts, polling, downloads, and mutations. Specify denial behavior and forbid client-supplied ownership as authority.
3. Compare the applicable Google OAuth client and redirect flows with current official documentation. Define `gmail.readonly`, conditional Calendar read scope, server-side credential retrieval/storage, disconnect, provider revocation, expiry/refresh failure, and deletion. **Checkpoint:** maintainer accepts OAuth flow, storage location/service, and retention/deletion periods.
4. Separate sanitized audit/runtime metadata from email bodies, drafts, credentials, and business knowledge. State collection, redaction, retention, deletion trigger, and verification evidence for each class.
5. Compare search providers and define allowed source categories, per-run request/source/time limits, token/cost ceiling, retry rules, and stop behavior. Do not adopt sample metrics from requirements. **Checkpoint:** maintainer selects a provider and numeric budgets, or explicitly gates search implementation behind a named follow-up decision.

## Validation and acceptance

- Trace `authenticated principal -> backend session -> Google connection -> message -> run -> draft -> authorized response`; every private lookup/poll/download has an owner check and denied outcome.
- Tabletop: wrong identity, forged owner, expired session, revoked/expired Google consent, refresh failure, disconnect, deletion request, provider 429, and exhausted search budget.
- Run `git diff --check -- docs/architecture.md docs/local-runtime.md` and verify Markdown links plus every provider-specific claim against a dated official source.
- Done when all checkpoints have recorded maintainer decisions, no secret/private data enters the repo, and no implementation or production-readiness claim is made.

## Risk and rollback

- **High likelihood / high impact:** choosing login independently of deployment makes the contract unusable. Mitigate by deciding them together and retaining rejected-option trade-offs.
- **Medium likelihood / high impact:** OAuth/retention guidance drifts. Mitigate with execution-time official-source review and explicit live-verification tasks.
- Roll back only the two documentation edits; this phase creates no schema, credential, deployment, or live provider state.
