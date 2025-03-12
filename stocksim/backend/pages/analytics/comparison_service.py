import pandas as pd
import numpy as np
import os
import glob
from .historical_data_service import load_stock_data, DATA_DIR


def get_sector_list():
    """Get list of available sectors based on stock data"""
    # This is a simplified approach - in a real application, you might have a separate database of sectors
    # For now, we'll use a predefined list of common Indian market sectors
    sectors = [
        "Technology",
        "Financial Services",
        "Healthcare",
        "Consumer Goods",
        "Industrial",
        "Energy",
        "Materials",
        "Utilities",
        "Real Estate",
        "Telecom",
    ]
    return sectors


def get_stocks_by_sector(sector):
    """Get list of stocks in a specific sector"""
    # This is a simplified approach - in a real application, you would query a database
    # For now, we'll return a predefined mapping
    sector_mapping = {
        "Technology": ["INFY", "TCS", "WIPRO", "HCLTECH"],
        "Financial Services": ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK"],
        "Healthcare": ["SUNPHARMA", "DRREDDY", "CIPLA", "DIVISLAB"],
        "Energy": ["RELIANCE", "ONGC", "IOC", "BPCL"],
        # Add more sectors as needed
    }

    return sector_mapping.get(sector, [])


def compare_stocks_performance(stock_names, exchanges, start_date=None, end_date=None):
    """Compare performance of multiple stocks

    Args:
        stock_names (list): List of stock names
        exchanges (list): List of exchanges corresponding to stock names
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Comparison data
    """
    if len(stock_names) != len(exchanges):
        return None

    comparison_data = {"dates": [], "stocks": {}}

    # Initialize with the first stock to get the date range
    first_stock_df = load_stock_data(stock_names[0], exchanges[0], start_date, end_date)

    if first_stock_df is None or len(first_stock_df) == 0:
        return None

    # Convert to datetime for calculations
    first_stock_df["Date"] = pd.to_datetime(first_stock_df["Date"])

    # Normalize to 100 at the start
    first_close = first_stock_df.iloc[0]["Close"]
    first_stock_df["Normalized"] = (first_stock_df["Close"] / first_close) * 100

    # Add to comparison data
    comparison_data["dates"] = first_stock_df["Date"].dt.strftime("%Y-%m-%d").tolist()
    comparison_data["stocks"][stock_names[0]] = {
        "normalized_prices": first_stock_df["Normalized"].tolist(),
        "exchange": exchanges[0],
        "start_price": float(first_close),
        "end_price": float(first_stock_df.iloc[-1]["Close"]),
        "percent_change": float(
            ((first_stock_df.iloc[-1]["Close"] / first_close) - 1) * 100
        ),
    }

    # Process the rest of the stocks
    for i in range(1, len(stock_names)):
        stock_df = load_stock_data(stock_names[i], exchanges[i], start_date, end_date)

        if stock_df is None or len(stock_df) == 0:
            continue

        # Convert to datetime for calculations
        stock_df["Date"] = pd.to_datetime(stock_df["Date"])

        # Ensure dates match with the first stock
        common_dates = set(first_stock_df["Date"]).intersection(set(stock_df["Date"]))
        if not common_dates:
            continue

        # Filter for common dates
        stock_df = stock_df[stock_df["Date"].isin(common_dates)]

        # Normalize to 100 at the start
        start_close = stock_df.iloc[0]["Close"]
        stock_df["Normalized"] = (stock_df["Close"] / start_close) * 100

        # Add to comparison data
        comparison_data["stocks"][stock_names[i]] = {
            "normalized_prices": stock_df["Normalized"].tolist(),
            "exchange": exchanges[i],
            "start_price": float(start_close),
            "end_price": float(stock_df.iloc[-1]["Close"]),
            "percent_change": float(
                ((stock_df.iloc[-1]["Close"] / start_close) - 1) * 100
            ),
        }

    return comparison_data


def compare_sector_performance(sector, start_date=None, end_date=None):
    """Compare performance of stocks within a sector

    Args:
        sector (str): Sector name
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Sector comparison data
    """
    stocks = get_stocks_by_sector(sector)

    if not stocks:
        return None

    # For simplicity, assume all stocks are from the same exchange (ns)
    exchanges = ["ns"] * len(stocks)

    return compare_stocks_performance(stocks, exchanges, start_date, end_date)
