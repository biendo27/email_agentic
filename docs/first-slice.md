# First slice: email to research draft

**Implementation contract; the foundation does not yet contain this business flow.** Build one integrated path with reviewable code, traces and output. This is the first increment of the [full requirements](requirements.md), not a reduction of the remaining scope.

## Input, output and permissions

A user manually selects one real email they are authorized to process, using Gmail read-only access. Google Calendar is the selected calendar provider; read context only when required, with calendar triggers deferred to their milestone. Do not poll the whole inbox, modify read status, send messages or create calendar events in this slice.

The foundation has not created an OAuth app, consent configuration or credentials. Before integration, follow [planned Google OAuth setup](local-runtime.md#planned-google-oauth-setup), verify read access and revocation, and choose the search provider, allowed sources and request budget. Do not put credentials or private messages in issues.

Produce a local Markdown draft for review, with provenance/citations for important claims, missing-data status and sanitized success/failure traces. Do not publish an official report, send notifications or persist business knowledge/memory. Runtime trace metadata needs a defined retention policy and must remain separate from business knowledge.

## Explicit flow

`manual trigger -> read selected email -> resolve company -> retrieve bounded sources -> validate evidence -> retain review draft -> stop`

`ambiguous company`, `missing evidence`, `permission denied`, `rate limited` and `provider unavailable` must produce accurate outcomes. Never fill unsupported fields with guesses. Company names/domains extracted from email are candidates until evidence resolves the correct organization.

Planned state includes run/message identity, company candidates/resolution, sources, claim-to-evidence mapping, draft reference and status/error. Tool contracts specify inputs, outputs, scope, timeout, request budget and errors. Sources retain URL, retrieval time and the minimum permitted evidence. Define source/request limits, timeouts, token/cost budget and stop conditions in the issue before implementation; sample slide metrics are not budgets.

## Observable acceptance

- Read one selected real email through read-only access; research authorized sources and link the steps through run/operation identity.
- Confirm correct company resolution; ambiguous names or missing domains cannot become a confident match without evidence.
- Include company/domain, cited research and missing-data details in the draft. Verify that each important citation supports its claim.
- Reject unsupported conclusions; injection in email/web content cannot grant tool permissions or expose secrets.
- Retain sanitized success and failure traces identifying the real provider, failure boundary and unverified checks. Fixture results do not replace live integration evidence.
- No send/notify/KB write and no Gmail/Calendar write permissions; inspect adapter permissions and actual actions.
- Run `make check` and `uv build` after changes; review the draft, citations and outcome status.

## Technical review invariants

- Graph transitions and state ownership are explicit; a node is not implicitly an LLM call.
- Structural validation and claim support are checked separately.
- External content cannot authorize tools or access credentials.
- Missing evidence and provider errors cannot produce a success result.

Proceed when acceptance evidence supports these invariants. Approval and durable resume must be implemented before enabling side effects; see [functional milestones](requirements.md#functional-milestones).
