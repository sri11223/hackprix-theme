"use client";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Users, BarChart2 } from "lucide-react";

export const CTASection = () => {
  const stats = [
    {
      value: "500+",
      label: "Startups",
      icon: <Rocket className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      value: "200+",
      label: "Investors",
      icon: <BarChart2 className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      value: "10K+",
      label: "Members",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-900 py-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 opacity-95"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-900 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-900 rounded-full opacity-10 animate-float-delayed"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Ready
            </span>{" "}
            to Transform Your Startup Journey?
          </h2>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join our ecosystem of innovators, investors, and mentors building the future
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              type="button"
              className="group relative bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>

            <motion.button
              type="button"
              className="border-2 border-gray-600 text-gray-200 hover:border-pink-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Features
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300`}></div>

              {/* Stat card */}
              <div className="relative bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-pink-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg bg-gradient-to-r ${stat.color} p-3 text-white`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial snippet */}
        <motion.div
          className="mt-20 rounded-2xl bg-gray-800/50 p-8 border border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                <span className="text-lg font-medium text-white">JP</span>
              </div>
            </div>
            <div className="ml-4">
              <blockquote className="text-white">
                <p className="text-lg">
                  "This platform transformed how we connect with investors. We
                  closed our Series A within 3 months of joining."
                </p>
              </blockquote>
              <div className="mt-4 text-gray-300">
                <p className="font-medium">Jane Parker</p>
                <p>CEO, TechNova</p>
              </div>
            </div>
          </div>
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