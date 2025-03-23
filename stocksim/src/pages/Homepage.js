// File: src/pages/HomePage.js
import React from "react";
import "./Homepage.css";

const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <div className="home-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>Paper Trading Platform with AI Analytics</h1>
                    <h2 id="betterh2">Unlimited Trading Experience</h2>
                    <h2>
                        Experience the Thrill of Live Trading with <span style={{color: '#FFC6A5'}}>Zero Risk!</span>
                    </h2>
                    <p>Begin with ₹5,00,000 virtual capital and practice risk-free investing</p>

                    <button className="cta-button">Start Trading Now</button>
                </section>
                <div className="paper-trading-section">
                    <div className="paper-trading-content">
                        <p className="stocksim-notice">
                            Why Paper Trading Should Be Your First Step Before You Invest Real
                        </p>

                        <p className="section-description">
                            Tempting as it may be to dive headfirst into the exciting world of stock trading, seasoned
                            investors
                            and newbies alike agree: paper trading is your secret weapon for success. Before risking
                            your
                            hard-earned cash, put your skills to the test in a risk-free virtual trading environment.
                            Think of
                            it as a training ground where you can learn, experiment, and build confidence without losing
                            a
                            single penny.
                        </p>
                        <div className="trading-benefits">
                            <div className="benefit-box">Master the Mechanics</div>
                            <div className="benefit-box">Discipline Your Emotions</div>
                            <div className="benefit-box">Fine-Tune Your Techniques</div>
                            <div className="benefit-box">Build Confidence and Momentum</div>
                        </div>
                    </div>
                    <img src="./chart.png" alt="Trading Chart" className="chart-image"/>
                </div>


                {/* Top Market Trends */}
                <section className="market-trends">
                    <h2 className="market-section-title">Market Insights</h2>
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
