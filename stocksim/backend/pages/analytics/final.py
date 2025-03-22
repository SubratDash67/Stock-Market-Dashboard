from stock_utils import get_stock_suggestions
from data_processor import load_stock_data, get_stock_date_range
from analysis_strategies import calculate_moving_averages, calculate_rsi


def test_stock_suggestions():
    """Test stock suggestion functionality"""
    results = get_stock_suggestions("MICRO")
    print(f"Stock suggestions for 'MICRO': {results}")


def test_data_loading():
    """Test data loading functionality"""
    stock_data = load_stock_data("20MICRONS", "ns")
    if stock_data is not None:
        print(f"Successfully loaded {len(stock_data)} rows of data for 20MICRONS-ns")
        print(stock_data.head())

        # Test date range function
        start_date, end_date = get_stock_date_range("20MICRONS", "ns")
        print(f"Stock data available from {start_date} to {end_date}")
    else:
        print("Failed to load stock data")


def test_analysis_strategies():
    """Test analysis strategies"""
    stock_data = load_stock_data("20MICRONS", "ns")
    if stock_data is not None:
        # Test moving averages
        ma_data = calculate_moving_averages(stock_data)
        print("\nMoving Averages:")
        print(
            ma_data[["Date", "Close", "SMA_20", "SMA_50", "Signal", "Position"]].tail()
        )

        # Test RSI
        rsi_data = calculate_rsi(stock_data)
        print("\nRSI:")
        print(rsi_data[["Date", "Close", "RSI", "RSI_Signal"]].tail())
    else:
        print("Failed to load stock data")


if __name__ == "__main__":
    print("Testing stock suggestions...")
    test_stock_suggestions()

    print("\nTesting data loading...")
    test_data_loading()

    print("\nTesting analysis strategies...")
    test_analysis_strategies()
