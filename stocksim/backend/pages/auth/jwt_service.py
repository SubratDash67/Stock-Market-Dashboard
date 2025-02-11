# File: backend/pages/auth/jwt_service.py
from datetime import datetime, timedelta
import jwt
from config import Config
from models.auth_models import User
from sqlalchemy.orm import Session


class JWTService:
    @staticmethod
    def create_access_token(user_id: int) -> str:
        """Create a new access token for the user."""
        payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
            "iat": datetime.utcnow(),
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify the access token and return the payload."""
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        """Get the current user from the token."""
        payload = JWTService.verify_token(token)
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise Exception("User not found")
        return user
