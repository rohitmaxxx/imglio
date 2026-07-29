# Pillow and python-jose[cryptography] both ship prebuilt manylinux wheels for
# this base image, so no compiler/build-essential stage is needed — a single
# stage is genuinely the optimal build here.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Copied and installed before the rest of the source so this layer is only
# invalidated when dependencies actually change.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ANALYTICS_DB defaults to <app>/data/analytics.db (core/config.py) — create it
# up front and hand ownership to the non-root user before dropping privileges.
RUN useradd --create-home --uid 1000 appuser \
    && mkdir -p /app/data \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# /api/config is unauthenticated and side-effect-free — a safe, always-on
# liveness probe without needing a dedicated /health route.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/config', timeout=3)" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
