# File: backend/models/auth_models.py
from sqlalchemy import Column, Integer, String
from models import Base  # Import Base from models/__init__.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
