# File: backend/pages/market/market_service.py
import yfinance as yf
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict

CACHE_FILE = "stock_data.json"
CACHE_EXPIRY_DAYS = 1


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


def filter_and_rank_stocks(data: List[Dict], filter_query: str) -> List[Dict]:
    """
    Filters and ranks stock data based on the query.
    Parameters:
        data: List of stock dictionaries with keys like 'symbol', 'pe_ratio', 'beta', 'dividend_yield', etc.
        filter_query: A string indicating the filtering criteria ("growth", "stability", "dividend", or a custom symbol search).
    Returns:
        A list of the top 6 stocks after filtering and ranking.
    """
    # Define filtering criteria for predefined queries
    criteria_map = {
        "growth": lambda stock: stock.get("pe_ratio", 0) > 20,
        "stability": lambda stock: stock.get("beta", float('inf')) < 1,
        "dividend": lambda stock: stock.get("dividend_yield", 0) > 0.03,
    }

    # Determine filtering function
    filter_func = criteria_map.get(filter_query.lower(),
                                   lambda stock: filter_query.lower() in stock.get("symbol", "").lower())

    # Apply filtering
    data = [stock for stock in data if filter_func(stock)]

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

    return data[:6]  # Return top 6 results



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
