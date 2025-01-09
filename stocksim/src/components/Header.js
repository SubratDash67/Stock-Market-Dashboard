// File: src/components/Header.js
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h1 className="logo">StockSim</h1>
                <p className="tagline">Your Ultimate Virtual Trading Experience</p>
            </div>
            <nav className="header-nav">
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/market">Market</Link></li>
                    <li><Link to="/trade">Trade</Link></li>
                    <li><Link to="/analytics">Analytics & Strategies</Link></li>
                    <li><Link to="/portfolio">Portfolio</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>
            </nav>
            <div className="header-right">
                <input
                    type="text"
                    placeholder="Search stocks or strategies"
                    className="search-bar"
                />
                {/* Link the Login / Sign Up button */}
                <Link to="/auth" className="login-button">
                    Login / Sign Up
                </Link>
            </div>
        </header>
    );
};

export default Header;
