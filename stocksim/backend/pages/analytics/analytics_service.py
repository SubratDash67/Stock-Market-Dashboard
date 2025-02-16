import os
import numpy as np
import tensorflow as tf
import joblib

from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands
from ta.volume import VolumeWeightedAveragePrice
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64

import requests
import os

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")


def fetch_sma(symbol, interval="daily", time_period=20):
    url = f"https://www.alphavantage.co/query?function=SMA&symbol={symbol}&interval={interval}&time_period={time_period}&series_type=close&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "Technical Analysis: SMA" not in data:
        raise ValueError("Invalid API response for SMA")

    return float(list(data["Technical Analysis: SMA"].values())[0]["SMA"])


def fetch_ema(symbol, interval="daily", time_period=10):
    url = f"https://www.alphavantage.co/query?function=EMA&symbol={symbol}&interval={interval}&time_period={time_period}&series_type=close&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "Technical Analysis: EMA" not in data:
        raise ValueError("Invalid API response for EMA")

    return float(list(data["Technical Analysis: EMA"].values())[0]["EMA"])


def fetch_rsi(symbol, interval="daily", time_period=14):
    url = f"https://www.alphavantage.co/query?function=RSI&symbol={symbol}&interval={interval}&time_period={time_period}&series_type=close&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "Technical Analysis: RSI" not in data:
        raise ValueError("Invalid API response for RSI")

    return float(list(data["Technical Analysis: RSI"].values())[0]["RSI"])


def predict_closing_price(symbol, prediction_type="intraday"):
    interval_mapping = {"intraday": "daily", "weekly": "weekly", "monthly": "monthly"}

    interval = interval_mapping.get(prediction_type, "daily")

    sma = fetch_sma(symbol, interval=interval)
    ema = fetch_ema(symbol, interval=interval)

    predicted_price = (sma + ema) / 2  # Simple average of SMA & EMA
    return predicted_price


def generate_historical_charts(stock_name):
    base_dir = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\cleaned_data"
    bo_path = os.path.join(base_dir, f"{stock_name}-bo.csv")
    ns_path = os.path.join(base_dir, f"{stock_name}-ns.csv")

    try:
        df_bo = pd.read_csv(bo_path, parse_dates=["Date"])
        df_ns = pd.read_csv(ns_path, parse_dates=["Date"])
    except FileNotFoundError:
        raise FileNotFoundError(f"Data for {stock_name} not found.")

    df = pd.concat([df_bo, df_ns]).sort_values(by="Date").reset_index(drop=True)
    df["SMA_20"] = df["Close"].rolling(window=20).mean()

    delta = df["Close"].diff(1)
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    df["RSI"] = 100 - (100 / (1 + rs))

    exp1 = df["Close"].ewm(span=12, adjust=False).mean()
    exp2 = df["Close"].ewm(span=26, adjust=False).mean()
    df["MACD"] = exp1 - exp2
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    df["Cumulative_Volume"] = df["Volume"].cumsum()
    df["Cumulative_Price_Volume"] = (df["Close"] * df["Volume"]).cumsum()
    df["VWAP"] = df["Cumulative_Price_Volume"] / df["Cumulative_Volume"]

    charts = {}

    for metric, title in zip(
        ["Close", "RSI", "MACD", "VWAP"], ["Close Price & SMA", "RSI", "MACD", "VWAP"]
    ):
        plt.figure(figsize=(14, 4))
        plt.plot(df["Date"], df[metric], label=metric, alpha=0.7)
        plt.title(f"{stock_name} - {title}")
        plt.xlabel("Date")
        plt.ylabel(metric)
        plt.legend()
        plt.grid(True)
        buf = BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        charts[metric.lower()] = base64.b64encode(buf.getvalue()).decode("utf-8")
        plt.close()

    return charts


# path: stocksim/backend/pages/analytics/analytics_service.py
