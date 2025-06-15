"use client";
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Trade = {
  id: string;
  symbol: string;
  date: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  currentValue?: number;
  pnl?: number;
};

type PortfolioMetric = {
  date: string;
  value: number;
  return: number;
};

export default function AnalyticsDashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch trade history (mock data - replace with real API call)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Mock trades data - replace with actual API call to your backend
      const mockTrades: Trade[] = [
        {
          id: '1',
          symbol: 'AAPL',
          date: '2023-10-01',
          type: 'BUY',
          quantity: 10,
          price: 170.25,
          currentValue: 175.50,
          pnl: 52.50
        },
        {
          id: '2',
          symbol: 'MSFT',
          date: '2023-10-05',
          type: 'BUY',
          quantity: 5,
          price: 325.40,
          currentValue: 330.20,
          pnl: 24.00
        },
        {
          id: '3',
          symbol: 'TSLA',
          date: '2023-09-15',
          type: 'SELL',
          quantity: 3,
          price: 265.75,
          currentValue: 260.30,
          pnl: -16.35
        }
      ];

      // Mock portfolio history - replace with actual API call
      const mockPortfolioHistory = generateMockPortfolioData(timeframe);
      
      setTrades(mockTrades);
      setPortfolioHistory(mockPortfolioHistory);
      setLoading(false);
    };

    fetchData();
  }, [timeframe]);

  // Generate mock portfolio data based on timeframe
  const generateMockPortfolioData = (range: string): PortfolioMetric[] => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startValue = 10000;
    const data: PortfolioMetric[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate market fluctuations
      const fluctuation = (Math.random() * 2 - 1) * (range === '1y' ? 1.5 : 0.8);
      const value = i === days ? startValue : 
        data[data.length - 1].value * (1 + fluctuation / 100);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(2)),
        return: parseFloat(((value / startValue - 1) * 100).toFixed(2))
      });
    }
    
    return data;
  };

  // Calculate summary metrics
  const totalInvested = trades.reduce((sum, trade) => sum + (trade.price * trade.quantity), 0);
  const currentValue = trades.reduce((sum, trade) => sum + ((trade.currentValue || trade.price) * trade.quantity), 0);
  const totalPnl = currentValue - totalInvested;
  const pnlPercentage = (totalPnl / totalInvested) * 100;

  // Prepare chart data
  const portfolioChartData = {
    labels: portfolioHistory.map(item => item.date),
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioHistory.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }
    ]
  };

  const returnsChartData = {
    labels: portfolioHistory.map(item => item.date),
    datasets: [
      {
        label: 'Daily Return %',
        data: portfolioHistory.map(item => item.return),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return <div className="p-4 text-center">Loading analytics...</div>;
  }

  return (
    <div className="p-4 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Invested</h3>
          <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Current Value</h3>
          <p className="text-2xl font-bold">${currentValue.toLocaleString()}</p>
        </div>
        <div className={`bg-white p-4 rounded-lg shadow ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <h3 className="text-gray-500">Profit/Loss</h3>
          <p className="text-2xl font-bold">
            ${totalPnl.toLocaleString()} ({pnlPercentage.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeframe(range as any)}
            className={`px-3 py-1 rounded-md ${
              timeframe === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Portfolio Value Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
        <div className="h-80">
          <Line
            data={portfolioChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.raw.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Returns Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Portfolio Returns</h2>
        <div className="h-80">
          <Bar
            data={returnsChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw}%`
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value}%`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Trade History Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Trade History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{trade.symbol}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${trade.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${trade.currentValue?.toFixed(2) || 'N/A'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${trade.pnl?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}