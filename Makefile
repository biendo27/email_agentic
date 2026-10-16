.PHONY: setup check dev doctor llm-smoke compose-check

setup:
	uv sync --locked

check:
	uv run --locked ruff check .
	uv run --locked ruff format --check .
	uv run --locked pyright
	uv run --locked pytest
	uv build --no-sources

dev:
	uv run --locked uvicorn email_agentic.api:app --host 127.0.0.1 --port 8000 --reload

doctor:
	uv run --locked email-agentic doctor

llm-smoke:
	uv run --locked email-agentic llm-smoke

compose-check:
	sh scripts/check-compose.sh
