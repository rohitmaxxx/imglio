"""
Central config — add new tools, presets, or formats here.
No need to dig through route handlers for common settings.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Upload limits
MAX_UPLOAD_MB = 16
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff"}

# Output formats users can pick in Export Settings
# key = form value, value = (Pillow format, file extension, mime subtype)
EXPORT_FORMATS = {
    "original": None,  # keep source format
    "jpg": ("JPEG", "jpg", "jpeg"),
    "png": ("PNG", "png", "png"),
    "webp": ("WEBP", "webp", "webp"),
}

# Social media presets — add more rows anytime
# (label, width, height)
SOCIAL_PRESETS = [
    ("Instagram Post", 1080, 1080),
    ("Instagram Story", 1080, 1920),
    ("Facebook Cover", 820, 312),
    ("Twitter / X Post", 1200, 675),
    ("YouTube Thumbnail", 1280, 720),
    ("LinkedIn Banner", 1584, 396),
    ("Pinterest Pin", 1000, 1500),
]

# Default resize / export values
DEFAULTS = {
    "mode": "size",          # size | percent | social
    "width": 800,
    "height": 600,
    "percent": 100,
    "lock_aspect": True,
    "target_size": "",
    "target_unit": "KB",     # KB | MB
    "export_format": "original",
}
