"""Pydantic request/response models for the auth endpoints."""

from pydantic import BaseModel


class SendOtpRequest(BaseModel):
    name: str
    email: str


class VerifyOtpRequest(BaseModel):
    email: str
    otp: str


class UserOut(BaseModel):
    name: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
