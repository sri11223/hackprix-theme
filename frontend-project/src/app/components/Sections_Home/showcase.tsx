"use client";
import { motion } from "framer-motion";
import { Rocket, DollarSign, Award, ArrowRight, Zap } from "lucide-react";

type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  category: "startup" | "investor" | "success-story";
  stats?: {
    value: string;
    label: string;
  }[];
  cta?: string;
};

const showcaseData: ShowcaseItem[] = [
  {
    id: "1",
    title: "Nexus AI",
    description: "AI-powered analytics platform that raised $5M in Seed funding through our network.",
    category: "startup",
    stats: [
      { value: "$5M", label: "Raised" },
      { value: "12", label: "Investors" },
    ],
    cta: "View Case Study"
  },
  {
    id: "2",
    title: "GreenVenture Capital",
    description: "Active investor specializing in climate tech startups. 15+ deals closed.",
    category: "investor",
    stats: [
      { value: "15+", label: "Deals" },
      { value: "$50M", label: "Deployed" },
    ],
    cta: "Connect Now"
  },
  {
    id: "3",
    title: "From Zero to $10M ARR",
    description: "How fintech startup Payly scaled with mentorship from our ecosystem.",
    category: "success-story",
    stats: [
      { value: "18", label: "Months" },
      { value: "10X", label: "Growth" },
    ],
    cta: "Read Story"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "startup": return <Rocket className="h-4 w-4" />;
    case "investor": return <DollarSign className="h-4 w-4" />;
    case "success-story": return <Award className="h-4 w-4" />;
    default: return <Zap className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "startup": return "bg-purple-900/30 text-purple-400 border-purple-500";
    case "investor": return "bg-blue-900/30 text-blue-400 border-blue-500";
    case "success-story": return "bg-green-900/30 text-green-400 border-green-500";
    default: return "bg-gray-900/30 text-gray-400 border-gray-500";
  }
};

export const ShowcaseSection = () => {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 opacity-95"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-900 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-900 rounded-full opacity-10 animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Featured
            </span> in Our Ecosystem
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover standout startups, active investors, and success stories
          </p>
        </motion.div>

        {/* Showcase Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {showcaseData.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl ${item.category === 'startup' ? 'bg-purple-900/20' : item.category === 'investor' ? 'bg-blue-900/20' : 'bg-green-900/20'} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300`}></div>
              
              {/* Card */}
              <div className="relative bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                    <span className="ml-1.5">
                      {item.category === "success-story" ? "Success" : item.category}
                    </span>
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {item.description}
                  </p>

                  {/* Stats */}
                  {item.stats && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {item.stats.map((stat, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                          <span className="block text-2xl font-bold text-white">
                            {stat.value}
                          </span>
                          <span className="text-xs text-gray-400">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                {item.cta && (
                  <button
                    type="button"
                    className={`w-full mt-auto rounded-lg px-4 py-2 font-medium transition-colors ${item.category === 'startup' ? 'bg-purple-600 hover:bg-purple-700 text-white' : item.category === 'investor' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    {item.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button
            type="button"
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Explore Full Showcase
            <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Animations */}
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