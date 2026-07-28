"""Exposes shared domain config (social presets, resize defaults) so the frontend has one source of truth."""

from fastapi import APIRouter

from config.settings import DEFAULTS, SOCIAL_PRESETS

router = APIRouter(prefix="/api", tags=["config"])


@router.get("/config")
async def get_config():
    return {"social_presets": SOCIAL_PRESETS, "defaults": DEFAULTS}
