# analytics_routes.py

from flask import Blueprint, jsonify, request
from .analytics_service import (
    predict_stock_price,
    generate_trading_signals,
    get_stock_fundamentals,
    get_similar_stocks,
    compare_stocks,
    get_options_data,
)
import logging

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.errorhandler(Exception)
def handle_error(error):
    logging.error(f"Error: {str(error)}")
    return jsonify({"status": "error", "message": str(error)}), 500


@analytics_bp.route("/predict/", methods=["GET"])
def predict_stock():
    symbol = request.args.get("symbol")
    prediction_type = request.args.get("type", "daily")
    if not symbol:
        return (
            jsonify({"status": "error", "message": "symbol parameter is required"}),
            400,
        )

    try:
        predicted_price = predict_stock_price(symbol, prediction_type)
        return (
            jsonify(
                {
                    "status": "success",
                    "symbol": symbol,
                    "prediction_type": prediction_type,
                    "predicted_price": round(predicted_price, 4),
                }
            ),
            200,
        )
    except Exception as e:
        return handle_error(e)


@analytics_bp.route("/stock_health", methods=["GET"])
def stock_health():
    symbol = request.args.get("symbol")
    if not symbol:
        return (
            jsonify({"status": "error", "message": "symbol parameter is required"}),
            400,
        )

    try:
        fundamentals = get_stock_fundamentals(symbol)
        return jsonify({"status": "success", "data": fundamentals}), 200
    except Exception as e:
        return handle_error(e)


@analytics_bp.route("/trading_signals", methods=["GET"])
def trading_signals():
    symbol = request.args.get("symbol")
    if not symbol:
        return (
            jsonify({"status": "error", "message": "symbol parameter is required"}),
            400,
        )

    try:
        signals = generate_trading_signals(symbol)
        return jsonify({"status": "success", "data": signals}), 200
    except Exception as e:
        return handle_error(e)


@analytics_bp.route("/compare_stocks", methods=["GET"])
def compare():
    stock1 = request.args.get("stock1")
    stock2 = request.args.get("stock2")
    if not stock1 or not stock2:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Both stock1 and stock2 parameters are required",
                }
            ),
            400,
        )

    try:
        comparison = compare_stocks(stock1, stock2)
        return jsonify({"status": "success", "data": comparison}), 200
    except Exception as e:
        return handle_error(e)


@analytics_bp.route("/similar_stocks", methods=["GET"])
def similar_stocks():
    symbol = request.args.get("symbol")
    if not symbol:
        return (
            jsonify({"status": "error", "message": "symbol parameter is required"}),
            400,
        )

    try:
        similar = get_similar_stocks(symbol)
        return jsonify({"status": "success", "data": similar}), 200
    except Exception as e:
        return handle_error(e)


@analytics_bp.route("/options_data", methods=["GET"])
def options_data():
    symbol = request.args.get("symbol")
    if not symbol:
        return (
            jsonify({"status": "error", "message": "symbol parameter is required"}),
            400,
        )

    try:
        options = get_options_data(symbol)
        return jsonify({"status": "success", "data": options}), 200
    except Exception as e:
        return handle_error(e)
