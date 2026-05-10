from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router
from app.api.interactions import router as interactions_router
from app.core.config import get_settings
from app.db.session import Base, engine
from app.models import interaction  # noqa: F401

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="AI-first CRM module for logging Healthcare Professional interactions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["System"])
def root():
    return {
        "service": settings.app_name,
        "status": "ok",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
        "database": settings.database_url.split(":", 1)[0],
        "llm_provider": settings.llm_provider,
    }


app.include_router(interactions_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
