# analytics_service.py

import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


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


def predict_stock_price(symbol, prediction_type="daily"):
    """Predict stock closing price for today, this week, or this month."""
    df = fetch_stock_data(symbol, period="3mo", interval="1d")

    X = np.arange(len(df)).reshape(-1, 1)
    y = df["Close"].values

    model = LinearRegression()
    model.fit(X, y)

    if prediction_type == "daily":
        next_day = len(df)
        return round(model.predict([[next_day]])[0], 2)
    elif prediction_type == "weekly":
        next_week = len(df) + 7
        return round(model.predict([[next_week]])[0], 2)
    elif prediction_type == "monthly":
        next_month = len(df) + 30
        return round(model.predict([[next_month]])[0], 2)

    return 0.0


def compute_rsi(data, period=14):
    """Calculate the Relative Strength Index (RSI)."""
    delta = data.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss.replace(0, pd.NA)
    return 100 - (100 / (1 + rs))


def compute_macd(data, fast_period=12, slow_period=26, signal_period=9):
    """Calculate MACD and Signal line."""
    fast_ema = data.ewm(span=fast_period, adjust=False).mean()
    slow_ema = data.ewm(span=slow_period, adjust=False).mean()
    macd = fast_ema - slow_ema
    signal = macd.ewm(span=signal_period, adjust=False).mean()
    return macd, signal


def generate_trading_signals(symbol):
    """Generate buy/sell signals using RSI, MACD, and Moving Averages."""
    df = fetch_stock_data(symbol, period="1mo", interval="1d")
    df["SMA_20"] = df["Close"].rolling(window=20).mean()
    df["RSI"] = compute_rsi(df["Close"])
    macd, macd_signal = compute_macd(df["Close"])
    df["MACD"], df["MACD_Signal"] = macd, macd_signal

    signals = []
    if df["Close"].iloc[-1] > df["SMA_20"].iloc[-1]:
        signals.append("Bullish: Price above 20-day SMA")
    if df["RSI"].iloc[-1] < 30:
        signals.append("Oversold: Possible buy opportunity")
    elif df["RSI"].iloc[-1] > 70:
        signals.append("Overbought: Possible sell opportunity")
    if macd.iloc[-1] > macd_signal.iloc[-1]:
        signals.append("Bullish: MACD above Signal line")
    else:
        signals.append("Bearish: MACD below Signal line")
    return signals


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


def compare_stocks(stock1, stock2):
    """Compare two stocks based on fundamentals and performance."""
    stock1_data = get_stock_fundamentals(stock1)
    stock2_data = get_stock_fundamentals(stock2)
    return {
        stock1: stock1_data,
        stock2: stock2_data,
    }


def get_options_data(symbol):
    """Fetch available expiration dates for options trading."""
    ticker = yf.Ticker(symbol)
    return ticker.options  # List of expiration dates
