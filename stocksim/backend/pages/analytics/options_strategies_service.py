import pandas as pd
import numpy as np
import math


def calculate_covered_call(stock_price, strike_price, premium, quantity=1):
    """Calculate P&L for covered call strategy

    Args:
        stock_price (float): Current stock price
        strike_price (float): Strike price of the call option
        premium (float): Premium received for selling the call option
        quantity (int): Number of shares/contracts

    Returns:
        dict: P&L data for covered call strategy
    """
    # Calculate maximum profit and loss
    max_profit = ((strike_price - stock_price) + premium) * quantity
    max_loss = (
        stock_price - premium
    ) * quantity  # Theoretical max loss if stock goes to zero

    # Calculate breakeven point
    breakeven = stock_price - premium

    # Generate P&L data for different stock prices
    price_range = np.linspace(max(0, stock_price * 0.5), stock_price * 1.5, 50)
    pl_data = []

    for price in price_range:
        if price <= strike_price:
            pl = ((price - stock_price) + premium) * quantity
        else:
            pl = ((strike_price - stock_price) + premium) * quantity

        pl_data.append({"stock_price": float(price), "pl": float(pl)})

    # Return strategy data
    covered_call_data = {
        "strategy_type": "Covered Call",
        "parameters": {
            "stock_price": stock_price,
            "strike_price": strike_price,
            "premium": premium,
            "quantity": quantity,
        },
        "metrics": {
            "max_profit": float(max_profit),
            "max_loss": float(max_loss),
            "breakeven": float(breakeven),
        },
        "pl_data": pl_data,
    }

    return covered_call_data


def calculate_straddle(
    stock_price,
    strike_price,
    call_premium,
    put_premium,
    quantity=1,
    position_type="long",
):
    """Calculate P&L for straddle strategy

    Args:
        stock_price (float): Current stock price
        strike_price (float): Strike price of the options
        call_premium (float): Premium of the call option
        put_premium (float): Premium of the put option
        quantity (int): Number of contracts
        position_type (str): "long" or "short"

    Returns:
        dict: P&L data for straddle strategy
    """
    # Calculate total premium
    total_premium = (call_premium + put_premium) * quantity

    # Calculate breakeven points
    upper_breakeven = (
        strike_price + total_premium
        if position_type == "long"
        else strike_price + total_premium / quantity
    )
    lower_breakeven = (
        strike_price - total_premium
        if position_type == "long"
        else strike_price - total_premium / quantity
    )

    # Generate P&L data for different stock prices
    price_range = np.linspace(max(0, stock_price * 0.5), stock_price * 1.5, 50)
    pl_data = []

    for price in price_range:
        if position_type == "long":
            # Long straddle
            if price <= strike_price:
                pl = ((strike_price - price) - total_premium) * quantity
            else:
                pl = ((price - strike_price) - total_premium) * quantity
        else:
            # Short straddle
            if price <= strike_price:
                pl = (total_premium - (strike_price - price)) * quantity
            else:
                pl = (total_premium - (price - strike_price)) * quantity

        pl_data.append({"stock_price": float(price), "pl": float(pl)})

    # Calculate maximum profit and loss
    if position_type == "long":
        max_profit = float("inf")  # Theoretically unlimited profit potential
        max_loss = total_premium
    else:
        max_profit = total_premium
        max_loss = float("inf")  # Theoretically unlimited loss potential

    # Return strategy data
    straddle_data = {
        "strategy_type": f"{position_type.capitalize()} Straddle",
        "parameters": {
            "stock_price": stock_price,
            "strike_price": strike_price,
            "call_premium": call_premium,
            "put_premium": put_premium,
            "quantity": quantity,
            "position_type": position_type,
        },
        "metrics": {
            "max_profit": (
                "Unlimited" if max_profit == float("inf") else float(max_profit)
            ),
            "max_loss": "Unlimited" if max_loss == float("inf") else float(max_loss),
            "upper_breakeven": float(upper_breakeven),
            "lower_breakeven": float(lower_breakeven),
        },
        "pl_data": pl_data,
    }

    return straddle_data


def calculate_iron_condor(
    stock_price,
    call_short_strike,
    call_long_strike,
    put_short_strike,
    put_long_strike,
    net_credit,
    quantity=1,
):
    """Calculate P&L for iron condor strategy

    Args:
        stock_price (float): Current stock price
        call_short_strike (float): Strike price of the short call
        call_long_strike (float): Strike price of the long call
        put_short_strike (float): Strike price of the short put
        put_long_strike (float): Strike price of the long put
        net_credit (float): Net credit received
        quantity (int): Number of contracts

    Returns:
        dict: P&L data for iron condor strategy
    """
    # Validate strikes
    if not (put_long_strike < put_short_strike < call_short_strike < call_long_strike):
        return None

    # Calculate width of spreads
    call_spread_width = call_long_strike - call_short_strike
    put_spread_width = put_short_strike - put_long_strike

    # Calculate maximum profit and loss
    max_profit = net_credit * quantity
    max_loss = (max(call_spread_width, put_spread_width) - net_credit) * quantity

    # Calculate breakeven points
    upper_breakeven = call_short_strike + net_credit
    lower_breakeven = put_short_strike - net_credit

    # Generate P&L data for different stock prices
    price_range = np.linspace(put_long_strike * 0.9, call_long_strike * 1.1, 50)
    pl_data = []

    for price in price_range:
        if price <= put_long_strike:
            pl = (net_credit - put_spread_width) * quantity
        elif price <= put_short_strike:
            pl = (net_credit - (put_short_strike - price)) * quantity
        elif price <= call_short_strike:
            pl = net_credit * quantity
        elif price <= call_long_strike:
            pl = (net_credit - (price - call_short_strike)) * quantity
        else:
            pl = (net_credit - call_spread_width) * quantity

        pl_data.append({"stock_price": float(price), "pl": float(pl)})

    # Return strategy data
    iron_condor_data = {
        "strategy_type": "Iron Condor",
        "parameters": {
            "stock_price": stock_price,
            "call_short_strike": call_short_strike,
            "call_long_strike": call_long_strike,
            "put_short_strike": put_short_strike,
            "put_long_strike": put_long_strike,
            "net_credit": net_credit,
            "quantity": quantity,
        },
        "metrics": {
            "max_profit": float(max_profit),
            "max_loss": float(max_loss),
            "upper_breakeven": float(upper_breakeven),
            "lower_breakeven": float(lower_breakeven),
        },
        "pl_data": pl_data,
    }

    return iron_condor_data
