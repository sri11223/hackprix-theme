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
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockStartups: Startup[] = [
  {
    id: '1',
    name: 'NeuroTech AI',
    logo: '/neurotech.png',
    tagline: 'Revolutionizing brain-computer interfaces',
    domains: ['AI', 'Neuroscience', 'Healthcare'],
    fundingStage: 'Series A',
    growthRate: 320,
    teamSize: 18,
    valuation: 45000000,
    foundedYear: 2020,
    location: 'San Francisco, CA',
    website: 'https://neurotech.ai',
    description: 'Developing non-invasive neural interfaces to help paralyzed patients communicate using only their thoughts. Our technology has shown 92% accuracy in clinical trials.',
    stats: {
      revenue: 1200000,
      users: 4500,
      retention: 78,
      mrrGrowth: 15,
      burnRate: 180000
    },
    team: [
      { 
        name: 'Dr. Sarah Chen', 
        role: 'CEO & Founder',
        experience: 'Former Google Brain, PhD Neuroscience Stanford',
        linkedin: '#' 
      },
      { 
        name: 'Mark Williams', 
        role: 'CTO',
        experience: 'Ex-Tesla Autopilot, MIT CS',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-10-15' },
      { type: 'Financials', url: '#', updated: '2023-09-30' },
      { type: 'Cap Table', url: '#', updated: '2023-08-20' }
    ],
    traction: [
      { milestone: 'FDA Approval for Clinical Trials', date: '2023-06-01', impact: 'Cleared for human testing' },
      { milestone: '$10M Series A', date: '2023-03-15', impact: 'Led by Sequoia Capital' },
      { milestone: 'First Commercial Pilot', date: '2022-11-01', impact: 'Deployed in 3 hospitals' }
    ]
  },
  {
    id: '2',
    name: 'GreenPack Solutions',
    logo: '/greenpack.png',
    tagline: 'Sustainable packaging for e-commerce',
    domains: ['Sustainability', 'E-commerce', 'Logistics'],
    fundingStage: 'Seed',
    growthRate: 180,
    teamSize: 12,
    valuation: 15000000,
    foundedYear: 2021,
    location: 'Austin, TX',
    website: 'https://greenpack.com',
    description: 'Plant-based biodegradable packaging that decomposes in 30 days while being as durable as plastic. Currently used by 50+ DTC brands.',
    stats: {
      revenue: 850000,
      users: 3200,
      retention: 65,
      mrrGrowth: 22,
      burnRate: 95000
    },
    team: [
      { 
        name: 'Emma Rodriguez', 
        role: 'Founder & CEO',
        experience: 'Ex-Amazon Sustainability Lead',
        linkedin: '#' 
      },
      { 
        name: 'James Wilson', 
        role: 'Head of R&D',
        experience: 'Material Science PhD, Berkeley',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-01' },
      { type: 'Financials', url: '#', updated: '2023-10-15' }
    ],
    traction: [
      { milestone: 'Walmart Supplier Contract', date: '2023-09-01', impact: '$2M annual contract' },
      { milestone: 'EPA Certification', date: '2023-07-15', impact: 'Fully compostable certification' }
    ]
  },
  {
    id: '3',
    name: 'QuantumLeap',
    logo: '/quantumleap.png',
    tagline: 'Democratizing quantum computing',
    domains: ['Quantum Computing', 'Enterprise SaaS', 'Cybersecurity'],
    fundingStage: 'Series B',
    growthRate: 410,
    teamSize: 32,
    valuation: 120000000,
    foundedYear: 2019,
    location: 'Boston, MA',
    website: 'https://quantumleap.tech',
    description: 'Making quantum computing accessible through cloud APIs with 99.9% qubit stability. Our platform reduces quantum algorithm development time from months to days.',
    stats: {
      revenue: 3500000,
      users: 12000,
      retention: 82,
      mrrGrowth: 28,
      burnRate: 420000
    },
    team: [
      { 
        name: 'Dr. Alan Zhang', 
        role: 'Chief Scientist',
        experience: 'Former IBM Quantum, PhD Physics MIT',
        linkedin: '#' 
      },
      { 
        name: 'Lisa Park', 
        role: 'COO',
        experience: 'Ex-AWS, Stanford MBA',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-20' },
      { type: 'Financials', url: '#', updated: '2023-10-31' },
      { type: 'Business Plan', url: '#', updated: '2023-09-15' }
    ],
    traction: [
      { milestone: 'Partnership with AWS', date: '2023-08-01', impact: 'Available on AWS Marketplace' },
      { milestone: 'Patented Qubit Tech', date: '2023-05-10', impact: '5 patents granted' }
    ]
  },
  {
    id: '4',
    name: 'FarmFutures',
    logo: '/farmfutures.png',
    tagline: 'AI-powered precision agriculture',
    domains: ['AgTech', 'AI', 'Sustainability'],
    fundingStage: 'Series A',
    growthRate: 275,
    teamSize: 24,
    valuation: 65000000,
    foundedYear: 2020,
    location: 'Chicago, IL',
    website: 'https://farmfutures.io',
    description: 'Using computer vision and IoT sensors to optimize crop yields while reducing water and fertilizer usage by up to 40%. Currently deployed across 500+ farms.',
    stats: {
      revenue: 2800000,
      users: 8500,
      retention: 71,
      mrrGrowth: 19,
      burnRate: 310000
    },
    team: [
      { 
        name: 'Raj Patel', 
        role: 'CEO',
        experience: 'Former John Deere, MS Agricultural Engineering',
        linkedin: '#' 
      },
      { 
        name: 'Sophia Kim', 
        role: 'Head of AI',
        experience: 'PhD Computer Vision, CMU',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-10-05' },
      { type: 'Financials', url: '#', updated: '2023-09-30' }
    ],
    traction: [
      { milestone: 'USDA Grant Award', date: '2023-07-15', impact: '$5M research grant' },
      { milestone: 'Major Food Co Partnership', date: '2023-04-01', impact: 'Rolling out to 200 farms' }
    ]
  },
  {
    id: '5',
    name: 'MediMatch',
    logo: '/medimatch.png',
    tagline: 'AI clinical trial matching',
    domains: ['Healthcare', 'AI', 'Clinical Trials'],
    fundingStage: 'Series B',
    growthRate: 380,
    teamSize: 45,
    valuation: 220000000,
    foundedYear: 2018,
    location: 'New York, NY',
    website: 'https://medimatch.ai',
    description: 'Our platform uses NLP to match patients with clinical trials 10x faster than manual processes, accelerating drug development timelines.',
    stats: {
      revenue: 8500000,
      users: 42000,
      retention: 88,
      mrrGrowth: 32,
      burnRate: 680000
    },
    team: [
      { 
        name: 'Dr. Nicole Brown', 
        role: 'Founder & CMO',
        experience: 'Former Pfizer, MD Harvard Medical',
        linkedin: '#' 
      },
      { 
        name: 'David Wilson', 
        role: 'CTO',
        experience: 'Ex-Google Health, PhD NLP',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-15' },
      { type: 'Financials', url: '#', updated: '2023-10-31' }
    ],
    traction: [
      { milestone: 'FDA Digital Health Certification', date: '2023-09-01', impact: 'Regulatory clearance' },
      { milestone: 'Partnership with Mayo Clinic', date: '2023-06-15', impact: 'Enterprise deployment' }
    ]
  },
  {
    id: '6',
    name: 'EduVantage',
    logo: '/eduvantage.png',
    tagline: 'Personalized learning at scale',
    domains: ['EdTech', 'AI', 'K12'],
    fundingStage: 'Series A',
    growthRate: 210,
    teamSize: 28,
    valuation: 75000000,
    foundedYear: 2019,
    location: 'Seattle, WA',
    website: 'https://eduvantage.com',
    description: 'Adaptive learning platform that personalizes educational content based on student performance and learning style, improving outcomes by 35%.',
    stats: {
      revenue: 4200000,
      users: 25000,
      retention: 76,
      mrrGrowth: 24,
      burnRate: 380000
    },
    team: [
      { 
        name: 'Maria Gonzalez', 
        role: 'CEO',
        experience: 'Former Pearson Education, EdD Columbia',
        linkedin: '#' 
      },
      { 
        name: 'Thomas Lee', 
        role: 'CPO',
        experience: 'Ex-Duolingo, Learning Science Expert',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-10-20' },
      { type: 'Financials', url: '#', updated: '2023-09-30' }
    ],
    traction: [
      { milestone: 'Department of Education Pilot', date: '2023-08-01', impact: '100 schools participating' },
      { milestone: 'Learning Efficacy Study', date: '2023-05-15', impact: '35% improvement proven' }
    ]
  },
  {
    id: '7',
    name: 'CleanRoute',
    logo: '/cleanroute.png',
    tagline: 'Optimizing EV charging networks',
    domains: ['EV', 'Clean Energy', 'Logistics'],
    fundingStage: 'Seed',
    growthRate: 320,
    teamSize: 15,
    valuation: 28000000,
    foundedYear: 2021,
    location: 'Denver, CO',
    website: 'https://cleanroute.ai',
    description: 'AI-powered routing system for electric fleets that reduces charging time by 25% and extends battery life through optimized charging patterns.',
    stats: {
      revenue: 950000,
      users: 3800,
      retention: 69,
      mrrGrowth: 27,
      burnRate: 210000
    },
    team: [
      { 
        name: 'Alex Johnson', 
        role: 'Founder',
        experience: 'Former Tesla Energy, MS Electrical Engineering',
        linkedin: '#' 
      },
      { 
        name: 'Priya Patel', 
        role: 'Head of AI',
        experience: 'PhD Battery Optimization, Stanford',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-10' },
      { type: 'Financials', url: '#', updated: '2023-10-31' }
    ],
    traction: [
      { milestone: 'Pilot with FedEx Fleet', date: '2023-09-15', impact: '50 trucks equipped' },
      { milestone: 'DOE Grant Award', date: '2023-07-01', impact: '$2.5M funding' }
    ]
  },
  {
    id: '8',
    name: 'VoiceHive',
    logo: '/voicehive.png',
    tagline: 'Enterprise voice AI platform',
    domains: ['Voice Tech', 'AI', 'Enterprise SaaS'],
    fundingStage: 'Series B',
    growthRate: 290,
    teamSize: 38,
    valuation: 180000000,
    foundedYear: 2018,
    location: 'San Francisco, CA',
    website: 'https://voicehive.ai',
    description: 'Context-aware voice assistant platform for enterprises that reduces call center volume by 40% while improving customer satisfaction scores.',
    stats: {
      revenue: 12500000,
      users: 85000,
      retention: 91,
      mrrGrowth: 33,
      burnRate: 750000
    },
    team: [
      { 
        name: 'Daniel Kim', 
        role: 'CEO',
        experience: 'Ex-Google Assistant, Speech Recognition Pioneer',
        linkedin: '#' 
      },
      { 
        name: 'Olivia Chen', 
        role: 'CPO',
        experience: 'Former Nuance, UX Specialist',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-05' },
      { type: 'Financials', url: '#', updated: '2023-10-31' }
    ],
    traction: [
      { milestone: 'Fortune 500 Deployment', date: '2023-08-15', impact: '20,000 seats licensed' },
      { milestone: 'Accuracy Benchmark', date: '2023-06-01', impact: '95% intent recognition' }
    ]
  },
  {
    id: '9',
    name: 'BuildStream',
    logo: '/buildstream.png',
    tagline: 'Construction workflow automation',
    domains: ['Construction Tech', 'SaaS', 'AI'],
    fundingStage: 'Series A',
    growthRate: 240,
    teamSize: 22,
    valuation: 85000000,
    foundedYear: 2020,
    location: 'Austin, TX',
    website: 'https://buildstream.io',
    description: 'End-to-end platform that digitizes construction workflows, reducing project delays by 30% and cutting paperwork by 90%.',
    stats: {
      revenue: 3800000,
      users: 12500,
      retention: 83,
      mrrGrowth: 26,
      burnRate: 420000
    },
    team: [
      { 
        name: 'Michael Rodriguez', 
        role: 'Founder',
        experience: 'Former Turner Construction, Civil Engineer',
        linkedin: '#' 
      },
      { 
        name: 'Sarah Johnson', 
        role: 'CTO',
        experience: 'Ex-Procore, Construction Tech Expert',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-10-15' },
      { type: 'Financials', url: '#', updated: '2023-09-30' }
    ],
    traction: [
      { milestone: 'Top 5 GC Partnership', date: '2023-07-01', impact: 'Enterprise contract signed' },
      { milestone: 'Product Certification', date: '2023-04-15', impact: 'OSHA-compliant workflows' }
    ]
  },
  {
    id: '10',
    name: 'FinSight',
    logo: '/finsight.png',
    tagline: 'AI-powered financial compliance',
    domains: ['FinTech', 'RegTech', 'AI'],
    fundingStage: 'Series C',
    growthRate: 180,
    teamSize: 65,
    valuation: 350000000,
    foundedYear: 2017,
    location: 'New York, NY',
    website: 'https://finsight.ai',
    description: 'Automating financial compliance with AI that reduces false positives by 70% while maintaining 99.9% detection accuracy for suspicious activity.',
    stats: {
      revenue: 28000000,
      users: 420000,
      retention: 95,
      mrrGrowth: 22,
      burnRate: 1200000
    },
    team: [
      { 
        name: 'Robert Chen', 
        role: 'CEO',
        experience: 'Former Goldman Sachs, FinTech Veteran',
        linkedin: '#' 
      },
      { 
        name: 'Lisa Wong', 
        role: 'Chief Compliance Officer',
        experience: 'Ex-SEC, Regulatory Expert',
        linkedin: '#' 
      }
    ],
    documents: [
      { type: 'Pitch Deck', url: '#', updated: '2023-11-01' },
      { type: 'Financials', url: '#', updated: '2023-10-31' }
    ],
    traction: [
      { milestone: 'Top 10 Bank Deployment', date: '2023-09-01', impact: 'Global rollout' },
      { milestone: 'Regulatory Approval', date: '2023-06-15', impact: 'Validated by FINRA' }
    ]
  }
];
        setStartups(mockStartups);
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

  const handleConnect = (startupId: string) => {
    if (!isClient) return;
    setConnectionRequested(prev => [...prev, startupId]);
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
                    <FiUsers className="mr-1" /> {startup.teamSize} team • {startup.location}
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