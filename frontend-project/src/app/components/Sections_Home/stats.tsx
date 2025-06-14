"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Rocket, Zap, BarChart2, DollarSign, Users, Award } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const StatsSection = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'startups',
      label: 'Startups in Network',
      value: 0,
      targetValue: 1250,
      suffix: '+',
      icon: <Rocket className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Innovative startups actively using our platform'
    },
    {
      id: 'funding',
      label: 'Funding Secured',
      value: 0,
      targetValue: 58,
      prefix: '$',
      suffix: 'M+',
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      description: 'Total investment facilitated through our network'
    },
    {
      id: 'investors',
      label: 'Active Investors',
      value: 0,
      targetValue: 320,
      suffix: '+',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Venture capitalists and angel investors'
    },
    {
      id: 'success',
      label: 'Success Rate',
      value: 0,
      targetValue: 87,
      suffix: '%',
      icon: <Award className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-teal-500 to-emerald-500',
      description: 'Of startups that achieve their funding goals'
    }
  ]);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Counter animation with easing
  const animateCounter = (item: StatItem, duration: number = 2000) => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = item.targetValue;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = Math.floor(easedProgress * targetValue);
      
      setStats(prevStats => 
        prevStats.map(stat => 
          stat.id === item.id 
            ? { ...stat, value: currentValue }
            : stat
        )
      );
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  };

  // Easing function for smooth counting
  const easeOutQuad = (t: number) => {
    return t * (2 - t);
  };

  // Start animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      // Start counter animations with staggered delays
      stats.forEach((stat, index) => {
        setTimeout(() => animateCounter(stat, 1800), index * 300);
      });
    }
  }, [isInView, controls]);

  const formatValue = (stat: StatItem) => {
    if (stat.prefix) {
      return `${stat.prefix}${stat.value}${stat.suffix}`;
    }
    return `${stat.value}${stat.suffix}`;
  };

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full opacity-30 animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={controls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { 
                duration: 0.6,
                ease: "easeOut"
              } 
            }
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ecosystem
            </span> by the Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
            Quantifying the impact of our global startup network and investor community
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover="hover"
              className="group relative"
            >
              {/* Glowing border effect */}
              <div className={`absolute inset-0 rounded-2xl ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}></div>
              
              {/* Stat card */}
              <div className="relative bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon with floating animation */}
                <motion.div 
                  className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full ${stat.color} text-white`}
                  animate={isInView ? {
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                    transition: {
                      duration: 4,
                      delay: index * 0.2,
                      repeat: Infinity,
                      repeatDelay: 4
                    }
                  } : {}}
                >
                  {stat.icon}
                </motion.div>

                {/* Animated counter */}
                <motion.div 
                  className={`text-5xl font-bold mb-2 font-['Poppins'] ${stat.id === 'funding' ? 'text-pink-600' : stat.id === 'startups' ? 'text-purple-600' : stat.id === 'investors' ? 'text-blue-600' : 'text-teal-600'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.3 + 0.5
                    }
                  } : {}}
                >
                  {formatValue(stat)}
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-['Inter']">
                  {stat.label}
                </h3>
                
                <p className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-['Inter']">
                  {stat.description}
                </p>

                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${i === 0 ? 'top-2 left-2 w-1 h-1' : i === 1 ? 'bottom-4 right-4 w-2 h-2' : 'top-6 right-6 w-1.5 h-1.5'} rounded-full ${stat.id === 'funding' ? 'bg-pink-300' : stat.id === 'startups' ? 'bg-purple-300' : stat.id === 'investors' ? 'bg-blue-300' : 'bg-teal-300'} opacity-0 group-hover:opacity-100`}
                    initial={{ scale: 0 }}
                    animate={isInView ? {
                      scale: [0, 1, 0.5, 1],
                      opacity: [0, 1, 1, 0],
                      transition: {
                        duration: 4,
                        delay: index * 0.1 + i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 5
                      }
                    } : {}}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { 
                duration: 0.6, 
                delay: 1.5,
                ease: "easeOut"
              } 
            }
          }}
        >
          <p className="text-lg text-gray-600 mb-6 font-['Inter']">
            Ready to join this thriving ecosystem?
          </p>
          <motion.button
            className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group font-['Inter']"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              Get Started Now
              <svg 
                className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;