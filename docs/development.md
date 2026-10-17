# Technical contribution workflow

Work from an accepted outcome, permitted inputs, constraints, non-goals and observable acceptance. Keep each delivery small enough to review and verify end to end. The existing stack and application boundaries remain in place; add modules only when real behavior needs them.

## Work ownership

| Surface | Owns | Does not own |
|---|---|---|
| GitHub Projects | Product priority, dependencies and work status | Detailed implementation steps |
| GitHub Issues | The selected outcome, acceptance, decisions and evidence links | A copy of source or private inputs |
| `plans/` | Technical phases, affected files, validation, risks and rollback | A second product roadmap |
| PR and CI | Proposed diff, review, checks and merge evidence | Proof of deployment or research quality |
| `docs/` | Durable technical decisions and navigation | Phase progress or personal learning strategy |

Use the [production Project](https://github.com/users/biendo27/projects/1) and [repository Issues](https://github.com/biendo27/email_agentic/issues) for work selection. AgentKit's plan dashboard is an optional view of execution plans; it does not replace the GitHub backlog. Skills belong to the development environment. Select them from the installed catalog; this repository does not prescribe or install a fixed tool chain.

## Select and prepare work

1. Select one bounded issue from the highest-priority unblocked milestone. Milestone issues retain the complete scope; create child issues as their contracts become clear. Keep one implementation issue in progress at a time unless independent work has an explicit reason.
2. Inspect the owning docs, current source, tests and relevant history. Reuse an accepted contract. For a bug, reproduce and diagnose before choosing a fix; for an investigation, define the decision or evidence to deliver.
3. Mark an issue **Ready** only when its outcome, boundaries, acceptance, dependencies and next action are clear. A design issue can be Ready while the implementation it prepares remains blocked. Record unresolved product choices as decisions to resolve, never as assumed acceptance.
4. For multi-step or risky work, create `plans/<date>-<issue>-<slug>/plan.md` and phase files. The index owns execution status and links; phases contain only the files, steps, verification, risks and rollback needed for safe execution. Link the issue and plan in both directions.

GitHub status meanings: **Backlog** needs refinement or prerequisites; **Ready** can start; **In progress** has active execution; **Review** has a concrete result awaiting review/acceptance; **Done** has accepted evidence. Record blockers and their issue links on the item rather than adding a second status system. A plan phase completing does not by itself complete an issue.

## Choose steps by impact

| Change | Required preparation and evidence | Steps that may be skipped |
|---|---|---|
| Docs, copy or small local change | Accepted outcome, owning source/link checks and final diff | Separate brainstorm session and phase plan when no material decision remains |
| Feature or UI interaction | Input/output and failure contract; bounded plan when multi-step; focused behavior checks; browser review for changed layout/interaction | Research when established local patterns answer the design |
| Auth, ownership, persistence or external effects | Explicit trust/data/state contract, permission and failure cases, recovery/rollback and review | Live side effects remain disabled until approval and replay invariants are proven |
| Agent, prompt, tool or retrieval behavior | Tool permissions/budgets, representative success/failure cases and output/claim-support evaluation | Paid/private live checks require explicit selection; fixture evidence cannot replace them |
| Deployment or operational change | Access route, secret retrieval, health/log lookup, rollback and relevant recovery evidence | Deployment itself when the issue ends at a reviewed PR |

UX/UI work starts with the task, information hierarchy, visual direction and interaction states. Review a concrete design before substantial interface implementation; follow [frontend conventions](frontend.md). Authentication and storage changes require the [architecture contract](architecture.md); new agent behavior also requires the [evaluation contract](../apps/backend/evals/README.md).

## Implement, verify and finish

Implement the integrated path required by the issue, including failures. Follow [codebase conventions](codebase-conventions.md) for source ownership and [frontend conventions](frontend.md) for web behavior. Do not add speculative agents or treat unavailable features as complete.

Start with the smallest reliable check for the changed invariant. The [Makefile](../Makefile), [backend manifest](../apps/backend/pyproject.toml), [web scripts](../apps/web/package.json) and [CI](../.github/workflows/checks.yaml) own executable gates. Before delivery, run `make check` for both applications. Use `make check-e2e` for relevant browser integration changes, `make compose-check` for Compose changes and explicitly selected live checks for provider contracts. Report skipped checks and what remains unverified. Default checks must not contact paid/private providers.

Review actual output, citation support, permissions and external effects when relevant. Test doubles and a green CI run do not prove live integration, factual correctness, authenticated deployment or recovery. Preserve failures rather than weakening assertions. Update only the smallest owning docs when behavior, setup, public contracts, architecture or an operational route changes.

Open a PR using the repository template, with the issue/plan, checks, sanitized acceptance evidence, risks and rollback. Use focused conventional commits. Mark implementation work Done only after the required review, acceptance and merge; if deployment is included, verify it too. A design-only issue can finish after its decision artifact is accepted. Keep remaining work linked in GitHub. Never publish secrets, raw inbox content, private references or unredacted traces.

## Merge policy

The [main branch protection settings](https://github.com/biendo27/email_agentic/settings/branches) require a PR, an up-to-date branch, successful GitHub Actions checks `backend`, `web` and `browser`, and resolved review conversations. Protection applies to administrators; force pushes and branch deletion are blocked. Required approvals are zero for solo delivery, while risk-appropriate review and acceptance still apply. The [CI workflow](../.github/workflows/checks.yaml) owns the jobs; keep required check names aligned when changing it.

Merged feature branches are automatically deleted through [repository settings](https://github.com/biendo27/email_agentic/settings). Keep the default Actions token read-only and grant additional permissions only to workflows that need them. Deployment environments and credentials are configured only after the deployment contract is accepted.

Before merge, verify the latest PR revision and its required checks. Update Project status at execution and acceptance checkpoints; do not rely on unverified automation. A child PR merging does not complete its parent milestone or prove deployment.

## Documentation lifecycle

At issue intake, identify the existing documentation owner and the expected impact in the issue or plan; no separate impact report is required. Update affected docs in the same proposed change, and state the impact or no-impact reason in the PR.

Keep task scope, acceptance and unresolved choices in the issue; keep execution steps and phase progress in its plan. Docs retain accepted decisions, domain rules, rationale and operating routes needed after the task closes. A feature specification may remain in docs when it owns a durable contract, but delivery-order names such as “first slice” must not become a parallel backlog.

Distinguish planned contracts from implemented behavior. Link to source, schemas, tests and scripts for executable detail. Before retiring a temporary contract, preserve its acceptance in the owning issue, consolidate durable decisions into the existing docs owner, and repair current inbound links. Keep only active plans and records still needed for execution, an unresolved decision, reproducible diagnosis or unique acceptance evidence. A failed attempt does not need a permanent report: preserve the useful lesson in the owning rule/runbook, or a meaningful regression test when appropriate. Keep useful failure, denial and recovery coverage even when the final implementation works.

At completion, link concise final evidence from the issue/PR, consolidate durable decisions into their existing owner, then remove completed or superseded plans, journals, previews and intermediate reports with no remaining consumer. Do not create an archive directory to relocate the same noise. Historical tracked content can be retrieved from a committed revision with `git log --all -- <path>` and `git show <revision>:<path>`; confirm that revision is retained before deleting. Untracked files, ignored files and uncommitted edits are not recoverable from Git: preserve unique needed content in an approved destination before removal. Repair inbound links and check the final diff. Age alone is not a deletion criterion.

Do not automatically generate a plan, journal or report for every task. Create one only when it helps execute, resume or prove the outcome; tool defaults do not establish a retention requirement. Personal practice notes stay outside the repository.

Verify changed paths, links, commands and claims against the final implementation or relevant live state. Leave equivalent guidance untouched. Completing a phase does not require a docs update; changing setup, permissions, contracts, architecture or an operational route does.

## Resume work

Read the selected issue, linked plan, current diff and latest checks. Reconcile changed assumptions before continuing; use the plan for phase progress and GitHub for product status. Do not infer implementation from a checked box. At a handoff, record completed evidence, current phase, blockers and the exact next action in the plan or issue. Track and stop processes started for the work; use the existing project ports.
