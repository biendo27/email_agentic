.PHONY: setup check check-be check-web check-e2e dev dev-web doctor llm-smoke compose-check

setup:
	uv sync --project apps/backend --locked
	npm --prefix apps/web ci

check: check-be check-web

check-be:
	uv run --project apps/backend --locked ruff check apps/backend
	uv run --project apps/backend --locked ruff format --check apps/backend
	uv run --project apps/backend --locked pyright --project apps/backend
	uv run --project apps/backend --locked pytest -c apps/backend/pyproject.toml
	uv build apps/backend --out-dir apps/backend/dist --no-sources

check-web:
	npm --prefix apps/web run check

dev:
	uv run --project apps/backend --locked uvicorn email_agentic.api.app:app --host 127.0.0.1 --port 8000 --reload --reload-dir apps/backend/src

dev-web:
	npm --prefix apps/web run dev

doctor:
	uv run --project apps/backend --locked email-agentic doctor

llm-smoke:
	uv run --project apps/backend --locked email-agentic llm-smoke

compose-check:
	sh scripts/check-compose.sh

check-e2e:
	npm --prefix apps/web run test:e2e
