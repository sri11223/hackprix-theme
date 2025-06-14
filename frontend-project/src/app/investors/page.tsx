'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ResizableNavbar } from '../components/Header/Navbar';
import { FooterWithSocialLinks } from '../components/Footer/Footer';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  VideoCameraIcon,
  StarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerCards = {
  container: {
    animate: { transition: { staggerChildren: 0.1 } }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
};

// Add these new data constants at the top of the file
const investmentData = {
  portfolioStats: [
    { label: "Total AUM", value: "$250M+", icon: "💰", growth: "+45% YoY" },
    { label: "IRR", value: "28.5%", icon: "📈", growth: "+12% YoY" },
    { label: "Active Investments", value: "320+", icon: "🚀", growth: "+65% YoY" },
    { label: "Successful Exits", value: "85+", icon: "🎯", growth: "+30% YoY" }
  ],
  sectorAllocation: [
    { sector: "AI/ML", allocation: 35, deals: 48 },
    { sector: "FinTech", allocation: 25, deals: 32 },
    { sector: "HealthTech", allocation: 20, deals: 28 },
    { sector: "CleanTech", allocation: 15, deals: 18 },
    { sector: "Others", allocation: 5, deals: 12 }
  ],
  investorTiers: [
    {
      name: "Angel Investor",
      minInvestment: "$10K",
      benefits: ["Deal Flow Access", "Basic Analytics", "Community Access"],
      color: "from-blue-500 to-purple-500"
    },
    {
      name: "Institutional",
      minInvestment: "$100K",
      benefits: ["Premium Deal Flow", "Advanced Analytics", "1:1 Support"],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Syndicate",
      minInvestment: "$500K",
      benefits: ["Lead Deals", "Custom Solutions", "Strategic Support"],
      color: "from-pink-500 to-red-500"
    }
  ]
};

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState('discover');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const opportunitiesRef = useRef(null);

  // InView hooks
  const isHeroVisible = useInView(heroRef, { once: true });
  const isStatsVisible = useInView(statsRef, { once: true });
  const isFeaturesVisible = useInView(featuresRef, { once: true });
  const isOpportunitiesVisible = useInView(opportunitiesRef, { once: true });

  // Mock Data
  const investmentStats = [
    { label: "Total Investments", value: "$50M+", icon: "💰" },
    { label: "Active Startups", value: "200+", icon: "🚀" },
    { label: "Success Rate", value: "89%", icon: "📈" },
    { label: "Investor Network", value: "5000+", icon: "🌐" }
  ];

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our advanced algorithms match you with the perfect investment opportunities.",
      icon: LightBulbIcon,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Real-time Analytics",
      description: "Track your portfolio performance with sophisticated analytics tools.",
      icon: ChartBarIcon,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Secure Transactions",
      description: "Bank-grade security for all your investment transactions.",
      icon: ShieldCheckIcon,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const opportunities = [
    {
      name: "TechFlow AI",
      sector: "Artificial Intelligence",
      funding: "$2.5M",
      progress: 75,
      logo: "🤖"
    },
    {
      name: "GreenEnergy",
      sector: "CleanTech",
      funding: "$1.8M",
      progress: 60,
      logo: "🌱"
    },
    {
      name: "FinanceHub",
      sector: "FinTech",
      funding: "$3.2M",
      progress: 85,
      logo: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <ResizableNavbar />

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen pt-32 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 opacity-90" />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              backgroundSize: ['100% 100%', '120% 120%']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: 'url("/grid-pattern.svg")',
              opacity: 0.1
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Smart Capital,
              </span>
              <br />
              <span className="text-white">
                Exceptional Returns
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Join an elite network of investors backing the next generation of unicorns
            </motion.p>

            {/* Investment Highlights */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              variants={staggerCards.container}
              initial="initial"
              animate="animate"
            >
              { [
                { value: "$250M+", label: "AUM" },
                { value: "28.5%", label: "IRR" },
                { value: "320+", label: "Deals" },
                { value: "85+", label: "Exits" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white"
                  variants={staggerCards.item}
                >
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              )) }
            </motion.div>

            {/* Enhanced CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Become an Investor
                  <SparklesIcon className="w-5 h-5 ml-2" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Deal Flow
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerCards.container}
            initial="initial"
            animate={isStatsVisible ? "animate" : "initial"}
          >
            {investmentStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                variants={staggerCards.item}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-purple-600">Us</span>
            </h2>
            <p className="text-xl text-gray-600">
              Cutting-edge technology meets investment expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section ref={opportunitiesRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isOpportunitiesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured <span className="text-purple-600">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600">
              Discover high-potential startups ready for investment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={isOpportunitiesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{opportunity.logo}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{opportunity.name}</h3>
                    <p className="text-gray-600">{opportunity.sector}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Funding Target</span>
                    <span className="font-bold text-gray-800">{opportunity.funding}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${opportunity.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {opportunity.progress}% Funded
                  </div>
                </div>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of successful investors on our platform
          </p>
          <motion.button
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
        </div>
      </section>

      <FooterWithSocialLinks />
    </div>
  );
}