from flask import Blueprint, request, jsonify
import pandas as pd
from datetime import datetime

from .stock_utils import get_stock_suggestions
from .data_processor import (
    load_stock_data,
    get_stock_date_range,
    filter_stock_data_by_date,
)
from .analysis_strategies import (
    calculate_moving_averages,
    calculate_rsi,
    generate_ma_chart,
    generate_rsi_chart,
)

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/api/analytics/stock-suggestions", methods=["GET"])
def stock_suggestions():
    query = request.args.get("query", "")
    if not query or len(query) < 2:
        return jsonify({"suggestions": []})

    suggestions = get_stock_suggestions(query)
    return jsonify({"suggestions": suggestions})


@analytics_bp.route("/api/analytics/stock-info", methods=["GET"])
def stock_info():
    stock_name = request.args.get("stock")
    exchange = request.args.get("exchange", "ns").lower()

    if not stock_name:
        return jsonify({"error": "Stock name is required"}), 400

    # Get date range for the stock
    start_date, end_date = get_stock_date_range(stock_name, exchange)

    if not start_date or not end_date:
        return jsonify({"error": "Stock data not found"}), 404

    return jsonify(
        {
            "stock": stock_name,
            "exchange": exchange,
            "dateRange": {"start": start_date, "end": end_date},
        }
    )


@analytics_bp.route("/api/analytics/moving-average", methods=["GET"])
def moving_average_analysis():
    stock_name = request.args.get("stock")
    exchange = request.args.get("exchange", "ns").lower()
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    short_window = int(request.args.get("short_window", 20))
    long_window = int(request.args.get("long_window", 50))

    if not stock_name:
        return jsonify({"error": "Stock name is required"}), 400

    # Load stock data
    df = load_stock_data(stock_name, exchange)
    if df is None:
        return jsonify({"error": "Stock data not found"}), 404

    # Filter by date if provided
    if start_date and end_date:
        df = filter_stock_data_by_date(df, start_date, end_date)

    # Calculate moving averages
    result_df = calculate_moving_averages(df, short_window, long_window)

    # Generate chart
    chart_image = generate_ma_chart(result_df, short_window, long_window)

    # Prepare summary data
    summary = {
        "totalPeriods": len(result_df),
        "buySignals": int(result_df["Position"].value_counts().get(1, 0)),
        "sellSignals": int(result_df["Position"].value_counts().get(-1, 0)),
        "lastSignal": "Buy" if result_df["Signal"].iloc[-1] == 1 else "Sell",
    }

    # Convert to JSON-serializable format
    result = result_df[
        [
            "Date",
            "Close",
            f"SMA_{short_window}",
            f"SMA_{long_window}",
            "Signal",
            "Position",
        ]
    ].tail(50)
    result["Date"] = result["Date"].dt.strftime("%Y-%m-%d")

    return jsonify(
        {"summary": summary, "chart": chart_image, "data": result.to_dict("records")}
    )


@analytics_bp.route("/api/analytics/rsi", methods=["GET"])
def rsi_analysis():
    stock_name = request.args.get("stock")
    exchange = request.args.get("exchange", "ns").lower()
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    window = int(request.args.get("window", 14))

    if not stock_name:
        return jsonify({"error": "Stock name is required"}), 400

    # Load stock data
    df = load_stock_data(stock_name, exchange)
    if df is None:
        return jsonify({"error": "Stock data not found"}), 404

    # Filter by date if provided
    if start_date and end_date:
        df = filter_stock_data_by_date(df, start_date, end_date)

    # Calculate RSI
    result_df = calculate_rsi(df, window)

    # Generate chart
    chart_image = generate_rsi_chart(result_df, window)

    # Prepare summary data
    summary = {
        "totalPeriods": len(result_df),
        "oversoldSignals": int((result_df["RSI_Signal"] == 1).sum()),
        "overboughtSignals": int((result_df["RSI_Signal"] == -1).sum()),
        "currentRSI": float(result_df["RSI"].iloc[-1]),
        "currentStatus": (
            "Overbought"
            if result_df["RSI"].iloc[-1] > 70
            else "Oversold" if result_df["RSI"].iloc[-1] < 30 else "Neutral"
        ),
    }

    # Convert to JSON-serializable format
    result = result_df[["Date", "Close", "RSI", "RSI_Signal"]].tail(50)
    result["Date"] = result["Date"].dt.strftime("%Y-%m-%d")

    return jsonify(
        {"summary": summary, "chart": chart_image, "data": result.to_dict("records")}
    )
