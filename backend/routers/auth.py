"""Auth endpoints: OTP request/verify, current-user lookup. Stateless JWT — no server-side session."""

from fastapi import APIRouter, HTTPException, Request

from core.security import create_access_token, get_current_user_optional
from schemas.auth import SendOtpRequest, TokenResponse, UserOut, VerifyOtpRequest
from services.otp import send_otp_email, verify_otp

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/auth/send-otp")
async def send_otp(payload: SendOtpRequest):
    name = (payload.name or "").strip()
    email = (payload.email or "").strip().lower()
    if not name or not email:
        raise HTTPException(status_code=400, detail="Please enter both name and email.")

    send_otp_email(name, email)
    return {"message": f"An OTP has been sent to {email}."}


@router.post("/auth/verify-otp", response_model=TokenResponse)
async def verify_otp_route(payload: VerifyOtpRequest):
    email = (payload.email or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    ok, result = verify_otp(email, payload.otp or "")
    if not ok:
        raise HTTPException(status_code=401, detail=result)

    token = create_access_token(email=email, name=result)
    return TokenResponse(access_token=token, user=UserOut(name=result, email=email))


@router.get("/me", response_model=UserOut)
async def me(request: Request):
    user = get_current_user_optional(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return UserOut(**user)
