"""
Flask app — thin routes only.
Business logic lives in config.py + services/.
To add a tool: 1) add service  2) add route + template  3) optional config entry.
"""

import os

from flask import Flask, flash, redirect, render_template, request, url_for, session

from config import DEFAULTS, MAX_UPLOAD_MB, SOCIAL_PRESETS
from services import allowed_file, open_image, parse_target_bytes, send_processed
from services.resize import apply_resize

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024


def validate_upload(redirect_endpoint: str):
    if "file" not in request.files:
        flash("No file selected.")
        return None, redirect(url_for(redirect_endpoint))

    file = request.files["file"]
    if not file.filename:
        flash("No file selected.")
        return None, redirect(url_for(redirect_endpoint))

    if not allowed_file(file.filename):
        flash("Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, BMP, TIFF.")
        return None, redirect(url_for(redirect_endpoint))

    return file, None


def form_int(name, default):
    try:
        return int(float(request.form.get(name, default)))
    except (TypeError, ValueError):
        return default


# ── Pages ──────────────────────────────────────────────

@app.route("/")
def index():
    return render_template(
        "index.html",
        social_presets=SOCIAL_PRESETS,
        defaults=DEFAULTS,
    )


@app.route("/compress")
def compress_page():
    return render_template("compress.html")


@app.route("/crop")
def crop_page():
    return render_template("crop.html")


@app.route("/rotate")
def rotate_page():
    return render_template("rotate.html")


@app.route("/convert")
def convert_page():
    return render_template("convert.html")


@app.route("/more")
def more_page():
    return render_template("more.html")


@app.route("/pricing")
def pricing_page():
    return render_template("pricing.html")


@app.route("/signup", methods=["GET", "POST"])
def signup_page():
    if request.method == "POST":
        flash("Signup is coming soon. Please try login for now.")
        return redirect(url_for("login_page"))
    return render_template("signup.html")


# ── Resize (supports size / percent / social + export) ─

@app.route("/resize", methods=["POST"])
def resize():
    file, err = validate_upload("index")
    if err:
        return err

    mode = (request.form.get("mode") or "size").lower()
    form_data = {
        "mode": mode,
        "width": form_int("width", DEFAULTS["width"]),
        "height": form_int("height", DEFAULTS["height"]),
        "percent": form_int("percent", DEFAULTS["percent"]),
        "lock_aspect": request.form.get("lock_aspect") == "on",
    }

    export_format = request.form.get("export_format") or "original"
    target_bytes = parse_target_bytes(
        request.form.get("target_size"),
        request.form.get("target_unit", "KB"),
    )

    # 🔍 DEBUG — temporarily add this line
    print("DEBUG target_size raw:", repr(request.form.get("target_size")),
          "| target_unit raw:", repr(request.form.get("target_unit")),
          "| computed target_bytes:", target_bytes)

    try:
        image = open_image(file)
        result = apply_resize(image, form_data)
        return send_processed(
            result,
            file.filename,
            suffix=f"resized_{result.width}x{result.height}",
            export_format=export_format,
            target_bytes=target_bytes,
        )
    except Exception:
        flash("Failed to process image. Please try another file.")
        return redirect(url_for("index"))


# ── Compress ───────────────────────────────────────────

@app.route("/do-compress", methods=["POST"])
def do_compress():
    file, err = validate_upload("compress_page")
    if err:
        return err

    quality = max(10, min(95, form_int("quality", 70)))
    target_bytes = parse_target_bytes(
        request.form.get("target_size"),
        request.form.get("target_unit", "KB"),
    )

    try:
        image = open_image(file)
        # Prefer JPEG for compression unless PNG with alpha
        export = "png" if image.mode == "RGBA" else "jpg"
        return send_processed(
            image,
            file.filename,
            suffix=f"compressed_q{quality}",
            export_format=export,
            target_bytes=target_bytes,
            quality=quality,
        )
    except Exception:
        flash("Failed to compress image. Please try another file.")
        return redirect(url_for("compress_page"))


# ── Crop ───────────────────────────────────────────────

@app.route("/do-crop", methods=["POST"])
def do_crop():
    file, err = validate_upload("crop_page")
    if err:
        return err

    try:
        image = open_image(file)
        img_w, img_h = image.size
        x = max(0, min(form_int("x", 0), img_w - 1))
        y = max(0, min(form_int("y", 0), img_h - 1))
        w = max(1, min(form_int("width", 100), img_w - x))
        h = max(1, min(form_int("height", 100), img_h - y))
        cropped = image.crop((x, y, x + w, y + h))
        return send_processed(cropped, file.filename, suffix=f"cropped_{w}x{h}")
    except Exception:
        flash("Failed to crop image. Please try another file.")
        return redirect(url_for("crop_page"))


# ── Rotate ─────────────────────────────────────────────

@app.route("/do-rotate", methods=["POST"])
def do_rotate():
    from PIL import Image

    file, err = validate_upload("rotate_page")
    if err:
        return err

    angle = form_int("angle", 90) % 360
    try:
        image = open_image(file)
        rotated = image.rotate(-angle, expand=True, resample=Image.Resampling.BICUBIC)
        return send_processed(rotated, file.filename, suffix=f"rotated_{angle}")
    except Exception:
        flash("Failed to rotate image. Please try another file.")
        return redirect(url_for("rotate_page"))

from services.auth import send_otp_email, verify_otp

@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")


@app.route("/login/send-otp", methods=["POST"])
def login_send_otp():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip().lower()

    if not name or not email:
        flash("Please enter both name and email.")
        return redirect(url_for("login_page"))

    session["pending_login_email"] = email
    send_otp_email(name, email)
    flash(f"An OTP has been sent to {email}.")
    return redirect(url_for("login_page", step="otp"))


@app.route("/login/verify-otp", methods=["POST"])
def login_verify_otp():
    email = session.get("pending_login_email")
    otp_input = request.form.get("otp", "")

    if not email:
        flash("Session expired, please log in again.")
        return redirect(url_for("login_page"))

    ok, result = verify_otp(email, otp_input)
    if ok:
        session.pop("pending_login_email", None)
        session["user_name"] = result
        session["user_email"] = email
        flash(f"Welcome, {result}!")
        return redirect(url_for("index"))

    flash(result)
    return redirect(url_for("login_page", step="otp"))


@app.route("/logout")
def logout():
    session.pop("user_name", None)
    session.pop("user_email", None)
    flash("Logged out successfully.")
    return redirect(url_for("index"))



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)
