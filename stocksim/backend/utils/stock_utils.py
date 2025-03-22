# C:\Users\KIIT\Desktop\Stock-Market-Dashboard\stocksim\backend\utils\stock_utils.py

import os


def load_stock_suggestions():
    """Load stock symbols from text files."""
    stocks = []
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    stocks_list_path = os.path.join(base_path, "stocks-list")

    # Load NS stocks
    try:
        with open(os.path.join(stocks_list_path, "NS_stocks.txt"), "r") as f:
            ns_stocks = [line.strip() for line in f.readlines()]
            stocks.extend(ns_stocks)
    except Exception as e:
        print(f"Error loading NS stocks: {e}")

    # Load BO stocks
    try:
        with open(os.path.join(stocks_list_path, "BO_stocks.txt"), "r") as f:
            bo_stocks = [line.strip() for line in f.readlines()]
            stocks.extend(bo_stocks)
    except Exception as e:
        print(f"Error loading BO stocks: {e}")

    return stocks


def get_stock_suggestions(query):
    """Get stock suggestions based on query."""
    all_stocks = load_stock_suggestions()

    # Filter stocks that match the query (case insensitive)
    matching_stocks = [stock for stock in all_stocks if query.upper() in stock.upper()]

    # Limit to top 10 suggestions
    return matching_stocks[:10]
