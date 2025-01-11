import React, { useState, useEffect } from "react";
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

    return (
        <div className="market-overview">
            {/* Market Trends Section */}
            <section className="market-trends">
                <h2>Market Trends</h2>
                <div className="indices">
                    {Object.entries(marketTrends).map(([indexName, trend]) => (
                        <div key={indexName} className="index-box">
                            <h3>{indexName}</h3>
                            <p>
                                {trend.percent_change >= 0 ? "+" : ""}
                                {trend.percent_change.toFixed(2)}% ({trend.price.toFixed(2)})
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Neo-Screener Section */}
            <section className="neo-screener">
                <h2>Neo-Screener</h2>
                <input
                    type="text"
                    placeholder="Filter by symbol, industry, etc."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
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
