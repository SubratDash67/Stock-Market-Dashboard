# Stock Market Dashboard 🚀

A full-stack **Stock Market Dashboard** application that enables **dummy trading**, provides **technical indicators-based analysis**, and showcases various visualizations for stock analysis. This project aims to provide a comprehensive platform for stock enthusiasts to practice trading and analyze trends using RSI and moving averages over historical data.

---

## 🌟 Features!

1. **Dummy Trading**: Simulate buying and selling of stocks with virtual money.
2. **Technical Analysis**: Analyze stock trends using RSI and Moving Averages.
3. **Stock Visualizations**: Analyze data with advanced charts and graphs.
4. **User Authentication**: Secure login and personalized dashboards.
5. **Historical Data**: Access past stock prices and trends.

---

## 🛠️ Tech Stack

### Frontend:

- **React.js**: Responsive and dynamic user interface.

### Backend:

- **Flask**: Backend framework for APIs.
- **SQLite**: Database for storing user and stock data.

### Technical Analysis:

- **Pandas / NumPy**: Data preprocessing and manipulation.
- **TA-Lib**: For computing RSI and moving averages.

---

## 🚀 Setup & Installation

### Prerequisites:

- Node.js
- Python 3.x

### Clone the Repository:

```bash
git clone https://github.com/SubratDash67/Stock-Market-Dashboard
cd Stock-Market-Dashboard
```

### Install Backend Dependencies:

```bash
cd stocksim/backend
pip install -r requirements.txt
```

### Run the Backend Server:

```bash
python app.py
```

### Install Frontend Dependencies:

```bash
cd ../../
npm install
```

### Run the Frontend:

```bash
npm start
```

### Directory Structure:

- `api/` - Contains backend APIs.
- `cleaned_data/` - Processed stock data.
- `nifty/` - NIFTY index data.
- `stocksim/backend/` - Flask backend with SQLite database.
- `stocksim/src/` - React frontend source files.

This project allows users to analyze stocks, apply RSI and moving averages for insights, and practice trading in a simulated environment.
