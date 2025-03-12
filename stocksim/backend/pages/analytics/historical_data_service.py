import os
import pandas as pd
import numpy as np
from datetime import datetime
import glob

# Base directory for stock data
DATA_DIR = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\cleaned_data"


def get_stock_list():
    """Get list of available stocks from the data directory"""
    stock_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
    stocks = []

    for file in stock_files:
        filename = os.path.basename(file)
        # Extract stock name and exchange
        if "-bo.csv" in filename or "-ns.csv" in filename:
            stock_name = filename.replace("-bo.csv", "").replace("-ns.csv", "")
            exchange = "bo" if "-bo.csv" in filename else "ns"
            stocks.append({"name": stock_name, "exchange": exchange})

    return stocks


# In historical_data_service.py, modify the load_stock_data function:


def load_stock_data(stock_name, exchange, start_date=None, end_date=None):
    """Load stock data from CSV file"""
    file_path = os.path.join(DATA_DIR, f"{stock_name}-{exchange}.csv")

    if not os.path.exists(file_path):
        return None

    # Load data
    df = pd.read_csv(file_path)

    # Convert date format - use format='mixed' to handle various formats
    df["Date"] = pd.to_datetime(df["Date"], format="mixed", dayfirst=True)

    # Filter by date range if provided
    if start_date:
        start_date = pd.to_datetime(start_date)
        df = df[df["Date"] >= start_date]

    if end_date:
        end_date = pd.to_datetime(end_date)
        df = df[df["Date"] <= end_date]

    # Sort by date
    df = df.sort_values("Date")

    # Convert back to string format for JSON serialization
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    return df


def get_ohlc_data(stock_name, exchange, start_date=None, end_date=None):
    """Get OHLC data for a stock"""
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None:
        return None

    # Extract OHLC data
    ohlc_data = df[["Date", "Open", "High", "Low", "Close"]].to_dict("records")

    return ohlc_data


def get_volume_data(stock_name, exchange, start_date=None, end_date=None):
    """Get volume data for a stock"""
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None:
        return None

    # Extract volume data
    volume_data = df[["Date", "Volume"]].to_dict("records")

    return volume_data


def calculate_moving_average(
    stock_name, exchange, window, ma_type="simple", start_date=None, end_date=None
):
    """Calculate moving average for a stock

    Args:
        stock_name (str): Name of the stock
        exchange (str): Exchange (bo or ns)
        window (int): Window size for moving average
        ma_type (str): Type of moving average ('simple' or 'exponential')
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        list: Moving average data
    """
    df = load_stock_data(stock_name, exchange, start_date, end_date)

    if df is None:
        return None

    # Convert date back to datetime for calculation
    df["Date"] = pd.to_datetime(df["Date"])

    # Calculate moving average
    if ma_type.lower() == "simple":
        df[f"MA_{window}"] = df["Close"].rolling(window=window).mean()
    elif ma_type.lower() == "exponential":
        df[f"MA_{window}"] = df["Close"].ewm(span=window, adjust=False).mean()
    else:
        return None

    # Drop NaN values
    df = df.dropna()

    # Convert date back to string
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Extract moving average data
    ma_data = df[["Date", f"MA_{window}", "Close"]].to_dict("records")

    return ma_data
