import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import axios from 'axios';
import './AnalyticsStrategiesPage.css';

// Register Chart.js components
Chart.register(...registerables);

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

const AnalyticsStrategiesPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('historical');
  
  // State for stock selection
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  
  // State for date range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for historical data
  const [ohlcData, setOhlcData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  
  // State for moving averages
  const [showMA, setShowMA] = useState(false);
  const [maType, setMaType] = useState('simple');
  const [maWindow, setMaWindow] = useState(20);
  const [maData, setMaData] = useState(null);
  
  // State for technical indicators
  const [selectedIndicator, setSelectedIndicator] = useState('rsi');
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiData, setRsiData] = useState(null);
  const [macdFast, setMacdFast] = useState(12);
  const [macdSlow, setMacdSlow] = useState(26);
  const [macdSignal, setMacdSignal] = useState(9);
  const [macdData, setMacdData] = useState(null);
  const [bbPeriod, setBbPeriod] = useState(20);
  const [bbDeviation, setBbDeviation] = useState(2);
  const [bbData, setBbData] = useState(null);
  
  // State for stock comparison
  const [comparisonStocks, setComparisonStocks] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [sectorData, setSectorData] = useState(null);
  
  // State for trading strategies
  const [trendFollowingData, setTrendFollowingData] = useState(null);
  const [supportResistanceData, setSupportResistanceData] = useState(null);
  const [momentumData, setMomentumData] = useState(null);
  const [fastPeriod, setFastPeriod] = useState(20);
  const [slowPeriod, setSlowPeriod] = useState(50);
  const [srPeriod, setSrPeriod] = useState(20);
  const [srThreshold, setSrThreshold] = useState(0.03);
  const [rsiOverbought, setRsiOverbought] = useState(70);
  const [rsiOversold, setRsiOversold] = useState(30);
  
  // State for options strategies
  const [optionStrategy, setOptionStrategy] = useState('covered-call');
  const [optionParams, setOptionParams] = useState({
    stock_price: 100,
    strike_price: 110,
    premium: 5,
    call_premium: 5,
    put_premium: 5,
    position_type: 'long',
    call_short_strike: 110,
    call_long_strike: 120,
    put_short_strike: 90,
    put_long_strike: 80,
    net_credit: 5,
    quantity: 1
  });
  const [optionResults, setOptionResults] = useState(null);
  
  // State for market indicators
  const [niftyData, setNiftyData] = useState(null);
  const [sensexData, setSensexData] = useState(null);
  const [fiiDiiData, setFiiDiiData] = useState(null);
  
  // Refs for charts
  const priceChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const indicatorChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const trendFollowingChartRef = useRef(null);
  const supportResistanceChartRef = useRef(null);
  const momentumChartRef = useRef(null);
  const optionStrategyChartRef = useRef(null);
  const niftyChartRef = useRef(null);
  const sensexChartRef = useRef(null);
  const fiiDiiChartRef = useRef(null);
  
  // Chart instances
  const [priceChart, setPriceChart] = useState(null);
  const [volumeChart, setVolumeChart] = useState(null);
  const [indicatorChart, setIndicatorChart] = useState(null);
  const [comparisonChart, setComparisonChart] = useState(null);
  const [trendFollowingChart, setTrendFollowingChart] = useState(null);
  const [supportResistanceChart, setSupportResistanceChart] = useState(null);
  const [momentumChart, setMomentumChart] = useState(null);
  const [optionStrategyChart, setOptionStrategyChart] = useState(null);
  const [niftyChart, setNiftyChart] = useState(null);
  const [sensexChart, setSensexChart] = useState(null);
  const [fiiDiiChart, setFiiDiiChart] = useState(null);
  
  // Fetch list of stocks on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stocks`);
        setStocks(response.data);
      } catch (err) {
        setError(`Failed to fetch stocks: ${err.message}`);
      }
    };
    
    const fetchSectors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sectors`);
        setSectors(response.data);
        if (response.data.length > 0) {
          setSelectedSector(response.data[0]);
        }
      } catch (err) {
        console.error(`Failed to fetch sectors: ${err.message}`);
      }
    };
    
    fetchStocks();
    fetchSectors();
    
    // Set default dates (last 1 year)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    setEndDate(endDate.toISOString().split('T')[0]);
    setStartDate(startDate.toISOString().split('T')[0]);
  }, []);
  
  // Fetch data based on active tab
  const fetchHistoricalData = useCallback(async () => {
    if (!selectedStock || !selectedExchange) return;
    
    try {
      const [ohlcResponse, volumeResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/ohlc?start_date=${startDate}&end_date=${endDate}`),
        axios.get(`${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/volume?start_date=${startDate}&end_date=${endDate}`)
      ]);
      
      setOhlcData(ohlcResponse.data);
      setVolumeData(volumeResponse.data);
      
      if (showMA) {
        const maResponse = await axios.get(
          `${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/ma?window=${maWindow}&type=${maType}&start_date=${startDate}&end_date=${endDate}`
        );
        setMaData(maResponse.data);
      }
    } catch (err) {
      throw new Error(`Failed to fetch historical data: ${err.message}`);
    }
  }, [selectedStock, selectedExchange, startDate, endDate, showMA, maWindow, maType]);
  
  const fetchTechnicalIndicators = useCallback(async () => {
    if (!selectedStock || !selectedExchange) return;
    
    try {
      let response;
      
      switch (selectedIndicator) {
        case 'rsi':
          response = await axios.get(
            `${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/rsi?period=${rsiPeriod}&start_date=${startDate}&end_date=${endDate}`
          );
          setRsiData(response.data);
          break;
        
        case 'macd':
          response = await axios.get(
            `${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/macd?fast_period=${macdFast}&slow_period=${macdSlow}&signal_period=${macdSignal}&start_date=${startDate}&end_date=${endDate}`
          );
          setMacdData(response.data);
          break;
        
        case 'bollinger':
          response = await axios.get(
            `${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/bollinger?period=${bbPeriod}&std_dev=${bbDeviation}&start_date=${startDate}&end_date=${endDate}`
          );
          setBbData(response.data);
          break;
        
        default:
          break;
      }
    } catch (err) {
      throw new Error(`Failed to fetch technical indicators: ${err.message}`);
    }
  }, [
    selectedStock, 
    selectedExchange, 
    selectedIndicator, 
    rsiPeriod, 
    macdFast, 
    macdSlow, 
    macdSignal, 
    bbPeriod, 
    bbDeviation, 
    startDate, 
    endDate
  ]);
  
  const fetchComparisonData = useCallback(async () => {
    if (comparisonStocks.length === 0) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/comparison/stocks`, {
        stocks: comparisonStocks.map(stock => stock.name),
        exchanges: comparisonStocks.map(stock => stock.exchange),
        start_date: startDate,
        end_date: endDate
      });
      
      setComparisonData(response.data);
    } catch (err) {
      throw new Error(`Failed to fetch comparison data: ${err.message}`);
    }
  }, [comparisonStocks, startDate, endDate]);
  
  const fetchSectorData = useCallback(async () => {
    if (!selectedSector) return;
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comparison/sectors/${selectedSector}?start_date=${startDate}&end_date=${endDate}`
      );
      
      setSectorData(response.data);
    } catch (err) {
      throw new Error(`Failed to fetch sector data: ${err.message}`);
    }
  }, [selectedSector, startDate, endDate]);
  
  const fetchTradingStrategies = useCallback(async () => {
    if (!selectedStock || !selectedExchange) return;
    
    try {
      const [trendResponse, srResponse, momentumResponse] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/strategies/trend-following/${selectedStock}/${selectedExchange}?fast_period=${fastPeriod}&slow_period=${slowPeriod}&start_date=${startDate}&end_date=${endDate}`
        ),
        axios.get(
          `${API_BASE_URL}/strategies/support-resistance/${selectedStock}/${selectedExchange}?period=${srPeriod}&threshold=${srThreshold}&start_date=${startDate}&end_date=${endDate}`
        ),
        axios.get(
          `${API_BASE_URL}/strategies/momentum/${selectedStock}/${selectedExchange}?rsi_period=${rsiPeriod}&rsi_overbought=${rsiOverbought}&rsi_oversold=${rsiOversold}&start_date=${startDate}&end_date=${endDate}`
        )
      ]);
      
      setTrendFollowingData(trendResponse.data);
      setSupportResistanceData(srResponse.data);
      setMomentumData(momentumResponse.data);
    } catch (err) {
      throw new Error(`Failed to fetch trading strategies: ${err.message}`);
    }
  }, [
    selectedStock, 
    selectedExchange, 
    fastPeriod, 
    slowPeriod, 
    srPeriod, 
    srThreshold, 
    rsiPeriod, 
    rsiOverbought, 
    rsiOversold, 
    startDate, 
    endDate
  ]);
  
  const fetchMarketIndicators = useCallback(async () => {
    try {
      const [indicesResponse, fiiDiiResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/market/indices?start_date=${startDate}&end_date=${endDate}`),
        axios.get(`${API_BASE_URL}/market/fii-dii?start_date=${startDate}&end_date=${endDate}`)
      ]);
      
      setNiftyData(indicesResponse.data.nifty);
      setSensexData(indicesResponse.data.sensex);
      setFiiDiiData(fiiDiiResponse.data);
    } catch (err) {
      throw new Error(`Failed to fetch market indicators: ${err.message}`);
    }
  }, [startDate, endDate]);
  
  // Load data when tab or stock selection changes
  useEffect(() => {
    if (!selectedStock || !selectedExchange) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        switch (activeTab) {
          case 'historical':
            await fetchHistoricalData();
            break;
          case 'technical':
            await fetchTechnicalIndicators();
            break;
          case 'comparison':
            if (comparisonStocks.length > 0) {
              await fetchComparisonData();
            }
            break;
          case 'strategies':
            await fetchTradingStrategies();
            break;
          case 'market':
            await fetchMarketIndicators();
            break;
          default:
            break;
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [
    activeTab, 
    selectedStock, 
    selectedExchange, 
    fetchHistoricalData, 
    fetchTechnicalIndicators, 
    fetchComparisonData, 
    fetchTradingStrategies, 
    fetchMarketIndicators,
    comparisonStocks.length
  ]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    
    // Destroy charts when changing tabs
    if (priceChart) {
      priceChart.destroy();
      setPriceChart(null);
    }
    
    if (volumeChart) {
      volumeChart.destroy();
      setVolumeChart(null);
    }
    
    if (indicatorChart) {
      indicatorChart.destroy();
      setIndicatorChart(null);
    }
    
    if (comparisonChart) {
      comparisonChart.destroy();
      setComparisonChart(null);
    }
    
    if (trendFollowingChart) {
      trendFollowingChart.destroy();
      setTrendFollowingChart(null);
    }
    
    if (supportResistanceChart) {
      supportResistanceChart.destroy();
      setSupportResistanceChart(null);
    }
    
    if (momentumChart) {
      momentumChart.destroy();
      setMomentumChart(null);
    }
    
    if (optionStrategyChart) {
      optionStrategyChart.destroy();
      setOptionStrategyChart(null);
    }
    
    if (niftyChart) {
      niftyChart.destroy();
      setNiftyChart(null);
    }
    
    if (sensexChart) {
      sensexChart.destroy();
      setSensexChart(null);
    }
    
    if (fiiDiiChart) {
      fiiDiiChart.destroy();
      setFiiDiiChart(null);
    }
  };
  
  // Handle stock selection
  const handleStockChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [name, exchange] = value.split('-');
      setSelectedStock(name);
      setSelectedExchange(exchange);
    } else {
      setSelectedStock('');
      setSelectedExchange('');
    }
  };
  
  // Toggle moving average
  const handleMAToggle = (e) => {
    const checked = e.target.checked;
    setShowMA(checked);
    
    if (checked && selectedStock && selectedExchange) {
      const fetchMA = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/stocks/${selectedStock}/${selectedExchange}/ma?window=${maWindow}&type=${maType}&start_date=${startDate}&end_date=${endDate}`
          );
          setMaData(response.data);
        } catch (err) {
          setError(`Failed to fetch MA data: ${err.message}`);
        }
      };
      
      fetchMA();
    }
  };
  
  // Handle indicator selection
  const handleIndicatorChange = (e) => {
    setSelectedIndicator(e.target.value);
    
    // Reset indicator chart
    if (indicatorChart) {
      indicatorChart.destroy();
      setIndicatorChart(null);
    }
  };
  
  // Add stock to comparison
  const addStockToComparison = () => {
    if (!selectedStock || !selectedExchange) return;
    
    // Check if stock is already in comparison
    const exists = comparisonStocks.some(
      stock => stock.name === selectedStock && stock.exchange === selectedExchange
    );
    
    if (!exists) {
      setComparisonStocks([
        ...comparisonStocks,
        { name: selectedStock, exchange: selectedExchange }
      ]);
    }
  };
  
  // Remove stock from comparison
  const removeStockFromComparison = (index) => {
    const newStocks = [...comparisonStocks];
    newStocks.splice(index, 1);
    setComparisonStocks(newStocks);
  };
  
  // Handle option parameter change
    // Handle option parameter change
    const handleOptionParamChange = (e) => {
      const { name, value, type } = e.target;
      
      setOptionParams({
        ...optionParams,
        [name]: type === 'number' ? parseFloat(value) : value
      });
    };
    
    // Calculate option strategy
    const calculateOptionStrategy = async () => {
      setLoading(true);
      setError('');
      
      try {
        let endpoint;
        let params;
        
        switch (optionStrategy) {
          case 'covered-call':
            endpoint = `${API_BASE_URL}/options/covered-call`;
            params = {
              stock_price: optionParams.stock_price,
              strike_price: optionParams.strike_price,
              premium: optionParams.premium,
              quantity: optionParams.quantity
            };
            break;
          
          case 'straddle':
            endpoint = `${API_BASE_URL}/options/straddle`;
            params = {
              stock_price: optionParams.stock_price,
              strike_price: optionParams.strike_price,
              call_premium: optionParams.call_premium,
              put_premium: optionParams.put_premium,
              position_type: optionParams.position_type,
              quantity: optionParams.quantity
            };
            break;
          
          case 'iron-condor':
            endpoint = `${API_BASE_URL}/options/iron-condor`;
            params = {
              stock_price: optionParams.stock_price,
              call_short_strike: optionParams.call_short_strike,
              call_long_strike: optionParams.call_long_strike,
              put_short_strike: optionParams.put_short_strike,
              put_long_strike: optionParams.put_long_strike,
              net_credit: optionParams.net_credit,
              quantity: optionParams.quantity
            };
            break;
          
          default:
            throw new Error('Invalid option strategy');
        }
        
        const response = await axios.post(endpoint, params);
        setOptionResults(response.data);
        
      } catch (err) {
        setError(`Failed to calculate option strategy: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    // Create price chart
    useEffect(() => {
      if (ohlcData && ohlcData.length > 0 && priceChartRef.current) {
        // Prepare data for chart
        const labels = ohlcData.map(item => item.Date);
        const closeData = ohlcData.map(item => item.Close);
        
        // Destroy existing chart if it exists
        if (priceChart) {
          priceChart.destroy();
        }
        
        // Create new chart
        const ctx = priceChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Close Price',
                data: closeData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
              },
              // Add MA dataset if available
              ...(maData && showMA ? [{
                label: `${maType.toUpperCase()} (${maWindow})`,
                data: maData.map(item => item[`MA_${maWindow}`]),
                borderColor: '#e74c3c',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false
              }] : [])
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${selectedStock} Stock Price`,
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Price'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setPriceChart(newChart);
      }
    }, [ohlcData, maData, showMA, maType, maWindow, priceChart, selectedStock]);
    
    // Create volume chart
    useEffect(() => {
      if (volumeData && volumeData.length > 0 && volumeChartRef.current) {
        // Prepare data for chart
        const labels = volumeData.map(item => item.Date);
        const volumes = volumeData.map(item => item.Volume);
        
        // Destroy existing chart if it exists
        if (volumeChart) {
          volumeChart.destroy();
        }
        
        // Create new chart
        const ctx = volumeChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Volume',
                data: volumes,
                backgroundColor: 'rgba(46, 204, 113, 0.5)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${selectedStock} Trading Volume`,
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Volume'
                },
                beginAtZero: true
              }
            }
          }
        });
        
        setVolumeChart(newChart);
      }
    }, [volumeData, volumeChart, selectedStock]);
    
    // Create indicator chart
    useEffect(() => {
      // Check if we have data and the canvas element
      if (indicatorChartRef.current) {
        let chartConfig = null;
        
        // Destroy existing chart if it exists
        if (indicatorChart) {
          indicatorChart.destroy();
        }
        
        // Configure chart based on selected indicator
        if (selectedIndicator === 'rsi' && rsiData && rsiData.length > 0) {
          const labels = rsiData.map(item => item.Date);
          const rsiValues = rsiData.map(item => item.RSI);
          
          chartConfig = {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: `RSI (${rsiPeriod})`,
                  data: rsiValues,
                  borderColor: '#9b59b6',
                  backgroundColor: 'rgba(155, 89, 182, 0.1)',
                  borderWidth: 2,
                  pointRadius: 1,
                  pointHoverRadius: 5,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Relative Strength Index (RSI)',
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  },
                  ticks: {
                    maxTicksLimit: 10
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'RSI Value'
                  },
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 10
                  }
                }
              }
            }
          };
        } else if (selectedIndicator === 'macd' && macdData && macdData.length > 0) {
          const labels = macdData.map(item => item.Date);
          const macdLine = macdData.map(item => item.MACD);
          const signalLine = macdData.map(item => item.Signal_Line);
          const histogram = macdData.map(item => item.MACD_Histogram);
          
          chartConfig = {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'MACD Histogram',
                  data: histogram,
                  type: 'bar',
                  backgroundColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 0 ? 'rgba(46, 204, 113, 0.5)' : 'rgba(231, 76, 60, 0.5)';
                  },
                  borderColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 0 ? 'rgba(46, 204, 113, 1)' : 'rgba(231, 76, 60, 1)';
                  },
                  borderWidth: 1,
                  order: 1
                },
                {
                  label: 'MACD Line',
                  data: macdLine,
                  type: 'line',
                  borderColor: '#3498db',
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                  order: 0
                },
                {
                  label: 'Signal Line',
                  data: signalLine,
                  type: 'line',
                  borderColor: '#e74c3c',
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                  order: 0
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Moving Average Convergence Divergence (MACD)',
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  },
                  ticks: {
                    maxTicksLimit: 10
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'MACD Value'
                  }
                }
              }
            }
          };
        } else if (selectedIndicator === 'bollinger' && bbData && bbData.length > 0) {
          const labels = bbData.map(item => item.Date);
          const closePrices = bbData.map(item => item.Close);
          const upperBand = bbData.map(item => item.Upper_Band);
          const middleBand = bbData.map(item => item.Middle_Band);
          const lowerBand = bbData.map(item => item.Lower_Band);
          
          chartConfig = {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Close Price',
                  data: closePrices,
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  borderWidth: 2,
                  pointRadius: 1,
                  pointHoverRadius: 5,
                  fill: false
                },
                {
                  label: 'Upper Band',
                  data: upperBand,
                  borderColor: '#e74c3c',
                  borderWidth: 1,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  fill: false,
                  borderDash: [5, 5]
                },
                {
                  label: 'Middle Band (SMA)',
                  data: middleBand,
                  borderColor: '#f39c12',
                  borderWidth: 1,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  fill: false
                },
                {
                  label: 'Lower Band',
                  data: lowerBand,
                  borderColor: '#e74c3c',
                  borderWidth: 1,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  fill: false,
                  borderDash: [5, 5]
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Bollinger Bands',
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  },
                  ticks: {
                    maxTicksLimit: 10
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Price'
                  }
                }
              }
            }
          };
        }
        
        // Create chart if we have a configuration
        if (chartConfig) {
          const ctx = indicatorChartRef.current.getContext('2d');
          const newChart = new Chart(ctx, chartConfig);
          setIndicatorChart(newChart);
        }
      }
    }, [selectedIndicator, rsiData, macdData, bbData, rsiPeriod, indicatorChart]);
    
    // Create comparison chart
    useEffect(() => {
      if (comparisonData && comparisonChartRef.current) {
        // Destroy existing chart if it exists
        if (comparisonChart) {
          comparisonChart.destroy();
        }
        
        const labels = comparisonData.dates;
        const datasets = [];
        
        // Create datasets for each stock
        Object.keys(comparisonData.stocks).forEach((stockName, index) => {
          const stockData = comparisonData.stocks[stockName];
          const colors = [
            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', 
            '#1abc9c', '#d35400', '#34495e', '#7f8c8d', '#27ae60'
          ];
          
          datasets.push({
            label: `${stockName} (${stockData.exchange.toUpperCase()})`,
            data: stockData.normalized_prices,
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 1,
            pointHoverRadius: 5
          });
        });
        
        // Create new chart
        const ctx = comparisonChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Stock Performance Comparison (Normalized to 100)',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Normalized Price'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setComparisonChart(newChart);
      }
    }, [comparisonData, comparisonChart]);
    
    // Create trend following chart
    useEffect(() => {
      if (trendFollowingData && trendFollowingChartRef.current) {
        // Destroy existing chart if it exists
        if (trendFollowingChart) {
          trendFollowingChart.destroy();
        }
        
        const data = trendFollowingData.data;
        const buySignals = trendFollowingData.buy_signals;
        const sellSignals = trendFollowingData.sell_signals;
        
        const labels = data.map(item => item.Date);
        const prices = data.map(item => item.Close);
        const maFast = data.map(item => item.MA_Fast);
        const maSlow = data.map(item => item.MA_Slow);
        
        // Create new chart
        const ctx = trendFollowingChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Close Price',
                data: prices,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
              },
              {
                label: `Fast MA (${fastPeriod})`,
                data: maFast,
                borderColor: '#e74c3c',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false
              },
              {
                label: `Slow MA (${slowPeriod})`,
                data: maSlow,
                borderColor: '#2ecc71',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false
              },
              {
                label: 'Buy Signals',
                data: buySignals.map(signal => {
                  const index = labels.indexOf(signal.Date);
                  return index !== -1 ? prices[index] : null;
                }),
                backgroundColor: 'green',
                borderColor: 'green',
                pointRadius: 8,
                pointStyle: 'triangle',
                pointRotation: 180,
                showLine: false
              },
              {
                label: 'Sell Signals',
                data: sellSignals.map(signal => {
                  const index = labels.indexOf(signal.Date);
                  return index !== -1 ? prices[index] : null;
                }),
                backgroundColor: 'red',
                borderColor: 'red',
                pointRadius: 8,
                pointStyle: 'triangle',
                showLine: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Trend Following Strategy',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Price'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setTrendFollowingChart(newChart);
      }
    }, [trendFollowingData, trendFollowingChart, fastPeriod, slowPeriod]);
    
    // Create support resistance chart
    useEffect(() => {
      if (supportResistanceData && supportResistanceChartRef.current) {
        // Destroy existing chart if it exists
        if (supportResistanceChart) {
          supportResistanceChart.destroy();
        }
        
        const data = supportResistanceData.data;
        const supportLevels = supportResistanceData.support_levels;
        const resistanceLevels = supportResistanceData.resistance_levels;
        
        const labels = data.map(item => item.Date);
        const highs = data.map(item => item.High);
        const lows = data.map(item => item.Low);
        const closes = data.map(item => item.Close);
        
        // Create horizontal line datasets for support and resistance levels
        const supportDatasets = supportLevels.map((level, index) => ({
          label: `Support ${index + 1}`,
          data: Array(labels.length).fill(level.level),
          borderColor: 'rgba(46, 204, 113, 0.7)',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          borderDash: [5, 5]
        }));
        
        const resistanceDatasets = resistanceLevels.map((level, index) => ({
          label: `Resistance ${index + 1}`,
          data: Array(labels.length).fill(level.level),
          borderColor: 'rgba(231, 76, 60, 0.7)',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          borderDash: [5, 5]
        }));
        
        // Create new chart
        const ctx = supportResistanceChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Close Price',
                data: closes,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
              },
              {
                label: 'High',
                data: highs,
                borderColor: 'rgba(231, 76, 60, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false
              },
              {
                label: 'Low',
                data: lows,
                borderColor: 'rgba(46, 204, 113, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false
              },
              ...supportDatasets,
              ...resistanceDatasets
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Support & Resistance Levels',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Price'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setSupportResistanceChart(newChart);
      }
    }, [supportResistanceData, supportResistanceChart]);
    
    // Create momentum chart
    useEffect(() => {
      if (momentumData && momentumChartRef.current) {
        // Destroy existing chart if it exists
        if (momentumChart) {
          momentumChart.destroy();
        }
        
        const data = momentumData.data;
        const buySignals = momentumData.buy_signals;
        const sellSignals = momentumData.sell_signals;
        
        const labels = data.map(item => item.Date);
        const prices = data.map(item => item.Close);
        const rsiValues = data.map(item => item.RSI);
        
        // Create new chart
        const ctx = momentumChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'RSI',
                data: rsiValues,
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                yAxisID: 'y1'
              },
              {
                label: 'Overbought (70)',
                data: Array(labels.length).fill(70),
                borderColor: 'rgba(231, 76, 60, 0.7)',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                borderDash: [5, 5],
                yAxisID: 'y1'
              },
              {
                label: 'Oversold (30)',
                data: Array(labels.length).fill(30),
                borderColor: 'rgba(46, 204, 113, 0.7)',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                borderDash: [5, 5],
                yAxisID: 'y1'
              },
              {
                label: 'Close Price',
                data: prices,
                borderColor: '#3498db',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                fill: false,
                yAxisID: 'y'
              },
              {
                label: 'Buy Signals',
                data: buySignals.map(signal => {
                  const index = labels.indexOf(signal.Date);
                  return index !== -1 ? prices[index] : null;
                }),
                backgroundColor: 'green',
                borderColor: 'green',
                pointRadius: 8,
                pointStyle: 'triangle',
                pointRotation: 180,
                showLine: false,
                yAxisID: 'y'
              },
              {
                label: 'Sell Signals',
                data: sellSignals.map(signal => {
                  const index = labels.indexOf(signal.Date);
                  return index !== -1 ? prices[index] : null;
                }),
                backgroundColor: 'red',
                borderColor: 'red',
                pointRadius: 8,
                pointStyle: 'triangle',
                showLine: false,
                yAxisID: 'y'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Momentum Trading Strategy (RSI)',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Price'
                },
                beginAtZero: false
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'RSI'
                },
                min: 0,
                max: 100,
                grid: {
                  drawOnChartArea: false
                }
              }
            }
          }
        });
        
        setMomentumChart(newChart);
      }
    }, [momentumData, momentumChart]);
    
    // Create option strategy chart
    useEffect(() => {
      if (optionResults && optionStrategyChartRef.current) {
        // Destroy existing chart if it exists
        if (optionStrategyChart) {
          optionStrategyChart.destroy();
        }
        
        const plData = optionResults.pl_data;
        
        // Create new chart
        const ctx = optionStrategyChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: plData.map(item => item.stock_price),
            datasets: [
              {
                label: 'Profit/Loss',
                data: plData.map(item => item.pl),
                borderColor: '#3498db',
                backgroundColor: (context) => {
                  const value = context.dataset.data[context.dataIndex];
                  return value >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
                },
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true
              },
              {
                label: 'Breakeven',
                data: Array(plData.length).fill(0),
                borderColor: '#7f8c8d',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                borderDash: [5, 5]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${optionResults.strategy_type} P&L Profile`,
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    return context.dataset.label + ': ₹' + value.toFixed(2);
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Stock Price at Expiration'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Profit/Loss (₹)'
                }
              }
            }
          }
        });
        
        setOptionStrategyChart(newChart);
      }
    }, [optionResults, optionStrategyChart]);
    
    // Create market indices charts
    useEffect(() => {
      if (niftyData && niftyData.length > 0 && niftyChartRef.current) {
        // Destroy existing chart if it exists
        if (niftyChart) {
          niftyChart.destroy();
        }
        
        const labels = niftyData.map(item => item.date);
        const closes = niftyData.map(item => item.close);
        
        // Create new chart
        const ctx = niftyChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Nifty Close',
                data: closes,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Nifty Index',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Index Value'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setNiftyChart(newChart);
      }
      
      if (sensexData && sensexData.length > 0 && sensexChartRef.current) {
        // Destroy existing chart if it exists
        if (sensexChart) {
          sensexChart.destroy();
        }
        
        const labels = sensexData.map(item => item.date);
        const closes = sensexData.map(item => item.close);
        
        // Create new chart
        const ctx = sensexChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Sensex Close',
                data: closes,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Sensex Index',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Index Value'
                },
                beginAtZero: false
              }
            }
          }
        });
        
        setSensexChart(newChart);
      }
    }, [niftyData, sensexData, niftyChart, sensexChart]);
    
    // Create FII/DII chart
    useEffect(() => {
      if (fiiDiiData && fiiDiiData.daily && fiiDiiData.daily.length > 0 && fiiDiiChartRef.current) {
        // Destroy existing chart if it exists
        if (fiiDiiChart) {
          fiiDiiChart.destroy();
        }
        
        const labels = fiiDiiData.daily.map(item => item.date);
        const fiiNet = fiiDiiData.daily.map(item => item.fii.net);
        const diiNet = fiiDiiData.daily.map(item => item.dii.net);
        
        // Create new chart
        const ctx = fiiDiiChartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'FII Net Investment',
                data: fiiNet,
                backgroundColor: (context) => {
                  const value = context.raw;
                  return value >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)';
                },
                borderColor: (context) => {
                  const value = context.raw;
                  return value >= 0 ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)';
                },
                borderWidth: 1
              },
              {
                label: 'DII Net Investment',
                data: diiNet,
                backgroundColor: (context) => {
                  const value = context.raw;
                  return value >= 0 ? 'rgba(52, 152, 219, 0.7)' : 'rgba(155, 89, 182, 0.7)';
                },
                borderColor: (context) => {
                  const value = context.raw;
                  return value >= 0 ? 'rgb(52, 152, 219)' : 'rgb(155, 89, 182)';
                },
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'FII/DII Daily Activity',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    return context.dataset.label + ': ₹' + value.toFixed(2) + ' Cr';
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                },
                ticks: {
                  maxTicksLimit: 10
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Net Investment (₹ Cr)'
                }
              }
            }
          }
        });
        
        setFiiDiiChart(newChart);
      }
    }, [fiiDiiData, fiiDiiChart]);
    
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>Analytics & Strategies</h1>
          <p>Analyze stock performance, apply technical indicators, and test trading strategies to make informed investment decisions.</p>
        </div>
        
        <div className="analytics-tabs">
          <button 
            className={`analytics-tab ${activeTab === 'historical' ? 'active' : ''}`}
            onClick={() => handleTabChange('historical')}
          >
            Historical Data
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => handleTabChange('technical')}
          >
            Technical Indicators
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => handleTabChange('comparison')}
          >
            Stock Comparison
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'strategies' ? 'active' : ''}`}
            onClick={() => handleTabChange('strategies')}
          >
            Trading Strategies
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'options' ? 'active' : ''}`}
            onClick={() => handleTabChange('options')}
          >
            Options Strategies
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => handleTabChange('market')}
          >
            Market Indicators
          </button>
        </div>
        
        {/* Historical Data Tab */}
        <div className={`tab-content ${activeTab === 'historical' ? 'active' : ''}`}>
          <div className="analytics-content">
            <form onSubmit={(e) => { e.preventDefault(); fetchHistoricalData(); }}>
              <div className="stock-selection">
                <div className="select-container">
                  <label htmlFor="stock-select">Select Stock:</label>
                  <select 
                    id="stock-select" 
                    value={selectedStock && selectedExchange ? `${selectedStock}-${selectedExchange}` : ''}
                    onChange={handleStockChange}
                    required
                  >
                    <option value="">-- Select a stock --</option>
                    {stocks.map((stock, index) => (
                      <option key={index} value={`${stock.name}-${stock.exchange}`}>
                        {stock.name} ({stock.exchange.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="date-range">
                <div className="date-container">
                  <label htmlFor="start-date">Start Date:</label>
                  <input 
                    type="date" 
                    id="start-date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-container">
                  <label htmlFor="end-date">End Date:</label>
                  <input 
                    type="date" 
                    id="end-date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="control-panel">
                <div className="control-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={showMA} 
                      onChange={handleMAToggle}
                    />
                    Show Moving Average
                  </label>
                </div>
                
                {showMA && (
                  <>
                    <div className="control-item">
                      <label htmlFor="ma-type">MA Type:</label>
                      <select 
                        id="ma-type" 
                        value={maType}
                        onChange={(e) => setMaType(e.target.value)}
                      >
                        <option value="simple">Simple (SMA)</option>
                        <option value="exponential">Exponential (EMA)</option>
                      </select>
                    </div>
                    <div className="control-item">
                      <label htmlFor="ma-window">Window Size:</label>
                      <input 
                        type="number" 
                        id="ma-window" 
                        min="2"
                        max="200"
                        value={maWindow}
                        onChange={(e) => setMaWindow(parseInt(e.target.value))}
                      />
                    </div>
                  </>
                )}
                
                <button type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Analyze'}
                </button>
              </div>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={priceChartRef}></canvas>
            </div>
            
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={volumeChartRef}></canvas>
            </div>
          </div>
        </div>
        
        {/* Technical Indicators Tab */}
        <div className={`tab-content ${activeTab === 'technical' ? 'active' : ''}`}>
          <div className="analytics-content">
            <form onSubmit={(e) => { e.preventDefault(); fetchTechnicalIndicators(); }}>
              <div className="stock-selection">
                <div className="select-container">
                  <label htmlFor="stock-select-technical">Select Stock:</label>
                  <select 
                    id="stock-select-technical" 
                    value={selectedStock && selectedExchange ? `${selectedStock}-${selectedExchange}` : ''}
                    onChange={handleStockChange}
                    required
                  >
                    <option value="">-- Select a stock --</option>
                    {stocks.map((stock, index) => (
                      <option key={index} value={`${stock.name}-${stock.exchange}`}>
                        {stock.name} ({stock.exchange.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="select-container">
                  <label htmlFor="indicator-select">Select Indicator:</label>
                  <select 
                    id="indicator-select" 
                    value={selectedIndicator}
                    onChange={handleIndicatorChange}
                  >
                    <option value="rsi">Relative Strength Index (RSI)</option>
                    <option value="macd">MACD</option>
                    <option value="bollinger">Bollinger Bands</option>
                  </select>
                </div>
              </div>
              
              <div className="date-range">
                <div className="date-container">
                  <label htmlFor="start-date-technical">Start Date:</label>
                  <input 
                    type="date" 
                    id="start-date-technical" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-container">
                  <label htmlFor="end-date-technical">End Date:</label>
                  <input 
                    type="date" 
                    id="end-date-technical" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Indicator-specific settings */}
              <div className="indicator-settings">
                <h3>Indicator Settings</h3>
                
                {selectedIndicator === 'rsi' && (
                  <div className="settings-row">
                    <div className="settings-item">
                      <label htmlFor="rsi-period">RSI Period:</label>
                      <input 
                        type="number" 
                        id="rsi-period" 
                        min="2"
                        max="50"
                        value={rsiPeriod}
                        onChange={(e) => setRsiPeriod(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="settings-item">
                      <p>
                        <strong>Overbought Level:</strong> 70
                        <br />
                        <strong>Oversold Level:</strong> 30
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedIndicator === 'macd' && (
                  <div className="settings-row">
                    <div className="settings-item">
                      <label htmlFor="macd-fast">Fast Period:</label>
                      <input 
                        type="number" 
                        id="macd-fast" 
                        min="2"
                        max="50"
                        value={macdFast}
                        onChange={(e) => setMacdFast(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="macd-slow">Slow Period:</label>
                      <input 
                        type="number" 
                        id="macd-slow" 
                        min="2"
                        max="100"
                        value={macdSlow}
                        onChange={(e) => setMacdSlow(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="macd-signal">Signal Period:</label>
                      <input 
                        type="number" 
                        id="macd-signal" 
                        min="2"
                        max="50"
                        value={macdSignal}
                        onChange={(e) => setMacdSignal(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
                
                {selectedIndicator === 'bollinger' && (
                  <div className="settings-row">
                    <div className="settings-item">
                      <label htmlFor="bb-period">Period (SMA):</label>
                      <input 
                        type="number" 
                        id="bb-period" 
                        min="2"
                        max="100"
                        value={bbPeriod}
                        onChange={(e) => setBbPeriod(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="bb-deviation">Standard Deviation:</label>
                      <input 
                        type="number" 
                        id="bb-deviation" 
                        min="1"
                        max="5"
                        step="0.5"
                        value={bbDeviation}
                        onChange={(e) => setBbDeviation(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Calculate Indicator'}
              </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={indicatorChartRef}></canvas>
            </div>
            
            {/* Indicator explanation */}
            <div className="indicator-explanation">
              {selectedIndicator === 'rsi' && (
                <div>
                  <h3>About Relative Strength Index (RSI)</h3>
                  <p>
                    The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements.
                    It oscillates between 0 and 100 and is typically used to identify overbought or oversold conditions in a market.
                  </p>
                  <ul>
                    <li><strong>RSI above 70:</strong> Considered overbought, potential reversal or pullback</li>
                    <li><strong>RSI below 30:</strong> Considered oversold, potential reversal or bounce</li>
                    <li><strong>Divergence:</strong> When price makes a new high/low but RSI doesn't, it can signal a potential reversal</li>
                  </ul>
                </div>
              )}
              
              {selectedIndicator === 'macd' && (
                <div>
                  <h3>About Moving Average Convergence Divergence (MACD)</h3>
                  <p>
                    MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.
                    It consists of the MACD line (fast EMA - slow EMA), signal line (EMA of MACD line), and histogram (MACD line - signal line).
                  </p>
                  <ul>
                    <li><strong>MACD crosses above signal line:</strong> Bullish signal</li>
                    <li><strong>MACD crosses below signal line:</strong> Bearish signal</li>
                    <li><strong>MACD above zero:</strong> Uptrend</li>
                    <li><strong>MACD below zero:</strong> Downtrend</li>
                    <li><strong>Divergence:</strong> When price makes a new high/low but MACD doesn't, it can signal a potential reversal</li>
                  </ul>
                </div>
              )}
              
              {selectedIndicator === 'bollinger' && (
                <div>
                  <h3>About Bollinger Bands</h3>
                  <p>
                    Bollinger Bands are a volatility indicator consisting of three lines: a simple moving average (middle band) and two standard deviation lines (upper and lower bands).
                    They help identify periods of high/low volatility and potential price breakouts.
                  </p>
                  <ul>
                    <li><strong>Price near upper band:</strong> Potentially overbought</li>
                    <li><strong>Price near lower band:</strong> Potentially oversold</li>
                    <li><strong>Bands narrowing:</strong> Low volatility, potential breakout ahead</li>
                    <li><strong>Bands widening:</strong> High volatility</li>
                    <li><strong>Bollinger Bounce:</strong> Price tends to return to the middle band</li>
                    <li><strong>Bollinger Squeeze:</strong> When bands come close together, often followed by a significant move</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stock Comparison Tab */}
        <div className={`tab-content ${activeTab === 'comparison' ? 'active' : ''}`}>
          <div className="analytics-content">
            <div className="stock-selection">
              <div className="select-container">
                <label htmlFor="stock-select-comparison">Select Stock:</label>
                <select 
                  id="stock-select-comparison" 
                  value={selectedStock && selectedExchange ? `${selectedStock}-${selectedExchange}` : ''}
                  onChange={handleStockChange}
                >
                  <option value="">-- Select a stock --</option>
                  {stocks.map((stock, index) => (
                    <option key={index} value={`${stock.name}-${stock.exchange}`}>
                      {stock.name} ({stock.exchange.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={addStockToComparison}
                disabled={!selectedStock || !selectedExchange}
              >
                Add to Comparison
              </button>
            </div>
            
            <div className="date-range">
              <div className="date-container">
                <label htmlFor="start-date-comparison">Start Date:</label>
                <input 
                  type="date" 
                  id="start-date-comparison" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-container">
                <label htmlFor="end-date-comparison">End Date:</label>
                <input 
                  type="date" 
                  id="end-date-comparison" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="comparison-stocks">
              {comparisonStocks.map((stock, index) => (
                <div key={index} className="stock-chip">
                  {stock.name} ({stock.exchange.toUpperCase()})
                  <span 
                    className="remove-stock" 
                    onClick={() => removeStockFromComparison(index)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={fetchComparisonData}
              disabled={comparisonStocks.length === 0 || loading}
            >
              {loading ? 'Loading...' : 'Compare Stocks'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={comparisonChartRef}></canvas>
            </div>
            
            {comparisonData && (
              <div className="comparison-metrics">
                <h3>Performance Comparison</h3>
                <div className="metrics-grid">
                  {Object.keys(comparisonData.stocks).map((stockName, index) => {
                    const stockData = comparisonData.stocks[stockName];
                    return (
                      <div key={index} className="metric-card">
                        <h4>{stockName} ({stockData.exchange.toUpperCase()})</h4>
                        <p>
                          <strong>Start Price:</strong> ₹{stockData.start_price.toFixed(2)}
                          <br />
                          <strong>End Price:</strong> ₹{stockData.end_price.toFixed(2)}
                          <br />
                          <strong>Change:</strong> 
                          <span className={stockData.percent_change >= 0 ? 'positive' : 'negative'}>
                            {stockData.percent_change >= 0 ? '+' : ''}{stockData.percent_change.toFixed(2)}%
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="sector-comparison">
              <h3>Sector Comparison</h3>
              <div className="stock-selection">
                <div className="select-container">
                  <label htmlFor="sector-select">Select Sector:</label>
                  <select 
                    id="sector-select" 
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                  >
                    {sectors.map((sector, index) => (
                      <option key={index} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={fetchSectorData}
                  disabled={!selectedSector || loading}
                >
                  {loading ? 'Loading...' : 'Analyze Sector'}
                </button>
              </div>
              
              {sectorData && (
                <div className="chart-container">
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <canvas ref={comparisonChartRef}></canvas>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Trading Strategies Tab */}
        <div className={`tab-content ${activeTab === 'strategies' ? 'active' : ''}`}>
          <div className="analytics-content">
            <div className="stock-selection">
              <div className="select-container">
                <label htmlFor="stock-select-strategies">Select Stock:</label>
                <select 
                  id="stock-select-strategies" 
                  value={selectedStock && selectedExchange ? `${selectedStock}-${selectedExchange}` : ''}
                  onChange={handleStockChange}
                  required
                >
                  <option value="">-- Select a stock --</option>
                  {stocks.map((stock, index) => (
                    <option key={index} value={`${stock.name}-${stock.exchange}`}>
                      {stock.name} ({stock.exchange.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="date-range">
              <div className="date-container">
                <label htmlFor="start-date-strategies">Start Date:</label>
                <input 
                  type="date" 
                  id="start-date-strategies" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-container">
                <label htmlFor="end-date-strategies">End Date:</label>
                <input 
                  type="date" 
                  id="end-date-strategies" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="strategy-settings">
              <h3>Trend Following Settings</h3>
              <div className="settings-row">
                <div className="settings-item">
                  <label htmlFor="fast-period">Fast MA Period:</label>
                  <input 
                    type="number" 
                    id="fast-period" 
                    min="5"
                    max="100"
                    value={fastPeriod}
                    onChange={(e) => setFastPeriod(parseInt(e.target.value))}
                  />
                </div>
                <div className="settings-item">
                  <label htmlFor="slow-period">Slow MA Period:</label>
                  <input 
                    type="number" 
                    id="slow-period" 
                    min="10"
                    max="200"
                    value={slowPeriod}
                    onChange={(e) => setSlowPeriod(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <h3>Support & Resistance Settings</h3>
              <div className="settings-row">
                <div className="settings-item">
                  <label htmlFor="sr-period">Period:</label>
                  <input 
                    type="number" 
                    id="sr-period" 
                    min="5"
                    max="50"
                    value={srPeriod}
                    onChange={(e) => setSrPeriod(parseInt(e.target.value))}
                  />
                </div>
                <div className="settings-item">
                  <label htmlFor="sr-threshold">Threshold:</label>
                  <input 
                    type="number" 
                    id="sr-threshold" 
                    min="0.01"
                    max="0.1"
                    step="0.01"
                    value={srThreshold}
                    onChange={(e) => setSrThreshold(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <h3>Momentum Trading Settings</h3>
              <div className="settings-row">
                <div className="settings-item">
                  <label htmlFor="momentum-period">RSI Period:</label>
                  <input 
                    type="number" 
                    id="momentum-period" 
                    min="2"
                    max="50"
                    value={rsiPeriod}
                    onChange={(e) => setRsiPeriod(parseInt(e.target.value))}
                  />
                </div>
                <div className="settings-item">
                  <label htmlFor="overbought">Overbought Level:</label>
                  <input 
                    type="number" 
                    id="overbought" 
                    min="50"
                    max="90"
                    value={rsiOverbought}
                    onChange={(e) => setRsiOverbought(parseInt(e.target.value))}
                  />
                </div>
                <div className="settings-item">
                  <label htmlFor="oversold">Oversold Level:</label>
                  <input 
                    type="number" 
                    id="oversold" 
                    min="10"
                    max="50"
                    value={rsiOversold}
                    onChange={(e) => setRsiOversold(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchTradingStrategies}
              disabled={!selectedStock || !selectedExchange || loading}
            >
              {loading ? 'Loading...' : 'Analyze Strategies'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
            
            <h3>Trend Following Strategy</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={trendFollowingChartRef}></canvas>
            </div>
            
            <h3>Support & Resistance Levels</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={supportResistanceChartRef}></canvas>
            </div>
            
            <h3>Momentum Trading Strategy</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={momentumChartRef}></canvas>
            </div>
            
            <div className="strategy-explanation">
              <h3>About Trading Strategies</h3>
              
              <div className="strategy-card">
                <h4>Trend Following</h4>
                <p>
                  Trend following strategies aim to capture gains through the analysis of an asset's momentum in a particular direction.
                  The strategy shown here uses two moving averages:
                </p>
                <ul>
                  <li><strong>Buy Signal:</strong> When the fast MA crosses above the slow MA</li>
                  <li><strong>Sell Signal:</strong> When the fast MA crosses below the slow MA</li>
                </ul>
              </div>
              
              <div className="strategy-card">
                <h4>Support & Resistance</h4>
                <p>
                  Support and resistance levels are price points on a chart where the price tends to find resistance as it rises or support as it falls.
                  These levels are identified by analyzing historical pivot points where the price has reversed.
                </p>
                <ul>
                  <li><strong>Support:</strong> Price level where a downtrend can be expected to pause due to a concentration of demand</li>
                  <li><strong>Resistance:</strong> Price level where an uptrend can be expected to pause due to a concentration of supply</li>
                </ul>
              </div>
              
              <div className="strategy-card">
                <h4>Momentum Trading</h4>
                <p>
                  Momentum trading involves buying or selling assets according to the recent strength of price trends.
                  The strategy shown here uses RSI to identify overbought and oversold conditions:
                </p>
                <ul>
                  <li><strong>Buy Signal:</strong> When RSI falls below the oversold level and then rises back above it</li>
                  <li><strong>Sell Signal:</strong> When RSI rises above the overbought level and then falls back below it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Options Strategies Tab */}
        <div className={`tab-content ${activeTab === 'options' ? 'active' : ''}`}>
          <div className="analytics-content">
            <div className="options-strategy-selector">
              <label htmlFor="option-strategy">Select Options Strategy:</label>
              <select 
                id="option-strategy" 
                value={optionStrategy}
                onChange={(e) => setOptionStrategy(e.target.value)}
              >
                <option value="covered-call">Covered Call</option>
                <option value="straddle">Straddle</option>
                <option value="iron-condor">Iron Condor</option>
              </select>
            </div>
            
            <div className="strategy-form">
              {optionStrategy === 'covered-call' && (
                <>
                  <div className="form-group">
                    <label htmlFor="stock-price">Stock Price (₹):</label>
                    <input 
                      type="number" 
                      id="stock-price"
                      name="stock_price" 
                      value={optionParams.stock_price} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="strike-price">Strike Price (₹):</label>
                    <input 
                      type="number" 
                      id="strike-price"
                      name="strike_price" 
                      value={optionParams.strike_price} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="premium">Option Premium (₹):</label>
                    <input 
                      type="number" 
                      id="premium"
                      name="premium" 
                      value={optionParams.premium} 
                      onChange={handleOptionParamChange}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input 
                      type="number" 
                      id="quantity"
                      name="quantity" 
                      value={optionParams.quantity} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="1"
                    />
                  </div>
                </>
              )}
              
              {optionStrategy === 'straddle' && (
                <>
                  <div className="form-group">
                    <label htmlFor="stock-price-straddle">Stock Price (₹):</label>
                    <input 
                      type="number" 
                      id="stock-price-straddle"
                      name="stock_price" 
                      value={optionParams.stock_price} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="strike-price-straddle">Strike Price (₹):</label>
                    <input 
                      type="number" 
                      id="strike-price-straddle"
                      name="strike_price" 
                      value={optionParams.strike_price} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="call-premium">Call Premium (₹):</label>
                    <input 
                      type="number" 
                      id="call-premium"
                      name="call_premium" 
                      value={optionParams.call_premium} 
                      onChange={handleOptionParamChange}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="put-premium">Put Premium (₹):</label>
                    <input 
                      type="number" 
                      id="put-premium"
                      name="put_premium" 
                      value={optionParams.put_premium} 
                      onChange={handleOptionParamChange}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="position-type">Position Type:</label>
                    <select 
                      id="position-type"
                      name="position_type" 
                      value={optionParams.position_type} 
                      onChange={handleOptionParamChange}
                    >
                      <option value="long">Long (Buy)</option>
                      <option value="short">Short (Sell)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity-straddle">Quantity:</label>
                    <input 
                      type="number" 
                      id="quantity-straddle"
                      name="quantity" 
                      value={optionParams.quantity} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="1"
                    />
                  </div>
                </>
              )}
              
              {optionStrategy === 'iron-condor' && (
                <>
                  <div className="form-group">
                    <label htmlFor="stock-price-condor">Stock Price (₹):</label>
                    <input 
                      type="number" 
                      id="stock-price-condor"
                      name="stock_price" 
                      value={optionParams.stock_price} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="call-short-strike">Call Short Strike (₹):</label>
                    <input 
                      type="number" 
                      id="call-short-strike"
                      name="call_short_strike" 
                      value={optionParams.call_short_strike} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="call-long-strike">Call Long Strike (₹):</label>
                    <input 
                      type="number" 
                      id="call-long-strike"
                      name="call_long_strike" 
                      value={optionParams.call_long_strike} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="put-short-strike">Put Short Strike (₹):</label>
                    <input 
                      type="number" 
                      id="put-short-strike"
                      name="put_short_strike" 
                      value={optionParams.put_short_strike} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="put-long-strike">Put Long Strike (₹):</label>
                    <input 
                      type="number" 
                      id="put-long-strike"
                      name="put_long_strike" 
                      value={optionParams.put_long_strike} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="0.5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="net-credit">Net Credit (₹):</label>
                    <input 
                      type="number" 
                      id="net-credit"
                      name="net_credit" 
                      value={optionParams.net_credit} 
                      onChange={handleOptionParamChange}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity-condor">Quantity:</label>
                    <input 
                      type="number" 
                      id="quantity-condor"
                      name="quantity" 
                      value={optionParams.quantity} 
                      onChange={handleOptionParamChange}
                      min="1"
                      step="1"
                    />
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={calculateOptionStrategy}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate Strategy'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
            
            {optionResults && (
              <div className="strategy-results">
                <h3>{optionResults.strategy_type} Results</h3>
                
                <div className="metrics-grid">
                  {optionResults.metrics.max_profit && (
                    <div className="metric-card">
                      <h4>Max Profit</h4>
                      <p className="positive">
                        ₹{typeof optionResults.metrics.max_profit === 'string' 
                          ? optionResults.metrics.max_profit 
                          : optionResults.metrics.max_profit.toFixed(2)}
                      </p>
                    </div>
                  )}
                  
                  {optionResults.metrics.max_loss && (
                    <div className="metric-card">
                      <h4>Max Loss</h4>
                      <p className="negative">
                      ₹{typeof optionResults.metrics.max_loss === 'string' 
                          ? optionResults.metrics.max_loss 
                          : optionResults.metrics.max_loss.toFixed(2)}
                      </p>
                    </div>
                  )}
                  
                  {optionResults.metrics.breakeven && (
                    <div className="metric-card">
                      <h4>Breakeven</h4>
                      <p>₹{optionResults.metrics.breakeven.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {optionResults.metrics.upper_breakeven && (
                    <div className="metric-card">
                      <h4>Upper Breakeven</h4>
                      <p>₹{optionResults.metrics.upper_breakeven.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {optionResults.metrics.lower_breakeven && (
                    <div className="metric-card">
                      <h4>Lower Breakeven</h4>
                      <p>₹{optionResults.metrics.lower_breakeven.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <div className="chart-container">
                  <canvas ref={optionStrategyChartRef}></canvas>
                </div>
                
                <div className="strategy-explanation">
                  {optionStrategy === 'covered-call' && (
                    <div>
                      <h4>About Covered Call Strategy</h4>
                      <p>
                        A covered call is an options strategy where you own the underlying stock and sell call options against that stock.
                        This strategy generates income through the premium received and provides limited downside protection.
                      </p>
                      <ul>
                        <li><strong>Maximum Profit:</strong> Limited to the strike price minus the purchase price of the stock plus the premium received</li>
                        <li><strong>Maximum Loss:</strong> Stock price minus premium received (if stock price goes to zero)</li>
                        <li><strong>Breakeven:</strong> Stock price minus premium received</li>
                        <li><strong>Ideal Market Outlook:</strong> Neutral to slightly bullish</li>
                      </ul>
                    </div>
                  )}
                  
                  {optionStrategy === 'straddle' && (
                    <div>
                      <h4>About Straddle Strategy</h4>
                      <p>
                        A straddle involves buying (or selling) both a call and put option with the same strike price and expiration date.
                        This strategy is used when you expect significant price movement but are unsure of the direction.
                      </p>
                      <ul>
                        <li><strong>Long Straddle:</strong> Buy both call and put options</li>
                        <li><strong>Short Straddle:</strong> Sell both call and put options</li>
                        <li><strong>Maximum Profit (Long):</strong> Unlimited (stock price can theoretically rise infinitely)</li>
                        <li><strong>Maximum Loss (Long):</strong> Limited to the total premium paid</li>
                        <li><strong>Maximum Profit (Short):</strong> Limited to the total premium received</li>
                        <li><strong>Maximum Loss (Short):</strong> Unlimited</li>
                        <li><strong>Breakeven Points:</strong> Strike price plus/minus the total premium</li>
                        <li><strong>Ideal Market Outlook (Long):</strong> High volatility expected</li>
                        <li><strong>Ideal Market Outlook (Short):</strong> Low volatility expected</li>
                      </ul>
                    </div>
                  )}
                  
                  {optionStrategy === 'iron-condor' && (
                    <div>
                      <h4>About Iron Condor Strategy</h4>
                      <p>
                        An iron condor is an options strategy that involves buying and selling both calls and puts with different strike prices but the same expiration date.
                        It consists of a bull put spread and a bear call spread, creating a range where the strategy is profitable.
                      </p>
                      <ul>
                        <li><strong>Maximum Profit:</strong> Net credit received</li>
                        <li><strong>Maximum Loss:</strong> Difference between the strike prices of either the call or put spreads minus the net credit received</li>
                        <li><strong>Breakeven Points:</strong> Put short strike minus net credit and call short strike plus net credit</li>
                        <li><strong>Ideal Market Outlook:</strong> Neutral (expecting the stock to stay within a range)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Market Indicators Tab */}
        <div className={`tab-content ${activeTab === 'market' ? 'active' : ''}`}>
          <div className="analytics-content">
            <div className="date-range">
              <div className="date-container">
                <label htmlFor="start-date-market">Start Date:</label>
                <input 
                  type="date" 
                  id="start-date-market" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-container">
                <label htmlFor="end-date-market">End Date:</label>
                <input 
                  type="date" 
                  id="end-date-market" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <button 
                onClick={fetchMarketIndicators}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Fetch Market Data'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <h3>Nifty Index</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={niftyChartRef}></canvas>
            </div>
            
            <h3>Sensex Index</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={sensexChartRef}></canvas>
            </div>
            
            <h3>FII/DII Activity</h3>
            <div className="chart-container">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <canvas ref={fiiDiiChartRef}></canvas>
            </div>
            
            {fiiDiiData && fiiDiiData.monthly && fiiDiiData.monthly.length > 0 && (
              <div className="fii-dii-summary">
                <h3>Monthly FII/DII Summary</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>FII Net (₹ Cr)</th>
                        <th>DII Net (₹ Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fiiDiiData.monthly.map((item, index) => (
                        <tr key={index}>
                          <td>{item.period}</td>
                          <td className={item.fii.net >= 0 ? 'positive' : 'negative'}>
                            {item.fii.net >= 0 ? '+' : ''}{item.fii.net.toFixed(2)}
                          </td>
                          <td className={item.dii.net >= 0 ? 'positive' : 'negative'}>
                            {item.dii.net >= 0 ? '+' : ''}{item.dii.net.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="market-indicators-explanation">
              <h3>About Market Indicators</h3>
              
              <div className="indicator-card">
                <h4>Nifty & Sensex</h4>
                <p>
                  The Nifty 50 and BSE Sensex are benchmark stock indices that represent the overall performance of the Indian stock market.
                  Tracking these indices helps investors understand the general market direction and sentiment.
                </p>
                <ul>
                  <li><strong>Nifty 50:</strong> Represents the weighted average of 50 Indian company stocks in 13 sectors listed on the National Stock Exchange (NSE)</li>
                  <li><strong>BSE Sensex:</strong> Represents the weighted average of 30 well-established and financially sound companies listed on the Bombay Stock Exchange (BSE)</li>
                </ul>
              </div>
              
              <div className="indicator-card">
                <h4>FII/DII Activity</h4>
                <p>
                  Foreign Institutional Investors (FIIs) and Domestic Institutional Investors (DIIs) significantly impact the Indian stock market through their buying and selling activities.
                </p>
                <ul>
                  <li><strong>FIIs:</strong> Foreign entities investing in Indian markets. Their inflows often lead to market rallies, while outflows can cause market corrections.</li>
                  <li><strong>DIIs:</strong> Indian financial institutions like mutual funds, insurance companies, and banks. They often act as a counterbalance to FII activity.</li>
                  <li><strong>Net Investment:</strong> The difference between buying and selling activity. Positive values indicate net buying, while negative values indicate net selling.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AnalyticsStrategiesPage;
