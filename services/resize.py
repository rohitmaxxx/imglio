"""Resize strategies — add a new mode by registering a function in MODES."""

from PIL import Image


def resize_by_size(image: Image.Image, width: int, height: int, lock_aspect: bool) -> Image.Image:
    ow, oh = image.size
    width = max(1, min(int(width), 10000))
    height = max(1, min(int(height), 10000))

    if lock_aspect:
        ratio = min(width / ow, height / oh)
        width = max(1, int(ow * ratio))
        height = max(1, int(oh * ratio))

    return image.resize((width, height), Image.Resampling.LANCZOS)


def resize_by_percent(image: Image.Image, percent: float) -> Image.Image:
    percent = max(1, min(float(percent), 500))
    ow, oh = image.size
    width = max(1, int(ow * percent / 100))
    height = max(1, int(oh * percent / 100))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def resize_social(image: Image.Image, width: int, height: int) -> Image.Image:
    """Fit inside preset box while keeping aspect ratio."""
    return resize_by_size(image, width, height, lock_aspect=True)


# Registry: mode name → handler factory that receives (image, form_data dict)
# Add new modes here without touching Flask routes.
def apply_resize(image: Image.Image, form: dict) -> Image.Image:
    mode = (form.get("mode") or "size").lower()

    if mode == "percent":
        return resize_by_percent(image, form.get("percent", 100))

    if mode == "social":
        return resize_social(
            image,
            form.get("width", 1080),
            form.get("height", 1080),
        )

    # default: by size
    lock = form.get("lock_aspect") in (True, "on", "true", "1", 1)
    return resize_by_size(
        image,
        form.get("width", 800),
        form.get("height", 600),
        lock_aspect=lock,
    )
