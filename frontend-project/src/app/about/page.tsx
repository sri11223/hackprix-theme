'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { ResizableNavbar } from '../components/Header/Navbar';
import { FooterWithSocialLinks } from '../components/Footer/Footer';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const timeline = [
    {
      year: "2022",
      title: "The Inspiration",
      description: "Witnessed countless promising startups fail due to preventable reasons. The idea of using AI to predict and prevent startup failures was born.",
      icon: "💡"
    },
    {
      year: "2023",
      title: "Research & Development",
      description: "Analyzed 10,000+ startup success/failure cases. Developed initial AI models for prediction.",
      icon: "🔬"
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Launched the world's first AI-powered startup success predictor with comprehensive ecosystem support.",
      icon: "🚀"
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Supporting 2,500+ startups across 30 countries with advanced AI insights.",
      icon: "🌍"
    }
  ];

  // Core Values Data
  const coreValues = [
    {
      icon: "🎯",
      title: "Innovation First",
      description: "Pushing boundaries with cutting-edge AI technology to solve complex startup challenges."
    },
    {
      icon: "🤝",
      title: "Founder-Centric",
      description: "Everything we build is designed to empower founders and make their journey easier."
    },
    {
      icon: "📈",
      title: "Data-Driven",
      description: "Making decisions and providing insights backed by robust data analysis."
    }
  ];

  // Technology Stack Data
  const techStack = [
    { name: "AI/ML", icon: "🤖", details: "TensorFlow, PyTorch, Scikit-learn" },
    { name: "Big Data", icon: "📊", details: "Apache Spark, Hadoop, MongoDB" },
    { name: "Cloud", icon: "☁️", details: "AWS, Google Cloud, Azure" },
    { name: "Security", icon: "🔒", details: "End-to-end encryption, OAuth 2.0" },
    { name: "Frontend", icon: "💻", details: "React, Next.js, TailwindCSS" },
    { name: "Backend", icon: "⚙️", details: "Node.js, Python, Go" },
    { name: "APIs", icon: "🔌", details: "REST, GraphQL, WebSockets" },
    { name: "DevOps", icon: "🔄", details: "Docker, Kubernetes, CI/CD" }
  ];

  // Team Data
  const teamData = [
    {
      role: "Technical Leadership",
      count: "15+",
      experience: "Years Combined Experience",
      expertise: ["AI/ML", "Cloud Architecture", "Scalable Systems"]
    },
    {
      role: "Data Science",
      count: "10+",
      experience: "Data Scientists",
      expertise: ["Predictive Analytics", "NLP", "Computer Vision"]
    },
    {
      role: "Product & Design",
      count: "8+",
      experience: "UX Specialists",
      expertise: ["User Research", "UI Design", "Product Strategy"]
    }
  ];

  // Global Presence Data
  const regions = [
    { region: "North America", startups: 850 },
    { region: "Europe", startups: 620 },
    { region: "Asia Pacific", startups: 580 },
    { region: "Latin America", startups: 450 }
  ];

  // Growth Metrics Data
  const growthMetrics = [
    { label: "Monthly Active Users", value: "12,000+" },
    { label: "Platform Availability", value: "99.99%" },
    { label: "Support Response Time", value: "< 2 hours" },
    { label: "Customer Satisfaction", value: "4.8/5" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <ResizableNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Transforming
              </span>
              <br />
              <span className="text-white">
                Startup Success
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              We're on a mission to revolutionize how startups grow, scale, and succeed using the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 relative overflow-hidden bg-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To create a world where every startup has the tools, insights, and support needed to succeed, powered by cutting-edge AI technology.
              </p>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To reduce startup failure rates by 50% through AI-powered predictions, real-time coaching, and ecosystem support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {item.year}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,500+", label: "Startups Supported" },
              { value: "85%", label: "Success Rate" },
              { value: "$180M", label: "Total Funding Raised" },
              { value: "30+", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white/5 backdrop-blur-lg relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Technology Stack
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center group-hover:border-white/20 transition-all">
                  <div className="text-4xl mb-3">{tech.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-400">{tech.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamData.map((team, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">{team.role}</h3>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {team.count}
                </div>
                <p className="text-gray-300 mb-4">{team.experience}</p>
                <div className="flex flex-wrap gap-2">
                  {team.expertise.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Global Presence
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Where We Operate</h3>
              <div className="grid grid-cols-2 gap-4">
                {regions.map((region, i) => (
                  <div key={i} className="text-gray-300">
                    <div className="font-semibold">{region.region}</div>
                    <div className="text-sm">{region.startups} Startups</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Growth Metrics</h3>
              <div className="space-y-4">
                {growthMetrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-300">{metric.label}</span>
                    <span className="text-white font-semibold">{metric.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterWithSocialLinks />
    </div>
  );
}