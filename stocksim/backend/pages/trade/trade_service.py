import time
import threading
import yfinance as yf

# In-memory storage for orders
portfolio = {}
basket_orders = []
pending_orders = []  # ✅ Stores Limit & Stop-Loss orders

def get_stock_price(symbol: str):
    """Fetches the latest stock price from Yahoo Finance."""
    try:
        stock = yf.Ticker(symbol)
        stock_price = stock.history(period="1d")["Close"].iloc[-1]  # Latest closing price
        return float(stock_price)
    except Exception:
        return None  # Handle errors

def get_suggestions(query: str):
    """Fetches stock symbol suggestions from Yahoo Finance."""
    try:
        stock = yf.Ticker(query)
        info = stock.info
        return [info["symbol"]] if "symbol" in info else []
    except Exception:
        return []

def add_to_basket(symbol: str, quantity: int, order_type: str, trade_type: str, limit_price=None):
    """Adds a trade to the basket."""
    basket_orders.append({
        "symbol": symbol,
        "quantity": quantity,
        "order_type": order_type,
        "trade_type": trade_type,
        "limit_price": limit_price
    })
    return {"message": "Trade added to basket", "basket": basket_orders}

def execute_trade(symbol: str, quantity: int, order_type: str, trade_type: str, limit_price=None):
    """Executes a trade immediately or stores it for later execution."""
    stock_price = get_stock_price(symbol)
    if stock_price is None:
        return {"error": "Invalid stock symbol or failed to fetch price"}

    if limit_price is not None:
        limit_price = float(limit_price)

    if order_type == "Limit" and ((trade_type == "Buy" and stock_price > limit_price) or
                                  (trade_type == "Sell" and stock_price < limit_price)):
        pending_orders.append({
            "symbol": symbol,
            "quantity": quantity,
            "order_type": order_type,
            "trade_type": trade_type,
            "limit_price": limit_price
        })
        return {"message": f"Limit Order placed at ₹{limit_price}. Waiting for price match."}

    if order_type == "Stop Loss" and trade_type == "Sell":
        pending_orders.append({
            "symbol": symbol,
            "quantity": quantity,
            "order_type": order_type,
            "trade_type": trade_type,
            "limit_price": limit_price
        })
        return {"message": f"Stop-Loss Order placed at ₹{limit_price}. Will sell when price drops."}

    total_cost = stock_price * quantity

    if trade_type == "Buy":
        if symbol in portfolio:
            portfolio[symbol]["quantity"] += quantity
            portfolio[symbol]["avg_price"] = (
                (portfolio[symbol]["avg_price"] * portfolio[symbol]["quantity"]) + total_cost
            ) / (portfolio[symbol]["quantity"] + quantity)
        else:
            portfolio[symbol] = {"quantity": quantity, "avg_price": stock_price}

    elif trade_type == "Sell":
        if symbol not in portfolio or portfolio[symbol]["quantity"] < quantity:
            return {"error": "Insufficient shares to sell"}

        portfolio[symbol]["quantity"] -= quantity
        if portfolio[symbol]["quantity"] == 0:
            del portfolio[symbol]

    return {"message": "Trade executed successfully", "trade": {"symbol": symbol, "quantity": quantity, "price": stock_price, "order_type": order_type, "trade_type": trade_type}}

def execute_basket():
    """Executes all trades in the basket."""
    global basket_orders
    if not basket_orders:
        return {"error": "No trades in the basket"}

    results = []
    for order in basket_orders:
        result = execute_trade(order["symbol"], order["quantity"], order["order_type"], order["trade_type"], order.get("limit_price"))
        results.append(result)

    basket_orders = []  # Clear basket after execution
    return {"message": "Basket executed successfully", "results": results}

def remove_from_basket(symbol: str, quantity: int, order_type: str, trade_type: str, limit_price=None):
    """Removes a specific trade from the basket."""
    global basket_orders
    basket_orders = [trade for trade in basket_orders if not (
        trade["symbol"] == symbol and
        trade["quantity"] == quantity and
        trade["order_type"] == order_type and
        trade["trade_type"] == trade_type and
        trade.get("limit_price", None) == limit_price
    )]

    return {"message": "Trade removed from basket", "basket": basket_orders}

def check_pending_orders():
    """Checks pending Limit & Stop-Loss orders every minute and executes them if conditions are met."""
    while True:
        if pending_orders:
            print("Checking pending orders...")
            for order in pending_orders[:]:  # Iterate over a copy of the list
                stock_price = get_stock_price(order["symbol"])
                if stock_price is None:
                    continue

                if order["order_type"] == "Limit" and (
                        (order["trade_type"] == "Buy" and stock_price <= order["limit_price"]) or
                        (order["trade_type"] == "Sell" and stock_price >= order["limit_price"])
                ):
                    execute_trade(order["symbol"], order["quantity"], "Market", order["trade_type"])
                    pending_orders.remove(order)

                if order["order_type"] == "Stop Loss" and order["trade_type"] == "Sell" and stock_price <= order["limit_price"]:
                    execute_trade(order["symbol"], order["quantity"], "Market", "Sell")
                    pending_orders.remove(order)

        time.sleep(60)  # Check every 60 seconds

# ✅ Start a background thread to process pending orders
threading.Thread(target=check_pending_orders, daemon=True).start()

def get_basket():
    """Returns the current basket orders."""
    return {"basket": basket_orders}

def get_portfolio():
    """Returns the current portfolio holdings."""
    return [{"symbol": symbol, "quantity": data["quantity"], "avg_price": data["avg_price"]} for symbol, data in portfolio.items()]
