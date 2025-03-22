// File: src/components/Footer.js
import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer-page">
            <footer className="footer">
                <div className="footer-links">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-and-conditions">Terms & Conditions</a>
                    <a href="/contact-us">Contact Us</a>
                </div>
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
                <p className="footer-copyright">
                    © {new Date().getFullYear()} StockSim. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default Footer;
