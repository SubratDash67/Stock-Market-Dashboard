// File: src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found">
                <h1>404</h1>
                <p>Oops! The page you are looking for does not exist.</p>
                <Link to="/" className="home-button">Return Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
