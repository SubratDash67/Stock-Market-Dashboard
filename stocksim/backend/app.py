from flask import Flask
from flask_cors import CORS
from pages.market.market_routes import market_bp
from pages.auth.auth_routes import auth_bp
from pages.analytics.analytics_routes import analytics_bp
from pages.analytics.historical_data_routes import historical_data_bp
from pages.analytics.technical_indicators_routes import technical_indicators_bp
from pages.analytics.comparison_routes import comparison_bp
from pages.analytics.trading_strategies_routes import trading_strategies_bp
from pages.analytics.options_strategies_routes import options_strategies_bp
from pages.analytics.market_indicators_routes import market_indicators_bp
from databases.auth_db import engine
from models import Base

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(market_bp, url_prefix="/market")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(analytics_bp, url_prefix="/analytics")
app.register_blueprint(historical_data_bp)
app.register_blueprint(technical_indicators_bp)
app.register_blueprint(comparison_bp)
app.register_blueprint(trading_strategies_bp)
app.register_blueprint(options_strategies_bp)
app.register_blueprint(market_indicators_bp)

# Create database tables
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
