from flask import Blueprint, request, jsonify
from .market_indicators_service import get_nifty_sensex_data, get_fii_dii_data

market_indicators_bp = Blueprint("market_indicators", __name__)


@market_indicators_bp.route("/api/market/indices", methods=["GET"])
def api_get_indices():
    """Get Nifty and Sensex data"""
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    indices_data = get_nifty_sensex_data(start_date, end_date)

    return jsonify(indices_data)


@market_indicators_bp.route("/api/market/fii-dii", methods=["GET"])
def api_get_fii_dii():
    """Get FII/DII activity data"""
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    fii_dii_data = get_fii_dii_data(start_date, end_date)

    return jsonify(fii_dii_data)
