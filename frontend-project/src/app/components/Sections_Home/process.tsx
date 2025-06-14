"use client";
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, BrainCircuit, Lightbulb, Handshake, TrendingUp } from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  gradient: string;
  delay: number;
}

const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const processSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Create Profile",
      description: "Build your startup profile with our guided setup",
      icon: <Rocket className="h-6 w-6" />,
      details: [
        "AI-powered profile builder",
        "Team information setup",
        "Business model canvas",
        "Initial assessment"
      ],
      gradient: "from-purple-600 to-pink-600",
      delay: 0.2
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Get comprehensive evaluation of your startup",
      icon: <BrainCircuit className="h-6 w-6" />,
      details: [
        "100+ factor analysis",
        "Market opportunity",
        "Team compatibility",
        "Financial assessment"
      ],
      gradient: "from-blue-600 to-cyan-600",
      delay: 0.4
    },
    {
      id: 3,
      title: "Get Insights",
      description: "Receive actionable recommendations",
      icon: <Lightbulb className="h-6 w-6" />,
      details: [
        "Strategic improvements",
        "Team building advice",
        "Market positioning",
        "Funding preparation"
      ],
      gradient: "from-green-600 to-emerald-600",
      delay: 0.6
    },
    {
      id: 4,
      title: "Connect Network",
      description: "Find investors and talent",
      icon: <Handshake className="h-6 w-6" />,
      details: [
        "Investor matching",
        "Co-founder discovery",
        "Talent acquisition",
        "Mentor connections"
      ],
      gradient: "from-yellow-600 to-amber-600",
      delay: 0.8
    },
    {
      id: 5,
      title: "Launch & Scale",
      description: "Grow with continuous support",
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        "Live pitch sessions",
        "Growth tracking",
        "Performance analytics",
        "Continuous optimization"
      ],
      gradient: "from-indigo-600 to-purple-600",
      delay: 1.0
    }
  ];

  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 opacity-95"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-900 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-900 rounded-full opacity-10 animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our 5-Step
            </span> Process
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From idea to successful business with AI-powered guidance
          </p>
        </motion.div>

        {/* Desktop Process Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <svg className="absolute top-24 left-0 w-full h-2 z-0" viewBox="0 0 1200 20">
              <motion.path
                d="M 50 10 Q 300 10 350 10 Q 600 10 650 10 Q 900 10 950 10 Q 1150 10 1150 10"
                stroke="url(#processGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="25%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="75%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>

            {/* Process Steps */}
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {processSteps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: step.delay, duration: 0.6 }}
                  className="text-center group cursor-pointer"
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  {/* Step Circle */}
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-lg relative`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-sm font-bold text-white border border-gray-700">
                      {step.id}
                    </div>
                  </motion.div>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <motion.div 
            className="mt-16 bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700"
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {processSteps.map((step) => (
              activeStep === step.id && (
                <div key={step.id}>
                  <div className="flex items-center mb-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white mr-6`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {step.details.map((detail, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-xs text-white mr-3`}>
                            {index + 1}
                          </div>
                          <span className="text-gray-100">{detail}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </div>

        {/* Mobile Process Flow */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: step.delay }}
              className="relative"
            >
              {/* Connecting Line for Mobile */}
              {index < processSteps.length - 1 && (
                <div className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-purple-500 to-blue-500 opacity-30"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Step Circle */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white relative flex-shrink-0`}>
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-xs font-bold text-white border border-gray-700">
                    {step.id}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-xs text-white mr-3 mt-1 flex-shrink-0`}>
                          {detailIndex + 1}
                        </div>
                        <span className="text-gray-100 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Startup?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of founders who've accelerated their success with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button
              className="border-2 border-gray-600 text-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:border-pink-500 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};

export default ProcessSection;