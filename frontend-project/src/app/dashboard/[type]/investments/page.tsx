'use client';
import { useState } from 'react';
import {
  FiUsers, FiEye, FiDollarSign, FiMail, FiTrendingUp,
  FiAward, FiCheck, FiX, FiClock, FiStar, FiBarChart2, FiUser
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type Investor = {
  id: string;
  name: string;
  firm: string;
  status: 'interested' | 'viewed' | 'proposed' | 'connected';
  proposalAmount?: number;
  equityAsk?: number;
  lastInteraction: string;
  judgeScore?: number;
};

export default function StartupInvestmentDashboard() {
  // Mock data
  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'Alex Chen',
      firm: 'Sequoia Capital',
      status: 'interested',
      lastInteraction: '2 hours ago',
      judgeScore: 85,
    },
    {
      id: '2',
      name: 'Maria Garcia',
      firm: 'Andreessen Horowitz',
      status: 'proposed',
      proposalAmount: 500000,
      equityAsk: 10,
      lastInteraction: '1 day ago',
      judgeScore: 92,
    },
    {
      id: '3',
      name: 'Jamal Williams',
      firm: 'Y Combinator',
      status: 'viewed',
      lastInteraction: '3 days ago',
      judgeScore: 78,
    },
    {
      id: '4',
      name: 'Taylor Smith',
      firm: '500 Startups',
      status: 'connected',
      lastInteraction: '1 week ago',
      judgeScore: 88,
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  // Filter investors based on tab
  const filteredInvestors = investors.filter((investor) => {
    if (activeTab === 'all') return true;
    return investor.status === activeTab;
  });

  // Judge scoring distribution (for pie chart)
  const judgeScoreData = [
    { name: '70-80', value: investors.filter(i => (i.judgeScore || 0) >= 70 && (i.judgeScore || 0) < 80).length },
    { name: '80-90', value: investors.filter(i => (i.judgeScore || 0) >= 80 && (i.judgeScore || 0) < 90).length },
    { name: '90-100', value: investors.filter(i => (i.judgeScore || 0) >= 90).length },
  ];

  // Investor interest trends (for bar chart)
  const interestTrendData = [
    { day: 'Mon', views: 12, proposals: 2 },
    { day: 'Tue', views: 18, proposals: 3 },
    { day: 'Wed', views: 25, proposals: 5 },
    { day: 'Thu', views: 15, proposals: 4 },
    { day: 'Fri', views: 30, proposals: 7 },
  ];

  // Colors for pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiTrendingUp className="mr-2" /> Investment Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Track investor interest, proposals, and judge evaluations.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FiUsers, color: 'blue', title: 'Interested Investors', value: investors.filter(i => i.status === 'interested').length },
          { icon: FiEye, color: 'green', title: 'Profile Views', value: investors.filter(i => i.status === 'viewed').length },
          { icon: FiDollarSign, color: 'purple', title: 'Investment Proposals', value: investors.filter(i => i.status === 'proposed').length },
          { icon: FiAward, color: 'yellow', title: 'Avg. Judge Score', value: Math.round(investors.reduce((acc, inv) => acc + (inv.judgeScore || 0), 0) / investors.length) || 0 },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg mr-3`}>
                <stat.icon className={`text-${stat.color}-600`} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investor List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Investor Activity</h2>
            <div className="flex space-x-2">
              {['all', 'interested', 'viewed', 'proposed', 'connected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvestors.map((investor) => (
              <motion.div
                key={investor.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedInvestor(investor)}
                className={`p-4 rounded-lg border cursor-pointer ${
                  selectedInvestor?.id === investor.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{investor.name}</h3>
                      <p className="text-sm text-gray-500">{investor.firm}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      investor.status === 'interested' ? 'bg-blue-100 text-blue-800' :
                      investor.status === 'viewed' ? 'bg-gray-100 text-gray-800' :
                      investor.status === 'proposed' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {investor.status}
                    </span>
                    {investor.judgeScore && (
                      <div className="flex items-center text-sm">
                        <FiStar className="text-yellow-500 mr-1" />
                        {investor.judgeScore}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>
                    {investor.status === 'proposed' && (
                      <>
                        <FiDollarSign className="inline mr-1" />
                        ${investor.proposalAmount?.toLocaleString()} for {investor.equityAsk}% equity
                      </>
                    )}
                    {investor.status === 'viewed' && 'Viewed your profile'}
                    {investor.status === 'interested' && 'Expressed interest'}
                    {investor.status === 'connected' && 'Connected with you'}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {investor.lastInteraction}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Investor Details / Analytics) */}
        <div className="space-y-6">
          {/* Selected Investor Details */}
          {selectedInvestor ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-gray-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedInvestor.name}</h3>
                    <p className="text-gray-600">{selectedInvestor.firm}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedInvestor.status === 'interested' ? 'bg-blue-100 text-blue-800' :
                  selectedInvestor.status === 'viewed' ? 'bg-gray-100 text-gray-800' :
                  selectedInvestor.status === 'proposed' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedInvestor.status}
                </span>
              </div>

              <div className="space-y-4">
                {selectedInvestor.status === 'proposed' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Investment Proposal</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold">${selectedInvestor.proposalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity Ask:</span>
                      <span className="font-bold">{selectedInvestor.equityAsk}%</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center">
                    <FiMail className="mr-2" /> Message
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg flex items-center justify-center">
                    <FiUser className="mr-2" /> Profile
                  </button>
                </div>

                {selectedInvestor.judgeScore && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Judge Evaluation</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${selectedInvestor.judgeScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{selectedInvestor.judgeScore}/100</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on market fit, team, and scalability.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
            >
              <FiUsers className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-500">Select an investor to view details</p>
            </motion.div>
          )}

          {/* Analytics Charts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold mb-4">Investor Engagement</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interestTrendData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                  <Bar dataKey="proposals" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Judge Score Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold mb-4">Judge Score Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={judgeScoreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {judgeScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}