import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta

# Update paths to the Nifty and Sensex CSV files
NIFTY_FILE = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\nifty\NIFTY 50.csv"
SENSEX_FILE = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\nifty\SENSEX.csv"

# Cache directory for market data
CACHE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "cache"
)
os.makedirs(CACHE_DIR, exist_ok=True)


def get_nifty_sensex_data(start_date=None, end_date=None):
    """Get historical Nifty and Sensex data

    Args:
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: Nifty and Sensex historical data
    """
    # Load Nifty data
    nifty_data = []
    if os.path.exists(NIFTY_FILE):
        try:
            # Read the CSV file
            df = pd.read_csv(NIFTY_FILE)

            # Check if 'Date' is in the index
            if "Date" not in df.columns and df.index.name == "Date":
                df = df.reset_index()

            # Convert date format - try different formats since the file structure might vary
            try:
                df["Date"] = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")
            except:
                print("Failed first date conversion attempt, trying alternative format")

            # Filter by date range if provided
            if start_date:
                start_date = pd.to_datetime(start_date)
                df = df[df["Date"] >= start_date]

            if end_date:
                end_date = pd.to_datetime(end_date)
                df = df[df["Date"] <= end_date]

            # Sort by date
            df = df.sort_values("Date")

            # Convert to the format needed for the API response
            for _, row in df.iterrows():
                nifty_data.append(
                    {
                        "date": row["Date"].strftime("%Y-%m-%d"),
                        "close": float(row["Close"]),
                        "open": float(row["Open"]),
                        "high": float(row["High"]),
                        "low": float(row["Low"]),
                        "volume": (
                            str(row["Volume"])
                            if "Volume" in row and not pd.isna(row["Volume"])
                            else "N/A"
                        ),
                        "change_percent": 0.0,  # Calculate this if needed
                    }
                )

            print(f"Successfully loaded {len(nifty_data)} Nifty records")
        except Exception as e:
            print(f"Error loading Nifty data: {e}")

            # Fallback to sample data if file reading fails
            nifty_data = [
                {
                    "date": "2012-09-07",
                    "close": 4494.65,
                    "open": 4518.45,
                    "high": 4549.05,
                    "low": 4482.85,
                    "volume": "0",
                    "change_percent": 0.0,
                },
                {
                    "date": "2012-09-18",
                    "close": 4546.20,
                    "open": 4494.10,
                    "high": 4551.80,
                    "low": 4481.55,
                    "volume": "0",
                    "change_percent": 1.15,
                },
            ]
    else:
        print(f"Nifty file not found at {NIFTY_FILE}")
        # Use sample data if file doesn't exist
        nifty_data = [
            {
                "date": "2012-09-07",
                "close": 4494.65,
                "open": 4518.45,
                "high": 4549.05,
                "low": 4482.85,
                "volume": "0",
                "change_percent": 0.0,
            },
            {
                "date": "2012-09-18",
                "close": 4546.20,
                "open": 4494.10,
                "high": 4551.80,
                "low": 4481.55,
                "volume": "0",
                "change_percent": 1.15,
            },
        ]

    # Load Sensex data with similar approach
    sensex_data = []
    if os.path.exists(SENSEX_FILE):
        try:
            # Read the CSV file
            df = pd.read_csv(SENSEX_FILE)

            # Check if 'Date' is in the index
            if "Date" not in df.columns and df.index.name == "Date":
                df = df.reset_index()

            # Convert date format
            try:
                df["Date"] = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")
            except:
                print(
                    "Failed first date conversion attempt for Sensex, trying alternative format"
                )

            # Filter by date range if provided
            if start_date:
                start_date = pd.to_datetime(start_date)
                df = df[df["Date"] >= start_date]

            if end_date:
                end_date = pd.to_datetime(end_date)
                df = df[df["Date"] <= end_date]

            # Sort by date
            df = df.sort_values("Date")

            # Convert to the format needed for the API response
            for _, row in df.iterrows():
                sensex_data.append(
                    {
                        "date": row["Date"].strftime("%Y-%m-%d"),
                        "close": float(row["Close"]),
                        "open": float(row["Open"]),
                        "high": float(row["High"]),
                        "low": float(row["Low"]),
                        "volume": (
                            str(row["Volume"])
                            if "Volume" in row and not pd.isna(row["Volume"])
                            else "N/A"
                        ),
                        "change_percent": 0.0,  # Calculate this if needed
                    }
                )

            print(f"Successfully loaded {len(sensex_data)} Sensex records")
        except Exception as e:
            print(f"Error loading Sensex data: {e}")

            # Fallback to sample data if file reading fails
            sensex_data = [
                {
                    "date": "2012-07-01",
                    "close": 4300.86,
                    "open": 4263.11,
                    "high": 4301.77,
                    "low": 4247.66,
                    "volume": "0",
                    "change_percent": 0.0,
                },
                {
                    "date": "2012-07-02",
                    "close": 4333.90,
                    "open": 4302.96,
                    "high": 4395.31,
                    "low": 4295.40,
                    "volume": "0",
                    "change_percent": 0.77,
                },
            ]
    else:
        print(f"Sensex file not found at {SENSEX_FILE}")
        # Use sample data if file doesn't exist
        sensex_data = [
            {
                "date": "2012-07-01",
                "close": 4300.86,
                "open": 4263.11,
                "high": 4301.77,
                "low": 4247.66,
                "volume": "0",
                "change_percent": 0.0,
            },
            {
                "date": "2012-07-02",
                "close": 4333.90,
                "open": 4302.96,
                "high": 4395.31,
                "low": 4295.40,
                "volume": "0",
                "change_percent": 0.77,
            },
        ]

    return {"nifty": nifty_data, "sensex": sensex_data}


