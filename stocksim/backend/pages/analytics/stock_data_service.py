# stock_data_service.py

import yfinance as yf
import pandas as pd
import requests
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")


def fetch_stock_data(symbol, period="1mo", interval="1d"):
    """Fetch historical stock data using yfinance."""
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval)
    if df.empty:
        raise ValueError(f"No data available for {symbol}")
    return df[["Open", "High", "Low", "Close", "Volume"]]


def get_latest_price(symbol):
    """Get the latest stock price."""
    ticker = yf.Ticker(symbol)
    return round(ticker.info.get("regularMarketPrice", 0), 2)


def predict_closing_price(symbol):
    """Predict today's closing price based on current trend."""
    df = fetch_stock_data(symbol, period="1d", interval="5m")
    last_price = df["Close"].iloc[-1]
    avg_trend = df["Close"].pct_change().mean()
    predicted_close = last_price * (1 + avg_trend)
    return round(predicted_close, 2)


def get_stock_fundamentals(symbol):
    """Fetch stock fundamentals: market cap, P/E ratio, etc."""
    ticker = yf.Ticker(symbol)
    info = ticker.info
    return {
        "sector": info.get("sector", "N/A"),
        "market_cap": info.get("marketCap", "N/A"),
        "pe_ratio": info.get("trailingPE", "N/A"),
        "dividend_yield": info.get("dividendYield", "N/A"),
        "52_week_high": info.get("fiftyTwoWeekHigh", "N/A"),
        "52_week_low": info.get("fiftyTwoWeekLow", "N/A"),
    }


def get_similar_stocks(symbol):
    """Find similar stocks based on sector and market cap."""
    ticker = yf.Ticker(symbol)
    sector = ticker.info.get("sector", "N/A")
    market_cap = ticker.info.get("marketCap", 0)
    if sector == "N/A" or market_cap == 0:
        return []

    # Fetch S&P 500 components
    sp500 = yf.Ticker("^GSPC").history(period="1d").index.tolist()
    similar_stocks = []
    for stock in sp500:
        stock_ticker = yf.Ticker(stock)
        stock_info = stock_ticker.info
        if stock_info.get("sector") == sector:
            similar_stocks.append((stock, stock_info.get("marketCap", 0)))

    similar_stocks.sort(key=lambda x: abs(x[1] - market_cap))
    return [stock[0] for stock in similar_stocks[:5]]  # Return top 5 similar stocks


def get_options_data(symbol):
    """Fetch available expiration dates for options trading."""
    ticker = yf.Ticker(symbol)
    return ticker.options  # List of expiration dates


def get_sector_performance():
    url = f"https://www.alphavantage.co/query?function=SECTOR&apikey={ALPHAVANTAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()
    return data
