"""Environment-driven application settings — single source of truth for env vars."""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Settings:
    JWT_SECRET: str = os.environ.get("JWT_SECRET", "dev-jwt-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = int(os.environ.get("JWT_EXPIRE_MINUTES", 60 * 24 * 7))

    FRONTEND_ORIGIN: str = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")

    ANALYTICS_DB: str = os.environ.get("ANALYTICS_DB", os.path.join(BASE_DIR, "data", "analytics.db"))

    SMTP_HOST: str = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.environ.get("SMTP_PORT", 587))
    SMTP_USER: str = os.environ.get("SMTP_USER")
    SMTP_PASS: str = os.environ.get("SMTP_PASS")


settings = Settings()
