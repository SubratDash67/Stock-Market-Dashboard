// File: src/pages/TradePage.js
import React, { useState } from "react";
import "./TradePage.css";

const TradePage = () => {
    const [form, setForm] = useState({
        symbol: "",
        quantity: "",
        orderType: "Market",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Trade Submitted: ${JSON.stringify(form)}`);
    };

    return (
        <div className="trade-page">
            {/* Trade Interface */}
            <section className="trade-interface">
                <h2>Trade Interface</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={form.symbol}
                            onChange={handleChange}
                            placeholder="Enter stock symbol"
                        />
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                        />
                    </div>
                    <div>
                        <label>Order Type</label>
                        <select
                            name="orderType"
                            value={form.orderType}
                            onChange={handleChange}
                        >
                            <option value="Market">Market</option>
                            <option value="Limit">Limit</option>
                            <option value="Stop Loss">Stop Loss</option>
                        </select>
                    </div>
                    <button type="submit">Place Order</button>
                </form>
            </section>

            {/* Advanced Options Chain */}
            <section className="options-chain">
                <h2>Advanced Options Chain</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Strike Price</th>
                        <th>Call OI</th>
                        <th>Put OI</th>
                        <th>IV</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>15,000</td>
                        <td>12,000</td>
                        <td>8,000</td>
                        <td>18%</td>
                    </tr>
                    <tr>
                        <td>15,500</td>
                        <td>10,500</td>
                        <td>7,200</td>
                        <td>20%</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            {/* Basket Orders */}
            <section className="basket-orders">
                <h2>Basket Orders</h2>
                <p>Create and execute multiple trades in one order.</p>
                <button>Add Trade</button>
                <button>Execute Basket</button>
            </section>

            {/* Options Analyzer */}
            <section className="options-analyzer">
                <h2>Options Analyzer</h2>
                <p>Visualize risk-reward scenarios for your options strategies.</p>
                {/* Placeholder for charts or diagrams */}
            </section>
        </div>
    );
};

export default TradePage;
