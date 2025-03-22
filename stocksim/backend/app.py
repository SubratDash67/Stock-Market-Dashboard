from flask import Flask
from flask_cors import CORS
from pages.market.market_routes import market_bp
from pages.auth.auth_routes import auth_bp
from pages.analytics.analytics_routes import analytics_bp
from pages.trade.trade_routes import trade_bp
from databases.trade_db import initialize_trade_db
from models.models import Base, engine

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(market_bp, url_prefix="/market")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(trade_bp, url_prefix="/trade")
app.register_blueprint(
    analytics_bp, url_prefix="/analytics"
)  # Ensure correct URL prefix

# Create database tables
print("Creating tables...")
Base.metadata.create_all(bind=engine)
initialize_trade_db()
print("Tables created successfully!")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
