import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer-page">
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <Link to="/" className="footer-logo-title">
                            <img src="./logo.png" alt="Logo" className="footer-logo" />
                            <span className="footer-title">StockSimulator</span>
                        </Link>
                        <div className="footer-socials">
                            <a href="#" className="social-circle">
                                <img src="./instagram.png" alt="Instagram" className="social-icon" />
                            </a>
                            <a href="#" className="social-circle">
                                <img src="./facebook.png" alt="Facebook" className="social-icon" />
                            </a>
                            <a href="#" className="social-circle">
                                <img src="./twitter.png" alt="Twitter" className="social-icon" />
                            </a>
                            <a href="#" className="social-circle">
                                <img src="./telegram.png" alt="Telegram" className="social-icon" />
                            </a>
                        </div>
                    </div>

                    {/* Center Section for About Us & Contact Us */}
                    <div className="footer-center">
                        <Link to="/about" className="footer-link">About Us</Link>
                        <Link to="/about" className="footer-link">Contact Us</Link>
                    </div>

                    {/* New Right Section for Newsletter */}
                    <div className="footer-right">
                        <p className="footer-news-text">Get regular updates on stock trading :</p>
                        <div className="newsletter">
                            <input type="email" placeholder="Your email" className="newsletter-input" />
                            <button type="submit" className="newsletter-submit">Submit</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">StockSim. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
