// File: src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
    const { user, logout } = useAuth();

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
                {user ? (
                    <div className="user-info">
                        <span className="welcome-message">Welcome, <span className="username">{user.username}</span>!</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <Link to="/auth" className="login-button">
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
