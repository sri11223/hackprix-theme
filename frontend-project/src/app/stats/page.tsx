'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ResizableNavbar } from '../components/Header/Navbar';
import { FooterWithSocialLinks } from '../components/Footer/Footer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';

export default function StatsPage() {
  const containerRef = useRef(null);
  const [activeMetric, setActiveMetric] = useState('monthly');
  
  const monthlyStats = [
    { month: 'Jan', startups: 150, investors: 80, deals: 25, funding: 12.5 },
    { month: 'Feb', startups: 210, investors: 95, deals: 32, funding: 15.8 },
    { month: 'Mar', startups: 320, investors: 120, deals: 45, funding: 22.3 },
    { month: 'Apr', startups: 450, investors: 180, deals: 58, funding: 28.7 },
    { month: 'May', startups: 580, investors: 220, deals: 72, funding: 35.4 },
    { month: 'Jun', startups: 750, investors: 280, deals: 95, funding: 42.9 }
  ];

  const yearlyStats = [
    { year: '2020', startups: 850, investors: 380, deals: 125, funding: 45.5 },
    { year: '2021', startups: 1210, investors: 495, deals: 232, funding: 89.8 },
    { year: '2022', startups: 2320, investors: 720, deals: 445, funding: 156.3 },
    { year: '2023', startups: 3450, investors: 980, deals: 658, funding: 234.7 }
  ];

  const quarterlyMetrics = [
    { quarter: 'Q1 2023', startups: 580, investors: 220, deals: 72, funding: 35.4 },
    { quarter: 'Q2 2023', startups: 750, investors: 280, deals: 95, funding: 42.9 },
    { quarter: 'Q3 2023', startups: 890, investors: 310, deals: 108, funding: 56.2 },
    { quarter: 'Q4 2023', startups: 1230, investors: 380, deals: 145, funding: 78.5 }
  ];

  const sectorData = [
    { name: 'AI/ML', value: 28, color: '#8B5CF6' },
    { name: 'FinTech', value: 22, color: '#3B82F6' },
    { name: 'HealthTech', value: 18, color: '#10B981' },
    { name: 'EdTech', value: 15, color: '#F59E0B' },
    { name: 'CleanTech', value: 12, color: '#EC4899' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const startupMetrics = [
    { subject: 'Growth Rate', A: 85, B: 90, fullMark: 100 },
    { subject: 'Revenue', A: 75, B: 85, fullMark: 100 },
    { subject: 'Market Size', A: 90, B: 80, fullMark: 100 },
    { subject: 'Team', A: 70, B: 88, fullMark: 100 },
    { subject: 'Innovation', A: 95, B: 85, fullMark: 100 },
    { subject: 'Scalability', A: 80, B: 92, fullMark: 100 },
  ];

  type QuarterlyKey = 'deals' | 'funding' | 'startups' | 'investors';

  const quarterlyStats = {
    q1: { deals: 102, funding: 50.6, startups: 680, investors: 295 },
    q2: { deals: 225, funding: 107.0, startups: 1780, investors: 680 },
    yoy: { deals: '+120%', funding: '+111%', startups: '+162%', investors: '+130%' }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <ResizableNavbar />

      {/* Hero Stats Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <motion.div className="absolute inset-0 z-0">
          {/* ...existing background blobs... */}
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Insights</span>
            </h1>
            <p className="text-xl text-gray-800 leading-relaxed">
              Comprehensive analytics and growth metrics of our startup ecosystem
            </p>
          </motion.div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { label: "Total Startups", value: "2,500+", icon: "🚀", change: "+45% YoY" },
              { label: "Active Investors", value: "980", icon: "💼", change: "+28% YoY" },
              { label: "Total Funding", value: "$82.6M", icon: "💰", change: "+92% YoY" },
              { label: "Success Rate", value: "89%", icon: "📈", change: "+12% YoY" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-800 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Time Period Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {['monthly', 'quarterly', 'yearly'].map((period) => (
              <button
                key={period}
                onClick={() => setActiveMetric(period)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${activeMetric === period 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Analytics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Growth Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Growth Trends</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={
                    activeMetric === 'monthly' ? monthlyStats :
                    activeMetric === 'quarterly' ? quarterlyMetrics :
                    yearlyStats
                  }>
                    <defs>
                      <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvestors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey={
                        activeMetric === 'monthly' ? 'month' :
                        activeMetric === 'quarterly' ? 'quarter' : 'year'
                      }
                      stroke="#4B5563"
                      fontSize={12}
                    />
                    <YAxis stroke="#4B5563" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 600 }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px',
                        color: '#374151'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="startups" 
                      stroke="#8B5CF6" 
                      fillOpacity={1} 
                      fill="url(#colorStartups)" 
                      name="Startups"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="investors" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorInvestors)" 
                      name="Investors"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6">Sector Distribution</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Startup Performance Metrics */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={150} data={startupMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Current Quarter"
                      dataKey="A"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Previous Quarter"
                      dataKey="B"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Funding Analytics */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6">Funding Analytics</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="funding" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]} 
                      name="Funding (M$)"
                    />
                    <Bar 
                      dataKey="deals" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]} 
                      name="Deals"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quarterly Performance */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Quarterly Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(quarterlyStats.q2).map(([key, value], i) => {
              const typedKey = key as QuarterlyKey;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{key}</h3>
                    <span className="text-green-500 text-sm font-medium">
                      {quarterlyStats.yoy[typedKey]}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-800">
                      Q1: {quarterlyStats.q1[typedKey].toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-800">
                      Q2: {quarterlyStats.q2[typedKey].toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterWithSocialLinks />
    </div>
  );
}