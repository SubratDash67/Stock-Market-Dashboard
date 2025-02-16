import React, { useState } from "react";
import "./AnalyticsStrategiesPage.css";

const AnalyticsStrategiesPage = () => {
  const [stockName, setStockName] = useState("");
  const [predictionType, setPredictionType] = useState("intraday");
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [charts, setCharts] = useState({});
  const [error, setError] = useState("");

  const fetchPredictions = () => {
    if (!stockName) {
      setError("Please enter a stock name.");
      return;
    }

    fetch(`http://127.0.0.1:5000/analytics/predict/${stockName}?type=${predictionType}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPredictedPrice(data.predicted_price);
          setError("");
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to fetch predictions.");
      });
  };

  const fetchCharts = () => {
    if (!stockName) {
      setError("Please enter a stock name.");
      return;
    }

    fetch(`http://127.0.0.1:5000/analytics/charts/historical?stock_name=${stockName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCharts(data.data);
          setError("");
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to fetch charts.");
      });
  };

  return (
    <div className="analytics-container">
      <h1>📊 Stock Analytics & Predictions</h1>

      {error && <p className="error">{error}</p>}

      <div className="input-section">
        <input
          type="text"
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          className="input-box"
        />

        <select
          value={predictionType}
          onChange={(e) => setPredictionType(e.target.value)}
          className="dropdown"
        >
          <option value="intraday">Today’s Closing Price</option>
          <option value="weekly">Weekly Prediction</option>
          <option value="monthly">Monthly Prediction</option>
        </select>

        <button className="fetch-btn" onClick={fetchPredictions}>
          Predict 📈
        </button>

        <button className="fetch-btn" onClick={fetchCharts}>
          Generate Charts 📊
        </button>
      </div>

      {predictedPrice !== null && (
        <div className="prediction-box">
          <h2>Predicted Price: <span>${predictedPrice.toFixed(2)}</span></h2>
        </div>
      )}

      <div className="charts-container">
        {Object.entries(charts).map(([metric, chartData]) => (
          <div key={metric} className="chart-card">
            <h3>{metric.toUpperCase()} Chart</h3>
            <img src={`data:image/png;base64,${chartData}`} alt={`${metric} Chart`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsStrategiesPage;

//path: stocksim/src/pages/PortfolioPage.js