# Evaluation contract

**Planned; no completed business eval dataset or pass claim.** Foundation tests cover runtime/configuration boundaries, not research quality, seven-role behavior, approval or delivery reliability.

Build six company cases from public/sample material, without raw inbox data or personal contacts in the public repo. Retain input provenance, expected company resolution, required report fields, evidence expectations and allowed actions. Freeze holdout cases before tuning; do not silently turn unseen acceptance cases into development examples.

Measure actual outcomes:

- Correct company/domain/fields, claim support by cited source, visible freshness and missing evidence.
- Injection cannot widen scopes, expose secrets or authorize writes.
- Approval/rejection, restart/resume and replay/dedup preserve action/version/destination; inspect actual sent/persisted state when implemented.
- Auth/scope/schema failures, 429, timeout, unavailable source and ambiguous identity produce accurate status. Uncertain side effects remain unknown until reconciled.
- Latency, request/tool success/fail, tokens and cost use measurements. Missing cost stays unknown; slide figures are samples.

Each slice needs a real success trace and failure trace: run/operation identity, tool, timestamps, redacted input summary, result/status, evidence references and actual outcome. Capture model/provider/config version without secrets. Private artifacts stay outside Git; publish only permitted sanitized evidence.

Use deterministic fixtures/test doubles for isolated application rules and explicit live runs for provider integration; neither substitutes for the other. Default CI stays offline. Calibrate model graders against human review; schema-valid output and citation presence are insufficient verdicts.

Record pass/fail/unverified per requirement in issue/PR. Set numeric thresholds with maintainers after a baseline; six-company cases cannot establish production reliability. See [requirements](../docs/requirements.md) and [first-slice acceptance](../docs/first-slice.md).
