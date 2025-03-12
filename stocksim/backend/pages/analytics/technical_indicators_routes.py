from flask import Blueprint, request, jsonify
from .technical_indicators_service import (
    calculate_rsi,
    calculate_macd,
    calculate_bollinger_bands,
)

technical_indicators_bp = Blueprint("technical_indicators", __name__)


@technical_indicators_bp.route(
    "/api/stocks/<stock_name>/<exchange>/rsi", methods=["GET"]
)
def api_get_rsi(stock_name, exchange):
    """Get RSI data for a stock"""
    period = request.args.get("period", default=14, type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    rsi_data = calculate_rsi(stock_name, exchange, period, start_date, end_date)

    if rsi_data is None:
        return jsonify({"error": "Could not calculate RSI"}), 404

    return jsonify(rsi_data)


@technical_indicators_bp.route(
    "/api/stocks/<stock_name>/<exchange>/macd", methods=["GET"]
)
def api_get_macd(stock_name, exchange):
    """Get MACD data for a stock"""
    fast_period = request.args.get("fast_period", default=12, type=int)
    slow_period = request.args.get("slow_period", default=26, type=int)
    signal_period = request.args.get("signal_period", default=9, type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    macd_data = calculate_macd(
        stock_name,
        exchange,
        fast_period,
        slow_period,
        signal_period,
        start_date,
        end_date,
    )

    if macd_data is None:
        return jsonify({"error": "Could not calculate MACD"}), 404

    return jsonify(macd_data)


@technical_indicators_bp.route(
    "/api/stocks/<stock_name>/<exchange>/bollinger", methods=["GET"]
)
def api_get_bollinger_bands(stock_name, exchange):
    """Get Bollinger Bands data for a stock"""
    period = request.args.get("period", default=20, type=int)
    std_dev = request.args.get("std_dev", default=2, type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    bb_data = calculate_bollinger_bands(
        stock_name, exchange, period, std_dev, start_date, end_date
    )

    if bb_data is None:
        return jsonify({"error": "Could not calculate Bollinger Bands"}), 404

    return jsonify(bb_data)
