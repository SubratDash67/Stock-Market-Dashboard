# File: backend/pages/market/market_service.py
import yfinance as yf
import json
import os
from datetime import datetime, timedelta

CACHE_FILE = "stock_data.json"
CACHE_EXPIRY_DAYS = 1


def get_market_trends():
    """
    Fetch real-time data for market indices.
    Returns the latest price, change, and percent change.
    """
    indices = {
        "NIFTY 50": "^NSEI",  # Nifty 50 Index
        "SENSEX": "^BSESN",   # Sensex Index
        "NASDAQ": "^IXIC"     # NASDAQ Composite Index
    }
    trends = {}

    for index_name, symbol in indices.items():
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="1d")
            if not history.empty:
                latest_data = history.iloc[-1]
                trends[index_name] = {
                    "price": latest_data["Close"],
                    "change": latest_data["Close"] - latest_data["Open"],
                    "percent_change": ((latest_data["Close"] - latest_data["Open"]) / latest_data["Open"]) * 100
                }
            else:
                trends[index_name] = {"error": "No data available"}
        except Exception as e:
            trends[index_name] = {"error": str(e)}

    return trends


def get_gainers_and_losers():
    """
    Fetch top gainers and losers using corrected stock symbols for Indian markets.
    """
    symbols = ["TCS.NS", "INFY.NS", "RELIANCE.NS", "WIPRO.NS", "HDFCBANK.NS", "ITC.NS", "ICICIBANK.NS", "SBIN.NS", "HINDUNILVR.NS", "AXISBANK.NS", "KOTAKBANK.NS", "BAJFINANCE.NS", "BHARTIARTL.NS", "MARUTI.NS", "ASIANPAINT.NS", "ADANIENT.NS", "ADANIGREEN.NS", "ULTRACEMCO.NS", "TITAN.NS", "SUNPHARMA.NS", "ONGC.NS", "NTPC.NS", "POWERGRID.NS", "JSWSTEEL.NS", "TATAMOTORS.NS", "HEROMOTOCO.NS", "DRREDDY.NS", "DIVISLAB.NS", "COALINDIA.NS", "LT.NS", "GRASIM.NS", "EICHERMOT.NS", "BRITANNIA.NS", "CIPLA.NS", "BAJAJ-AUTO.NS", "INDUSINDBK.NS", "BPCL.NS", "HCLTECH.NS", "NESTLEIND.NS", "M&M.NS", "APOLLOHOSP.NS", "SHREECEM.NS", "UPL.NS", "TECHM.NS", "HINDALCO.NS", "SBICARD.NS"]
    gainers = []
    losers = []

    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="1d")
            if not history.empty:
                latest_data = history.iloc[-1]
                percent_change = ((latest_data["Close"] - latest_data["Open"]) / latest_data["Open"]) * 100
                stock_data = {
                    "symbol": symbol,
                    "price": latest_data["Close"],
                    "percent_change": percent_change
                }
                if percent_change >= 0:
                    gainers.append(stock_data)
                else:
                    losers.append(stock_data)
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")

    gainers.sort(key=lambda x: x["percent_change"], reverse=True)
    losers.sort(key=lambda x: x["percent_change"])
    return gainers[:5], losers[:5]






def fetch_stock_data(symbols):
    """
    Fetch stock data for the given symbols from yfinance and return it as a list of dictionaries.
    """
    screener_data = []
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="1d")
            info = ticker.info

            if not history.empty:
                latest_data = history.iloc[-1]
                screener_data.append({
                    "symbol": symbol,
                    "price": latest_data["Close"],
                    "percent_change": ((latest_data["Close"] - latest_data["Open"]) / latest_data["Open"]) * 100,
                    "volume": latest_data["Volume"],
                    "market_cap": info.get("marketCap", 0),
                    "pe_ratio": info.get("trailingPE", 0),
                    "52_week_high": info.get("fiftyTwoWeekHigh", 0),
                    "52_week_low": info.get("fiftyTwoWeekLow", 0),
                    "dividend_yield": info.get("dividendYield", 0),
                    "beta": info.get("beta", 0),
                    "pb_ratio": info.get("priceToBook", 0),
                    "eps": info.get("trailingEps", 0),
                    "last_updated": datetime.now().isoformat()  # For tracking cache expiry
                })
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
    return screener_data


def load_cached_data():
    """
    Load stock data from the cache file if it exists and is not expired.
    """
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            data = json.load(f)

        # Check if cache is still valid
        if data and "last_updated" in data[0]:
            last_updated = datetime.fromisoformat(data[0]["last_updated"])
            if datetime.now() - last_updated < timedelta(days=CACHE_EXPIRY_DAYS):
                return data
    return None


def save_to_cache(data):
    """
    Save stock data to the cache file.
    """
    with open(CACHE_FILE, "w") as f:
        json.dump(data, f, indent=4)


def filter_and_rank_stocks(data, filter_query):
    """
    Filter stock data based on the query and rank by the scoring logic.
    """
    # Filter by query
    if filter_query:
        data = [stock for stock in data if filter_query.lower() in stock["symbol"].lower()]

    # Ranking logic
    if data:
        data.sort(
            key=lambda stock: (
                stock["percent_change"] * 0.5 +
                (stock["dividend_yield"] or 0) * 10 +
                stock["market_cap"] / 1e12 -
                abs((stock["pe_ratio"] or 0) - 15) * 0.1
            ),
            reverse=True
        )
    return data[:6]  # Return top 6


def get_filtered_stocks(filter_query):
    """
    Main function to get filtered stocks based on the query.
    """
    symbols = [
        "TCS.NS", "INFY.NS", "RELIANCE.NS", "WIPRO.NS", "HDFCBANK.NS", "ITC.NS",
        "ICICIBANK.NS", "SBIN.NS", "HINDUNILVR.NS", "AXISBANK.NS", "KOTAKBANK.NS",
        "BAJFINANCE.NS", "BHARTIARTL.NS", "MARUTI.NS", "ASIANPAINT.NS", "ADANIENT.NS",
        "ADANIGREEN.NS", "ULTRACEMCO.NS", "TITAN.NS", "SUNPHARMA.NS", "ONGC.NS",
        "NTPC.NS", "POWERGRID.NS", "JSWSTEEL.NS", "TATAMOTORS.NS", "HEROMOTOCO.NS",
        "DRREDDY.NS", "DIVISLAB.NS", "COALINDIA.NS", "LT.NS", "GRASIM.NS",
        "EICHERMOT.NS", "BRITANNIA.NS", "CIPLA.NS", "BAJAJ-AUTO.NS", "INDUSINDBK.NS",
        "BPCL.NS", "HCLTECH.NS", "NESTLEIND.NS", "M&M.NS", "APOLLOHOSP.NS",
        "SHREECEM.NS", "UPL.NS", "TECHM.NS", "HINDALCO.NS", "SBICARD.NS"
    ]

    # Attempt to load from cache
    cached_data = load_cached_data()
    if cached_data:
        print("Loaded data from cache.")
        return filter_and_rank_stocks(cached_data, filter_query)

    # Fetch fresh data if cache is not available or expired
    print("Fetching fresh stock data...")
    fresh_data = fetch_stock_data(symbols)
    save_to_cache(fresh_data)
    screener_data = filter_and_rank_stocks(fresh_data, filter_query)
    return screener_data  # Return all data
