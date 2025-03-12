from flask import Blueprint, request, jsonify
from .comparison_service import (
    get_sector_list,
    get_stocks_by_sector,
    compare_stocks_performance,
    compare_sector_performance,
)

comparison_bp = Blueprint("comparison", __name__)


@comparison_bp.route("/api/sectors", methods=["GET"])
def api_get_sectors():
    """Get list of available sectors"""
    sectors = get_sector_list()
    return jsonify(sectors)


@comparison_bp.route("/api/sectors/<sector>/stocks", methods=["GET"])
def api_get_stocks_by_sector(sector):
    """Get list of stocks in a specific sector"""
    stocks = get_stocks_by_sector(sector)

    if not stocks:
        return jsonify({"error": f"No stocks found for sector: {sector}"}), 404

    return jsonify(stocks)


@comparison_bp.route("/api/comparison/stocks", methods=["POST"])
def api_compare_stocks():
    """Compare performance of multiple stocks"""
    data = request.json

    if not data or "stocks" not in data:
        return jsonify({"error": "Missing stocks data"}), 400

    stock_names = data.get("stocks", [])
    exchanges = data.get("exchanges", [])
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not stock_names or not exchanges or len(stock_names) != len(exchanges):
        return jsonify({"error": "Invalid stocks or exchanges data"}), 400

    comparison_data = compare_stocks_performance(
        stock_names, exchanges, start_date, end_date
    )

    if comparison_data is None:
        return jsonify({"error": "Could not compare stocks"}), 404

    return jsonify(comparison_data)


@comparison_bp.route("/api/comparison/sectors/<sector>", methods=["GET"])
def api_compare_sector(sector):
    """Compare performance of stocks within a sector"""
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    comparison_data = compare_sector_performance(sector, start_date, end_date)

    if comparison_data is None:
        return jsonify({"error": f"Could not compare stocks in sector: {sector}"}), 404

    return jsonify(comparison_data)
