// File: src/App.js
import React from "react";
import HomePage from "./pages/Homepage"; // Import HomePage component
import Header from "./components/Header"; // Import Header component
import "./App.css"; // Optional global styling
const App = () => {
  return (
    <div className="App">
      <Header /> {/* Add the Header component */}
      <HomePage /> {/* Add the HomePage component */}
    </div>
  );
};

export default App;
