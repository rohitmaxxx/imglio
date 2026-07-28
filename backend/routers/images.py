"""Image processing endpoints: resize, compress, crop, rotate. Unauthenticated — anonymous use is the current, intended behavior."""

import asyncio

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from PIL import Image

from core.security import get_current_user_optional
from models.analytics import AnalyticsEvent
from services import allowed_file, analytics, open_image, parse_target_bytes, send_processed_fastapi
from services.resize import apply_resize
from utils.upload_adapter import to_upload_adapter

router = APIRouter(prefix="/api", tags=["images"])

INVALID_FILE_TYPE = "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF."


def _log(request: Request, event_type: str, details: dict):
    try:
        user = get_current_user_optional(request)
        event = AnalyticsEvent(
            ip=request.client.host if request.client else None,
            path=str(request.url),
            method=request.method,
            user_email=user.get("email") if user else None,
            user_name=user.get("name") if user else None,
            user_agent=request.headers.get("user-agent", ""),
            event_type=event_type,
            details=details,
        )
        loop = asyncio.get_event_loop()
        loop.run_in_executor(None, analytics.log_event, event)
    except Exception:
        pass


@router.post("/resize")
async def resize(
    request: Request,
    file: UploadFile = File(...),
    mode: str = Form(default="size"),
    width: int = Form(default=800),
    height: int = Form(default=600),
    percent: int = Form(default=100),
    lock_aspect: str = Form(default=None),
    export_format: str = Form(default="original"),
    target_size: str = Form(default=""),
    target_unit: str = Form(default="KB"),
):
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail=INVALID_FILE_TYPE)

    form_data = {"mode": (mode or "size").lower(), "width": width, "height": height, "percent": percent, "lock_aspect": lock_aspect == "on"}
    target_bytes = parse_target_bytes(target_size, target_unit)

    try:
        _log(request, "resize_request", {"filename": file.filename, "form": form_data, "target_bytes": target_bytes})
        image = open_image(to_upload_adapter(file))
        result = apply_resize(image, form_data)
        return send_processed_fastapi(result, file.filename, suffix=f"resized_{result.width}x{result.height}", export_format=export_format, target_bytes=target_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to process image. Please try another file.")


@router.post("/compress")
async def do_compress(
    request: Request,
    file: UploadFile = File(...),
    quality: int = Form(default=70),
    target_size: str = Form(default=""),
    target_unit: str = Form(default="KB"),
):
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail=INVALID_FILE_TYPE)

    q = max(10, min(95, int(quality)))
    target_bytes = parse_target_bytes(target_size, target_unit)
    try:
        _log(request, "compress_request", {"filename": file.filename, "quality": q, "target_bytes": target_bytes})
        image = open_image(to_upload_adapter(file))
        export = "png" if image.mode == "RGBA" else "jpg"
        return send_processed_fastapi(image, file.filename, suffix=f"compressed_q{q}", export_format=export, target_bytes=target_bytes, quality=q)
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to compress image. Please try another file.")


@router.post("/crop")
async def do_crop(
    request: Request,
    file: UploadFile = File(...),
    x: int = Form(default=0),
    y: int = Form(default=0),
    width: int = Form(default=100),
    height: int = Form(default=100),
):
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail=INVALID_FILE_TYPE)

    try:
        _log(request, "crop_request", {"filename": file.filename, "x": x, "y": y, "width": width, "height": height})
        image = open_image(to_upload_adapter(file))
        img_w, img_h = image.size
        x = max(0, min(int(x), img_w - 1))
        y = max(0, min(int(y), img_h - 1))
        w = max(1, min(int(width), img_w - x))
        h = max(1, min(int(height), img_h - y))
        cropped = image.crop((x, y, x + w, y + h))
        return send_processed_fastapi(cropped, file.filename, suffix=f"cropped_{w}x{h}")
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to crop image. Please try another file.")


@router.post("/rotate")
async def do_rotate(
    request: Request,
    file: UploadFile = File(...),
    angle: int = Form(default=90),
):
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail=INVALID_FILE_TYPE)

    ang = int(angle) % 360
    try:
        _log(request, "rotate_request", {"filename": file.filename, "angle": ang})
        image = open_image(to_upload_adapter(file))
        rotated = image.rotate(-ang, expand=True, resample=Image.Resampling.BICUBIC)
        return send_processed_fastapi(rotated, file.filename, suffix=f"rotated_{ang}")
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to rotate image. Please try another file.")
