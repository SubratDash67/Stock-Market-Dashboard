import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, Container, Row, Col, Spinner, Alert, Image, Table, Tabs, Tab } from 'react-bootstrap';
import './AnalyticsStrategiesPage.css';

const API_BASE_URL = 'http://localhost:5000/analytics/api';

const AnalyticsStrategiesPage = () => {
  // State variables
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('ns');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shortWindow, setShortWindow] = useState(20);
  const [longWindow, setLongWindow] = useState(50);
  const [rsiWindow, setRsiWindow] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maData, setMaData] = useState(null);
  const [rsiData, setRsiData] = useState(null);
  const [activeTab, setActiveTab] = useState('moving-average');

  // Fetch stock suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/stock-suggestions`, {
          params: { query }
        });
        setSuggestions(response.data.suggestions || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  // Fetch stock info when a stock is selected
  useEffect(() => {
    const fetchStockInfo = async () => {
      if (!selectedStock) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/analytics/stock-info`, {
          params: { stock: selectedStock, exchange: selectedExchange }
        });
        
        if (response.data.dateRange) {
          setDateRange(response.data.dateRange);
          setStartDate(response.data.dateRange.start);
          setEndDate(response.data.dateRange.end);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stock info:', err);
        setError('Failed to fetch stock information');
        setLoading(false);
      }
    };

    fetchStockInfo();
  }, [selectedStock, selectedExchange]);

  // Handle stock selection from suggestions
  const handleSelectStock = (stock) => {
    const parts = stock.split('.');
    if (parts.length === 2) {
      setSelectedStock(parts[0]);
      setSelectedExchange(parts[1].toLowerCase());
    } else {
      setSelectedStock(stock);
    }
    setQuery('');
    setSuggestions([]);
  };

  // Fetch moving average analysis
  const fetchMovingAverageAnalysis = async () => {
    if (!selectedStock) {
      setError('Please select a stock first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/analytics/moving-average`, {
        params: {
          stock: selectedStock,
          exchange: selectedExchange,
          start_date: startDate,
          end_date: endDate,
          short_window: shortWindow,
          long_window: longWindow
        }
      });
      
      setMaData(response.data);
      setActiveTab('moving-average');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching moving average analysis:', err);
      setError('Failed to fetch moving average analysis');
      setLoading(false);
    }
  };

  // Fetch RSI analysis
  const fetchRsiAnalysis = async () => {
    if (!selectedStock) {
      setError('Please select a stock first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/analytics/rsi`, {
        params: {
          stock: selectedStock,
          exchange: selectedExchange,
          start_date: startDate,
          end_date: endDate,
          window: rsiWindow
        }
      });
      
      setRsiData(response.data);
      setActiveTab('rsi');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching RSI analysis:', err);
      setError('Failed to fetch RSI analysis');
      setLoading(false);
    }
  };

  return (
    <Container className="analytics-page">
      <h1 className="page-title">Stock Analysis Strategies</h1>
      
      <Card className="mb-4">
        <Card.Header>Select Stock</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Search for a stock</Form.Label>
                  <div className="suggestion-container">
                    <Form.Control
                      type="text"
                      placeholder="Enter stock name or symbol"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {suggestions.length > 0 && (
                      <div className="suggestions-dropdown">
                        {suggestions.map((stock, index) => (
                          <div 
                            key={index} 
                            className="suggestion-item"
                            onClick={() => handleSelectStock(stock)}
                          >
                            {stock}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Selected Stock</Form.Label>
                  <div className="selected-stock">
                    {selectedStock ? (
                      <span>{selectedStock}.{selectedExchange.toUpperCase()}</span>
                    ) : (
                      <span className="text-muted">No stock selected</span>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {dateRange.start && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={dateRange.start}
                      max={dateRange.end}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={dateRange.start}
                      max={dateRange.end}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Moving Average Crossover Strategy</Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Short Window (days)</Form.Label>
                      <Form.Control
                        type="number"
                        min="5"
                        max="100"
                        value={shortWindow}
                        onChange={(e) => setShortWindow(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Long Window (days)</Form.Label>
                      <Form.Control
                        type="number"
                        min="20"
                        max="200"
                        value={longWindow}
                        onChange={(e) => setLongWindow(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button 
                  variant="primary" 
                  onClick={fetchMovingAverageAnalysis}
                  disabled={!selectedStock || loading}
                >
                  Analyze Moving Averages
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Relative Strength Index (RSI) Strategy</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>RSI Window (days)</Form.Label>
                  <Form.Control
                    type="number"
                    min="7"
                    max="30"
                    value={rsiWindow}
                    onChange={(e) => setRsiWindow(parseInt(e.target.value))}
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  onClick={fetchRsiAnalysis}
                  disabled={!selectedStock || loading}
                >
                  Analyze RSI
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {(maData || rsiData) && (
        <Card className="mb-4">
          <Card.Header>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="moving-average" title="Moving Average Crossover">
                {maData && (
                  <div className="analysis-results">
                    <h3>Moving Average Analysis Results</h3>
                    <div className="summary-box">
                      <div className="summary-item">
                        <span className="label">Total Periods:</span>
                        <span className="value">{maData.summary.totalPeriods}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Buy Signals:</span>
                        <span className="value">{maData.summary.buySignals}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Sell Signals:</span>
                        <span className="value">{maData.summary.sellSignals}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Last Signal:</span>
                        <span className={`value ${maData.summary.lastSignal === 'Buy' ? 'text-success' : 'text-danger'}`}>
                          {maData.summary.lastSignal}
                        </span>
                      </div>
                    </div>
                    
                    <div className="chart-container">
                      <h4>Moving Average Crossover Chart</h4>
                      <Image 
                        src={`data:image/png;base64,${maData.chart}`} 
                        alt="Moving Average Chart" 
                        fluid 
                      />
                    </div>
                    
                    <div className="data-table">
                      <h4>Recent Data</h4>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Close</th>
                            <th>SMA_{shortWindow}</th>
                            <th>SMA_{longWindow}</th>
                            <th>Signal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maData.data.map((row, index) => (
                            <tr key={index}>
                              <td>{row.Date}</td>
                              <td>{row.Close.toFixed(2)}</td>
                              <td>{row[`SMA_${shortWindow}`].toFixed(2)}</td>
                              <td>{row[`SMA_${longWindow}`].toFixed(2)}</td>
                              <td className={row.Signal === 1 ? 'text-success' : 'text-danger'}>
                                {row.Signal === 1 ? 'Buy' : 'Sell'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </Tab>
              
              <Tab eventKey="rsi" title="RSI Analysis">
                {rsiData && (
                  <div className="analysis-results">
                    <h3>RSI Analysis Results</h3>
                    <div className="summary-box">
                      <div className="summary-item">
                        <span className="label">Total Periods:</span>
                        <span className="value">{rsiData.summary.totalPeriods}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Oversold Signals:</span>
                        <span className="value">{rsiData.summary.oversoldSignals}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Overbought Signals:</span>
                        <span className="value">{rsiData.summary.overboughtSignals}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Current RSI:</span>
                        <span className="value">{rsiData.summary.currentRSI.toFixed(2)}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Current Status:</span>
                        <span className={`value ${
                          rsiData.summary.currentStatus === 'Overbought' ? 'text-danger' : 
                          rsiData.summary.currentStatus === 'Oversold' ? 'text-success' : 
                          'text-warning'
                        }`}>
                          {rsiData.summary.currentStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="chart-container">
                      <h4>RSI Chart</h4>
                      <Image 
                        src={`data:image/png;base64,${rsiData.chart}`} 
                        alt="RSI Chart" 
                        fluid 
                      />
                    </div>
                    
                    <div className="data-table">
                      <h4>Recent Data</h4>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Close</th>
                            <th>RSI</th>
                            <th>Signal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rsiData.data.map((row, index) => (
                            <tr key={index}>
                              <td>{row.Date}</td>
                              <td>{row.Close.toFixed(2)}</td>
                              <td>{row.RSI.toFixed(2)}</td>
                              <td>
                                {row.RSI_Signal === 1 ? (
                                  <span className="text-success">Oversold (Buy)</span>
                                ) : row.RSI_Signal === -1 ? (
                                  <span className="text-danger">Overbought (Sell)</span>
                                ) : (
                                  <span className="text-muted">Neutral</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </Tab>
            </Tabs>
          </Card.Header>
        </Card>
      )}
    </Container>
  );
};

export default AnalyticsStrategiesPage;
