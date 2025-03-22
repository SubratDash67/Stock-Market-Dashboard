# File: backend/pages/auth/auth_routes.py

from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from models.models import get_auth_db, User  # Updated import from models.py
from .jwt_service import JWTService
from .auth_middleware import require_auth
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

def register_user(db: Session, username: str, email: str, password: str):
    """Registers a new user with a hashed password."""
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    """Authenticates user by verifying email and password."""
    user = db.query(User).filter(User.email == email).first()
    if user and check_password_hash(user.password, password):
        return user
    return None

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """User signup endpoint."""
    data = request.json
    username, email, password = data.get("username"), data.get("email"), data.get("password")

    if not all([username, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    with next(get_auth_db()) as db:
        if db.query(User).filter(User.email == email).first():
            return jsonify({"error": "User with this email already exists"}), 400

        user = register_user(db, username, email, password)
        access_token = JWTService.create_access_token(user.id)

        return jsonify({
            "message": f"Welcome new user, {user.username}!",
            "access_token": access_token,
            "user": {"id": user.id, "username": user.username, "email": user.email},
        })

@auth_bp.route("/login", methods=["POST"])
def login():
    """User login endpoint."""
    data = request.json
    email, password = data.get("email"), data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    with next(get_auth_db()) as db:
        user = authenticate_user(db, email, password)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = JWTService.create_access_token(user.id)
        return jsonify({
            "message": f"Welcome back, {user.username}!",
            "access_token": access_token,
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }), 200

@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user(current_user):
    """Get the current authenticated user's details."""
    return jsonify({"user": {"id": current_user.id, "username": current_user.username, "email": current_user.email}})
