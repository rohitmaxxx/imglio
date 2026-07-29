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

## Docker

Run the whole stack (Nginx + Next.js frontend + FastAPI backend) with a single command — no local Python/Node install required.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- Docker Compose v2 (bundled with modern Docker Desktop; `docker compose version` should work)

### Build & run

```bash
cp .env.example .env       # then edit values as needed (see below)
docker compose up --build
```

The app is available at **http://localhost** (Nginx). The backend is also published directly at **http://localhost:8000** because the frontend's browser-side code (resize/compress/crop/rotate/config calls) talks to it directly — see [`services/api.ts`](frontend/services/api.ts).

Run in the background:

```bash
docker compose up -d --build
```

### Stopping

```bash
docker compose down          # stop and remove containers
docker compose down -v       # also delete the persisted analytics DB volume
```

### Environment variables

All variables live in `.env` (copied from `.env.example`) and are read by `docker-compose.yml`. Full reference:

| Variable | Default | Purpose |
|---|---|---|
| `NGINX_PORT` | `80` | Host port for the Nginx entrypoint |
| `FRONTEND_PORT` | `3000` | Host port the Next.js container is also published on |
| `BACKEND_PORT` | `8000` | Host port the FastAPI container is published on |
| `JWT_SECRET` | *(dev default)* | JWT signing secret — **must** be overridden in production |
| `JWT_EXPIRE_MINUTES` | `10080` | Auth token lifetime (7 days) |
| `FRONTEND_ORIGIN` | `http://localhost` | Origin the backend's CORS policy allows — must match how you access the app |
| `ANALYTICS_DB` | `data/analytics.db` | Path (inside the backend container) to the SQLite analytics store |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | — | OTP email delivery; leave `SMTP_USER`/`SMTP_PASS` blank to print OTPs to the backend container logs instead |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend URL the **browser** calls directly — baked into the frontend build, so changing it requires `docker compose up --build` again |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost` | Used for metadata/Open Graph/sitemap absolute URLs |

Two more URLs are wired up automatically inside `docker-compose.yml` and don't need to be set by hand: the frontend container's own server-side code (SSR config fetch, the OTP-verify/logout route handlers) reaches the backend via the internal Docker network at `http://backend:8000`.

### Architecture notes

- **Nginx** (`nginx/nginx.conf`) is the single public entrypoint. It proxies `/api/auth/verify-otp` and `/api/auth/logout` to the **frontend** container (these are Next.js route handlers that set/clear the httpOnly auth cookie), everything else under `/api/` to the **backend** (FastAPI), and everything else to the frontend for pages/assets. It also handles gzip, security headers, `_next/static` caching, and a 25MB upload limit for the image-processing endpoints.
- The frontend is **Next.js**, not a static SPA — it runs its own Node server (`next start`, via the standalone build output) rather than being served as static files by Nginx, because it has server-rendered pages and its own API routes.
- The backend's SQLite analytics DB persists in a named Docker volume (`backend_data`) so it survives `docker compose down` (but not `docker compose down -v`).

### Troubleshooting

- **"Network error" / failed image processing in the browser**: confirm `NEXT_PUBLIC_API_URL` in `.env` is a URL your *browser* (not just the Docker network) can reach, and that you rebuilt (`docker compose up --build`) after changing it — it's compiled into the JS bundle, not read at runtime.
- **CORS errors in the browser console**: `FRONTEND_ORIGIN` must exactly match the origin you're loading the app from (scheme + host + port, no trailing slash). If you access the app via a different port than `NGINX_PORT`, update `FRONTEND_ORIGIN` to match and restart the backend.
- **OTP emails never arrive**: leave `SMTP_USER`/`SMTP_PASS` blank for local dev — OTPs print to `docker compose logs backend` instead.
- **`docker compose up` fails at `depends_on` / a service stuck "unhealthy"**: check that service's logs (`docker compose logs backend` / `frontend` / `nginx`); the healthchecks require `/api/config` (backend) and `/` (frontend) to respond within the configured `start_period`.
- **Changes to backend Python code not showing up**: images are built once; re-run `docker compose up --build` after code changes (there's no hot-reload in the production containers by design).
