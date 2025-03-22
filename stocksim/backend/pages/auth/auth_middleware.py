# File: backend/pages/auth/auth_middleware.py

from functools import wraps
from flask import request, jsonify
from .jwt_service import JWTService
from models.models import get_auth_db  # Updated import from models.py

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid authorization header"}), 401

        token = auth_header.split(" ")[1]
        try:
            with next(get_auth_db()) as db:
                current_user = JWTService.get_current_user(db, token)
                return f(current_user, *args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 401

    return decorated
