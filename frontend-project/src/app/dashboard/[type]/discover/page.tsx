'use client';
import { useState, useEffect } from 'react';
import {
  FiSearch, FiBriefcase, FiUsers, FiBarChart2, 
  FiDollarSign, FiMail, FiGlobe, FiClock, FiStar,
  FiHeart, FiShare2, FiMessageSquare, FiX, FiUser, 
  FiTrendingUp, FiDownload, FiCheck
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_ENDPOINTS } from '@/lib/api-config';

type Startup = {
  id: string;
  name: string;
  logo?: string;
  tagline: string;
  domains: string[];
  fundingStage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  growthRate: number;
  teamSize: number;
  valuation: number;
  description: string;
  foundedYear: number;
  location: string;
  website: string;
  stats: {
    revenue: number;
    users: number;
    retention: number;
    mrrGrowth: number;
    burnRate: number;
  };
  team: {
    name: string;
    role: string;
    experience?: string;
    linkedin?: string;
  }[];
  documents: {
    type: 'Pitch Deck' | 'Financials' | 'Cap Table' | 'Business Plan';
    url: string;
    updated: string;
  }[];
  traction: {
    milestone: string;
    date: string;
    impact: string;
  }[];
};

export default function DiscoverStartups() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [connectionRequested, setConnectionRequested] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${API_ENDPOINTS.STARTUPS.LIST}?search=${searchQuery}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setStartups(data.startups || []);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.domains.some(domain => 
      domain.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleConnect = async (startupId: string) => {
    if (!isClient) return;
    try {
      const token = Cookies.get('token');
      await fetch(API_ENDPOINTS.CONNECTIONS.REQUEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ targetUserId: startupId }),
      });
      setConnectionRequested(prev => [...prev, startupId]);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Discover <span className="text-blue-600">Startups</span>
        </h1>
        <p className="text-lg text-gray-600">
          Find innovative companies ready for investment
        </p>
      </header>

      {/* Search & Filters */}
      <div className="mb-8">
        <div className="relative max-w-xl mb-6">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups by name or domain (AI, Healthcare, SaaS...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'AI', 'Healthcare', 'Fintech', 'Sustainability', 'Web3', 'Seed Stage', 'Series A+'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag === 'All' ? '' : tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                (searchQuery === tag || (tag === 'All' && searchQuery === '')) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Startup Grid */}
      {filteredStartups.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No startups found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <motion.div
              key={startup.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStartup(startup)}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                    {startup.logo ? (
                      <img src={startup.logo} alt={`${startup.name} logo`} className="w-full h-full object-cover" />
                    ) : (
                      <FiBriefcase className="text-2xl text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{startup.name}</h3>
                    <p className="text-gray-600">{startup.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {startup.domains.map((domain) => (
                    <span key={domain} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {domain}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {startup.fundingStage}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Growth</div>
                    <div className="font-bold text-green-600">{startup.growthRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="font-bold">{formatCurrency(startup.stats.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Valuation</div>
                    <div className="font-bold">{formatCurrency(startup.valuation)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUsers className="mr-1" /> {startup.teamSize} team â€¢ {startup.location}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(startup.id);
                    }}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm ${
                      connectionRequested.includes(startup.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {connectionRequested.includes(startup.id) ? (
                      <>
                        <FiCheck className="mr-1" /> Requested
                      </>
                    ) : (
                      <>
                        <FiMail className="mr-1" /> Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Startup Detail Dialog */}
      <AnimatePresence>
        {selectedStartup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStartup(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ... (rest of the dialog content remains the same) ... */}
               {/* Startup Detail Dialog */}
      <AnimatePresence>
        {selectedStartup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStartup(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
                      {selectedStartup.logo ? (
                        <img src={selectedStartup.logo} alt={`${selectedStartup.name} logo`} className="w-full h-full object-cover" />
                      ) : (
                        <FiBriefcase className="text-3xl text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStartup.name}</h2>
                      <p className="text-lg text-gray-600">{selectedStartup.tagline}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedStartup.domains.map((domain) => (
                          <span key={domain} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {domain}
                          </span>
                        ))}
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {selectedStartup.fundingStage}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {selectedStartup.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStartup(null)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-3">About</h3>
                      <p className="text-gray-700 mb-4">{selectedStartup.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiGlobe className="mr-2" />
                        <a href={selectedStartup.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedStartup.website}
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3">Key Metrics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { icon: FiTrendingUp, label: 'Growth Rate', value: `${selectedStartup.growthRate}% YoY` },
                          { icon: FiDollarSign, label: 'Revenue', value: formatCurrency(selectedStartup.stats.revenue) },
                          { icon: FiUsers, label: 'Users', value: selectedStartup.stats.users.toLocaleString() },
                          { icon: FiBarChart2, label: 'Retention', value: `${selectedStartup.stats.retention}%` },
                          { icon: FiClock, label: 'Founded', value: selectedStartup.foundedYear },
                          { icon: FiStar, label: 'Valuation', value: formatCurrency(selectedStartup.valuation) },
                        ].map((metric, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center mb-1">
                              <metric.icon className="text-gray-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                            </div>
                            <div className="text-lg font-bold">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedStartup.traction && selectedStartup.traction.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-3">Recent Traction</h3>
                        <div className="space-y-3">
                          {selectedStartup.traction.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                              <div className="text-sm text-gray-500">{item.date}</div>
                              <div className="font-medium">{item.milestone}</div>
                              <div className="text-sm text-gray-600">{item.impact}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-3">Team ({selectedStartup.teamSize})</h3>
                      <div className="space-y-3">
                        {selectedStartup.team.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUser className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-600">{member.role}</div>
                              {member.experience && (
                                <div className="text-xs text-gray-500 mt-1">{member.experience}</div>
                              )}
                            </div>
                            {member.linkedin && (
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Investment Opportunity</h3>
                      <p className="text-sm text-gray-700 mb-4">
                        {selectedStartup.name} is seeking {selectedStartup.fundingStage} funding to accelerate growth.
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleConnect(selectedStartup.id)}
                          className={`w-full py-2 rounded-lg flex items-center justify-center ${
                            connectionRequested.includes(selectedStartup.id)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {connectionRequested.includes(selectedStartup.id) ? (
                            <>
                              <FiCheck className="mr-2" /> Connection Requested
                            </>
                          ) : (
                            <>
                              <FiMail className="mr-2" /> Connect with Founders
                            </>
                          )}
                        </button>
                        <button className="w-full py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                          <FiShare2 className="mr-2" /> Share Startup
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Due Diligence Documents</h3>
                      <div className="space-y-2">
                        {selectedStartup.documents.map((doc, index) => (
                          <a 
                            key={index}
                            href={doc.url}
                            download
                            className="w-full block text-left py-2 px-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{doc.type}</div>
                              <div className="text-xs text-gray-500">Updated {doc.updated}</div>
                            </div>
                            <FiDownload className="text-gray-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
