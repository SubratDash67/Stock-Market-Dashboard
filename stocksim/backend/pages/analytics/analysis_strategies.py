import pandas as pd
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from io import BytesIO
import base64


def calculate_moving_averages(df, short_window=20, long_window=50):
    """
    Calculate moving averages for a stock

    Args:
        df (pandas.DataFrame): Stock data
        short_window (int): Short window size
        long_window (int): Long window size

    Returns:
        pandas.DataFrame: DataFrame with moving averages
    """
    if df is None or df.empty:
        return None

    # Create a copy of the dataframe
    result_df = df.copy()

    # Calculate moving averages
    result_df[f"SMA_{short_window}"] = (
        result_df["Close"].rolling(window=short_window, min_periods=1).mean()
    )
    result_df[f"SMA_{long_window}"] = (
        result_df["Close"].rolling(window=long_window, min_periods=1).mean()
    )

    # Generate buy/sell signals
    result_df["Signal"] = 0
    result_df.loc[short_window:, "Signal"] = np.where(
        result_df.loc[short_window:, f"SMA_{short_window}"]
        > result_df.loc[short_window:, f"SMA_{long_window}"],
        1,
        0,
    )

    result_df["Position"] = result_df["Signal"].diff()

    return result_df


def calculate_rsi(df, window=14):
    """
    Calculate Relative Strength Index (RSI)

    Args:
        df (pandas.DataFrame): Stock data
        window (int): RSI window size

    Returns:
        pandas.DataFrame: DataFrame with RSI
    """
    if df is None or df.empty:
        return None

    # Create a copy of the dataframe
    result_df = df.copy()

    # Calculate price changes
    delta = result_df["Close"].diff()

    # Separate gains and losses
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    # Calculate average gain and loss
    avg_gain = gain.rolling(window=window, min_periods=1).mean()
    avg_loss = loss.rolling(window=window, min_periods=1).mean()

    # Calculate RS and RSI
    rs = avg_gain / avg_loss
    result_df["RSI"] = 100 - (100 / (1 + rs))

    # Generate overbought/oversold signals
    result_df["RSI_Signal"] = 0
    result_df["RSI_Signal"] = np.where(
        result_df["RSI"] > 70, -1, result_df["RSI_Signal"]
    )  # Overbought
    result_df["RSI_Signal"] = np.where(
        result_df["RSI"] < 30, 1, result_df["RSI_Signal"]
    )  # Oversold

    return result_df


def generate_ma_chart(df, short_window=20, long_window=50):
    """Generate a moving average crossover chart"""
    if df is None or df.empty:
        return None

    # Calculate moving averages if not already present
    if (
        f"SMA_{short_window}" not in df.columns
        or f"SMA_{long_window}" not in df.columns
    ):
        df = calculate_moving_averages(df, short_window, long_window)

    # Create a new figure
    plt.figure(figsize=(12, 6))

    # Plot close price and moving averages
    plt.plot(df["Date"], df["Close"], label="Close Price")
    plt.plot(df["Date"], df[f"SMA_{short_window}"], label=f"{short_window}-day SMA")
    plt.plot(df["Date"], df[f"SMA_{long_window}"], label=f"{long_window}-day SMA")

    # Plot buy/sell signals
    buy_signals = df[df["Position"] == 1]
    sell_signals = df[df["Position"] == -1]

    plt.scatter(
        buy_signals["Date"],
        buy_signals["Close"],
        marker="^",
        color="g",
        label="Buy Signal",
    )
    plt.scatter(
        sell_signals["Date"],
        sell_signals["Close"],
        marker="v",
        color="r",
        label="Sell Signal",
    )

    plt.title(f"Moving Average Crossover Strategy ({short_window}/{long_window})")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.legend()
    plt.grid(True)

    # Convert plot to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    image_png = buffer.getvalue()
    buffer.close()
    plt.close()

    return base64.b64encode(image_png).decode("utf-8")


def generate_rsi_chart(df, window=14):
    """Generate an RSI chart"""
    if df is None or df.empty:
        return None

    # Calculate RSI if not already present
    if "RSI" not in df.columns:
        df = calculate_rsi(df, window)

    # Create a new figure with 2 subplots
    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(12, 8), gridspec_kw={"height_ratios": [3, 1]}
    )

    # Plot close price
    ax1.plot(df["Date"], df["Close"], label="Close Price")
    ax1.set_title("Stock Price and RSI")
    ax1.set_ylabel("Price")
    ax1.grid(True)
    ax1.legend()

    # Plot RSI
    ax2.plot(df["Date"], df["RSI"], label=f"RSI ({window})", color="purple")
    ax2.axhline(y=70, color="r", linestyle="-", alpha=0.3)
    ax2.axhline(y=30, color="g", linestyle="-", alpha=0.3)
    ax2.fill_between(
        df["Date"], df["RSI"], 70, where=(df["RSI"] >= 70), color="r", alpha=0.3
    )
    ax2.fill_between(
        df["Date"], df["RSI"], 30, where=(df["RSI"] <= 30), color="g", alpha=0.3
    )
    ax2.set_ylabel("RSI")
    ax2.set_xlabel("Date")
    ax2.grid(True)
    ax2.legend()

    plt.tight_layout()

    # Convert plot to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    image_png = buffer.getvalue()
    buffer.close()
    plt.close()

    return base64.b64encode(image_png).decode("utf-8")
