"""Shared image load / save helpers used by every tool."""

import io

from PIL import Image
from werkzeug.utils import secure_filename

from config import ALLOWED_EXTENSIONS, EXPORT_FORMATS
from starlette.responses import StreamingResponse


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_ext(filename: str) -> str:
    return filename.rsplit(".", 1)[1].lower()


def open_image(file_storage) -> Image.Image:
    image = Image.open(file_storage.stream)
    if image.mode == "P":
        image = image.convert("RGBA")
    elif image.mode not in ("RGB", "RGBA", "L"):
        image = image.convert("RGB")
    return image


def resolve_format(image: Image.Image, original_filename: str, export_format: str):
    """
    Returns (pillow_format, extension, mime_subtype).
    export_format: original | jpg | png | webp
    """
    choice = (export_format or "original").lower()
    if choice != "original" and choice in EXPORT_FORMATS and EXPORT_FORMATS[choice]:
        return EXPORT_FORMATS[choice]

    ext = get_ext(original_filename)
    mapping = {
        "png": ("PNG", "png", "png"),
        "webp": ("WEBP", "webp", "webp"),
        "gif": ("GIF", "gif", "gif"),
        "bmp": ("BMP", "bmp", "bmp"),
    }
    return mapping.get(ext, ("JPEG", "jpg", "jpeg"))


def encode_image(image: Image.Image, fmt: str, quality: int = 90) -> bytes:
    if fmt == "JPEG" and image.mode in ("RGBA", "P"):
        image = image.convert("RGB")
    elif fmt == "JPEG" and image.mode == "L":
        image = image.convert("RGB")

    buffer = io.BytesIO()
    kwargs = {}
    if fmt == "JPEG":
        kwargs["quality"] = max(1, min(95, quality))
        kwargs["optimize"] = True
    elif fmt == "WEBP":
        kwargs["quality"] = max(1, min(95, quality))
    elif fmt == "PNG":
        kwargs["optimize"] = True

    image.save(buffer, format=fmt, **kwargs)
    return buffer.getvalue()


def encode_to_target_size(
    image: Image.Image,
    fmt: str,
    target_bytes: int,
    min_quality: int = 20,
    max_quality: int = 95,
) -> bytes:
    """
    Binary-search JPEG/WEBP quality to approach target_bytes.
    PNG ignores quality — returns optimized PNG.
    """
    if fmt not in ("JPEG", "WEBP") or target_bytes <= 0:
        return encode_image(image, fmt, quality=max_quality)

    low, high = min_quality, max_quality
    best_under = None
    best_over = None

    # If highest quality already fits, return it
    candidate = encode_image(image, fmt, quality=high)
    if len(candidate) <= target_bytes:
        return candidate
    best_over = candidate

    # Binary search for quality that produces <= target_bytes
    for _ in range(12):
        if low > high:
            break
        mid = (low + high) // 2
        data = encode_image(image, fmt, quality=mid)
        size = len(data)
        if size <= target_bytes:
            best_under = data
            low = mid + 1
        else:
            best_over = data
            high = mid - 1

    # Prefer the largest-quality image that is <= target_bytes
    if best_under is not None:
        return best_under

    # If none under target, return the smallest-over we found (best_over)
    if best_over is not None:
        return best_over

    # Fallback to encoding at min_quality
    return encode_image(image, fmt, quality=min_quality)


def optimize_encode_to_target(
    image: Image.Image,
    fmt: str,
    target_bytes: int,
    min_quality: int = 5,
    max_quality: int = 95,
    min_dim: int = 50,
    scale_step: float = 0.85,
):
    """
    Try to encode to `target_bytes` by first searching quality at current dimensions.
    If that fails, progressively downscale the image and retry —
    keeps going until it fits target_bytes or image becomes too small to be usable.
    """
    current = image.copy()

    while True:
        data = encode_to_target_size(
            current, fmt, target_bytes,
            min_quality=min_quality, max_quality=max_quality
        )
        if len(data) <= target_bytes:
            return data

        w, h = current.size
        if min(w, h) <= min_dim:
            # Last resort: force lowest quality possible, even below min_quality,
            # so we never silently return something 2x over target.
            return encode_image(current, fmt, quality=1)

        new_w = max(int(w * scale_step), min_dim)
        new_h = max(int(h * scale_step), min_dim)
        current = current.resize((new_w, new_h), Image.LANCZOS)


def send_processed_fastapi(
    image,
    original_filename: str,
    suffix: str,
    export_format: str = "original",
    target_bytes: int = 0,
    quality: int = 90,
):
    fmt, ext, mime = resolve_format(image, original_filename, export_format)

    # If user requested a target byte size, get as close to it as possible —
    # search quality up to the max before falling back to downscaling.
    # PNG ignores quality, so only convert it to JPEG once optimized PNG doesn't fit.
    if target_bytes > 0:
        if fmt not in ("JPEG", "WEBP"):
            candidate = encode_image(image, fmt, quality=quality)
            if len(candidate) <= target_bytes:
                data = candidate
            else:
                fmt, ext, mime = ("JPEG", "jpg", "jpeg")
                data = optimize_encode_to_target(image, fmt, target_bytes)
        else:
            data = optimize_encode_to_target(image, fmt, target_bytes)
    else:
        data = encode_image(image, fmt, quality=quality)

    buffer = io.BytesIO(data)
    buffer.seek(0)

    name = secure_filename(original_filename).rsplit(".", 1)[0]
    download_name = f"{name}_{suffix}.{ext}"

    headers = {"Content-Disposition": f'attachment; filename="{download_name}"'}
    return StreamingResponse(buffer, media_type=f"image/{mime}", headers=headers)


def parse_target_bytes(value, unit: str) -> int:
    """Convert form target size (KB/MB) to bytes. Empty → 0."""
    if value is None or str(value).strip() == "":
        return 0
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return 0
    if amount <= 0:
        return 0
    unit = (unit or "KB").upper()
    if unit == "MB":
        return int(amount * 1024 * 1024)
    return int(amount * 1024)
