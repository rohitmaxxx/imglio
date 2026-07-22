from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from jinja2 import pass_context

import os
import asyncio

from config import DEFAULTS, SOCIAL_PRESETS
from services import allowed_file, open_image, parse_target_bytes, send_processed_fastapi
from services import analytics
from services.resize import apply_resize

app = FastAPI()

# initialize analytics DB (local sqlite by default)
analytics.init_db(os.environ.get("ANALYTICS_DB", "data/analytics.db"))

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Sessions (simple replacement for Flask sessions used by templates)
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production"))


# Jinja helpers to mimic Flask template globals: url_for, get_flashed_messages, session
@pass_context
def _jinja_url_for(context, endpoint: str, *args, **kwargs):
    # Support calls like: url_for('static', filename='css/style.css')
    req: Request = context.get("request")
    try:
        # Special-case static files: FastAPI's StaticFiles route expects 'path'
        if endpoint == "static":
            # accept either filename= or path=
            fname = kwargs.get("filename") or kwargs.get("path") or (args[0] if args else None)
            if fname is None:
                return req.url_for(endpoint)
            return req.url_for(endpoint, path=fname)

        # For other endpoints, pass through any provided args/kwargs
        try:
            return req.url_for(endpoint, *args, **kwargs)
        except Exception:
            # fallback mapping for non-routable endpoints (templates expecting Flask-like names)
            mapping = {
                "index": "/",
                "compress_page": "/compress",
                "crop_page": "/crop",
                "rotate_page": "/rotate",
                "login_page": "/login",
                "signup_page": "/signup",
                "logout": "/logout",
                "convert_page": "/convert",
                "more_page": "/more",
                "pricing_page": "/pricing",
            }
            return mapping.get(endpoint, "#")
    except Exception:
        return "#"


@pass_context
def _jinja_get_flashed_messages(context):
    req: Request = context.get("request")
    if not req:
        return []
    flashes = req.session.pop("_flashes", []) if "_flashes" in req.session else []
    return flashes


templates.env.globals["url_for"] = _jinja_url_for
templates.env.globals["get_flashed_messages"] = _jinja_get_flashed_messages


def render_template(request: Request, template_name: str, **context):
    context.setdefault("request", request)
    context.setdefault("session", getattr(request, "session", {}))
    return templates.TemplateResponse(template_name, context)


@app.middleware("http")
async def analytics_middleware(request: Request, call_next):
    response = await call_next(request)
    try:
        ip = request.client.host if request.client else None
        path = str(request.url)
        method = request.method
        ua = request.headers.get("user-agent", "")
        user_email = request.session.get("user_email") if hasattr(request, "session") else None
        user_name = request.session.get("user_name") if hasattr(request, "session") else None
        details = {"status_code": response.status_code}
        loop = asyncio.get_event_loop()
        loop.run_in_executor(None, analytics.log_event, ip, path, method, user_email, user_name, ua, "visit", details)
    except Exception:
        pass
    return response


def _flash(request: Request, message: str):
    arr = request.session.get("_flashes") or []
    arr.append(message)
    request.session["_flashes"] = arr


def _upload_adapter(upload: UploadFile):
    # Provide a minimal object compatible with services.open_image expecting `.stream` and `.filename`
    class _A:
        pass

    a = _A()
    a.stream = upload.file
    a.filename = upload.filename
    return a


@app.get("/", name="index")
async def index(request: Request):
    return render_template(
        request,
        "index.html",
        social_presets=SOCIAL_PRESETS,
        defaults=DEFAULTS,
    )



@app.get("/compress", name="compress_page")
async def compress_page(request: Request):
    return render_template(request, "compress.html")


@app.get("/crop", name="crop_page")
async def crop_page(request: Request):
    return render_template(request, "crop.html")


@app.get("/rotate", name="rotate_page")
async def rotate_page(request: Request):
    return render_template(request, "rotate.html")


@app.get("/convert", name="convert_page")
async def convert_page(request: Request):
    return render_template(request, "convert.html")


@app.get("/more", name="more_page")
async def more_page(request: Request):
    return render_template(request, "more.html")


