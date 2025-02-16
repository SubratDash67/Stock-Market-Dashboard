from flask import Blueprint, jsonify, request
from .analytics_service import predict_closing_price, generate_historical_charts

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    prediction_type = request.args.get("type", "intraday")
    try:
        predicted_price = predict_closing_price(symbol, prediction_type)
        return (
            jsonify(
                {
                    "status": "success",
                    "symbol": symbol,
                    "prediction_type": prediction_type,
                    "predicted_price": predicted_price,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route("/charts/historical", methods=["GET"])
def historical_charts():
    stock_name = request.args.get("stock_name")
    if not stock_name:
        return (
            jsonify({"status": "error", "message": "stock_name parameter is required"}),
            400,
        )

    try:
        charts = generate_historical_charts(stock_name)
        return jsonify({"status": "success", "data": charts}), 200
    except FileNotFoundError as fnf_error:
        return jsonify({"status": "error", "message": str(fnf_error)}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# path: stocksim/backend/pages/analytics/analytics_routes.py
