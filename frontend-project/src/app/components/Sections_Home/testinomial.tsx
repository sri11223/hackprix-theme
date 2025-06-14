"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  src: string;
  type: "founder" | "investor" | "mentor";
};

export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "This platform transformed how we connect with investors. We closed our Series A within 3 months of joining and found the perfect lead investor who truly understood our vision.",
      name: "Alex Chen",
      role: "Co-Founder & CEO",
      company: "Nexus AI",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      type: "founder"
    },
    {
      quote: "I've discovered three game-changing startups through this network that perfectly fit my investment thesis. The quality of ventures here surpasses other platforms we use.",
      name: "Sarah Johnson",
      role: "Venture Partner",
      company: "Horizon Ventures",
      src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      type: "investor"
    },
    {
      quote: "Mentoring startups through this platform has been incredibly rewarding. The matching system pairs me with founders who genuinely benefit from my fintech expertise.",
      name: "David Park",
      role: "Former CTO",
      company: "TechGlobal",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      type: "mentor"
    }
  ];

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<'left'|'right'>('right');

  const handleNext = () => {
    setDirection('right');
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate every 7 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 7000);
    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'founder': return 'bg-purple-100 text-purple-800';
      case 'investor': return 'bg-pink-100 text-pink-800';
      case 'mentor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Trusted
            </span> by Our Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
            Hear from founders, investors, and mentors in our global network
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Image Carousel */}
          <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-xl">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ 
                  opacity: 0, 
                  x: direction === 'right' ? 100 : -100,
                  rotateY: direction === 'right' ? 10 : -10
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  rotateY: 0,
                  transition: { duration: 0.5 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction === 'right' ? -100 : 100,
                  rotateY: direction === 'right' ? -10 : 10,
                  transition: { duration: 0.5 }
                }}
                className="absolute inset-0"
              >
                <img
                  src={testimonials[active].src}
                  alt={testimonials[active].name}
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(testimonials[active].type)}`}>
                    {testimonials[active].type.charAt(0).toUpperCase() + testimonials[active].type.slice(1)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Content */}
          <div className="flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    "{testimonials[active].quote}"
                  </h3>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonials[active].name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {testimonials[active].role}, {testimonials[active].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="flex-1 text-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > active ? 'right' : 'left');
                      setActive(index);
                    }}
                    className={`mx-1 inline-block h-2 w-8 rounded-full transition-all ${index === active ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800"
              >
                <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};