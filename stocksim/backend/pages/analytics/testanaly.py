from data_processor import load_stock_data
from analysis_strategies import calculate_moving_averages, calculate_rsi

# Test with a sample stock
stock_data = load_stock_data("20MICRONS", "ns")
if stock_data is not None:
    # Test moving averages
    ma_data = calculate_moving_averages(stock_data)
    print("Moving Averages:")
    print(ma_data[["Date", "Close", "SMA_20", "SMA_50", "Signal", "Position"]].tail())

    # Test RSI
    rsi_data = calculate_rsi(stock_data)
    print("\nRSI:")
    print(rsi_data[["Date", "Close", "RSI", "RSI_Signal"]].tail())
else:
    print("Failed to load stock data")
