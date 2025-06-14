'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export function ResizableNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Startups', href: '/startups', icon: BriefcaseIcon },
    { name: 'Investors', href: '/investors', icon: UserGroupIcon },
    { name: 'Stats', href: '/stats', icon: ChartBarIcon },
    { name: 'About', href: '/about', icon: QuestionMarkCircleIcon }
  ]

  return (
    <motion.header 
      className="fixed w-full top-0 left-0 z-50"
      initial={{ y: 0 }}
      animate={{ y: scrolled ? 20 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Bubble background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-pink-100 opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-pink-50 opacity-60 blur-3xl"></div>
      </div>
      
      {/* Navbar */}
      <motion.nav
        className="bg-gradient-to-r from-white to-pink-50 backdrop-blur-sm border-b border-pink-100"
        initial={{ width: '100%', borderRadius: 0 }}
        animate={{ 
          width: scrolled ? '90%' : '100%',
          borderRadius: scrolled ? '12px' : '0px',
          marginTop: scrolled ? '0px' : '20px',
          marginLeft: scrolled ? '5%' : '0%',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-['Poppins']">
                StartupConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-all duration-300 group relative"
                >
                  <item.icon className="h-5 w-5 mr-2 group-hover:text-pink-500 transition-all duration-300" />
                  <span className="font-medium font-['Inter'] text-lg">{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <div className="flex space-x-4 ml-6 items-center">
                <a
                  href="/login"
                  className="px-4 py-2 text-lg font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 hover:scale-[1.02] font-['Inter']"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="relative px-6 py-3 text-lg font-medium text-purple-600 hover:text-purple-700 transition-all duration-300 group"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <svg 
                      className="w-4 h-4 ml-2 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span className="absolute top-0 left-0 w-10 h-10 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full transition-all duration-300 -z-1"></span>
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-pink-600 focus:outline-none transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-all duration-300 hover:pl-6 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-6 w-6 mr-3 text-pink-500" />
                    <span className="font-medium font-['Inter']">{item.name}</span>
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <a
                    href="/login"
                    className="block px-4 py-3 text-center text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 font-['Inter'] text-lg"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="relative block px-4 py-3 text-center text-purple-600 hover:text-purple-700 transition-all duration-300 group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Get Started
                      <svg 
                        className="w-4 h-4 ml-2 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    <span className="absolute top-0 left-1/4 w-10 h-10 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 group-hover:w-3/4 group-hover:h-full transition-all duration-300 -z-1"></span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </motion.header>
  )
}