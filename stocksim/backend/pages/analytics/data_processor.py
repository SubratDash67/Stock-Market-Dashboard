import os
import pandas as pd
import numpy as np
from datetime import datetime


def load_stock_data(stock_name, exchange):
    """
    Load stock data from CSV file

    Args:
      stock_name (str): Name of the stock
      exchange (str): Exchange code (ns or bo)

    Returns:
      pandas.DataFrame: Stock data or None if file not found
    """
    base_path = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\cleaned_data"
    file_path = os.path.join(base_path, f"{stock_name}-{exchange}.csv")

    try:
        # Read CSV file
        df = pd.read_csv(file_path)

        # Convert date string to datetime object - using format='mixed' to infer the format
        df["Date"] = pd.to_datetime(df["Date"], format="mixed")

        # Sort by date
        df = df.sort_values("Date")

        # Filter out rows with missing data
        df = df.dropna(subset=["Open", "High", "Low", "Close", "Volume"])

        return df
    except Exception as e:
        print(f"Error loading stock data: {e}")
        return None


def get_stock_date_range(stock_name, exchange):
    """Get the date range for a stock"""
    df = load_stock_data(stock_name, exchange)
    if df is not None and not df.empty:
        start_date = df["Date"].min().strftime("%Y-%m-%d")
        end_date = df["Date"].max().strftime("%Y-%m-%d")
        return start_date, end_date
    return None, None


def filter_stock_data_by_date(df, start_date, end_date):
    """Filter stock data by date range"""
    if df is None or df.empty:
        return None

    # Convert string dates to datetime if they're not already
    if isinstance(start_date, str):
        start_date = pd.to_datetime(start_date)
    if isinstance(end_date, str):
        end_date = pd.to_datetime(end_date)

    # Filter data
    filtered_df = df[(df["Date"] >= start_date) & (df["Date"] <= end_date)]
    return filtered_df
