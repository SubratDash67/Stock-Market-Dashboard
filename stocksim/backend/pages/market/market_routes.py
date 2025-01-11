# File: backend/pages/market/market_routes.py
from flask import Blueprint, jsonify, request
from .market_service import get_market_trends, get_gainers_and_losers, get_filtered_stocks

market_bp = Blueprint("market", __name__)

@market_bp.route("/trends", methods=["GET"])
def market_trends():
    try:
        trends = get_market_trends()
        return jsonify({"status": "success", "data": trends}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@market_bp.route("/gainers-losers", methods=["GET"])
def gainers_and_losers():
    try:
        gainers, losers = get_gainers_and_losers()
        return jsonify({
            "status": "success",
            "data": {"gainers": gainers, "losers": losers}
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@market_bp.route("/screener", methods=["GET"])
def screener():
    filter_query = request.args.get("filter", "")
    try:
        stocks = get_filtered_stocks(filter_query)
        return jsonify({"status": "success", "data": stocks}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
