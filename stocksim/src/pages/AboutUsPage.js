// File: src/pages/AboutUsPage.js
import React from "react";
import "./AboutUsPage.css";

const AboutUsPage = () => {
    return (
        <div className="about-us-page">
            {/* Platform Overview */}
            <section className="platform-overview">
                <h2>About Us</h2>
                <p>
                    Welcome to StockSim, your ultimate virtual trading platform. Whether
                    you're a beginner exploring the stock market or an experienced trader
                    testing new strategies, StockSim offers the tools you need in a
                    risk-free environment.
                </p>
            </section>

            {/* Key Features Recap */}
            <section className="key-features">
                <h2>Key Features</h2>
                <ul>
                    <li>Unlimited Trades Every Day</li>
                    <li>Rs. 5 Lacs Initial Virtual Money + Free Top-Up</li>
                    <li>AI-Based Options Trader</li>
                    <li>Basket Orders for Multiple Trades</li>
                    <li>Advanced Screener for Stocks and Options</li>
                    <li>Comprehensive Analytics and Strategy Builder</li>
                </ul>
            </section>

            {/* Contact Information */}
            <section className="contact-info">
                <h2>Contact Us</h2>
                <p>
                    Have questions or need support? Reach out to us:
                </p>
                <p>Email: <a href="mailto:support@stocksim.com">support@stocksim.com</a></p>
                <p>Phone: +91-9876543210</p>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/facebook-icon.png" alt="Facebook" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/twitter-icon.png" alt="Twitter" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/linkedin-icon.png" alt="LinkedIn" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;