@app.get("/pricing", name="pricing_page")
async def pricing_page(request: Request):
    return render_template(request, "pricing.html")


@app.get("/signup", name="signup_page")
async def signup_get(request: Request):
    return render_template(request, "signup.html")


@app.post("/signup")
async def signup_post(request: Request):
    _flash(request, "Signup is coming soon. Please try login for now.")
    return RedirectResponse(url="/login", status_code=303)


@app.get("/login", name="login_page")
async def login_get(request: Request):

    step = request.query_params.get("step")

    return render_template(
        request,
        "login.html",
        step=step
    )

@app.post("/login/send-otp",name="login_send_otp")
async def login_send_otp(request: Request, name: str = Form(...), email: str = Form(...)):
    name = (name or "").strip()
    email = (email or "").strip().lower()
    if not name or not email:
        _flash(request, "Please enter both name and email.")
        return RedirectResponse(url="/login", status_code=303)

    request.session["pending_login_email"] = email
    # delegate to existing service (works with same API)
    from services.auth import send_otp_email

    send_otp_email(name, email)
    _flash(request, f"An OTP has been sent to {email}.")
    return RedirectResponse(url="/login?step=otp", status_code=303)


@app.post("/login/verify-otp",name="login_verify_otp")
async def login_verify_otp(request: Request, otp: str = Form(...)):
    email = request.session.get("pending_login_email")
    otp_input = otp or ""
    if not email:
        _flash(request, "Session expired, please log in again.")
        return RedirectResponse(url="/login", status_code=303)

    from services.auth import verify_otp

    ok, result = verify_otp(email, otp_input)
    if ok:
        request.session.pop("pending_login_email", None)
        request.session["user_name"] = result
        request.session["user_email"] = email
        _flash(request, f"Welcome, {result}!")
        return RedirectResponse(url="/", status_code=303)

    _flash(request, result)
    return RedirectResponse(url="/login?step=otp", status_code=303)


@app.get("/logout")
async def logout(request: Request):
    request.session.pop("user_name", None)
    request.session.pop("user_email", None)
    _flash(request, "Logged out successfully.")
    return RedirectResponse(url="/", status_code=303)


@app.post("/resize")
async def resize(request: Request, file: UploadFile = File(...), mode: str = Form(default="size"), width: int = Form(default=800), height: int = Form(default=600), percent: int = Form(default=100), lock_aspect: str = Form(default=None), export_format: str = Form(default="original"), target_size: str = Form(default=""), target_unit: str = Form(default="KB")):
    if not file.filename or not allowed_file(file.filename):
        _flash(request, "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF.")
        return RedirectResponse(url="/", status_code=303)

    form_data = {"mode": (mode or "size").lower(), "width": width, "height": height, "percent": percent, "lock_aspect": lock_aspect == "on"}
    target_bytes = parse_target_bytes(target_size, target_unit)

    try:
        # Log the resize request (don't block request processing)
        try:
            ip = request.client.host if request.client else None
            ua = request.headers.get("user-agent", "")
            loop = asyncio.get_event_loop()
            loop.run_in_executor(
                None,
                analytics.log_event,
                ip,
                str(request.url),
                request.method,
                request.session.get("user_email") if hasattr(request, "session") else None,
                request.session.get("user_name") if hasattr(request, "session") else None,
                ua,
                "resize_request",
                {"filename": file.filename, "form": form_data, "target_bytes": target_bytes},
            )
        except Exception:
            pass
        adapter = _upload_adapter(file)
        image = open_image(adapter)
        result = apply_resize(image, form_data)
        return send_processed_fastapi(result, file.filename, suffix=f"resized_{result.width}x{result.height}", export_format=export_format, target_bytes=target_bytes)
    except Exception:
        _flash(request, "Failed to process image. Please try another file.")
        return RedirectResponse(url="/", status_code=303)


