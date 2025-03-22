// File: src/pages/HomePage.js
import React from "react";
import "./Homepage.css";

const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <div className="home-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>Unlimited Trading Experience</h1>
                    <p>Begin with ₹5,00,000 virtual capital and practice risk-free investing</p>
                    <button className="cta-button">Start Trading Now</button>
                </section>

                {/* Portfolio Overview */}
                <section className="portfolio-overview">
                    <h2 className="section-title">Your Portfolio</h2>
                    <div className="portfolio-stats">
                        <div className="stat-card">
                            <h3>Total Portfolio Value</h3>
                            <p>₹5,00,000</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Returns</h3>
                            <p>+₹50,000</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Positions</h3>
                            <p>5 Stocks</p>
                        </div>
                    </div>
                    <button className="view-portfolio-button">View Details</button>
                </section>

                {/* Top Market Trends */}
                <section className="market-trends">
                    <h2 className="section-title">Market Insights</h2>
                    <div className="trends-container">
                        <div className="trend-box">
                            <h3>Top Gainers</h3>
                            <ul>
                                <li>HDFC Bank <span className="gain">+5.2%</span></li>
                                <li>Reliance <span className="gain">+4.5%</span></li>
                                <li>TCS <span className="gain">+3.8%</span></li>
                            </ul>
                        </div>
                        <div className="trend-box">
                            <h3>Top Losers</h3>
                            <ul>
                                <li>Yes Bank <span className="loss">-3.1%</span></li>
                                <li>Adani Power <span className="loss">-2.5%</span></li>
                                <li>BHEL <span className="loss">-1.9%</span></li>
                            </ul>
                        </div>
                        <div className="trend-box">
                            <h3>Market Overview</h3>
                            <ul>
                                <li>NIFTY 50 <span className="gain">+1.2%</span></li>
                                <li>SENSEX <span className="gain">+1.0%</span></li>
                                <li>BANK NIFTY <span className="gain">+1.5%</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Quick Access Links */}
                <section className="quick-access">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-buttons">
                        <button>Trade Now</button>
                        <button>Market Screener</button>
                        <button>Investment Strategies</button>
                        <button>Portfolio Analytics</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;