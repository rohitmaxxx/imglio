"""FastAPI app factory — thin entrypoint. Route logic lives in routers/, cross-cutting concerns in middleware/ and core/."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from middleware.analytics_middleware import analytics_middleware
from routers import auth, config, images
from services import analytics

app = FastAPI(title="pixanzo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["Content-Disposition"],
)

app.middleware("http")(analytics_middleware)

analytics.init_db(settings.ANALYTICS_DB)

app.include_router(auth.router)
app.include_router(config.router)
app.include_router(images.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
