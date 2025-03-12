from flask import Blueprint, request, jsonify
from .trading_strategies_service import (
    identify_trend_following_signals,
    identify_support_resistance_levels,
    identify_momentum_signals,
)

trading_strategies_bp = Blueprint("trading_strategies", __name__)


@trading_strategies_bp.route(
    "/api/strategies/trend-following/<stock_name>/<exchange>", methods=["GET"]
)
def api_get_trend_following(stock_name, exchange):
    """Get trend following signals for a stock"""
    fast_period = request.args.get("fast_period", default=20, type=int)
    slow_period = request.args.get("slow_period", default=50, type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    trend_data = identify_trend_following_signals(
        stock_name, exchange, fast_period, slow_period, start_date, end_date
    )

    if trend_data is None:
        return jsonify({"error": "Could not identify trend following signals"}), 404

    return jsonify(trend_data)


@trading_strategies_bp.route(
    "/api/strategies/support-resistance/<stock_name>/<exchange>", methods=["GET"]
)
def api_get_support_resistance(stock_name, exchange):
    """Get support and resistance levels for a stock"""
    period = request.args.get("period", default=20, type=int)
    threshold = request.args.get("threshold", default=0.03, type=float)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    sr_data = identify_support_resistance_levels(
        stock_name, exchange, period, threshold, start_date, end_date
    )

    if sr_data is None:
        return (
            jsonify({"error": "Could not identify support and resistance levels"}),
            404,
        )

    return jsonify(sr_data)


@trading_strategies_bp.route(
    "/api/strategies/momentum/<stock_name>/<exchange>", methods=["GET"]
)
def api_get_momentum(stock_name, exchange):
    """Get momentum trading signals for a stock"""
    rsi_period = request.args.get("rsi_period", default=14, type=int)
    rsi_overbought = request.args.get("rsi_overbought", default=70, type=int)
    rsi_oversold = request.args.get("rsi_oversold", default=30, type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    momentum_data = identify_momentum_signals(
        stock_name,
        exchange,
        rsi_period,
        rsi_overbought,
        rsi_oversold,
        start_date,
        end_date,
    )

    if momentum_data is None:
        return jsonify({"error": "Could not identify momentum signals"}), 404

    return jsonify(momentum_data)
