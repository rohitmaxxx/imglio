"""Stateless JWT creation/verification — no server-side session store."""

import datetime
from typing import Optional

from fastapi import Request
from jose import JWTError, jwt

from core.config import settings


def create_access_token(email: str, name: str) -> str:
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {"sub": email, "name": name, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
    return {"email": payload.get("sub"), "name": payload.get("name")}


def get_current_user_optional(request: Request) -> Optional[dict]:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    return decode_token(auth[len("Bearer "):])
