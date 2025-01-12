import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import "./MarketOverview.css";

const MarketOverview = () => {
    const [marketTrends, setMarketTrends] = useState([]);
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const [screenerData, setScreenerData] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        // Fetch Market Trends
        fetch("http://localhost:5000/market/trends")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setMarketTrends(data.data);
                }
            })
            .catch((error) => console.error("Error fetching market trends:", error));

        // Fetch Gainers and Losers
        fetch("http://localhost:5000/market/gainers-losers")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setGainers(data.data.gainers);
                    setLosers(data.data.losers);
                }
            })
            .catch((error) => console.error("Error fetching gainers and losers:", error));
    }, []);

    useEffect(() => {
        // Fetch Screener Data
        fetch(`http://localhost:5000/market/screener?filter=${filter}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setScreenerData(data.data);
                }
            })
            .catch((error) => console.error("Error fetching screener data:", error));
    }, [filter]);

    ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

    return (
        <div className="market-overview">
            {/* Market Trends Section */}
            <section className="market-trends">
                <h2>Market Trends</h2>
                <div className="indices">
                    {Object.entries(marketTrends).map(([indexName, trend]) => (
                        <div
                            key={indexName}
                            className="index-box"
                            style={{ width: "300px", height: "275px", margin: "10px" }} // Adjusted container height
                        >
                            <h3 style={{ fontSize: "1rem" }}>{indexName}</h3>
                            {trend.error ? ( // Check for errors from backend data
                                <p className="error-message" style={{ fontSize: "0.9rem", color: "red" }}>
                                    {trend.error}
                                </p>
                            ) : (
                                <>
                                    {/* Current Price Section */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <h4 style={{ fontSize: "1rem", margin: 0 }}>
                                            {`${
                                                trend.price ? trend.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "--"
                                            }`}
                                        </h4>
                                        <p
                                            style={{
                                                fontSize: "0.9rem",
                                                color: trend.change >= 0 ? "green" : "red",
                                                margin: 0,
                                            }}
                                        >
                                            {trend.change >= 0 ? "+" : ""}
                                            {trend.change?.toFixed(2)} ({trend.percent_change?.toFixed(2)}%)
                                        </p>
                                    </div>

                                    {/* Line Chart */}
                                    <Line
                                        data={{
                                            labels: trend.dates,
                                            datasets: [
                                                {
                                                    label: `${indexName} Price`,
                                                    data: trend.prices,
                                                    borderColor: "rgba(75,192,192,1)",
                                                    borderWidth: 1, // Thinner line
                                                    pointRadius: 1, // Smaller points
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true, // Ensures the chart fits the container
                                            plugins: {
                                                legend: { display: false }, // Hide legend to reduce visual clutter
                                                tooltip: { mode: "index", intersect: false },
                                            },

                                            scales: {
                                                x: {
                                                    title: { display: true, text: "Date", font: { size: 10 } },
                                                    ticks: { maxRotation: 45, font: { size: 8 } }, // Smaller x-axis labels
                                                },
                                                y: {
                                                    title: { display: true, text: "Price", font: { size: 10 } },
                                                    ticks: { font: { size: 8 } }, // Smaller y-axis labels
                                                },
                                            },
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            {/* Neo-Screener Section */}
            <section className="neo-screener">
                <h2>Neo-Screener</h2>
                <div className="neo-screener-input">
                    <input
                        type="text"
                        placeholder="Filter by symbol, industry, etc."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div className="neo-screener-buttons">
                        <button onClick={() => setFilter("growth")}>Growth Stock</button>
                        <button onClick={() => setFilter("stability")}>Stability Stock</button>
                        <button onClick={() => setFilter("dividend")}>Dividend Stock</button>
                    </div>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>% Change</th>
                        <th>Volume</th>
                    </tr>
                    </thead>
                    <tbody>
                    {screenerData.map((stock) => (
                        <tr key={stock.symbol}>
                            <td>{stock.symbol}</td>
                            <td>{stock.price.toFixed(2)}</td>
                            <td>{stock.percent_change.toFixed(2)}%</td>
                            <td>{stock.volume}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>


            {/* Gainers & Losers Section */}
            <section className="gainers-losers">
                <h2>Top Gainers & Losers</h2>
                <div className="gainers-losers-container">
                    <div className="gainers">
                        <h3>Top Gainers</h3>
                        <ul>
                            {gainers.map((gainer) => (
                                <li key={gainer.symbol}>
                                    {gainer.symbol}: +{gainer.percent_change.toFixed(2)}%
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="losers">
                        <h3>Top Losers</h3>
                        <ul>
                            {losers.map((loser) => (
                                <li key={loser.symbol}>
                                    {loser.symbol}: {loser.percent_change.toFixed(2)}%
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarketOverview;
