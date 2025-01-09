// File: src/pages/MarketOverview.js
import React, { useState } from "react";
import "./MarketOverview.css";

const MarketOverview = () => {
    // State for Neo-Screener filters
    const [filter, setFilter] = useState("");

    return (
        <div className="market-overview">
            {/* Market Trends Section */}
            <section className="market-trends">
                <h2>Market Trends</h2>
                <div className="indices">
                    <div className="index-box">
                        <h3>NIFTY 50</h3>
                        <p>+1.5% (17,300)</p>
                    </div>
                    <div className="index-box">
                        <h3>SENSEX</h3>
                        <p>+1.3% (58,500)</p>
                    </div>
                    <div className="index-box">
                        <h3>NASDAQ</h3>
                        <p>-0.8% (14,000)</p>
                    </div>
                </div>
            </section>

            {/* Neo-Screener Section */}
            <section className="neo-screener">
                <h2>Neo-Screener</h2>
                <input
                    type="text"
                    placeholder="Filter by sector, industry, etc."
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
                    {/* Placeholder data */}
                    <tr>
                        <td>TCS</td>
                        <td>Rs. 3,000</td>
                        <td>+1.2%</td>
                        <td>1.5M</td>
                    </tr>
                    <tr>
                        <td>INFY</td>
                        <td>Rs. 1,500</td>
                        <td>-0.5%</td>
                        <td>900K</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            {/* Sector/Industry Screener */}
            <section className="sector-screener">
                <h2>Sector Screener</h2>
                <select>
                    <option value="IT">IT</option>
                    <option value="Banking">Banking</option>
                    <option value="Pharma">Pharma</option>
                </select>
            </section>

            {/* Gainers & Losers Section */}
            <section className="gainers-losers">
                <h2>Top Gainers & Losers</h2>
                <div className="gainers-losers-container">
                    <div className="gainers">
                        <h3>Top Gainers</h3>
                        <ul>
                            <li>Stock A: +5.6%</li>
                            <li>Stock B: +4.8%</li>
                        </ul>
                    </div>
                    <div className="losers">
                        <h3>Top Losers</h3>
                        <ul>
                            <li>Stock X: -3.2%</li>
                            <li>Stock Y: -2.7%</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarketOverview;
