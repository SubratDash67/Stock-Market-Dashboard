from flask import Flask
from flask_cors import CORS
from pages.market.market_routes import market_bp
from pages.auth.auth_routes import auth_bp
from pages.analytics.analytics_routes import analytics_bp
from databases.auth_db import engine
from models import Base

app = Flask(__name__)
CORS(app)

app.register_blueprint(market_bp, url_prefix="/market")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(analytics_bp, url_prefix="/analytics")

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


# path: stocksim/backend/app.py
