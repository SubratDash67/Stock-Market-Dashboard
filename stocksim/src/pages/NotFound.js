// File: src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <p>Page Not Found</p>
            <Link to="/" className="home-link">Go Back to Home</Link>
        </div>
    );
};

export default NotFound;
