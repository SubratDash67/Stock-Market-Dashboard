from flask import Blueprint, request, jsonify
from .historical_data_service import (
    get_stock_list,
    get_ohlc_data,
    get_volume_data,
    calculate_moving_average,
)

historical_data_bp = Blueprint("historical_data", __name__)


@historical_data_bp.route("/api/stocks", methods=["GET"])
def api_get_stocks():
    """Get list of available stocks"""
    stocks = get_stock_list()
    return jsonify(stocks)


@historical_data_bp.route("/api/stocks/<stock_name>/<exchange>/ohlc", methods=["GET"])
def api_get_ohlc(stock_name, exchange):
    """Get OHLC data for a stock"""
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    ohlc_data = get_ohlc_data(stock_name, exchange, start_date, end_date)

    if ohlc_data is None:
        return jsonify({"error": "Stock data not found"}), 404

    return jsonify(ohlc_data)


@historical_data_bp.route("/api/stocks/<stock_name>/<exchange>/volume", methods=["GET"])
def api_get_volume(stock_name, exchange):
    """Get volume data for a stock"""
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    volume_data = get_volume_data(stock_name, exchange, start_date, end_date)

    if volume_data is None:
        return jsonify({"error": "Stock data not found"}), 404

    return jsonify(volume_data)


@historical_data_bp.route("/api/stocks/<stock_name>/<exchange>/ma", methods=["GET"])
def api_get_moving_average(stock_name, exchange):
    """Get moving average data for a stock"""
    window = request.args.get("window", default=20, type=int)
    ma_type = request.args.get("type", default="simple")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    ma_data = calculate_moving_average(
        stock_name, exchange, window, ma_type, start_date, end_date
    )

    if ma_data is None:
        return jsonify({"error": "Could not calculate moving average"}), 404

    return jsonify(ma_data)
