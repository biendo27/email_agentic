"""HTTP application composition; business execution never starts on import."""

from fastapi import FastAPI

from email_agentic.api.routes.health import router as health_router

app = FastAPI(title="Email Agentic", version="0.1.0")
app.include_router(health_router)
