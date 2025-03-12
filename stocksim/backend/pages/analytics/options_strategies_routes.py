from flask import Blueprint, request, jsonify
from .options_strategies_service import (
    calculate_covered_call,
    calculate_straddle,
    calculate_iron_condor,
)

options_strategies_bp = Blueprint("options_strategies", __name__)


@options_strategies_bp.route("/api/options/covered-call", methods=["POST"])
def api_calculate_covered_call():
    """Calculate P&L for covered call strategy"""
    data = request.json

    if not data:
        return jsonify({"error": "Missing request data"}), 400

    stock_price = data.get("stock_price")
    strike_price = data.get("strike_price")
    premium = data.get("premium")
    quantity = data.get("quantity", 1)

    if not all([stock_price, strike_price, premium]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        covered_call_data = calculate_covered_call(
            float(stock_price), float(strike_price), float(premium), int(quantity)
        )
        return jsonify(covered_call_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@options_strategies_bp.route("/api/options/straddle", methods=["POST"])
def api_calculate_straddle():
    """Calculate P&L for straddle strategy"""
    data = request.json

    if not data:
        return jsonify({"error": "Missing request data"}), 400

    stock_price = data.get("stock_price")
    strike_price = data.get("strike_price")
    call_premium = data.get("call_premium")
    put_premium = data.get("put_premium")
    quantity = data.get("quantity", 1)
    position_type = data.get("position_type", "long")

    if not all([stock_price, strike_price, call_premium, put_premium]):
        return jsonify({"error": "Missing required parameters"}), 400

    if position_type not in ["long", "short"]:
        return jsonify({"error": "Invalid position type"}), 400

    try:
        straddle_data = calculate_straddle(
            float(stock_price),
            float(strike_price),
            float(call_premium),
            float(put_premium),
            int(quantity),
            position_type,
        )
        return jsonify(straddle_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@options_strategies_bp.route("/api/options/iron-condor", methods=["POST"])
def api_calculate_iron_condor():
    """Calculate P&L for iron condor strategy"""
    data = request.json

    if not data:
        return jsonify({"error": "Missing request data"}), 400

    stock_price = data.get("stock_price")
    call_short_strike = data.get("call_short_strike")
    call_long_strike = data.get("call_long_strike")
    put_short_strike = data.get("put_short_strike")
    put_long_strike = data.get("put_long_strike")
    net_credit = data.get("net_credit")
    quantity = data.get("quantity", 1)

    if not all(
        [
            stock_price,
            call_short_strike,
            call_long_strike,
            put_short_strike,
            put_long_strike,
            net_credit,
        ]
    ):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        iron_condor_data = calculate_iron_condor(
            float(stock_price),
            float(call_short_strike),
            float(call_long_strike),
            float(put_short_strike),
            float(put_long_strike),
            float(net_credit),
            int(quantity),
        )

        if iron_condor_data is None:
            return jsonify({"error": "Invalid strike prices"}), 400

        return jsonify(iron_condor_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
