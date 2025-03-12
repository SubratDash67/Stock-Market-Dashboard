import pandas as pd
import numpy as np
from .historical_data_service import load_stock_data


def calculate_rsi(stock_name, exchange, period=14, start_date=None, end_date=None):
    """Calculate Relative Strength Index (RSI)

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        period (int): Period for RSI calculation (default: 14)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        list: RSI data
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None or len(df) < period:
        return None

    # Convert date back to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate price changes
    df["Price_Change"] = df["Close"].diff()

    # Calculate gains and losses
    df["Gain"] = df["Price_Change"].apply(lambda x: x if x > 0 else 0)
    df["Loss"] = df["Price_Change"].apply(lambda x: abs(x) if x < 0 else 0)

    # Calculate average gains and losses
    df["Avg_Gain"] = df["Gain"].rolling(window=period).mean()
    df["Avg_Loss"] = df["Loss"].rolling(window=period).mean()

    # Calculate RS and RSI
    df["RS"] = df["Avg_Gain"] / df["Avg_Loss"]
    df["RSI"] = 100 - (100 / (1 + df["RS"]))

    # Drop NaN values
    df = df.dropna()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Extract RSI data
    rsi_data = df[["Date", "Close", "RSI"]].to_dict("records")

    return rsi_data


def calculate_macd(
    stock_name,
    exchange,
    fast_period=12,
    slow_period=26,
    signal_period=9,
    start_date=None,
    end_date=None,
):
    """Calculate Moving Average Convergence Divergence (MACD)

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        fast_period (int): Fast period for MACD calculation (default: 12)
        slow_period (int): Slow period for MACD calculation (default: 26)
        signal_period (int): Signal period for MACD calculation (default: 9)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        list: MACD data
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None or len(df) < slow_period + signal_period:
        return None

    # Convert date back to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate EMAs
    df["EMA_fast"] = df["Close"].ewm(span=fast_period, adjust=False).mean()
    df["EMA_slow"] = df["Close"].ewm(span=slow_period, adjust=False).mean()

    # Calculate MACD and Signal Line
    df["MACD"] = df["EMA_fast"] - df["EMA_slow"]
    df["Signal_Line"] = df["MACD"].ewm(span=signal_period, adjust=False).mean()

    # Calculate MACD Histogram
    df["MACD_Histogram"] = df["MACD"] - df["Signal_Line"]

    # Drop NaN values
    df = df.dropna()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Extract MACD data
    macd_data = df[["Date", "Close", "MACD", "Signal_Line", "MACD_Histogram"]].to_dict(
        "records"
    )

    return macd_data


def calculate_bollinger_bands(
    stock_name, exchange, period=20, std_dev=2, start_date=None, end_date=None
):
    """Calculate Bollinger Bands

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        period (int): Period for Bollinger Bands calculation (default: 20)
        std_dev (int): Number of standard deviations (default: 2)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        list: Bollinger Bands data
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None or len(df) < period:
        return None

    # Convert date back to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate middle band (SMA)
    df["Middle_Band"] = df["Close"].rolling(window=period).mean()

    # Calculate standard deviation
    df["Std_Dev"] = df["Close"].rolling(window=period).std()

    # Calculate upper and lower bands
    df["Upper_Band"] = df["Middle_Band"] + (df["Std_Dev"] * std_dev)
    df["Lower_Band"] = df["Middle_Band"] - (df["Std_Dev"] * std_dev)

    # Drop NaN values
    df = df.dropna()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Extract Bollinger Bands data
    bb_data = df[["Date", "Close", "Upper_Band", "Middle_Band", "Lower_Band"]].to_dict(
        "records"
    )

    return bb_data