@app.post("/do-compress")
async def do_compress(request: Request, file: UploadFile = File(...), quality: int = Form(default=70), target_size: str = Form(default=""), target_unit: str = Form(default="KB")):
    if not file.filename or not allowed_file(file.filename):
        _flash(request, "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF.")
        return RedirectResponse(url="/compress", status_code=303)

    q = max(10, min(95, int(quality)))
    target_bytes = parse_target_bytes(target_size, target_unit)
    try:
        # Log compress request
        try:
            ip = request.client.host if request.client else None
            ua = request.headers.get("user-agent", "")
            loop = asyncio.get_event_loop()
            loop.run_in_executor(
                None,
                analytics.log_event,
                ip,
                str(request.url),
                request.method,
                request.session.get("user_email") if hasattr(request, "session") else None,
                request.session.get("user_name") if hasattr(request, "session") else None,
                ua,
                "compress_request",
                {"filename": file.filename, "quality": q, "target_bytes": target_bytes},
            )
        except Exception:
            pass

        adapter = _upload_adapter(file)
        image = open_image(adapter)
        export = "png" if image.mode == "RGBA" else "jpg"
        return send_processed_fastapi(image, file.filename, suffix=f"compressed_q{q}", export_format=export, target_bytes=target_bytes, quality=q)
    except Exception:
        _flash(request, "Failed to compress image. Please try another file.")
        return RedirectResponse(url="/compress", status_code=303)


@app.post("/do-crop")
async def do_crop(request: Request, file: UploadFile = File(...), x: int = Form(default=0), y: int = Form(default=0), width: int = Form(default=100), height: int = Form(default=100)):
    if not file.filename or not allowed_file(file.filename):
        _flash(request, "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF.")
        return RedirectResponse(url="/crop", status_code=303)

    try:
        # Log crop request
        try:
            ip = request.client.host if request.client else None
            ua = request.headers.get("user-agent", "")
            loop = asyncio.get_event_loop()
            loop.run_in_executor(
                None,
                analytics.log_event,
                ip,
                str(request.url),
                request.method,
                request.session.get("user_email") if hasattr(request, "session") else None,
                request.session.get("user_name") if hasattr(request, "session") else None,
                ua,
                "crop_request",
                {"filename": file.filename, "x": x, "y": y, "width": width, "height": height},
            )
        except Exception:
            pass

        adapter = _upload_adapter(file)
        image = open_image(adapter)
        img_w, img_h = image.size
        x = max(0, min(int(x), img_w - 1))
        y = max(0, min(int(y), img_h - 1))
        w = max(1, min(int(width), img_w - x))
        h = max(1, min(int(height), img_h - y))
        cropped = image.crop((x, y, x + w, y + h))
        return send_processed_fastapi(cropped, file.filename, suffix=f"cropped_{w}x{h}")
    except Exception:
        _flash(request, "Failed to crop image. Please try another file.")
        return RedirectResponse(url="/crop", status_code=303)


@app.post("/do-rotate")
async def do_rotate(request: Request, file: UploadFile = File(...), angle: int = Form(default=90)):
    if not file.filename or not allowed_file(file.filename):
        _flash(request, "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF.")
        return RedirectResponse(url="/rotate", status_code=303)

    from PIL import Image

    ang = int(angle) % 360
    try:
        # Log rotate request
        try:
            ip = request.client.host if request.client else None
            ua = request.headers.get("user-agent", "")
            loop = asyncio.get_event_loop()
            loop.run_in_executor(
                None,
                analytics.log_event,
                ip,
                str(request.url),
                request.method,
                request.session.get("user_email") if hasattr(request, "session") else None,
                request.session.get("user_name") if hasattr(request, "session") else None,
                ua,
                "rotate_request",
                {"filename": file.filename, "angle": ang},
            )
        except Exception:
            pass

        adapter = _upload_adapter(file)
        image = open_image(adapter)
        rotated = image.rotate(-ang, expand=True, resample=Image.Resampling.BICUBIC)
        return send_processed_fastapi(rotated, file.filename, suffix=f"rotated_{ang}")
    except Exception:
        _flash(request, "Failed to rotate image. Please try another file.")
        return RedirectResponse(url="/rotate", status_code=303)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
