# imglio

A web app for quick, no-signup-required image manipulation: resize, compress, crop, rotate, and convert formats — with social-media size presets and byte-size targeting (e.g. "get this under 200KB").

## Features

- **Resize** — by exact width/height (with optional aspect-lock), by percentage, or by picking a social media preset (Instagram Post/Story, Facebook Cover, Twitter/X Post, YouTube Thumbnail, LinkedIn Banner, Pinterest Pin).
- **Compress** — JPEG/WEBP quality-based compression, with an optional target file size (binary-searches quality, then downscales dimensions if quality alone can't hit the target).
- **Crop** — pixel-accurate crop with server-side bounds clamping.
- **Rotate** — rotate by an arbitrary angle (mod 360), expands canvas to fit.
- **Convert** — export any processed image as JPG, PNG, WEBP, or keep the original format.
- **Target file size** — resize/compress endpoints accept a target size + unit (KB/MB) and iteratively adjust quality/dimensions to land under that budget.
- **Passwordless login** — email + OTP (one-time code), no passwords stored. OTPs are kept in memory with a 5-minute expiry.
- **Analytics** — every request is logged (IP, path, method, user, user-agent, event type, JSON details) to a local SQLite database for basic usage tracking.

## Architecture

Single entry point: **`main.py`** (FastAPI, run with `uvicorn`). Business logic lives in `services/` and `config.py`.

```
image_resize/
├── main.py              # FastAPI app — entry point (uvicorn main:app)
├── config.py              # Central config: allowed extensions, export formats, social presets, defaults
├── requirements.txt
├── services/
│   ├── __init__.py       # image open/encode/save helpers, target-size logic, response builder
│   ├── resize.py          # resize strategy registry (size / percent / social)
│   ├── auth.py            # OTP generation, email delivery (SMTP or dev-mode console print), verification
│   └── analytics.py       # SQLite event logging (init_db, log_event)
├── templates/              # Jinja2 templates (index, compress, crop, rotate, convert, login, signup, pricing, more, base)
├── static/
│   ├── css/style.css
│   └── js/                # resize.js, compress.js, crop.js, rotate.js, utils.js
└── data/
    └── analytics.db        # SQLite analytics store (created at runtime, not committed)
```

### Request flow (example: resize)

1. Browser posts a multipart form (`file` + resize params) to `/resize`.
2. Route validates the file extension against `ALLOWED_EXTENSIONS`.
3. `services.open_image` loads it into a Pillow `Image`, normalizing palette/mode.
4. `services.resize.apply_resize` dispatches to the strategy matching `mode` (`size` / `percent` / `social`).
5. If a target byte size was given, `services.encode_to_target_size` / `optimize_encode_to_target` binary-search JPEG/WEBP quality (and progressively downscale) until the output fits.
6. `send_processed_fastapi` streams the result back as a file download.
7. In the background, the request is logged to SQLite via `analytics.log_event`.

## Setup

### Requirements

- Python 3.9+
- See `requirements.txt`: Pillow, Werkzeug (for `secure_filename`), FastAPI, uvicorn, python-multipart.

### Install

```bash
pip install -r requirements.txt
```

### Run

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

or simply:

```bash
python main.py
```

App will be available at `http://localhost:8000`.

## Configuration

All tunables live in [config.py](config.py):

| Setting | Purpose |
|---|---|
| `ALLOWED_EXTENSIONS` | Accepted file extensions for upload |
| `EXPORT_FORMATS` | Map of export choice → (Pillow format, extension, MIME subtype) |
| `SOCIAL_PRESETS` | List of `(label, width, height)` presets shown on the home page |
| `DEFAULTS` | Default form values (mode, width, height, percent, lock_aspect, etc.) |

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `SECRET_KEY` | `dev-secret-key-change-in-production` | Session/cookie signing key — **must be overridden in production** |
| `ANALYTICS_DB` | `data/analytics.db` | Path to the SQLite analytics database |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server used to send OTP emails |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | *(none)* | SMTP username. If unset, OTPs are printed to the console instead of emailed ("dev mode") |
| `SMTP_PASS` | *(none)* | SMTP password |

## Routes

### Pages (GET)

| Route | Template |
|---|---|
| `/` | `index.html` — main resize tool |
| `/compress` | `compress.html` |
| `/crop` | `crop.html` |
| `/rotate` | `rotate.html` |
| `/convert` | `convert.html` |
| `/more` | `more.html` |
| `/pricing` | `pricing.html` |
| `/login` | `login.html` (supports `?step=otp`) |
| `/signup` | `signup.html` |
| `/logout` | redirects to `/` |

### Actions (POST)

| Route | Form fields | Behavior |
|---|---|---|
| `/resize` | `file`, `mode` (size/percent/social), `width`, `height`, `percent`, `lock_aspect`, `export_format`, `target_size`, `target_unit` | Resizes and streams the result as a download |
| `/do-compress` | `file`, `quality` (10–95), `target_size`, `target_unit` | Compresses to JPEG/PNG and streams the download |
| `/do-crop` | `file`, `x`, `y`, `width`, `height` | Crops (bounds are clamped server-side) and streams the download |
| `/do-rotate` | `file`, `angle` | Rotates (canvas expands) and streams the download |
| `/signup` | — | Flashes "coming soon", redirects to login |
| `/login/send-otp` | `name`, `email` | Generates + sends/logs a 6-digit OTP, valid 5 minutes |
| `/login/verify-otp` | `otp` | Verifies against the in-memory OTP store; logs the user in via session |

All processing endpoints reject disallowed file types with a flash message and redirect back to the originating page.

## Known gaps / things to note before production

- **OTP store is in-memory** (`services/auth.py`) — it resets on restart and won't work across multiple worker processes/instances.
- **`SECRET_KEY` has an insecure default** — set a real one via environment variable before deploying.
- **Signup is not implemented** — the endpoint just flashes "coming soon" and redirects to login.
- **No upload size limit is enforced** — FastAPI/Starlette don't cap request body size by default; add a check (e.g. `Content-Length` guard or a reverse-proxy limit) before exposing this publicly.
- Analytics DB (`data/analytics.db`) is unauthenticated and local-only; there's no route to view/query the collected data.
