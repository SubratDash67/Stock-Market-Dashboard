# File: backend/pages/market/market_service.py
import yfinance as yf
import os
import csv
from datetime import datetime
from typing import List, Dict

CSV_FILE = "stock_data.csv"

def get_market_trends():
    """
    Fetch historical and current data for multiple indices.
    """
    indices = {
        "NIFTY 50": "^NSEI",
        "SENSEX": "^BSESN",
        "NASDAQ": "^IXIC"
    }
    trends = {}

    for index_name, symbol in indices.items():
        try:
            ticker = yf.Ticker(symbol)

            # Fetch last 7 days of history
            history = ticker.history(period="5d")
            if not history.empty:
                trends[index_name] = {
                    "dates": history.index.strftime("%Y-%m-%d").tolist(),
                    "prices": history["Close"].tolist()
                }
            else:
                trends[index_name] = {"error": "No data available"}

            # Fetch current day price data
            today_data = ticker.history(period="1d")
            if not today_data.empty:
                latest_data = today_data.iloc[-1]
                trends[index_name].update({
                    "price": latest_data["Close"],
                    "change": latest_data["Close"] - latest_data["Open"],
                    "percent_change": ((latest_data["Close"] - latest_data["Open"]) / latest_data["Open"]) * 100
                })
        except Exception as e:
            trends[index_name] = {"error": str(e)}

    return trends

def load_csv_data():
    """
    Load stock data from a CSV file and return it as a list of dictionaries.
    """
    data = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    data.append({
                        "symbol": row["symbol"],
                        "price": float(row["price"] or 0),
                        "percent_change": float(row["percent_change"] or 0),
                        "volume": int(row["volume"] or 0),
                        "market_cap": float(row["market_cap"] or 0),
                        "pe_ratio": float(row["pe_ratio"] or 0),
                        "52_week_high": float(row["52_week_high"] or 0),
                        "52_week_low": float(row["52_week_low"] or 0),
                        "dividend_yield": float(row["dividend_yield"] or 0),
                        "beta": float(row["beta"] or 0),
                        "pb_ratio": float(row["pb_ratio"] or 0),
                        "eps": float(row["eps"] or 0),
                        "last_updated": row["last_updated"],
                        "sector": row["sector"]
                    })
                except ValueError as e:
                    print(f"Error processing row: {row}, {e}")
    return data



def get_gainers_and_losers(sector=None):
    """
    Fetch top gainers and losers, dynamically filtered by sector.
    """
    data = load_csv_data()  # Load CSV data
    gainers = []
    losers = []

    for stock in data:
        try:
            # Re-traverse and filter by sector if specified
            if sector and stock["sector"].lower() != sector.lower():
                continue

            percent_change = stock["percent_change"]
            stock_data = {
                "symbol": stock["symbol"],
                "price": stock["price"],
                "percent_change": percent_change,
                "sector": stock["sector"],
            }

            if percent_change >= 0:
                gainers.append(stock_data)
            else:
                losers.append(stock_data)
        except KeyError as e:
            print(f"Error processing stock data: {stock}, {e}")

    # Sort gainers and losers
    gainers.sort(key=lambda x: x["percent_change"], reverse=True)
    losers.sort(key=lambda x: x["percent_change"])

    return gainers[:20], losers[:20]


def filter_and_rank_stocks(data: List[Dict], filter_query: str) -> List[Dict]:
    """
    Filters and ranks stock data based on the query.
    """
    # Parse combined filters (e.g., "Growth|Energy")
    filters = filter_query.split('|')
    stock_type = filters[0].strip().lower() if len(filters) > 0 else ''
    sector_filter = filters[1].strip().lower() if len(filters) > 1 else None

    # Define filtering criteria for predefined queries
    criteria_map = {
        "growth stock": lambda stock: stock.get("pe_ratio", 0) > 20,
        "stability stock": lambda stock: stock.get("beta", float('inf')) < 1,
        "dividend stock": lambda stock: stock.get("dividend_yield", 0) > 0.03,
    }

    # Apply filters for stock type and sector
    data = [
        stock for stock in data
        if (not stock_type or criteria_map.get(stock_type, lambda x: True)(stock)) and
           (not sector_filter or stock["sector"].strip().lower() == sector_filter)
    ]

    # Ranking weights
    weights = {
        "percent_change": 0.5,
        "dividend_yield": 10,
        "market_cap": 1,
        "pe_ratio_deviation": 0.1,
    }

    # Rank stocks based on scoring logic
    data.sort(
        key=lambda stock: (
            (stock.get("percent_change", 0) * weights["percent_change"]) +
            (stock.get("dividend_yield", 0) * weights["dividend_yield"]) +
            (stock.get("market_cap", 0) / 1e12 * weights["market_cap"]) -
            abs((stock.get("pe_ratio", 15) - 15) * weights["pe_ratio_deviation"])
        ),
        reverse=True
    )

    return data[:15]  # Return top results



def get_filtered_stocks(filter_query):
    """
    Main function to get filtered stocks based on the query.
    """
    data = load_csv_data()
    screener_data = filter_and_rank_stocks(data, filter_query)
    return screener_data  # Return all data
