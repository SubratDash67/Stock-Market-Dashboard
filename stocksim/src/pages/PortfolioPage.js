// File: src/pages/PortfolioPage.js
import React from "react";
import "./PortfolioPage.css";

const PortfolioPage = () => {
    return (
        <div className="portfolio-page">
            {/* Portfolio Overview */}
            <section className="portfolio-overview">
                <h2>Portfolio Overview</h2>
                <div className="overview-cards">
                    <div className="overview-card">
                        <h3>Total Holdings</h3>
                        <p>Rs. 5,50,000</p>
                    </div>
                    <div className="overview-card">
                        <h3>Unrealized Gains/Losses</h3>
                        <p>+Rs. 50,000</p>
                    </div>
                    <div className="overview-card">
                        <h3>Diversification</h3>
                        {/* Placeholder for a diversification chart */}
                        <div className="chart-placeholder">Chart Placeholder</div>
                    </div>
                </div>
                <button className="top-up-button">Top-Up Rs. 5 Lacs</button>
            </section>

            {/* Day-Wise Summary */}
            <section className="day-summary">
                <h2>Day-Wise Summary</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Trades Executed</th>
                        <th>Daily P/L</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Placeholder data */}
                    <tr>
                        <td>2025-01-01</td>
                        <td>5</td>
                        <td>+Rs. 10,000</td>
                    </tr>
                    <tr>
                        <td>2025-01-02</td>
                        <td>3</td>
                        <td>-Rs. 2,000</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            {/* 10-Day Trade History */}
            <section className="trade-history">
                <h2>10-Day Trade History</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Buy/Sell</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>P/L</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Placeholder data */}
                    <tr>
                        <td>TCS</td>
                        <td>Buy</td>
                        <td>10</td>
                        <td>Rs. 3,000</td>
                        <td>Rs. 30,000</td>
                        <td>+Rs. 5,000</td>
                    </tr>
                    <tr>
                        <td>INFY</td>
                        <td>Sell</td>
                        <td>5</td>
                        <td>Rs. 1,500</td>
                        <td>Rs. 7,500</td>
                        <td>-Rs. 500</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            {/* Portfolio Actions */}
            <section className="portfolio-actions">
                <h2>Portfolio Actions</h2>
                <button className="action-button">Clear History</button>
                <button className="action-button">Top-Up Rs. 5 Lacs</button>
            </section>
        </div>
    );
};

export default PortfolioPage;
