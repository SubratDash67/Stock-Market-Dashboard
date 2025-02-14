# File: backend/pages/auth/auth_routes.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from databases.auth_db import get_auth_db
from .auth_service import register_user, authenticate_user
from .jwt_service import JWTService
from models.auth_models import User
from .auth_middleware import (
    require_auth,
)  # Import the decorator instead of defining it here

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    with next(get_auth_db()) as db:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400

        # Register the new user
        user = register_user(db, username, email, password)
        # Create access token
        access_token = JWTService.create_access_token(user.id)

        return jsonify(
            {
                "message": f"Welcome new user, {user.username}!",
                "access_token": access_token,
                "user": {"id": user.id, "username": user.username, "email": user.email},
            }
        )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    with next(get_auth_db()) as db:
        user = authenticate_user(db, email, password)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Create access token
        access_token = JWTService.create_access_token(user.id)

        return (
            jsonify(
                {
                    "message": f"Welcome back, {user.username}!",
                    "access_token": access_token,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                }
            ),
            200,
        )


@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user(current_user):
    """Get the current authenticated user's details."""
    return jsonify(
        {
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
            }
        }
    )
