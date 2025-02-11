import pandas as pd

# Load the CSV file
file_path = r"stocksim\backend\stock_data.csv"
df = pd.read_csv(file_path)

# Extract stock names
bo_stocks = df[df["symbol"].str.endswith(".BO")]["symbol"]
ns_stocks = df[df["symbol"].str.endswith(".NS")]["symbol"]

# Save to separate text files
bo_stocks.to_csv("BO_stocks.txt", index=False, header=False)
ns_stocks.to_csv("NS_stocks.txt", index=False, header=False)

print("Stock names extracted successfully!")
