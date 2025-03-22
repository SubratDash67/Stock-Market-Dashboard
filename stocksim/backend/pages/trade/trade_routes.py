from flask import Blueprint, request, jsonify
from pages.trade.trade_service import (
    execute_trade, get_portfolio, add_to_basket, execute_basket,
    get_basket, get_stock_price, get_suggestions, remove_from_basket  # ✅ Add this
)


trade_bp = Blueprint("trade", __name__)

@trade_bp.route("/buy", methods=["POST"])
def buy_stock():
    """Handles buying stocks."""
    data = request.json
    result = execute_trade(data["symbol"], data["quantity"], data["order_type"], "Buy", data.get("limit_price"))
    return jsonify(result), (400 if "error" in result else 200)

@trade_bp.route("/sell", methods=["POST"])
def sell_stock():
    """Handles selling stocks."""
    data = request.json
    result = execute_trade(data["symbol"], data["quantity"], data["order_type"], "Sell", data.get("limit_price"))
    return jsonify(result), (400 if "error" in result else 200)

@trade_bp.route("/portfolio", methods=["GET"])
def portfolio():
    """Fetches the user's current portfolio."""
    return jsonify(get_portfolio()), 200

@trade_bp.route("/basket/add", methods=["POST"])
def add_trade_to_basket():
    """Adds a trade to the basket."""
    data = request.json
    result = add_to_basket(data["symbol"], data["quantity"], data["order_type"], data["trade_type"], data.get("limit_price"))
    return jsonify(result), 200

@trade_bp.route("/basket/execute", methods=["POST"])
def execute_basket_orders():
    """Executes all trades in the basket."""
    result = execute_basket()
    return jsonify(result), 200

@trade_bp.route("/basket", methods=["GET"])
def view_basket():
    """Returns the current basket orders."""
    return jsonify(get_basket()), 200

@trade_bp.route("/price", methods=["GET"])
def fetch_stock_price():
    """Fetches the real-time stock price for a given symbol."""
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error": "Stock symbol is required"}), 400

    price = get_stock_price(symbol)
    if price is None:
        return jsonify({"error": "Failed to fetch stock price"}), 400

    return jsonify({"symbol": symbol, "price": price}), 200

@trade_bp.route("/suggestions", methods=["GET"])
def fetch_stock_suggestions():
    """Fetches stock symbol suggestions based on user input."""
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    suggestions = get_suggestions(query)
    return jsonify({"suggestions": suggestions}), 200

@trade_bp.route("/basket/remove", methods=["POST"])
def remove_trade_from_basket():
    """Removes a specific trade from the basket."""
    data = request.json
    result = remove_from_basket(data["symbol"], data["quantity"], data["order_type"], data["trade_type"], data.get("limit_price"))
    return jsonify(result), 200

