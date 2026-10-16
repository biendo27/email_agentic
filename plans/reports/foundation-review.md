# Foundation code review

## Scope and verdict

Reviewed the accepted bootstrap contract in `plans/2026-10-16-local-bootstrap/plan.md` against the settled runtime, tests, packaging, Docker/Compose, CI, onboarding documentation, and publishable repository content.

Runtime review: **no unresolved blocking or informational defects found**. One medium-severity onboarding defect was found during review and corrected before this report: Compose resolves required database-password interpolation across the whole file, so an LGTM-only command still needs `POSTGRES_PASSWORD` and `NEO4J_PASSWORD`. `docs/local-runtime.md:7` and `docs/local-runtime.md:26` now state that prerequisite accurately. The publication snapshot remains blocked until the rewritten working tree is restaged and reviewed.

## Specification compliance

| Acceptance | Result | Evidence |
|---|---|---|
| Locked Python 3.12 environment | Pass | `.python-version`, `pyproject.toml`, `uv.lock`; controller/runtime verification completed with the locked environment. |
| Credential-free health and offline diagnostics | Pass | `src/email_agentic/api.py`, `src/email_agentic/cli.py`, `tests/test_api.py`, `tests/test_cli.py`; actual local HTTP process returned `200 {"status":"alive"}` and was terminated cleanly. |
| Explicit, bounded gateway smoke only | Pass for implemented contract | `src/email_agentic/gateway.py` performs one request only after all required settings exist, disables redirects, applies a bounded timeout, and withholds provider content. Tests cover missing configuration, exact request shape, status/redirect failures, transport failures, malformed bodies, and no retries. A local TCP server check confirmed the real HTTP client path, authorization header, request path, and model payload. |
| Quality gates and package build | Pass | Settled `make check`: Ruff lint/format pass, Pyright strict mode 0 errors, 29 pytest cases pass, sdist and wheel build pass. |
| Compose render | Pass at available level | `make compose-check` passes without a daemon. An isolated failure check confirmed the documented global password-interpolation behavior. Docker image build and container health remain unverified because the daemon is unavailable. |
| README and maintainer navigation | Pass | Exact local startup, current feature status, docs navigation, and first-slice next task are present. Claims consistently distinguish liveness/config checks from business functionality. |
| Requirements/evidence mapping | Pass | `docs/requirements.md`, `docs/first-slice.md`, and `evals/README.md` preserve the full product scope while marking it planned. Sample metrics are explicitly separated from adopted targets. |
| Publishable content | Pass for inspected working tree | No `.env` file exists. `.env*` is ignored except the public example; private data/output directories are ignored and excluded from Docker context. Targeted scans found no credentials, private workstation paths, raw inbox content, or copied private reference files. Sentinel strings in tests are synthetic and verify redaction. Publication and GitHub CI remain controller steps. |

## Review findings

No unresolved runtime findings.

Resolved during review:

- **Medium — Compose onboarding prerequisite:** `compose.yaml:9` and `compose.yaml:26` require database passwords during whole-file interpolation, including targeted LGTM commands. The earlier runtime guide implied only the Grafana password was required. `docs/local-runtime.md:7` and `docs/local-runtime.md:26` now document all required variables and explain profile/service filtering order.

## English and public-content review

The settled working tree uses English throughout README, agent guidance, documentation, evaluation guidance, templates, plans, reports and journal. Non-technical personal workflow and background content is absent. Product human approval remains because it is a functional security boundary. References to sample `30 days`, request timeouts and provider budgets remain because they describe product requirements or runtime behavior.

Relative Markdown paths and heading anchors passed an independent check across 17 prose/template files. No broken local links or anchors were found. The remaining non-ASCII characters are punctuation in English records, not Vietnamese prose.

Publication check at review time:

- **High — staged snapshot was stale:** `git status --short` reports `AM` for every rewritten documentation/template/plan record. `git diff --cached` still contains the earlier staged versions, including Vietnamese and superseded non-technical prose. A commit from the current index would not match the reviewed working tree. Refresh the full index only after all edits are complete, then rerun the English/relevance scan, local-link check, `git diff --cached --check`, secret/public-content scan and staged-diff review before committing.

## Risk checklist

- Concurrency/shared state: no mutable application state or background work exists in this foundation.
- Error boundaries: gateway timeout, transport, HTTP status, malformed JSON/shape, and empty content become fixed secret-safe errors; configuration validation emits field names only.
- API contract: `/healthz` is intentionally liveness-only and has a typed stable response. It does not claim dependency readiness.
- Backward compatibility: fresh repository; no prior public contract is changed.
- Input validation: typed URL, secret, model, and finite timeout validation cover the implemented external configuration boundary. Credential-bearing/query URLs are rejected.
- Authentication/authorization: the only route is a non-sensitive liveness endpoint. Business/authenticated routes are explicitly absent.
- Query efficiency/data leakage: no database queries or user records exist. Provider bodies, exception contents, secret values, and completion text are not printed.

## Verification limitations

- No real provider credential was used. Provider compatibility, access, quota, billing, and live model response are **unverified integration evidence**, not a failure of the offline foundation.
- Docker daemon-dependent image build, service startup, database health, and LGTM health are **unverified**. Compose syntax/interpolation rendering passed.
- Test coverage percentage was not measured; the review relies on behavior-focused tests and source inspection rather than a percentage claim.
- Remote publication and GitHub Actions outcome were outside this review worker's authority and remain for the controller.

Status: DONE

Summary: The settled runtime and English working tree match the accepted bootstrap scope. The Compose documentation defect and residual personal/background wording were corrected and rechecked; local links and heading anchors pass.

Concerns/Blockers: Live provider and daemon-dependent Docker checks remain unverified integration steps. Publication and remote CI are verified separately by the controller.

## Staged snapshot resolution

Before the initial commit, the publication worker refreshed all 38 authorized paths and verified the staged snapshot. Cached whitespace, English/relevance, private-path/credential and local Markdown link/anchor checks passed. No unstaged or untracked files remained. Keyword matches were configuration declarations, redaction safeguards, synthetic test values and validation-only Compose settings. The earlier staging blocker is resolved; the report update itself must be restaged before commit.
