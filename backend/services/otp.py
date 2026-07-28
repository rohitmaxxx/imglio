import random
import smtplib
import time
from email.mime.text import MIMEText

from core.config import settings

# In-memory OTP store: { email: {"otp": "123456", "expires": ts, "name": "..."} }
_otp_store = {}
OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp():
    return f"{random.randint(0, 999999):06d}"


def send_otp_email(name, email):
    otp = generate_otp()
    _otp_store[email] = {"otp": otp, "expires": time.time() + OTP_EXPIRY_SECONDS, "name": name}

    body = f"Hi {name},\n\nYour pixanzo login OTP is: {otp}\nValid for 5 minutes.\n"
    if not settings.SMTP_USER or not settings.SMTP_PASS:
        print(f"[DEV MODE] OTP for {email}: {otp}")
        return True

    msg = MIMEText(body)
    msg["Subject"] = "Your pixanzo Login OTP"
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.sendmail(settings.SMTP_USER, [email], msg.as_string())
        return True
    except Exception as e:
        print(f"OTP email failed: {e}")
        return False


def verify_otp(email, otp_input):
    record = _otp_store.get(email)
    if not record:
        return False, "OTP not found, please try again."
    if time.time() > record["expires"]:
        del _otp_store[email]
        return False, "OTP expired, please request a new one."
    if record["otp"] != otp_input.strip():
        return False, "Incorrect OTP, please try again."
    name = record["name"]
    del _otp_store[email]
    return True, name
