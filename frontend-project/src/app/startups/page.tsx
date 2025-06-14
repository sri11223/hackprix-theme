// app/startup/page.tsx
'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ResizableNavbar } from '../components/Header/Navbar';
import { FooterWithSocialLinks } from '../components/Footer/Footer';

export default function StartupPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Enhanced parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const xText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div 
      ref={ref}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50"
    >
      <ResizableNavbar/>
      {/* Hero Section with Beam Collision */}
      <section className="relative min-h-screen pt-24 overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900">
        <BackgroundBeamsWithCollision className="from-indigo-900/50 to-purple-900/50">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <motion.h1 
                style={{ x: xText }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200">
                  Founder's Hub
                </span>
              </motion.h1>
              <motion.p 
                style={{ x: xText }}
                className="text-xl text-gray-300 mb-8 max-w-lg"
              >
                The complete platform to build, fund, and scale your startup
              </motion.p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-xl shadow-indigo-500/20"
                >
                  Launch Your Startup
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium backdrop-blur-sm border border-white/20"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Added floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"
            />
          </div>
        </BackgroundBeamsWithCollision>
        
        {/* Added gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Enhanced Trust Indicators */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
            Trusted by <span className="text-purple-600">12,000+</span> Startups
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4.8/5", label: "Platform Rating", icon: "⭐" },
              { value: "$3.2B", label: "Funding Raised", icon: "💰" },
              { value: "240+", label: "Investor Network", icon: "👔" },
              { value: "95%", label: "Satisfaction Rate", icon: "❤️" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-3xl font-bold text-indigo-600 mb-2">{item.value}</p>
                <p className="text-gray-600">{item.label}</p>
              </motion.div>
            ))}

            {/* New Animated Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-all col-span-2 md:col-span-1"
            >
              <div className="text-4xl mb-3">
                <motion.img
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  src="/badge-trust.svg"
                  alt="Trusted Badge"
                  className="inline-block"
                />
              </div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">Trusted by Experts</p>
              <p className="text-gray-600 text-sm">
                Our platform is recommended by top industry experts and successful founders.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Background elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-100/50 blur-3xl" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-indigo-100/50 blur-3xl" />
      </section>

      {/* Enhanced Startup Journey */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Your <span className="text-indigo-600">Startup Journey</span> With Us
          </motion.h2>
          
          <div className="relative">
            {/* Animated timeline line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              className="hidden md:block absolute left-1/2 h-full w-1 bg-gradient-to-b from-indigo-200 to-purple-200 transform -translate-x-1/2 origin-top"
            />
            
            {/* Steps with enhanced animations */}
            {[
              {
                title: "AI-Powered Profile Setup",
                description: "Get instant feedback on your startup concept and profile completeness with our advanced AI analysis",
                icon: "🚀",
                color: "bg-indigo-100"
              },
              {
                title: "Team Formation",
                description: "Match with co-founders and hire top talent through our verified network of professionals",
                icon: "👥",
                color: "bg-purple-100"
              },
              {
                title: "Investor Matching",
                description: "Connect with verified investors perfectly tailored to your industry and growth stage",
                icon: "💵",
                color: "bg-blue-100"
              },
              {
                title: "Growth Analytics",
                description: "Track all key metrics and get predictive insights to scale efficiently",
                icon: "📊",
                color: "bg-cyan-100"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className={`relative mb-16 md:mb-20 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:self-end md:ml-auto'}`}
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`p-8 rounded-2xl shadow-md hover:shadow-xl transition-all ${step.color}`}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: i * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="hidden md:block absolute top-1/2 w-6 h-6 rounded-full bg-indigo-600 transform -translate-y-1/2" 
                  style={{ left: i % 2 === 0 ? 'calc(100% - 3rem)' : '-3rem' }} 
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            transition: { repeat: Infinity, duration: 8, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-indigo-200/30 blur-lg"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
            transition: { repeat: Infinity, duration: 10, ease: "easeInOut", delay: 0.5 }
          }}
          className="absolute bottom-1/4 right-20 w-28 h-28 rounded-full bg-purple-200/30 blur-lg"
        />
      </section>

      {/* Enhanced Investment Connection */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Direct Access to <span className="text-indigo-300">Global Investors</span>
            </h2>
            <p className="text-xl mb-10 text-indigo-200 max-w-3xl mx-auto">
              Our intelligent algorithm matches you with the perfect investors based on your startup's profile, traction, and funding needs.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {[
                { type: "VC Firms", count: "240+" },
                { type: "Angels", count: "500+" },
                { type: "CVCs", count: "120+" },
                { type: "PE Firms", count: "80+" },
                { type: "Syndicates", count: "60+" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <p className="text-2xl font-bold mb-1">{item.count}</p>
                  <p className="text-sm opacity-90">{item.type}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-6 text-lg border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-indigo-900 transition-colors"
            >
              View Investor Matches
            </motion.button>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            transition: { repeat: Infinity, duration: 15, ease: "easeInOut" }
          }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-800/30 blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            transition: { repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }
          }}
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-800/30 blur-2xl"
        />
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-[url('/texture-light.svg')] bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-indigo-50/90" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block max-w-2xl bg-white p-12 rounded-3xl shadow-2xl border border-gray-100"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to <span className="text-indigo-600">accelerate</span> your startup?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of founders who launched successfully with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
              >
                Get Started - Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-6 text-lg border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium"
              >
                Book Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            transition: { repeat: Infinity, duration: 20, ease: "linear" }
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-4 border-indigo-200/30"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            transition: { repeat: Infinity, duration: 25, ease: "linear", delay: 3 }
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border-4 border-purple-200/30"
        />
      </section>

      {/* New Feature: Startup Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Startup <span className="text-purple-600">Success Stories</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "EcoPack",
                story: "Raised $4.2M in seed funding through our investor network",
                growth: "320%",
                logo: "🌱"
              },
              {
                name: "HealthTrack",
                story: "Found their perfect CTO through our matching system",
                growth: "180%",
                logo: "🏥"
              },
              {
                name: "FoodGenius",
                story: "Improved their pitch and secured Series A in 3 months",
                growth: "420%",
                logo: "🍔"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{item.logo}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.story}</p>
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full inline-block text-sm font-medium">
                  +{item.growth} Growth
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Feature: Startup Resources */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900"
          >
            Free <span className="text-purple-600">Startup Resources</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Pitch Deck Template",
                icon: "📑",
                category: "Funding"
              },
              {
                title: "Cap Table Calculator",
                icon: "🧮",
                category: "Finance"
              },
              {
                title: "Founder Agreement",
                icon: "📝",
                category: "Legal"
              },
              {
                title: "Growth Metrics",
                icon: "📈",
                category: "Analytics"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-indigo-600">{item.category}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Browse All Resources
            </motion.button>
          </motion.div>
        </div>
      </section>
      <FooterWithSocialLinks/>
    </div>
  );
}

