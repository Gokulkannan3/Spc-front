"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Home,
  Info,
  IndianRupee,
  LocateFixed,
  ShieldCheck,
  PhoneCall,
  Sparkles
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const C = {
  ivory: "#fdf8f0",
  cream: "#faf3e4",
  parchment: "#f5e9c9",
  crimson: "#c0392b",
  crimsonD: "#96281b",
  saffron: "#e67e22",
  ink: "#2c2c2e",
  muted: "#7c7c88",
  border: "#e8dcc8",
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)

  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about-us", icon: Info },
    { name: "Prices", path: "/price-list", icon: IndianRupee },
    { name: "Track", path: "/status", icon: LocateFixed },
    { name: "Safety", path: "/safety-tips", icon: ShieldCheck },
    { name: "Contact", path: "/contact-us", icon: PhoneCall },
  ]

  const handleNavigation = (path) => {
    navigate(path, { replace: true })
    window.scrollTo({ top: 0, behavior: "smooth" })
    setActiveTab(path)
  }

  return (
    <>
      {/* Top Navbar - Premium & Clean */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-[#e8dcc8] px-6 py-4 backdrop-blur-xl"
          style={{ background: C.ivory }}
        >
          <div className="flex items-center justify-between">
            {/* Logo with Responsive Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-[#c0392b] to-[#96281b] rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                {/* Desktop: Sri Palaniyappa Crackers */}
                <h1 className="display text-2xl font-bold tracking-tight hidden hundred:block" style={{ color: C.ink }}>
                  Sree Palaniyappa
                </h1>
                <p className="label tracking-[2px] hidden hundred:block" style={{ color: C.crimson }}>CRACKERS</p>

                {/* Mobile: SP Crackers */}
                <h1 className="display text-2xl font-bold tracking-tight hundred:hidden" style={{ color: C.ink }}>
                  SP
                </h1>
                <p className="label tracking-[2px] hidden hundred:hidden mobile:block" style={{ color: C.crimson }}>CRACKERS</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.path
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`relative px-6 py-2.5 font-medium rounded-xl flex items-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? "text-white bg-[#c0392b] shadow-md" 
                        : "text-[#2c2c2e] hover:text-[#c0392b] hover:bg-[#fdf8f0]"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#e67e22] rounded-full"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Order Now Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/price-list")}
              className="btn-primary flex items-center gap-2 text-sm md:text-base px-6 py-2.5 rounded-xl shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="inline sm:hidden">Order</span>
            </motion.button>
          </div>
        </motion.div>
      </nav>

      {/* Modern Bottom Navigation - Mobile Only */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 lg:hidden w-full max-w-md px-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-[#e8dcc8] shadow-2xl rounded-full px-3 py-2 h-18 flex justify-between items-center">

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.path

            return (
              <motion.button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                whileTap={{ scale: 0.85 }}
                className="relative flex-1 flex justify-center items-center"
              >
                {/* Active Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r h-10 from-[#c0392b] to-[#e67e22] rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center">
                  <Icon
                    className={`w-7 h-10 transition-all duration-300 ${
                      isActive
                        ? "text-white scale-110"
                        : "text-[#7c7c88]"
                    }`}
                  />
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Spacer for fixed navbar */}
      <div className="h-24 lg:h-0" />
    </>
  )
}