# File: backend/models.py

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from config import Config

# Define a shared Base for all models
Base = declarative_base()

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

# Database engine and session setup
engine = create_engine(Config.AUTH_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency for database session
def get_auth_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
