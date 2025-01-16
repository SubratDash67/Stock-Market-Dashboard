import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import Slider from "rc-slider"; // Import rc-slider
import "rc-slider/assets/index.css"; // Import rc-slider styles
import "./MarketOverview.css";


const MarketOverview = () => {
    const [marketTrends, setMarketTrends] = useState([]);
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const [screenerData, setScreenerData] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [sliderRange, setSliderRange] = useState([0, 100]); // Initial range for the slider
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch Market Trends
        fetch("http://localhost:5000/market/trends")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setMarketTrends(data.data);
                }
            })
            .catch((error) => console.error("Error fetching market trends:", error));

        // Initial Fetch for Gainers and Losers (All Sectors)
        fetchGainersAndLosers("All");
    }, []);

    useEffect(() => {
        const selectedData = selectedFilters.join("|"); // Combine filters for the query
        fetch(`http://localhost:5000/market/screener?filter=${selectedData}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setScreenerData(data.data);
                }
            })
            .catch((error) => console.error("Error fetching screener data:", error));
    }, [selectedFilters]);

    // Re-fetch gainers and losers when the selected sector changes
    useEffect(() => {
        fetchGainersAndLosers(selectedSector);
    }, [selectedSector]);

    useEffect(() => {
        const filterButtons = document.querySelectorAll(".neo-screener-buttons button, .neo-screener-sectors button");

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const buttonValue = button.textContent.trim();

                setSelectedFilters((prevFilters) => {
                    const stocks = ["Growth Stock", "Stability Stock", "Dividend Stock"];
                    const sectors = [
                        "Energy",
                        "Basic Materials",
                        "Industrials",
                        "Consumer Cyclical",
                        "Consumer Defensive",
                        "Healthcare",
                        "Financial Services",
                        "Technology",
                        "Communication Services",
                        "Utilities",
                        "Real Estate",
                    ];

                    const isStock = stocks.includes(buttonValue);
                    const isSector = sectors.includes(buttonValue);

                    if (prevFilters.includes(buttonValue)) {
                        // Toggle off (remove from filters)
                        return prevFilters.filter((filter) => filter !== buttonValue);
                    } else {
                        if (isStock) {
                            // Ensure only one stock filter is selected
                            return [buttonValue, ...prevFilters.filter((filter) => !stocks.includes(filter))];
                        }
                        if (isSector) {
                            // Ensure only one sector filter is selected
                            return [buttonValue, ...prevFilters.filter((filter) => !sectors.includes(filter))];
                        }
                    }

                    return prevFilters; // Default case
                });
            });
        });

        return () => {
            filterButtons.forEach((button) => {
                button.removeEventListener("click", () => {});
            });
        };
    }, []);

    // Handle slider value change
    const handleSliderChange = (value) => {
        setSliderRange(value); // Update the range with the new slider values
    };

    // Function to fetch gainers and losers for the selected sector
    const fetchGainersAndLosers = (sector) => {
        setIsLoading(true);
        setError(null);
        const sectorQuery = sector === "All" ? "" : `?sector=${sector}`;
        fetch(`http://localhost:5000/market/gainers-losers${sectorQuery}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch gainers and losers");
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    setGainers(data.data.gainers);
                    setLosers(data.data.losers);
                } else {
                    throw new Error(data.message || "Unknown error occurred");
                }
            })
            .catch((error) => setError(error.message))
            .finally(() => setIsLoading(false));
    };

    ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);



    const sectors = [
        "Energy",
        "Basic Materials",
        "Industrials",
        "Consumer Cyclical",
        "Consumer Defensive",
        "Healthcare",
        "Financial Services",
        "Technology",
        "Communication Services",
        "Utilities",
        "Real Estate",
    ];

    return (
        <div className="market-overview">
            {/* Market Trends Section */}
            <section className="market-trends">
                <h2>Market Trends</h2>
                <div className="indices">
                    {Object.entries(marketTrends).map(([indexName, trend]) => (
                        <div
                            key={indexName}
                            className="index-box"
                            style={{width: "300px", height: "275px", margin: "10px"}} // Adjusted container height
                        >
                            <h3 style={{fontSize: "1rem"}}>{indexName}</h3>
                            {trend.error ? ( // Check for errors from backend data
                                <p className="error-message" style={{fontSize: "0.9rem", color: "red"}}>
                                    {trend.error}
                                </p>
                            ) : (
                                <>
                                    {/* Current Price Section */}
                                    <div style={{marginBottom: "10px"}}>
                                        <h4 style={{fontSize: "1rem", margin: 0}}>
                                            {`${
                                                trend.price ? trend.price.toLocaleString("en-US", {maximumFractionDigits: 2}) : "--"
                                            }`}
                                        </h4>
                                        <p
                                            style={{
                                                fontSize: "0.9rem",
                                                color: trend.change >= 0 ? "green" : "red",
                                                margin: 0,
                                            }}
                                        >
                                            {trend.change >= 0 ? "+" : ""}
                                            {trend.change?.toFixed(2)} ({trend.percent_change?.toFixed(2)}%)
                                        </p>
                                    </div>

                                    {/* Line Chart */}
                                    <Line
                                        data={{
                                            labels: trend.dates,
                                            datasets: [
                                                {
                                                    label: `${indexName} Price`,
                                                    data: trend.prices,
                                                    borderColor: "rgba(75,192,192,1)",
                                                    borderWidth: 1, // Thinner line
                                                    pointRadius: 1, // Smaller points
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true, // Ensures the chart fits the container
                                            plugins: {
                                                legend: {display: false}, // Hide legend to reduce visual clutter
                                                tooltip: {mode: "index", intersect: false},
                                            },

                                            scales: {
                                                x: {
                                                    title: {display: true, text: "Date", font: {size: 10}},
                                                    ticks: {maxRotation: 45, font: {size: 8}}, // Smaller x-axis labels
                                                },
                                                y: {
                                                    title: {display: true, text: "Price", font: {size: 10}},
                                                    ticks: {font: {size: 8}}, // Smaller y-axis labels
                                                },
                                            },
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            <section className="neo-screener">
                <h2>Neo-Screener</h2>
                <div className="neo-screener-input">
                    <input
                        type="text"
                        placeholder="Filter by symbol, industry, etc."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />

                    {/* Filter Buttons */}
                    <div className="neo-screener-buttons">
                        <button
                            onClick={() => setSelectedFilters((prev) => (prev.includes("Growth Stock") ? prev.filter((filter) => filter !== "Growth Stock") : [...prev, "Growth Stock"]))}
                            className={selectedFilters.includes("Growth Stock") ? "active" : ""}
                        >
                            Growth Stock
                        </button>
                        <button
                            onClick={() => setSelectedFilters((prev) => (prev.includes("Stability Stock") ? prev.filter((filter) => filter !== "Stability Stock") : [...prev, "Stability Stock"]))}
                            className={selectedFilters.includes("Stability Stock") ? "active" : ""}
                        >
                            Stability Stock
                        </button>
                        <button
                            onClick={() => setSelectedFilters((prev) => (prev.includes("Dividend Stock") ? prev.filter((filter) => filter !== "Dividend Stock") : [...prev, "Dividend Stock"]))}
                            className={selectedFilters.includes("Dividend Stock") ? "active" : ""}
                        >
                            Dividend Stock
                        </button>
                    </div>
                </div>

                {/* Sector Buttons */}
                <div className="neo-screener-sectors">
                    {sectors.map((sector) => (
                        <button
                            key={sector}
                            onClick={() => setSelectedFilters((prev) => (prev.includes(sector) ? prev.filter((filter) => filter !== sector) : [...prev, sector]))}
                            className={selectedFilters.includes(sector) ? "active" : ""}
                        >
                            {sector}
                        </button>
                    ))}
                    {/* Slider with Labels */}
                    <div className="slider-container"
                         style={{textAlign: "center", marginTop: "15px", position: "relative"}}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "5px",
                            fontSize: "14px",
                            fontWeight: "bold" // Makes the text bold
                        }}>
                            <span style={{
                                position: "absolute",
                                left: "0",
                                transform: "translateY(-50%)",
                                transform: "translateX(-120%)"
                            }}>Undervalued</span>
                            <span style={{
                                position: "absolute",
                                right: "0",
                                transform: "translateY(-50%)",
                                transform: "translateX(120%)"
                            }}>Overvalued</span>
                        </div>
                        <Slider
                            range
                            min={0}
                            max={100}
                            step={1}
                            value={sliderRange}
                            onChange={handleSliderChange}
                            trackStyle={[{backgroundColor: "#3b82f6"}]}
                            handleStyle={[
                                {borderColor: "#3b82f6", backgroundColor: "#fff"},
                                {borderColor: "#3b82f6", backgroundColor: "#fff"},
                            ]}
                        />
                        <label style={{display: "block", marginTop: "-30px", marginBottom: "20px", fontSize: "14px",fontWeight: "bold"}}>
                            P/E Ratio : {sliderRange[0]} - {sliderRange[1]}
                        </label>
                    </div>

                </div>

                {/* Display Screener Data */}
                <table>
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>% Change</th>
                        <th>Volume</th>
                        <th>Market Cap</th>
                        <th>52 Week High</th>
                        <th>52 Week Low</th>
                        <th>Dividend Yield</th>
                    </tr>
                    </thead>
                    <tbody>
                    {screenerData.map((stock) => (
                        <tr key={stock.symbol}>
                            <td>{stock.symbol}</td>
                            <td>{stock.price.toFixed(2)}</td>
                            <td>{stock.percent_change.toFixed(2)}%</td>
                            <td>{stock.volume}</td>
                            <td>₹{(stock.market_cap / 1e7).toFixed(2)}cr</td>
                            <td>{stock["52_week_high"].toFixed(2)}</td>
                            <td>{stock["52_week_low"].toFixed(2)}</td>
                            <td>{stock.dividend_yield ? stock.dividend_yield.toFixed(2) + '%' : 'None'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>


            {/* Gainers and Losers Section */}
            <section className="gainers-losers">
                <div className="gainers-losers-layout">
                    <aside className="sector-sidebar">
                        <h3>Sectors</h3>
                        <ul className="sector-buttons">
                            <li>
                                <button
                                    onClick={() => setSelectedSector("All")}
                                    className={selectedSector === "All" ? "active" : ""}
                                >
                                    All
                                </button>
                            </li>
                            {sectors.map((sector) => (
                                <li key={sector}>
                                    <button
                                        onClick={() => setSelectedSector(sector)}
                                        className={selectedSector === sector ? "active" : ""}
                                    >
                                        {sector}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <div className="gainers-losers-content">
                        <h2>Top Gainers & Losers</h2>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <div className="gainers-losers-container">
                                <div className="gainers">
                                    <h3>Top Gainers</h3>
                                    <ul>
                                        {gainers.map((gainer) => (
                                            <li key={gainer.symbol}>
                                                <span>{gainer.symbol}</span>
                                                <span>+{gainer.percent_change.toFixed(2)}%</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="losers">
                                    <h3>Top Losers</h3>
                                    <ul>
                                        {losers.map((loser) => (
                                            <li key={loser.symbol}>
                                                <span>{loser.symbol}</span>
                                                <span>{loser.percent_change.toFixed(2)}%</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarketOverview;
