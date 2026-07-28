"""Fire-and-forget request logging — must never block or fail the request it logs."""

import asyncio

from fastapi import Request

from core.security import get_current_user_optional
from models.analytics import AnalyticsEvent
from services import analytics


async def analytics_middleware(request: Request, call_next):
    response = await call_next(request)
    try:
        user = get_current_user_optional(request)
        event = AnalyticsEvent(
            ip=request.client.host if request.client else None,
            path=str(request.url),
            method=request.method,
            user_email=user.get("email") if user else None,
            user_name=user.get("name") if user else None,
            user_agent=request.headers.get("user-agent", ""),
            event_type="visit",
            details={"status_code": response.status_code},
        )
        loop = asyncio.get_event_loop()
        loop.run_in_executor(None, analytics.log_event, event)
    except Exception:
        pass
    return response
