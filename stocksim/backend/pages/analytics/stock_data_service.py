import requests
import pandas as pd
import os

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")


def fetch_intraday_data(symbol, interval="5min"):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize=full&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    time_series_key = f"Time Series ({interval})"
    if time_series_key not in data:
        raise ValueError("Invalid API response for intraday data.")

    df = pd.DataFrame.from_dict(data[time_series_key], orient="index")

    df.rename(
        columns={
            "1. open": "Open",
            "2. high": "High",
            "3. low": "Low",
            "4. close": "4. close",
            "5. volume": "5. volume",
        },
        inplace=True,
    )

    df = df.astype(float)
    df.sort_index(inplace=True)
    return df
