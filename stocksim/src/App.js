// File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
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
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/market" element={<MarketOverview />} />
                        <Route path="/trade" element={<TradePage />} />
                        <Route path="/analytics" element={<AnalyticsStrategiesPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
