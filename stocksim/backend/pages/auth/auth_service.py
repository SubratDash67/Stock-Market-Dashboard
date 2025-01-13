# File: backend/pages/auth/auth_service.py
from models.auth_models import User
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash

# Function to register a new user
def register_user(db: Session, username: str, email: str, password: str):
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Function to authenticate a user
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user and check_password_hash(user.password, password):
        return user
    return None
