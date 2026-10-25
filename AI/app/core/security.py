import os
import secrets
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Header, HTTPException

# Charge le .env situé à la racine du dossier IA
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

INTERNAL_KEY = os.getenv("HERMES_INTERNAL_KEY", "").strip()


async def verify_internal_key(x_internal_key: str = Header(default="")):
    if not INTERNAL_KEY or not secrets.compare_digest(x_internal_key, INTERNAL_KEY):
        raise HTTPException(status_code=401, detail="Unauthorized")
