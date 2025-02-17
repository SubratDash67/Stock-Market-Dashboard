# stock_data_service.py

import yfinance as yf
import pandas as pd


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
    if sector == "N/A":
        return []
    # This is a placeholder. In a real application, you'd need a comprehensive list of stocks.
    sp500 = yf.Ticker("^GSPC").info.get("components", [])[
        :100
    ]  # Get top 100 S&P 500 components
    similar = [s for s in sp500 if yf.Ticker(s).info.get("sector") == sector]
    return similar[:5]  # Return top 5 similar stocks


def get_options_data(symbol):
    """Fetch available expiration dates for options trading."""
    ticker = yf.Ticker(symbol)
    return ticker.options  # List of expiration dates
