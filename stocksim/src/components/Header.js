// File: src/components/Header.js
import React from "react";
import "./Header.css"; // Create this CSS file for styling.

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">StockSim</h1>
        <p className="tagline">Your Ultimate Virtual Trading Experience</p>
      </div>

      <nav className="header-nav">
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#market">Market</a></li>
          <li><a href="#trade">Trade</a></li>
          <li><a href="#analytics">Analytics & Strategies</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
      </nav>

      <div className="header-right">
        <input 
          type="text" 
          placeholder="Search stocks or strategies" 
          className="search-bar" 
        />
        <button className="login-button">Login / Sign Up</button>
        {/* Placeholder for User Avatar */}
        {/* Replace with a profile picture if logged in */}
      </div>
    </header>
  );
};

export default Header;
