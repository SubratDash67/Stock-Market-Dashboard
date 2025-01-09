// File: src/pages/AuthPage.js
import React, { useState } from "react";
import "./AuthPage.css";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                <form>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Enter your name" />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <p className="toggle-link">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
