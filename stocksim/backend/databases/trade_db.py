from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.trade_models import Base, Portfolio

# Database connection setup
DATABASE_URL = "sqlite:///trade_data.db"
engine = create_engine(DATABASE_URL, echo=True)  # Set echo=False in production
SessionLocal = sessionmaker(bind=engine)

def initialize_trade_db():
    """Creates portfolio table if it doesn't exist."""
    print("Initializing Portfolio Database...")
    Base.metadata.create_all(bind=engine)
    print("Portfolio Database initialized successfully!")

def update_portfolio(user_id, symbol, quantity, executed_price, trade_type):
    """Updates the user's portfolio based on executed trades."""
    session = SessionLocal()
    try:
        print(f"User ID: {user_id}, Symbol: {symbol}, Quantity: {quantity}, Price: {executed_price}, Type: {trade_type}")

        portfolio_entry = session.query(Portfolio).filter_by(user_id=user_id, symbol=symbol).first()
        print(f"Existing Portfolio Entry: {portfolio_entry}")

        if trade_type == "Buy":
            if portfolio_entry:
                new_quantity = portfolio_entry.quantity + quantity
                new_avg_price = ((portfolio_entry.avg_price * portfolio_entry.quantity) + (executed_price * quantity)) / new_quantity
                portfolio_entry.quantity = new_quantity
                portfolio_entry.avg_price = new_avg_price
            else:
                portfolio_entry = Portfolio(user_id=user_id, symbol=symbol, quantity=quantity, avg_price=executed_price)
                session.add(portfolio_entry)

        elif trade_type == "Sell" and portfolio_entry:
            if portfolio_entry.quantity > quantity:
                portfolio_entry.quantity -= quantity
            else:
                session.delete(portfolio_entry)

        session.commit()
        print("✅ Portfolio updated successfully!")

    except Exception as e:
        session.rollback()
        print(f"❌ Error updating portfolio: {e}")
    finally:
        session.close()


def get_portfolio(user_id):
    """Fetches the user's portfolio without authentication."""
    session = SessionLocal()
    try:
        portfolio = session.query(Portfolio).filter_by(user_id=user_id).all()
        return [entry.to_dict() for entry in portfolio]
    finally:
        session.close()
