"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { ResizableNavbar } from "@/app/components/Header/Navbar";
import {FooterWithSocialLinks} from "@/app/components/Footer/Footer";
import { GlobeComponent } from "@/app/components/Sections_Home/Globe"
import {globeData} from "@/app/components/Sections_Home/globeData";
import StatsSection from "../Sections_Home/stats";
import { TestimonialsSection } from "../Sections_Home/testinomial";
import ProcessSection from "../Sections_Home/process";
import { CTASection } from "../Sections_Home/cta";
import { ShowcaseSection } from "../Sections_Home/showcase";
import GeminiRiskAnalyzer from "../Sections_Home/geminiapirisk";
export const HeroParallax = () => {
  // High-quality startup-themed images
  const startupProducts = [
    {
      title: "Investor Network",
      link: "/investors",
      thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Startup Showcase",
      link: "/startups",
      thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    },
    {
      title: "Recruitment Hub",
      link: "/recruit",
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    },
    {
      title: "Market Stats",
      link: "/stats",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Testimonials",
      link: "/testimonials",
      thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    },
    {
      title: "Funding Portal",
      link: "/funding",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80",
    },
    {
      title: "Mentorship",
      link: "/mentorship",
      thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    },
    {
      title: "Workshops",
      link: "/workshops",
      thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    },
    {
      title: "Pitch Events",
      link: "/events",
      thumbnail: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Our Platform",
      link: "/platform",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  const firstRow = startupProducts.slice(0, 5);
  const secondRow = startupProducts.slice(5, 10);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 500]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 300]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [1, 0.8]),
    springConfig
  );

  return (
    <div className="relative">
      <ResizableNavbar />
      <div
        ref={ref}
        className="h-[180vh] pt-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gray-950"
      >
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
        >
          <motion.div 
            className="flex flex-row-reverse space-x-reverse space-x-20 mb-20"
            style={{ scale }}
          >
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
          </motion.div>
          <motion.div 
            className="flex flex-row mb-20 space-x-20"
            style={{ scale }}
          >
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
      <StatsSection/>
      <ProcessSection />
      <GeminiRiskAnalyzer />
      <ShowcaseSection/>
        <TestimonialsSection />
        
        <CTASection />
       <GlobeComponent 
    data={globeData} 
    // data={getStartupConnections()} // Use this for filtered view
    height={700}
  />
  
        <FooterWithSocialLinks />
    </div>
  );
};

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-4xl md:text-7xl font-bold text-white font-['Poppins']">
        <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Connect</span> with the <br /> Startup Ecosystem
      </h1>
      <p className="max-w-2xl text-lg md:text-xl mt-8 text-gray-300 font-['Inter']">
        Discover innovative startups, meet investors, find talent, and track industry 
        trends - all in one powerful platform designed for startup success.
      </p>
      <div className="flex gap-4 mt-12">
        <a
          href="/register"
          className="px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-['Inter'] hover:from-pink-600 hover:to-purple-700"
        >
          Join Our Network
        </a>
        <a
          href="/explore"
          className="px-6 py-3 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] font-['Inter']"
        >
          Explore Startups
        </a>
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-80 w-[24rem] relative shrink-0 rounded-xl overflow-hidden shadow-lg"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl transition-shadow duration-300"
      >
        <img
          src={product.thumbnail}
          height="800"
          width="800"
          className="object-cover object-center absolute h-full w-full inset-0 group-hover/product:scale-105 transition-transform duration-300"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white text-2xl font-bold font-['Poppins'] transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

export default HeroParallax;