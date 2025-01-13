# File: backend/databases/auth_db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models import Base  # Import Base from models/__init__.py

# Create database engine for the authentication database
engine = create_engine(Config.AUTH_DATABASE_URI)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_auth_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
