# First slice: email to research draft

**Implementation contract; the foundation does not yet contain this business flow.** Build one integrated path with reviewable code, traces and output. This is the first increment of the [full requirements](requirements.md), not a reduction of the remaining scope.

## Input, output and permissions

In the web UI, a user selects one real email they are authorized to process and starts read-only research. The backend retrieves it through Gmail read-only access and verifies the selection against the authorized account. Google Calendar is the selected calendar provider; read context only when required, with calendar triggers deferred to their milestone. Do not poll the whole inbox, modify read status, send messages or create calendar events in this slice.

The foundation has not created an OAuth app, consent configuration or credentials. Before integration, follow [planned Google OAuth setup](local-runtime.md#planned-google-oauth-setup), verify read access and revocation, and choose the search provider, allowed sources and request budget. Do not put credentials or private messages in issues.

Retain a Markdown draft and present it in the UI for review, with provenance/citations for important claims, missing-data status and sanitized success/failure traces. Show run progress, accurate outcome/error states and a recoverable failure path without inventing completed stages. Do not publish an official report, send notifications or persist business knowledge/memory. Runtime trace metadata needs a defined retention policy and must remain separate from business knowledge.

## Explicit flow

`UI selection/start -> backend reads selected email -> resolve company -> retrieve bounded sources -> validate evidence -> retain draft -> UI review -> stop`

`ambiguous company`, `missing evidence`, `permission denied`, `rate limited` and `provider unavailable` must produce accurate outcomes. Never fill unsupported fields with guesses. Company names/domains extracted from email are candidates until evidence resolves the correct organization.

Planned state includes run/message identity, company candidates/resolution, sources, claim-to-evidence mapping, draft reference and status/error. Tool contracts specify inputs, outputs, scope, timeout, request budget and errors. Sources retain URL, retrieval time and the minimum permitted evidence. Define source/request limits, timeouts, token/cost budget and stop conditions in the issue before implementation; sample slide metrics are not budgets.

## Observable acceptance

- Select an authorized message and start research from the UI; the backend reads it through read-only access. Research authorized sources and link the steps through run/operation identity.
- Show run status, loading/error states and supported recovery controls; invalid/unauthorized message selection is rejected by the backend. Never use fabricated runs or completion metrics.
- Confirm correct company resolution; ambiguous names or missing domains cannot become a confident match without evidence.
- Display company/domain, the retained draft, cited research and missing-data details in the UI. Render external content safely without trusting embedded HTML/instructions. Verify that each important citation supports its claim.
- Reject unsupported conclusions; injection in email/web content cannot grant tool permissions or expose secrets.
- Retain sanitized success and failure traces identifying the real provider, failure boundary and unverified checks. Fixture results do not replace live integration evidence.
- No send/notify/KB write and no Gmail/Calendar write permissions; inspect adapter permissions and actual actions.
- Run `make check` after changes; review the draft, citations and outcome status.

## Technical review invariants

- Graph transitions and state ownership are explicit; a node is not implicitly an LLM call.
- Structural validation and claim support are checked separately.
- External content and browser state cannot authorize tools or access provider credentials.
- UI controls reflect backend authority; endpoints and response contracts are defined and validated as part of this slice.
- Missing evidence and provider errors cannot produce a success result.

Proceed when acceptance evidence supports these invariants. Approval and durable resume must be implemented before enabling side effects; see [functional milestones](requirements.md#functional-milestones).
