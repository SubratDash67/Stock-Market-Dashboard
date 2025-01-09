// File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import MarketOverview from "./pages/MarketOverview";
import TradePage from "./pages/TradePage";
import AnalyticsStrategiesPage from "./pages/AnalyticsStrategiesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutUsPage from "./pages/AboutUsPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import "./App.css"; // Global styles

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header /> {/* Common Header visible on all pages */}
                <Routes>
                    <Route path="/" element={<HomePage />} /> {/* Home Page */}
                    <Route path="/market" element={<MarketOverview />} /> {/* Market Overview */}
                    <Route path="/trade" element={<TradePage />} /> {/* Trade Page */}
                    <Route path="/analytics" element={<AnalyticsStrategiesPage />} /> {/* Analytics & Strategies */}
                    <Route path="/portfolio" element={<PortfolioPage />} /> {/* Portfolio */}
                    <Route path="/about" element={<AboutUsPage />} /> {/* About Us */}
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="*" element={<NotFound />} /> {/* 404 Page */}
                </Routes>
                <Footer /> {/* Common Footer visible on all pages */}
            </div>
        </Router>
    );
};

export default App;
