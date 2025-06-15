'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, FiDollarSign, FiUsers, FiBriefcase, FiClock, 
  FiAward, FiCode, FiBarChart2, FiCalendar, FiMessageSquare, 
  FiStar, FiCheckCircle, FiHeart, FiShare2, FiBookmark, 
  FiZap, FiLayers, FiTarget, FiPieChart, FiActivity
} from 'react-icons/fi';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const hoverVariants = {
  hover: { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }
};

const InvestorDashboard = () => (
  <div className="space-y-8">
    {/* Header */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Investor Dashboard</h2>
        <p className="text-gray-500">Track your portfolio and discover new opportunities</p>
      </div>
      <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
        Last updated: Just now
      </div>
    </motion.div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Portfolio Value</h3>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiDollarSign className="text-indigo-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">$4.2M</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiTrendingUp className="mr-1" />
            <span>18.5% from last quarter</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Active Investments</h3>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiBriefcase className="text-green-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">14</p>
          <div className="flex items-center mt-2 text-gray-500">
            <FiUsers className="mr-1" />
            <span>22 total in portfolio</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Avg. ROI</h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiBarChart2 className="text-purple-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">32.7%</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiTrendingUp className="mr-1" />
            <span>5.2% from last year</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">New Opportunities</h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiStar className="text-yellow-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">28</p>
          <div className="flex items-center mt-2 text-gray-500">
            <FiZap className="mr-1" />
            <span>High-potential matches</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recommended Startups */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recommended Startups</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View all <FiShare2 className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "NeuroTech AI",
              industry: "Artificial Intelligence",
              stage: "Series B",
              match: "96%",
              description: "Brain-computer interfaces for medical applications",
              valuation: "$120M",
              team: "12 members",
              traction: "300% YoY growth"
            },
            {
              name: "QuantumLeap",
              industry: "Quantum Computing",
              stage: "Series A",
              match: "93%",
              description: "Quantum algorithms for financial modeling",
              valuation: "$85M",
              team: "9 members",
              traction: "Patent pending"
            },
            {
              name: "GreenHydro",
              industry: "Clean Energy",
              stage: "Series C",
              match: "91%",
              description: "Hydrogen fuel cell technology for transportation",
              valuation: "$250M",
              team: "24 members",
              traction: "Govt contracts secured"
            },
            {
              name: "BioGenomeX",
              industry: "Biotech",
              stage: "Series B",
              match: "89%",
              description: "CRISPR-based gene editing platform",
              valuation: "$180M",
              team: "18 members",
              traction: "FDA trials phase 2"
            }
          ].map((startup, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-lg">{startup.name}</h4>
                  <p className="text-gray-600">{startup.industry} • {startup.stage}</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                    {startup.match} match
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{startup.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500">Valuation</div>
                  <div className="font-medium">{startup.valuation}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500">Team</div>
                  <div className="font-medium">{startup.team}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500">Traction</div>
                  <div className="font-medium truncate">{startup.traction}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  <FiBookmark className="mr-1" /> Save
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                  <FiMessageSquare className="mr-2" /> Contact
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Events & Quick Actions */}
      <div className="space-y-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              {
                title: "Pitch Day: Winter Cohort",
                time: "Today, 2:00 PM",
                type: "Pitch Event",
                participants: "15 startups presenting",
                status: "Live"
              },
              {
                title: "Portfolio Review",
                time: "Tomorrow, 9:00 AM",
                type: "Internal Meeting",
                participants: "With partners",
                status: "Confirmed"
              },
              {
                title: "Tech Conference",
                time: "Dec 15, 10:00 AM",
                type: "Industry Event",
                participants: "Keynote speaker",
                status: "Registered"
              },
              {
                title: "Founder Dinner",
                time: "Dec 20, 7:00 PM",
                type: "Networking",
                participants: "Top portfolio CEOs",
                status: "RSVP"
              }
            ].map((event, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 5 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <FiCalendar className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{event.title}</h4>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <FiClock className="mr-1" /> {event.time}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{event.type} • {event.participants}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === "Live" ? "bg-red-100 text-red-800" :
                    event.status === "Confirmed" ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {event.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex flex-col items-center">
              <FiActivity className="w-6 h-6 mb-2" />
              <span>Portfolio Analytics</span>
            </button>
            <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center">
              <FiTarget className="w-6 h-6 mb-2" />
              <span>Set Preferences</span>
            </button>
            <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center">
              <FiLayers className="w-6 h-6 mb-2" />
              <span>Deal Flow</span>
            </button>
            <button className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center">
              <FiPieChart className="w-6 h-6 mb-2" />
              <span>Reports</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Portfolio Performance */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Portfolio Performance</h3>
        <div className="flex space-x-2">
          <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
            1M
          </button>
          <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
            6M
          </button>
          <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
            1Y
          </button>
          <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
            All
          </button>
        </div>
      </div>
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-2 text-gray-500">Portfolio performance chart would be displayed here</p>
          <p className="text-sm text-gray-400">(Integration with charting library)</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Top Performer", value: "NeuroTech AI", change: "+45%" },
          { name: "Fastest Growth", value: "QuantumLeap", change: "+320%" },
          { name: "Newest Addition", value: "GreenHydro", change: "+18%" },
          { name: "Most Stable", value: "BioGenomeX", change: "+12%" }
        ].map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">{item.name}</p>
            <p className="font-medium">{item.value}</p>
            <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const StartupDashboard = () => (
  <div className="space-y-8">
    {/* Header */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Startup Dashboard</h2>
        <p className="text-gray-500">Manage your startup and track growth metrics</p>
      </div>
      <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
        Active • Seed Stage
      </div>
    </motion.div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Funding Raised</h3>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiDollarSign className="text-indigo-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">$1.2M</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiTrendingUp className="mr-1" />
            <span>$450K this quarter</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Growth</h3>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiTrendingUp className="text-green-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">22%</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiZap className="mr-1" />
            <span>Industry avg: 12%</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Team Members</h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiUsers className="text-purple-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">9</p>
          <div className="flex items-center mt-2 text-gray-500">
            <FiBriefcase className="mr-1" />
            <span>4 open positions</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Investor Interest</h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiStar className="text-yellow-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">36</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiMessageSquare className="mr-1" />
            <span>8 new this week</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Insights */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">AI Insights & Recommendations</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            Full report <FiShare2 className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Market Opportunity",
              icon: <FiTarget className="text-green-500 w-5 h-5" />,
              score: 92,
              description: "Your target market is growing rapidly with increasing demand",
              recommendation: "Expand marketing efforts to capitalize on trend"
            },
            {
              title: "Competitive Position",
              icon: <FiAward className="text-yellow-500 w-5 h-5" />,
              score: 78,
              description: "You have 5 direct competitors with similar offerings",
              recommendation: "Differentiate with unique features or pricing"
            },
            {
              title: "Team Strength",
              icon: <FiUsers className="text-blue-500 w-5 h-5" />,
              score: 85,
              description: "Your team covers all critical functions effectively",
              recommendation: "Consider adding senior sales leadership"
            },
            {
              title: "Funding Readiness",
              icon: <FiDollarSign className="text-purple-500 w-5 h-5" />,
              score: 88,
              description: "Strong metrics for next funding round",
              recommendation: "Prepare Series A deck and target 15 investors"
            }
          ].map((insight, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-opacity-20 bg-green-100 rounded-full mr-3">
                  {insight.icon}
                </div>
                <h4 className="font-bold">{insight.title}</h4>
                <div className="ml-auto bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {insight.score}/100
                </div>
              </div>
              <p className="mt-3 text-gray-600">{insight.description}</p>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-700">Recommendation:</p>
                <p className="text-sm text-gray-600">{insight.recommendation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <div className="space-y-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                type: "Funding",
                title: "Term sheet received from Sequoia",
                time: "2 hours ago",
                status: "Review"
              },
              {
                type: "Hiring",
                title: "3 new applications for CTO role",
                time: "5 hours ago",
                status: "New"
              },
              {
                type: "Product",
                title: "Version 2.3 released to beta",
                time: "1 day ago",
                status: "Live"
              },
              {
                type: "Partnership",
                title: "Meeting with AWS scheduled",
                time: "2 days ago",
                status: "Upcoming"
              }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 5 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-4 ${
                    activity.type === "Funding" ? "bg-purple-100" : 
                    activity.type === "Hiring" ? "bg-green-100" : 
                    activity.type === "Product" ? "bg-blue-100" : "bg-yellow-100"
                  }`}>
                    {activity.type === "Funding" ? <FiDollarSign className="text-purple-600 w-5 h-5" /> :
                     activity.type === "Hiring" ? <FiUsers className="text-green-600 w-5 h-5" /> :
                     activity.type === "Product" ? <FiCode className="text-blue-600 w-5 h-5" /> :
                     <FiBriefcase className="text-yellow-600 w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{activity.title}</h4>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <FiClock className="mr-1" /> {activity.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === "Review" ? "bg-yellow-100 text-yellow-800" :
                    activity.status === "New" ? "bg-green-100 text-green-800" :
                    activity.status === "Live" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex flex-col items-center">
              <FiMessageSquare className="w-6 h-6 mb-2" />
              <span>Pitch Deck</span>
            </button>
            <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center">
              <FiUsers className="w-6 h-6 mb-2" />
              <span>Hiring</span>
            </button>
            <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center">
              <FiDollarSign className="w-6 h-6 mb-2" />
              <span>Fundraising</span>
            </button>
            <button className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center">
              <FiBarChart2 className="w-6 h-6 mb-2" />
              <span>Metrics</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Investor Pipeline */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Investor Pipeline</h3>
        <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add New Investor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              {
                investor: "Sequoia Capital",
                stage: "Term Sheet",
                lastContact: "2 days ago",
                interest: "High",
                nextSteps: "Schedule partner meeting"
              },
              {
                investor: "Andreessen Horowitz",
                stage: "Pitch Meeting",
                lastContact: "1 week ago",
                interest: "Medium",
                nextSteps: "Send follow-up"
              },
              {
                investor: "Accel Partners",
                stage: "Initial Contact",
                lastContact: "2 weeks ago",
                interest: "Low",
                nextSteps: "Share metrics update"
              },
              {
                investor: "Y Combinator",
                stage: "Application",
                lastContact: "3 weeks ago",
                interest: "Pending",
                nextSteps: "Wait for response"
              }
            ].map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{item.investor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.stage === "Term Sheet" ? "bg-green-100 text-green-800" :
                    item.stage === "Pitch Meeting" ? "bg-blue-100 text-blue-800" :
                    item.stage === "Initial Contact" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {item.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.lastContact}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      item.interest === "High" ? "bg-green-500" :
                      item.interest === "Medium" ? "bg-yellow-500" :
                      item.interest === "Low" ? "bg-red-500" : "bg-gray-500"
                    }`}></div>
                    {item.interest}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Edit
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

const IndividualDashboard = () => (
  <div className="space-y-8">
    {/* Header */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Career Dashboard</h2>
        <p className="text-gray-500">Find your next opportunity and grow your skills</p>
      </div>
      <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
        Active job seeker
      </div>
    </motion.div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Applications</h3>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiBriefcase className="text-indigo-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">14</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiTrendingUp className="mr-1" />
            <span>5 this week</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Interviews</h3>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiMessageSquare className="text-green-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">3</p>
          <div className="flex items-center mt-2 text-gray-500">
            <FiCalendar className="mr-1" />
            <span>1 scheduled</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Profile Strength</h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiAward className="text-purple-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">85%</p>
          <div className="flex items-center mt-2 text-green-500">
            <FiCheckCircle className="mr-1" />
            <span>Complete your profile</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Network</h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiUsers className="text-yellow-600 w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">127</p>
          <div className="flex items-center mt-2 text-gray-500">
            <FiHeart className="mr-1" />
            <span>12 new this month</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job Recommendations */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recommended Jobs</h3>
          <div className="flex space-x-2">
            <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
              All
            </button>
            <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
              Tech
            </button>
            <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
              Startup
            </button>
            <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
              Remote
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Senior React Developer",
              company: "TechStart AI",
              location: "San Francisco, CA (Remote OK)",
              salary: "$130k - $160k",
              equity: "0.1% - 0.5%",
              match: "98%",
              skills: ["React", "TypeScript", "GraphQL"],
              posted: "2 days ago"
            },
            {
              title: "Tech Lead - Platform",
              company: "CloudSecure",
              location: "New York, NY",
              salary: "$150k - $190k",
              equity: "0.2% - 0.8%",
              match: "95%",
              skills: ["Node.js", "AWS", "Team Leadership"],
              posted: "5 days ago"
            },
            {
              title: "Full Stack Engineer",
              company: "DataMind",
              location: "Remote",
              salary: "$120k - $150k",
              equity: "0.05% - 0.2%",
              match: "92%",
              skills: ["React", "Python", "PostgreSQL"],
              posted: "1 week ago"
            },
            {
              title: "Frontend Architect",
              company: "UXFlow",
              location: "Austin, TX (Hybrid)",
              salary: "$140k - $180k",
              equity: "0.1% - 0.3%",
              match: "89%",
              skills: ["React", "Design Systems", "Performance"],
              posted: "2 weeks ago"
            }
          ].map((job, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="p-5 border rounded-xl hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-lg">{job.title}</h4>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                    {job.match} match
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Salary</div>
                  <div className="font-medium">{job.salary}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Equity</div>
                  <div className="font-medium">{job.equity}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Posted</div>
                  <div className="font-medium">{job.posted}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  <FiBookmark className="mr-1" /> Save
                </button>
                <div className="flex space-x-2">
                  <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                    View Details
                  </button>
                  <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skill Development & Network */}
      <div className="space-y-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Skill Development</h3>
          <div className="space-y-4">
            {[
              {
                skill: "React.js",
                level: "Advanced",
                progress: 85,
                neededFor: "92% of frontend jobs",
                resources: 12
              },
              {
                skill: "Node.js",
                level: "Intermediate",
                progress: 65,
                neededFor: "78% of fullstack jobs",
                resources: 8
              },
              {
                skill: "TypeScript",
                level: "Beginner",
                progress: 40,
                neededFor: "65% of your saved jobs",
                resources: 15
              },
              {
                skill: "GraphQL",
                level: "Beginner",
                progress: 30,
                neededFor: "45% of API jobs",
                resources: 6
              }
            ].map((skill, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{skill.skill}</h4>
                  <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {skill.level}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your proficiency</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        skill.progress > 70 ? 'bg-green-500' :
                        skill.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Needed for {skill.neededFor}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{skill.resources} resources available</span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    View resources
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Network Activity</h3>
          <div className="space-y-4">
            {[
              {
                name: "Sarah Johnson",
                role: "Engineering Manager at TechStart",
                action: "Viewed your profile",
                time: "2 hours ago",
                mutual: 3
              },
              {
                name: "Michael Chen",
                role: "CTO at CloudSecure",
                action: "Endorsed your React skills",
                time: "1 day ago",
                mutual: 5
              },
              {
                name: "Alex Rodriguez",
                role: "Recruiter at DataMind",
                action: "Sent connection request",
                time: "2 days ago",
                mutual: 2
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="bg-gray-200 w-10 h-10 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <h4 className="font-bold">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                    <p className="text-sm mt-1">{contact.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contact.time} • {contact.mutual} mutual connections
                    </p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <FiMessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            View all network activity
          </button>
        </motion.div>
      </div>
    </div>

    {/* Interview Preparation */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Interview Preparation</h3>
        <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Practice Now
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-indigo-50 rounded-lg">
          <h4 className="font-bold text-indigo-800">Upcoming Interviews</h4>
          <div className="mt-3 space-y-3">
            {[
              {
                company: "TechStart AI",
                role: "Senior React Dev",
                date: "Tomorrow, 10:00 AM",
                type: "Technical"
              },
              {
                company: "CloudSecure",
                role: "Tech Lead",
                date: "Friday, 2:00 PM",
                type: "Behavioral"
              }
            ].map((interview, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="font-medium">{interview.company}</p>
                <p className="text-sm text-gray-600">{interview.role}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <FiClock className="inline mr-1" /> {interview.date}
                </p>
                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {interview.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800">Common Questions</h4>
          <div className="mt-3 space-y-3">
            {[
              "Explain React's virtual DOM",
              "How do you optimize performance?",
              "Describe a challenging project",
              "What's your leadership style?"
            ].map((question, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm">{question}</p>
                <button className="mt-2 text-xs text-green-600 hover:text-green-800">
                  View sample answer
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800">Resources</h4>
          <div className="mt-3 space-y-3">
            {[
              {
                title: "System Design Primer",
                type: "Guide",
                length: "45 min"
              },
              {
                title: "React Patterns",
                type: "Video Course",
                length: "3 hours"
              },
              {
                title: "Behavioral Questions",
                type: "Cheat Sheet",
                length: "PDF"
              }
            ].map((resource, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="font-medium text-sm">{resource.title}</p>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{resource.type}</span>
                  <span>{resource.length}</span>
                </div>
                <button className="w-full mt-2 text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const type = Cookies.get('userType');
    setUserType(type);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userType) {
      case 'INVESTOR':
        return <InvestorDashboard />;
      case 'STARTUP':
        return <StartupDashboard />;
      case 'INDIVIDUAL':
        return <IndividualDashboard />;
      default:
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to HackPrix</h2>
              <p className="text-gray-600">Please select your user type to continue</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={userType || 'empty'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderDashboard()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}