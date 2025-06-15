"use client"; // This directive is required for using React hooks

import { useState } from 'react';
import Head from 'next/head';

export default function InvestmentRecommender() {
  // State for user inputs
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [riskTolerance, setRiskTolerance] = useState('Medium');
  const [investmentHorizon, setInvestmentHorizon] = useState('Medium-term (1-5 years)');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample stock symbols to analyze
  const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM', 'V', 'WMT'];

  // Function to fetch stock data
  const fetchStockData = async (symbol: string) => {
    try {
      // Note: In production, call your own API endpoint to keep keys secure
      const apiKey = 'XDNX9V3TU3YL9QNZ'; // Replace with your actual API key
      
      // Fetch overview data
      const overviewRes = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
      );
      const overviewData = await overviewRes.json();
      
      // Fetch time series data
      const timeSeriesRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`
      );
      const timeSeriesData = await timeSeriesRes.json();
      
      return { overview: overviewData, timeSeries: timeSeriesData };
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
      return null;
    }
  };

  // Function to analyze a stock
  const analyzeStock = (symbol: string, data: any) => {
    if (!data || !data.overview || !data.timeSeries) return null;
    
    const { overview, timeSeries } = data;
    const dailyData = timeSeries['Time Series (Daily)'] || {};
    const dates = Object.keys(dailyData).sort().reverse().slice(0, 30);
    
    // Calculate recent performance (30-day change)
    const recentPrices = dates.map(date => parseFloat(dailyData[date]['4. close']));
    const priceChange = recentPrices.length > 1 
      ? ((recentPrices[0] - recentPrices[recentPrices.length - 1]) / recentPrices[recentPrices.length - 1]) * 100
      : 0;
    
    // Calculate score based on various metrics
    let score = 0;
    
    // Positive factors
    if (overview.PERatio && parseFloat(overview.PERatio) < 25) score += 2;
    if (overview.PEGRatio && parseFloat(overview.PEGRatio) < 1.5) score += 1.5;
    if (overview.DividendYield && parseFloat(overview.DividendYield) > 0.02) score += 1;
    if (priceChange > 0) score += 1;
    
    // Adjust for risk tolerance
    if (riskTolerance === 'Low') {
      if (overview.Beta && parseFloat(overview.Beta) > 1.2) score -= 1;
    } else if (riskTolerance === 'High') {
      if (overview.Beta && parseFloat(overview.Beta) < 0.8) score -= 1;
    }
    
    return {
      symbol,
      name: overview.Name || symbol,
      price: recentPrices[0]?.toFixed(2) || 'N/A',
      change: priceChange.toFixed(2),
      peRatio: overview.PERatio || 'N/A',
      pegRatio: overview.PEGRatio || 'N/A',
      dividendYield: overview.DividendYield || '0',
      sector: overview.Sector || 'N/A',
      score: score.toFixed(1)
    };
  };

  // Generate recommendations
  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stockDataPromises = stockSymbols.map(symbol => fetchStockData(symbol));
      const allStockData = await Promise.all(stockDataPromises);
      
      const analyzedStocks = stockSymbols.map((symbol, index) => 
        analyzeStock(symbol, allStockData[index])
      ).filter((stock): stock is NonNullable<typeof stock> => stock !== null);
      
      // Sort by score and get top 5
      const sortedRecommendations = analyzedStocks.sort((a, b) => 
        parseFloat(b.score) - parseFloat(a.score)
      ).slice(0, 5);
      
      setRecommendations(sortedRecommendations);
    } catch (err) {
      setError('Failed to generate recommendations. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Investment Recommender</title>
        <meta name="description" content="Smart investment recommendations" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">💰 Smart Investment Recommender</h1>
        <p className="text-center mb-8 text-gray-600">
          Get personalized investment recommendations based on your preferences
        </p>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Investment Amount ($)</label>
              <input
                type="number"
                min="100"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Risk Tolerance</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Investment Horizon</label>
              <select
                value={investmentHorizon}
                onChange={(e) => setInvestmentHorizon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Short-term (&lt;1 year)">Short-term (&lt;1 year)</option>
                <option value="Medium-term (1-5 years)">Medium-term (1-5 years)</option>
                <option value="Long-term (&gt;5 years)">Long-term (&gt;5 years)</option>
              </select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Recommendations...' : 'Get Recommendations'}
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {recommendations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recommended Investments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">30D Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/E</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recommendations.map((stock, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stock.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${stock.price}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${parseFloat(stock.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{stock.peRatio}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{stock.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Investment Allocation Suggestion</h3>
                <p>
                  Based on your ${investmentAmount.toLocaleString()} investment and {riskTolerance.toLowerCase()} risk tolerance, 
                  consider allocating your funds as follows:
                </p>
                <ul className="mt-2 space-y-1">
                  {recommendations.map((stock, index) => (
                    <li key={index}>
                      <span className="font-medium">{stock.symbol}</span>: ${Math.round(investmentAmount * (0.3 - index * 0.05)).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Note: This is a demo application. Always consult with a financial advisor before making investment decisions.</p>
        <p className="mt-2">Data provided by Alpha Vantage API</p>
      </footer>
    </div>
  );
}