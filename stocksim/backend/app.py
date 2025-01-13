# File: backend/app.py
from flask import Flask
from flask_cors import CORS
from pages.market.market_routes import market_bp
from pages.auth.auth_routes import auth_bp  # Import auth blueprint
from databases.auth_db import engine
from models import Base

app = Flask(__name__)

# Enable CORS to allow cross-origin requests (needed for frontend-backend communication)
CORS(app)

# Register Blueprints
app.register_blueprint(market_bp, url_prefix="/market")
app.register_blueprint(auth_bp, url_prefix="/auth")  # Register auth blueprint

# Initialize the database
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")



if __name__ == "__main__":
    # Run the server in debug mode
    app.run(debug=True, host="0.0.0.0", port=5000)