def get_fii_dii_data(start_date=None, end_date=None):
    """Get FII/DII activity data (sample data)

    Args:
        start_date (str, optional): Start date in YYYY-MM-DD format
        end_date (str, optional): End date in YYYY-MM-DD format

    Returns:
        dict: FII/DII activity data
    """
    # Cache file path
    fii_dii_cache_file = os.path.join(CACHE_DIR, "fii_dii_data.json")

    # Check if cache file exists and is recent (less than 1 day old)
    fii_dii_data = None

    if os.path.exists(fii_dii_cache_file):
        file_age = datetime.now() - datetime.fromtimestamp(
            os.path.getmtime(fii_dii_cache_file)
        )
        if file_age.days < 1:
            with open(fii_dii_cache_file, "r") as f:
                fii_dii_data = json.load(f)

    # If data not in cache, create sample data based on recent trends
    if fii_dii_data is None:
        # Note: This is sample data as we don't have real FII/DII data
        fii_dii_data = [
            {
                "date": "2025-03-12",
                "fii": {
                    "gross_purchase": 28500.45,
                    "gross_sales": 35200.78,
                    "net": -6700.33,
                },
                "dii": {
                    "gross_purchase": 32450.67,
                    "gross_sales": 25300.89,
                    "net": 7149.78,
                },
            },
            {
                "date": "2025-03-11",
                "fii": {
                    "gross_purchase": 27800.23,
                    "gross_sales": 33450.56,
                    "net": -5650.33,
                },
                "dii": {
                    "gross_purchase": 30250.45,
                    "gross_sales": 24150.67,
                    "net": 6099.78,
                },
            },
            {
                "date": "2025-03-10",
                "fii": {
                    "gross_purchase": 29450.67,
                    "gross_sales": 36700.89,
                    "net": -7250.22,
                },
                "dii": {
                    "gross_purchase": 33600.34,
                    "gross_sales": 26800.56,
                    "net": 6799.78,
                },
            },
            {
                "date": "2025-03-09",
                "fii": {
                    "gross_purchase": 26900.34,
                    "gross_sales": 32150.67,
                    "net": -5250.33,
                },
                "dii": {
                    "gross_purchase": 29800.56,
                    "gross_sales": 23450.78,
                    "net": 6349.78,
                },
            },
            {
                "date": "2025-03-08",
                "fii": {
                    "gross_purchase": 28100.56,
                    "gross_sales": 34300.78,
                    "net": -6200.22,
                },
                "dii": {
                    "gross_purchase": 31200.89,
                    "gross_sales": 24900.34,
                    "net": 6300.55,
                },
            },
        ]

        # Add monthly summary based on 2025 data
        monthly_summary = [
            {
                "period": "2025-till-date",
                "fii": {
                    "gross_purchase": 554218.13,
                    "gross_sales": 716082.44,
                    "net": -161864.31,
                },
                "dii": {
                    "gross_purchase": 686560.51,
                    "gross_sales": 514164.63,
                    "net": 172395.88,
                },
            },
            {
                "period": "February-2025",
                "fii": {
                    "gross_purchase": 259256.89,
                    "gross_sales": 318244.97,
                    "net": -58988.08,
                },
                "dii": {
                    "gross_purchase": 277187.00,
                    "gross_sales": 212333.81,
                    "net": 64853.19,
                },
            },
            {
                "period": "January-2025",
                "fii": {
                    "gross_purchase": 242699.59,
                    "gross_sales": 330074.25,
                    "net": -87374.66,
                },
                "dii": {
                    "gross_purchase": 339689.44,
                    "gross_sales": 253097.64,
                    "net": 86591.80,
                },
            },
        ]

        # Save to cache
        with open(fii_dii_cache_file, "w") as f:
            json.dump({"daily": fii_dii_data, "monthly": monthly_summary}, f)

    # Filter by date range if provided
    if start_date or end_date:
        filtered_data = {"daily": [], "monthly": fii_dii_data.get("monthly", [])}

        for item in fii_dii_data.get("daily", []):
            item_date = datetime.strptime(item["date"], "%Y-%m-%d")

            if start_date:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                if item_date < start:
                    continue

            if end_date:
                end = datetime.strptime(end_date, "%Y-%m-%d")
                if item_date > end:
                    continue

            filtered_data["daily"].append(item)

        return filtered_data

    return (
        fii_dii_data
        if isinstance(fii_dii_data, dict)
        else {"daily": fii_dii_data, "monthly": []}
    )
