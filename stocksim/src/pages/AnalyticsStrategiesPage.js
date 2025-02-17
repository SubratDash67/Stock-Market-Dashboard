// AnalyticsStrategiesPage.js
import React, { useState } from "react";
import "./AnalyticsStrategiesPage.css";

const AnalyticsStrategiesPage = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [predictionType, setPredictionType] = useState("daily");
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [stockHealth, setStockHealth] = useState(null);
  const [tradingSignals, setTradingSignals] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000/analytics/${endpoint}?symbol=${stockSymbol}&type=${predictionType}`);
      const data = await response.json();
      if (data.status === "success") {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(`Failed to fetch ${endpoint}: ${error.message}`);
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!stockSymbol) {
      setError("Please enter a stock symbol.");
      return;
    }

    setError("");
    setPredictedPrice(null);
    setStockHealth(null);
    setTradingSignals([]);
    setOptionsData([]);

    const predictionData = await fetchData("predict");
    if (predictionData) setPredictedPrice(predictionData.predicted_price);

    const healthData = await fetchData("stock_health");
    if (healthData) setStockHealth(healthData.data);

    const signalsData = await fetchData("trading_signals");
    if (signalsData) setTradingSignals(signalsData.data);

    const optionsData = await fetchData("options_data");
    if (optionsData) setOptionsData(optionsData.data);
  };

  return (
    <div className="analytics-container">
      <h1>Stock Analytics & Strategies</h1>
      
      <div className="input-section">
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          className="input-box"
        />
        <select
          value={predictionType}
          onChange={(e) => setPredictionType(e.target.value)}
          className="dropdown"
        >
          <option value="daily">Daily Prediction</option>
          <option value="weekly">Weekly Prediction</option>
          <option value="monthly">Monthly Prediction</option>
        </select>
        <button className="analyze-btn" onClick={handleAnalyze}>
          Analyze
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {predictedPrice && (
        <div className="result-card">
          <h2>Predicted Price</h2>
          <p className="highlight">${predictedPrice.toFixed(2)}</p>
        </div>
      )}

      {stockHealth && (
        <div className="result-card">
          <h2>Stock Health</h2>
          <ul>
            {Object.entries(stockHealth).map(([key, value]) => (
              <li key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tradingSignals.length > 0 && (
        <div className="result-card">
          <h2>Trading Signals</h2>
          <ul>
            {tradingSignals.map((signal, index) => (
              <li key={index}>{signal}</li>
            ))}
          </ul>
        </div>
      )}

      {optionsData.length > 0 && (
        <div className="result-card">
          <h2>Options Expiration Dates</h2>
          <ul>
            {optionsData.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyticsStrategiesPage;
