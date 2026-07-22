import sqlite3
import os
import json
import datetime
from typing import Optional

_db_path: Optional[str] = None


def init_db(path: str = "data/analytics.db"):
    global _db_path
    _db_path = path
    dirn = os.path.dirname(path)
    if dirn:
        os.makedirs(dirn, exist_ok=True)
    conn = sqlite3.connect(path)
    cur = conn.cursor()
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT,
        ip TEXT,
        path TEXT,
        method TEXT,
        user_email TEXT,
        user_name TEXT,
        user_agent TEXT,
        event_type TEXT,
        details TEXT
    )
    """
    )
    conn.commit()
    conn.close()


def log_event(ip: Optional[str], path: str, method: str, user_email: Optional[str], user_name: Optional[str], user_agent: str, event_type: str, details: dict):
    """Insert an event record into the analytics DB.

    This function is intentionally synchronous and lightweight; callers that
    don't want to block should call it via an executor (eg.
    `loop.run_in_executor`).
    """
    global _db_path
    if not _db_path:
        init_db()

    ts = datetime.datetime.utcnow().isoformat() + "Z"
    conn = sqlite3.connect(_db_path)
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO events (ts, ip, path, method, user_email, user_name, user_agent, event_type, details) VALUES (?,?,?,?,?,?,?,?,?)",
            (ts, ip, path, method, user_email, user_name, user_agent, event_type, json.dumps(details or {})),
        )
        conn.commit()
    finally:
        conn.close()
