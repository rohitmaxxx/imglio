import os
import random
import smtplib
import time
from email.mime.text import MIMEText

# In-memory OTP store: { email: {"otp": "123456", "expires": ts, "name": "..."} }
_otp_store = {}
OTP_EXPIRY_SECONDS = 300  # 5 minutes

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER")   
SMTP_PASS = os.environ.get("SMTP_PASS")   


def generate_otp():
    return f"{random.randint(0, 999999):06d}"


def send_otp_email(name, email):
    otp = generate_otp()
    _otp_store[email] = {"otp": otp, "expires": time.time() + OTP_EXPIRY_SECONDS, "name": name}

    body = f"Hi {name},\n\nYour imglio login OTP is: {otp}\nValid for 5 minutes.\n"
    if not SMTP_USER or not SMTP_PASS:
        
        print(f"[DEV MODE] OTP for {email}: {otp}")
        return True

    msg = MIMEText(body)
    msg["Subject"] = "Your imglio Login OTP"
    msg["From"] = SMTP_USER
    msg["To"] = email
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, [email], msg.as_string())
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