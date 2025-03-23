import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TradePage.css";

const TradePage = () => {
    const [form, setForm] = useState({
        symbol: "",
        quantity: "",
        orderType: "Market",
        limitPrice: "",
    });
    const [message, setMessage] = useState("");
    const [portfolio, setPortfolio] = useState([]);
    const [basket, setBasket] = useState([]);
    const [livePrice, setLivePrice] = useState(null);
    const [livePrices, setLivePrices] = useState({});

    const fetchLivePrice = async (symbol) => {
        if (!symbol) return;

        try {
            const response = await axios.get(`http://localhost:5000/trade/price?symbol=${symbol}`);
            const price = response.data.price;

            setLivePrices((prevPrices) => ({
                ...prevPrices,
                [symbol]: price,
            }));
            setLivePrice(price); // ✅ Store price for confirmation modal
        } catch (error) {
            console.error("Failed to fetch live price", error);
            setLivePrices((prevPrices) => ({
                ...prevPrices,
                [symbol]: null, // ✅ Handle API failures gracefully
            }));
        }
    };


    useEffect(() => {
        fetchBasket();  // ✅ Load basket on page load

        if (form.symbol) {
            fetchLivePrice(form.symbol);  // ✅ Fetch price ONLY when symbol changes
        }
    }, [form.symbol]);  // ✅ Runs only when stock symbol changes


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === "orderType" && value === "Market") {
            setForm({ ...form, limitPrice: "" });
        }
    };

    const handleTrade = async (tradeType) => {
        try {
            const response = await axios.post(`http://localhost:5000/trade/${tradeType}`, {
                symbol: form.symbol,
                quantity: parseInt(form.quantity),
                order_type: form.orderType,
                limit_price: form.limitPrice || null,
            });

            setMessage(response.data.message);
            updatePortfolio();
        } catch (error) {
            setMessage(error.response?.data?.error || "Trade failed");
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        handleTrade("buy");
    };

    const handleSell = () => {
        handleTrade("sell");
    };

    const clearForm = () => {
        setForm({ symbol: "", quantity: "", orderType: "Market", limitPrice: "" });
        setMessage("");
    };

    const updatePortfolio = async () => {
        try {
            const response = await axios.get("http://localhost:5000/trade/portfolio");
            setPortfolio(response.data);
        } catch (error) {
            console.error("Failed to fetch portfolio", error);
        }
    };

    const addTradeToBasket = async () => {
        try {
            const response = await axios.post("http://localhost:5000/trade/basket/add", {
                symbol: form.symbol,
                quantity: parseInt(form.quantity),
                order_type: form.orderType,
                trade_type: "Buy",
                limit_price: form.limitPrice || null,
            });

            setMessage(response.data.message);
            fetchBasket();
        } catch (error) {
            setMessage("Failed to add trade to basket");
        }
    };

    const executeBasket = async () => {
        try {
            const response = await axios.post("http://localhost:5000/trade/basket/execute");
            setMessage(response.data.message);
            setBasket([]);
        } catch (error) {
            setMessage("Failed to execute basket");
        }
    };

    const clearBasket = async () => {
        setBasket([]);
        setMessage("Basket cleared!");
    };

    const fetchBasket = async () => {
        try {
            const response = await axios.get("http://localhost:5000/trade/basket");
            setBasket(response.data.basket);
        } catch (error) {
            console.error("Failed to fetch basket", error);
        }
    };
    const [showModal, setShowModal] = useState(false);

    const confirmTrade = () => {
        setShowModal(true);
    };

    const executeConfirmedTrade = () => {
        setShowModal(false);
        handleTrade("buy");
    };
    const [suggestions, setSuggestions] = useState([]);

    const handleSymbolChange = async (e) => {
        const { value } = e.target;
        setForm({ ...form, symbol: value });

        if (value.length > 1) {
            try {
                const response = await axios.get(`http://localhost:5000/trade/suggestions?query=${value}`);
                setSuggestions(response.data.suggestions); // ✅ Fix API response handling
            } catch (error) {
                console.error("Failed to fetch symbols", error);
            }
        } else {
            setSuggestions([]);  // ✅ Clear suggestions when input is empty
        }
    };

    const selectSymbol = (symbol) => {
        setForm({ ...form, symbol });
        setSuggestions([]);
    };
    const removeFromBasket = async (index) => {
        try {
            const tradeToRemove = basket[index]; // Get trade details

            await axios.post("http://localhost:5000/trade/basket/remove", {
                symbol: tradeToRemove.symbol,
                quantity: tradeToRemove.quantity,
                order_type: tradeToRemove.order_type,
                trade_type: tradeToRemove.trade_type,
                limit_price: tradeToRemove.limit_price || null,
            });

            fetchBasket(); // Refresh basket from backend
            setMessage("Trade removed from basket");
        } catch (error) {
            console.error("Failed to remove trade from basket", error);
            setMessage("Failed to remove trade from basket");
        }
    };


    return (
        <div className="trade-page">
            <h1 id="page-heading">Trade Interface</h1>
            <p className="section-description">
                The Trade Interface allows you to place buy and sell orders for stocks. Enter the stock symbol, specify
                the quantity, and choose an order type: "Market" (executes at the current price), "Limit" (executes at a
                specified price), or "Stop Loss" (executes when a trigger price is reached). Live price updates are
                available for selected stocks. Before confirming a trade, you can review details in a confirmation
                modal. You can also add trades to the Basket for batch execution or save them for later.
            </p>
            {/* Trade Interface */}
            <section className="trade-interface">
                {message && <p className="trade-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={form.symbol}
                            onChange={handleSymbolChange}
                            placeholder="Enter stock symbol"
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions">
                                {suggestions.map((s, index) => (
                                    <li key={index} onClick={() => selectSymbol(s)}>{s}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <div>
                        <label>Order Type</label>
                        <select name="orderType" value={form.orderType} onChange={handleChange}>
                            <option value="Market">Market</option>
                            <option value="Limit">Limit</option>
                            <option value="Stop Loss">Stop Loss</option>
                        </select>
                    </div>
                    {showModal && (
                        <div className="modal">
                            <h3>Confirm Trade</h3>
                            <p><strong>Symbol:</strong> {form.symbol}</p>
                            <p><strong>Quantity:</strong> {form.quantity}</p>
                            <p><strong>Order Type:</strong> {form.orderType}</p>
                            <p><strong>Price:</strong> {livePrice ? `₹${livePrice}` : "Fetching..."}</p>
                            <button onClick={executeConfirmedTrade}>Confirm</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    )}

                    {(form.orderType === "Limit" || form.orderType === "Stop Loss") && (
                        <div>
                            <label>Limit/Stop-Loss Price</label>
                            <input
                                type="number"
                                name="limitPrice"
                                value={form.limitPrice || ""}
                                onChange={handleChange}
                                placeholder="Enter price"
                                required
                            />
                        </div>
                    )}

                    <div className="trade-buttons">
                        <button type="button" onClick={confirmTrade}>Buy</button>
                        <button type="button" onClick={handleSell}>Sell</button>
                        <button type="button" onClick={clearForm}>Clear</button>
                        <button type="button" onClick={addTradeToBasket}>Add Trade to Basket</button>
                    </div>
                </form>
            </section>

            {/* Portfolio Section */}
            <section className="portfolio">
                <h2>My Portfolio</h2>
                <p className="section-description">
                    The My Portfolio section provides an overview of your stock holdings, including the quantity held,
                    average purchase price, current market price, and profit/loss calculations. Click "Refresh
                    Portfolio" to update stock prices in real-time. Profit or loss for each stock is calculated based on
                    the latest price and is color-coded: green for gains and red for losses. Use this section to monitor
                    your investments and make informed trading decisions.
                </p>

                <button onClick={updatePortfolio}>Refresh Portfolio</button>
                {portfolio.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Avg Price</th>
                            <th>Current Price</th>
                            <th>Profit/Loss</th>
                        </tr>
                        </thead>
                        <tbody>
                        {portfolio.map((stock, index) => {
                            const currentPrice = livePrices[stock.symbol] ?? stock.avg_price;
                            const profitLoss = ((currentPrice - stock.avg_price) * stock.quantity).toFixed(2);
                            return (
                                <tr key={index}>
                                    <td>{stock.symbol}</td>
                                    <td>{stock.quantity}</td>
                                    <td>₹{stock.avg_price.toFixed(2)}</td>
                                    <td>₹{currentPrice.toFixed(2)}</td>
                                    <td className={profitLoss >= 0 ? "profit" : "loss"}>₹{profitLoss}</td>
                                </tr>
                            );
                        })}
                        </tbody>

                    </table>
                ) : (
                    <p>No stocks in portfolio.</p>
                )}
            </section>

            {/* Basket Orders */}
            <section className="basket-orders">
                <h2>Basket Orders</h2>
                <p className="section-description">
                    Basket Orders allow you to group multiple trades and execute them in a single transaction. Add buy or sell orders to the basket by selecting stock symbols, quantities, and order types. Once your basket is ready, you can execute all trades at once or remove individual orders before execution. This feature helps streamline trading and ensures efficient order placement, especially when managing multiple stocks.
                </p>
                <ul>
                    {basket.length > 0 ? (
                        basket.map((trade, index) => (
                            <li key={index}>
                                {trade.trade_type} {trade.quantity} {trade.symbol} @ {trade.order_type}
                                {trade.limit_price ? ` (Limit Price: ₹${trade.limit_price})` : ""}
                                <button onClick={() => removeFromBasket(index)}>
                                    <img src="./remove.png" alt="Remove"
                                         style={{width: "20px", height: "20px"}}/>
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No trades in basket.</p>
                    )}
                </ul>
                <div className="basket-buttons">
                    <button onClick={executeBasket}>Execute Basket</button>
                    <button onClick={clearBasket}>Clear Basket</button>
                </div>
            </section>
        </div>
    );
};

export default TradePage;
