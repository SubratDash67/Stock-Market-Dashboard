from data_processor import load_stock_data, get_stock_date_range

# Test with a sample stock
stock_data = load_stock_data("20MICRONS", "ns")
if stock_data is not None:
    print(f"Loaded {len(stock_data)} rows of data")
    print(stock_data.head())

    # Test date range function
    start_date, end_date = get_stock_date_range("20MICRONS", "ns")
    print(f"Stock data available from {start_date} to {end_date}")
else:
    print("Failed to load stock data")
