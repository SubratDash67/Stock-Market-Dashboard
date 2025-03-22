// File: src/pages/AboutUsPage.js
import React, { useState } from "react";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import "./AboutUsPage.css";

const AboutUsPage = () => {
    const [showSamirEmail, setShowSamirEmail] = useState(false);
    const [showSubratEmail, setShowSubratEmail] = useState(false);

    return (
        <div className="aboutus-page">
            <div className="about-container">
                <div className="about-header">
                    <h1>About StockSim</h1>
                    <div className="header-underline"></div>
                </div>

                <section className="about-section">
                    <h2>Our Platform</h2>
                    <p>
                        StockSim is a free, interactive stock market simulation platform that allows users to analyze stocks,
                        predict price movements, and explore trading strategies in a risk-free environment. Whether you're a
                        beginner exploring the stock market or an experienced trader testing new strategies, StockSim offers
                        the tools you need to succeed.
                    </p>
                </section>

                <section className="mission-section">
                    <div className="mission-content">
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to make stock market analysis accessible to everyone by providing powerful,
                            free tools for historical data analysis and price prediction. We believe that financial education
                            should be available to all, regardless of experience level or financial background.
                        </p>
                    </div>
                    <div className="mission-graphic">
                        <div className="graphic-element"></div>
                    </div>
                </section>

                <section className="features-section">
                    <h2>Platform Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon trading-icon"></div>
                            <h3>Unlimited Trades</h3>
                            <p>Practice with unlimited daily trades without real-world consequences</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon money-icon"></div>
                            <h3>Virtual Capital</h3>
                            <p>Start with Rs. 5 Lacs virtual money with free top-ups as needed</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon ai-icon"></div>
                            <h3>AI Trading Assistant</h3>
                            <p>AI-powered options trading recommendations and analysis</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon basket-icon"></div>
                            <h3>Basket Orders</h3>
                            <p>Execute multiple trades simultaneously with basket orders</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon screener-icon"></div>
                            <h3>Advanced Screener</h3>
                            <p>Comprehensive screening tools for stocks and options</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon analytics-icon"></div>
                            <h3>Analytics</h3>
                            <p>In-depth performance analytics and strategy building tools</p>
                        </div>
                    </div>
                </section>

                <section className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Sign Up</h3>
                                <p>Create your free account in seconds</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Explore Markets</h3>
                                <p>Access real-time market data and analysis tools</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Build Strategies</h3>
                                <p>Develop and test your trading strategies</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Track Performance</h3>
                                <p>Monitor your results with detailed analytics</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="disclaimer-section">
                    <h2>Transparency & Disclaimer</h2>
                    <p>
                        StockSim provides analysis based on historical data and publicly available sources.
                        This is for educational and informational purposes only and should not be considered
                        financial advice. Past performance is not indicative of future results, and all
                        simulations are meant for practice and learning purposes only.
                    </p>
                </section>

                <section className="team-section">
                    <h2>The Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <h3>Samir Singh</h3>
                            <div className="member-links">
                                <a href="https://github.com/samir54883" target="_blank" rel="noopener noreferrer">
                                    <FaGithub className="social-icon" />
                                </a>
                                <div className="email-container">
                                    <FaEnvelope
                                        className="social-icon"
                                        onClick={() => setShowSamirEmail(!showSamirEmail)}
                                    />
                                    {showSamirEmail && <span className="email-popup">samir54883@gmail.com</span>}
                                </div>
                            </div>
                        </div>
                        <div className="team-member">
                            <h3>Subrat Dash</h3>
                            <div className="member-links">
                                <a href="https://github.com/SubratDash67" target="_blank" rel="noopener noreferrer">
                                    <FaGithub className="social-icon" />
                                </a>
                                <div className="email-container">
                                    <FaEnvelope
                                        className="social-icon"
                                        onClick={() => setShowSubratEmail(!showSubratEmail)}
                                    />
                                    {showSubratEmail && <span className="email-popup">subratdash2022@gmail.com</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-section">
                    <h2>Contact Us</h2>
                    <p>Have questions or feedback? We'd love to hear from you!</p>
                    <div className="contact-form">
                        <div className="form-group">
                            <input type="text" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Your Email" />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Your Message"></textarea>
                        </div>
                        <button className="submit-button">Send Message</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUsPage;
