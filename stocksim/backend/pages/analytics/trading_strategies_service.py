import pandas as pd
import numpy as np
from .historical_data_service import load_stock_data
from .technical_indicators_service import (
    calculate_bollinger_bands,
    calculate_rsi,
    calculate_macd,
)


def identify_trend_following_signals(
    stock_name, exchange, fast_period=20, slow_period=50, start_date=None, end_date=None
):
    """Identify trend following signals based on moving averages

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        fast_period (int): Fast period for moving average (default: 20)
        slow_period (int): Slow period for moving average (default: 50)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Trend following signals
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None or len(df) < slow_period:
        return None

    # Convert date to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate moving averages
    df["MA_Fast"] = df["Close"].rolling(window=fast_period).mean()
    df["MA_Slow"] = df["Close"].rolling(window=slow_period).mean()

    # Calculate signals
    df["Signal"] = 0
    df.loc[df["MA_Fast"] > df["MA_Slow"], "Signal"] = 1  # Buy signal
    df.loc[df["MA_Fast"] < df["MA_Slow"], "Signal"] = -1  # Sell signal

    # Calculate signal changes
    df["Signal_Change"] = df["Signal"].diff()

    # Identify buy and sell points
    buy_points = df[df["Signal_Change"] == 1].copy()
    sell_points = df[df["Signal_Change"] == -1].copy()

    # Drop NaN values
    df = df.dropna()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    buy_points["Date"] = buy_points["Date"].dt.strftime("%Y-%m-%d")
    sell_points["Date"] = sell_points["Date"].dt.strftime("%Y-%m-%d")

    # Extract trend following data
    trend_data = {
        "data": df[["Date", "Close", "MA_Fast", "MA_Slow", "Signal"]].to_dict(
            "records"
        ),
        "buy_signals": buy_points[["Date", "Close"]].to_dict("records"),
        "sell_signals": sell_points[["Date", "Close"]].to_dict("records"),
    }

    return trend_data


def identify_support_resistance_levels(
    stock_name, exchange, period=20, threshold=0.03, start_date=None, end_date=None
):
    """Identify support and resistance levels

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        period (int): Period for identifying levels (default: 20)
        threshold (float): Threshold for identifying levels (default: 0.03)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Support and resistance levels
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None or len(df) < period:
        return None

    # Convert date to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Function to identify if a point is a pivot
    def is_pivot(df, i, period):
        if i - period < 0 or i + period >= len(df):
            return False

        pivot_high = True
        pivot_low = True

        for j in range(i - period, i + period + 1):
            if df.iloc[j]["High"] > df.iloc[i]["High"]:
                pivot_high = False
            if df.iloc[j]["Low"] < df.iloc[i]["Low"]:
                pivot_low = False

        return pivot_high or pivot_low

    # Identify pivot points
    pivot_points = []
    for i in range(len(df)):
        if is_pivot(df, i, period):
            pivot_points.append(
                {
                    "date": df.iloc[i]["Date"].strftime("%Y-%m-%d"),
                    "high": float(df.iloc[i]["High"]),
                    "low": float(df.iloc[i]["Low"]),
                    "close": float(df.iloc[i]["Close"]),
                }
            )

    # Identify support and resistance levels
    support_levels = []
    resistance_levels = []

    for i in range(len(pivot_points) - 1):
        for j in range(i + 1, len(pivot_points)):
            # Check if levels are close enough
            if (
                abs(pivot_points[i]["low"] - pivot_points[j]["low"])
                / pivot_points[i]["low"]
                < threshold
            ):
                level = (pivot_points[i]["low"] + pivot_points[j]["low"]) / 2
                support_levels.append(
                    {
                        "level": float(level),
                        "start_date": pivot_points[i]["date"],
                        "end_date": pivot_points[j]["date"],
                    }
                )

            if (
                abs(pivot_points[i]["high"] - pivot_points[j]["high"])
                / pivot_points[i]["high"]
                < threshold
            ):
                level = (pivot_points[i]["high"] + pivot_points[j]["high"]) / 2
                resistance_levels.append(
                    {
                        "level": float(level),
                        "start_date": pivot_points[i]["date"],
                        "end_date": pivot_points[j]["date"],
                    }
                )

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Extract support and resistance data
    sr_data = {
        "data": df[["Date", "Open", "High", "Low", "Close"]].to_dict("records"),
        "pivot_points": pivot_points,
        "support_levels": support_levels,
        "resistance_levels": resistance_levels,
    }

    return sr_data


def identify_momentum_signals(
    stock_name,
    exchange,
    rsi_period=14,
    rsi_overbought=70,
    rsi_oversold=30,
    start_date=None,
    end_date=None,
):
    """Identify momentum trading signals based on RSI

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        rsi_period (int): Period for RSI calculation (default: 14)
        rsi_overbought (int): RSI overbought level (default: 70)
        rsi_oversold (int): RSI oversold level (default: 30)
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Momentum signals
    """
    # Get RSI data
    rsi_data = calculate_rsi(stock_name, exchange, rsi_period, start_date, end_date)

    if rsi_data is None:
        return None

    # Convert to DataFrame for easier processing
    df = pd.DataFrame(rsi_data)

    # Convert date to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate signals
    df["Signal"] = 0
    df.loc[df["RSI"] < rsi_oversold, "Signal"] = 1  # Buy signal (oversold)
    df.loc[df["RSI"] > rsi_overbought, "Signal"] = -1  # Sell signal (overbought)

    # Calculate signal changes
    df["Signal_Change"] = df["Signal"].diff()

    # Identify buy and sell points
    buy_points = df[(df["Signal"] == 1) & (df["Signal_Change"] != 0)].copy()
    sell_points = df[(df["Signal"] == -1) & (df["Signal_Change"] != 0)].copy()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    buy_points["Date"] = buy_points["Date"].dt.strftime("%Y-%m-%d")
    sell_points["Date"] = sell_points["Date"].dt.strftime("%Y-%m-%d")

    # Extract momentum data
    momentum_data = {
        "data": df[["Date", "Close", "RSI", "Signal"]].to_dict("records"),
        "buy_signals": buy_points[["Date", "Close", "RSI"]].to_dict("records"),
        "sell_signals": sell_points[["Date", "Close", "RSI"]].to_dict("records"),
    }

    return momentum_data
