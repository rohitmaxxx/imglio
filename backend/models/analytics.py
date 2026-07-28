"""Typed shape of a logged analytics event.

No ORM is used — analytics.db is a single SQLite table written via raw SQL
(see services/analytics.py) — this dataclass exists to give callers a typed,
self-documenting event shape instead of passing 8 positional arguments around.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class AnalyticsEvent:
    ip: Optional[str]
    path: str
    method: str
    user_email: Optional[str]
    user_name: Optional[str]
    user_agent: str
    event_type: str
    details: dict
