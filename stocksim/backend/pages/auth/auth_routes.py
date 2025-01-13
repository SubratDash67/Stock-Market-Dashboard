# File: backend/pages/auth/auth_routes.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from databases.auth_db import get_auth_db
from .auth_service import register_user, authenticate_user
from models.auth_models import User

auth_bp = Blueprint("auth", __name__)

# User registration endpoint
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    with next(get_auth_db()) as db:  # Get a database session
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400

        # Register the new user
        user = register_user(db, username, email, password)
        return jsonify({"message": f"Welcome new user, {user.username}!"})

# User login endpoint
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    with next(get_auth_db()) as db:  # Get a database session
        user = authenticate_user(db, email, password)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({"message": f"Welcome back, {user.username}!"})
