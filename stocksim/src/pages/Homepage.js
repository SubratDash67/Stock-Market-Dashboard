// File: src/pages/HomePage.js
import React from "react";
import "./Homepage.css";

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <h1>Unlimited Trades Every Day</h1>
                <p>Rs. 5 Lacs Initial Virtual Money + Free Top-Up</p>
                <button className="cta-button">Start Trading Now</button>
            </section>

            {/* Portfolio Overview */}
            <section className="portfolio-overview">
                <h2>Portfolio Overview</h2>
                <div className="portfolio-stats">
                    <div className="stat-card">
                        <h3>Portfolio Value</h3>
                        <p>Rs. 5,00,000</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Returns</h3>
                        <p>+Rs. 50,000</p>
                    </div>
                    <div className="stat-card">
                        <h3>Current Holdings</h3>
                        <p>5 Stocks</p>
                    </div>
                </div>
                <button className="view-portfolio-button">View Full Portfolio</button>
            </section>

            {/* Top Market Trends */}
            <section className="market-trends">
                <h2>Top Market Trends</h2>
                <div className="trends-container">
                    <div className="trend-box">
                        <h3>Top Gainers</h3>
                        <ul>
                            <li>Stock A: +5%</li>
                            <li>Stock B: +4.5%</li>
                        </ul>
                    </div>
                    <div className="trend-box">
                        <h3>Top Losers</h3>
                        <ul>
                            <li>Stock X: -3%</li>
                            <li>Stock Y: -2.5%</li>
                        </ul>
                    </div>
                    <div className="trend-box">
                        <h3>Index Trends</h3>
                        <p>NIFTY: +1.2% | SENSEX: +1.0%</p>
                    </div>
                </div>
            </section>

            {/* Quick Access Links */}
            <section className="quick-access">
                <h2>Quick Access</h2>
                <div className="quick-buttons">
                    <button>Trade Now</button>
                    <button>Explore Screener</button>
                    <button>View Strategies</button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