// BackgroundBeamsWithCollision Component
const BackgroundBeamsWithCollision = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [beams] = useState([
    { initialX: 100, duration: 7, className: "h-20" },
    { initialX: 400, duration: 5, className: "h-16" },
    { initialX: 700, duration: 9, className: "h-24" }
  ]);

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-screen w-full relative flex items-center justify-center overflow-hidden",
        
      )}
    >
      {beams.map((beam, i) => (
        <BeamWithCollision 
          key={i} 
          beamOptions={beam} 
          containerRef={containerRef} 
          parentRef={parentRef} 
        />
      ))}
      {children}
    </div>
  );
};

// Beam Component with Collision Detection
const BeamWithCollision = ({
  beamOptions,
  containerRef,
  parentRef
}: {
  beamOptions: any;
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState(false);
  const [collisionPos, setCollisionPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        if (beamRect.bottom >= containerRect.top && !collision) {
          const relativeX = beamRect.left - parentRef.current.getBoundingClientRect().left;
          const relativeY = beamRect.bottom - parentRef.current.getBoundingClientRect().top;
          
          setCollisionPos({ x: relativeX, y: relativeY });
          setCollision(true);
          
          setTimeout(() => {
            setCollision(false);
          }, 1000);
        }
      }
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [collision]);

  return (
    <>
      <motion.div
        ref={beamRef}
        animate={{
          y: [0, 1000],
          x: beamOptions.initialX
        }}
        transition={{
          duration: beamOptions.duration,
          repeat: Infinity,
          ease: "linear"
        }}
        className={cn(
          "absolute top-0 w-px bg-gradient-to-t from-indigo-400 to-transparent",
          beamOptions.className
        )}
      />
      
      <AnimatePresence>
        {collision && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-50 w-4 h-4 rounded-full bg-white pointer-events-none"
            style={{
              left: `${collisionPos.x}px`,
              top: `${collisionPos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Utility function
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}