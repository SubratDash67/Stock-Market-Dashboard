import os
import shutil

# Define the paths
path_1990_2020 = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\stocksim\backend\data_1990_2020\stock_data"
path_2021 = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard\stocksim\backend\data_2021\stock_data"
bo_stocks_file = r"BO_stocks.txt"
ns_stocks_file = r"NS_stocks.txt"

# Create output directories
os.makedirs("historic_bo_data", exist_ok=True)
os.makedirs("historic_ns_data", exist_ok=True)

# Read BO and NS stock lists
with open(bo_stocks_file, "r") as f:
    bo_stocks = set(line.strip().split(".")[0] for line in f)

with open(ns_stocks_file, "r") as f:
    ns_stocks = set(line.strip().split(".")[0] for line in f)


# Function to process files in a directory
def process_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".csv"):
            stock_name = os.path.splitext(filename)[0]

            if stock_name in bo_stocks:
                new_filename = f"{stock_name}-bo.csv"
                dst = os.path.join("historic_bo_data", new_filename)
            elif stock_name in ns_stocks:
                new_filename = f"{stock_name}-ns.csv"
                dst = os.path.join("historic_ns_data", new_filename)
            else:
                print(f"Skipping {filename}: Not found in BO or NS stock lists")
                continue

            src = os.path.join(directory, filename)
            try:
                shutil.copy2(src, dst)
                print(f"Copied and renamed {filename} to {new_filename}")
            except FileNotFoundError:
                print(f"Error: File {filename} not found")
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")


# Process both directories
process_directory(path_1990_2020)
process_directory(path_2021)
