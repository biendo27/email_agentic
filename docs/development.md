# Contribution workflow

Keep changes bounded by observable product behavior, explicit permissions and acceptance evidence.

## Change workflow

1. Create an **Integrated slice** issue with permitted input, expected output, scope, tool permissions, technical invariants and observable acceptance.
2. Inspect relevant source and tests. For multi-step or risky work, write a short plan under `plans/` covering scope, affected files, verification and rollback.
3. Implement the integrated path from input through state and tools to output and failure handling.
4. Run appropriate checks and retain sanitized success/failure evidence. Review actual output, citation support and side effects alongside lint, types and tests.
5. Open a PR with acceptance results and unresolved risks. Mark requirements complete only when evidence supports them; retain remaining requirements in the backlog.

Coding skills belong to the development environment, not the application runtime. When installed, use `advise` for design decisions, `brainstorm` for unclear outcomes, `plan` for execution plans, `cook` for implementation, `test` for verification, `code-review` for review, `debug` for diagnosis and `github` for issue/PR operations. Check the current installed catalog before selecting a skill; this repository does not install them. Small changes may use a shorter workflow while retaining acceptance and evidence.

## Python conventions

Adopt a subset of the [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html): descriptive names, deliberate exceptions, no mutable default arguments, limited mutable global state, readable comprehensions and docstrings for non-obvious contracts. This is not full Google-style compliance. uv, Ruff, Pyright and pytest are project choices; [pyproject.toml](../pyproject.toml) owns their configuration and [Makefile](../Makefile) owns aggregate commands.

- Use `snake_case` for Python modules, functions and variables, `PascalCase` for classes, and kebab-case for new documentation filenames.
- Type API, tool, state and persistence boundaries explicitly. Pydantic validates data structure; valid structure does not establish factual support.
- Prefer clear loops and branches over nested comprehensions or abstractions that obscure control flow.
- Separate business decisions from provider clients and orchestration where a real boundary exists. Do not create speculative folders or base classes.
- Imports must not open connections, call networks, write files or execute graphs. Create resources at explicit entry points or lifecycle boundaries.
- Do not swallow broad exceptions and return empty success. Retry appropriate transient failures with limits; validation and permission denial are not network failures.
- Define node/tool inputs, outputs, permissions, timeouts and errors. Keep secrets and private message bodies out of traces.

A graph checkpoint records execution state. It does not replace domain storage or an external action's transaction and deduplication contract.

## Verification and delivery

`make check` runs local quality gates, including a package build; `uv build` is available for a focused package check. Start with the smallest useful test for an application-owned invariant. Use integration checks when provider/database contracts change, and select credentialed live checks explicitly. Boundary test doubles are not proof of a live integration.

Factual correctness, approval, restart, duplicate prevention and actual delivery require [separate evidence](../evals/README.md). Report pass, fail and unverified results; do not weaken assertions to hide failures. Use focused conventional commits without personal data. Update the owning documentation when behavior, setup, commands or architecture change; phase completion alone does not require documentation changes.
