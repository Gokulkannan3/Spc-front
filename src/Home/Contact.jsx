import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../Component/Navbar"
import { MapPin, Phone, Mail, Globe, Sparkles, Clock, ArrowRight } from "lucide-react"
import { API_BASE_URL } from '../../Config'

const C = {
  ivory: "#fdf8f0",
  cream: "#faf3e4",
  parchment: "#f5e9c9",
  crimson: "#c0392b",
  crimsonD: "#96281b",
  saffron: "#e67e22",
  saffronL: "#f39c12",
  ink: "#2c2c2e",
  slate: "#4a4a52",
  muted: "#7c7c88",
  border: "#e8dcc8",
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&family=Barlow:wght@300;400;500;600&display=swap');
    
    .display { 
      font-family: 'Syne', sans-serif; 
      font-weight: 800; 
      line-height: 1.05; 
      letter-spacing: -0.03em; 
    }
    .serif { 
      font-family: 'Lora', serif; 
    }
    .label { 
      font-family: 'Barlow', sans-serif; 
      font-weight: 600; 
      font-size: 11px; 
      letter-spacing: 0.22em; 
      text-transform: uppercase; 
      color: ${C.crimson}; 
    }
  `}</style>
)

const ModernFireworkAnimation = ({ delay = 0, startPosition, endPosition, burstPosition, colors }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-4 h-8 rounded-full"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.tertiary} 100%)`,
          boxShadow: `0 0 20px ${colors.primary}`,
        }}
        animate={{
          x: [0, endPosition.x - startPosition.x],
          y: [0, endPosition.y - startPosition.y],
          opacity: [1, 1, 0],
          scale: [1, 1.2, 0.8],
        }}
        transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay: 10, ease: "easeOut" }}
      />

      <motion.div
        className="absolute"
        style={{ left: burstPosition.x, top: burstPosition.y, transform: "translate(-50%, -50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 0] }}
        transition={{ duration: 5, delay: delay + 2.2, repeat: Infinity, repeatDelay: 10 }}
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = i * 12.86 * (Math.PI / 180)
          const distance = dimensions.width * 0.25
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: colors.burst[i % colors.burst.length],
                boxShadow: `0 0 15px ${colors.burst[i % colors.burst.length]}`,
              }}
              animate={{
                x: [0, x * 0.3, x * 0.7, x],
                y: [0, y * 0.3, y * 0.7, y],
                opacity: [1, 0.9, 0.5, 0],
                scale: [1, 1.3, 0.8, 0],
              }}
              transition={{ duration: 4.5, delay: delay + 2.2, repeat: Infinity, repeatDelay: 10, ease: "easeOut" }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

const ContactCard = ({ icon: Icon, title, content, delay = 0, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <div 
        className="relative pt-10 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#e8dcc8] overflow-hidden"
        style={{ background: C.ivory }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <h2 className="display text-xl font-bold mb-6 text-center" style={{ color: C.ink }}>
            {title}
          </h2>
          <div className="space-y-3">
            {content.map((item, idx) => (
              <div key={idx}>
                {typeof item === "string" ? (
                  <p className="serif text-[#4a4a52] text-center leading-relaxed">
                    {item}
                  </p>
                ) : (
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    className="block text-[#c0392b] hover:text-[#96281b] text-center transition-colors duration-200 hover:underline font-medium"
                  >
                    {item.text}
                  </motion.a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Contact() {
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Shop Location",
      content: ["Sree Palaniyappa Crackers", "Vaanakkar street,", "Salem, Tamil Nadu"],
      gradient: "bg-gradient-to-br from-[#c0392b] to-[#96281b]",
    },
    {
      icon: Phone,
      title: "Call Information",
      content: [
        { text: "Online Enquiry: +91 81242 59430", href: "tel:+918124259430" },
        // { text: "Whole Sale Enquiry: 9487524689", href: "tel:9487524689" },
        // { text: "Dispatch: 9487594689", href: "tel:9487594689" },
      ],
      gradient: "bg-gradient-to-br from-[#e67e22] to-[#f39c12]",
    },
    {
      icon: Mail,
      title: "Email Address",
      content: [{ text: "sreepalaniyappacrackers@gmail.com", href: "mailto:sreepalaniyappacrackers@gmail.com" }],
      gradient: "bg-gradient-to-br from-[#c0392b] to-[#96281b]",
    },
  ]

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${C.ivory}, #fffaf0, ${C.cream})` }}>
        <Navbar />

        <section className="max-w-7xl mx-auto pt-32 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-[#c0392b] to-[#96281b] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Phone className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="display text-5xl md:text-6xl font-bold mb-6" style={{ color: C.ink }}>
              Contact <span style={{ color: C.crimson }}>Us</span>
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-[#c0392b] to-[#e67e22] rounded-full mx-auto mb-8"
            />

            <p className="serif text-xl text-[#4a4a52] max-w-3xl mx-auto leading-relaxed">
              Ready to light up your celebrations? Get in touch with{" "}
              <span className="font-semibold" style={{ color: C.crimson }}>Sree Palaniyappa Crackers</span> for premium fireworks.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactCards.map((card, index) => (
              <ContactCard
                key={index}
                icon={card.icon}
                title={card.title}
                content={card.content}
                delay={index * 0.2}
                gradient={card.gradient}
              />
            ))}
          </div>

          {/* Wholesale Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="bg-white rounded-3xl shadow-lg p-10 border border-[#e8dcc8]" style={{ background: C.ivory }}>
              <h2 className="display text-3xl font-bold text-center mb-8" style={{ color: C.crimson }}>
                Wholesale Enquiry Form
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target
                  const data = {
                    name: form.name.value,
                    email: form.email.value,
                    mobile: form.mobile.value,
                    message: form.message.value,
                  }
                  fetch(`${API_BASE_URL}/api/send-wholesale-enquiry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  })
                    .then((res) => {
                      if (res.ok) {
                        form.reset()
                        setShowSuccess(true)
                        setTimeout(() => setShowSuccess(false), 4000)
                      } else {
                        alert("Failed to send. Try again.")
                      }
                    })
                    .catch(() => alert("Error sending enquiry."))
                }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" name="name" placeholder="Your Name" required className="w-full border border-[#e8dcc8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#c0392b] bg-[#faf3e4]" />
                  <input type="email" name="email" placeholder="Your Email" required className="w-full border border-[#e8dcc8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#c0392b] bg-[#faf3e4]" />
                </div>
                <input type="tel" name="mobile" placeholder="Mobile Number" required className="w-full border border-[#e8dcc8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#c0392b] bg-[#faf3e4]" />
                <textarea name="message" rows="5" placeholder="Your Message" required className="w-full border border-[#e8dcc8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#c0392b] bg-[#faf3e4]" />
                
                <div className="text-center">
                  <button type="submit" className="btn-primary" style={{ padding: "14px 40px", fontSize: "16px" }}>
                    Submit Enquiry
                  </button>
                </div>
              </form>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
                  onClick={() => setShowSuccess(false)}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white px-12 py-8 rounded-2xl shadow-2xl border-4 border-[#c0392b] text-center max-w-sm"
                  >
                    <h2 className="display text-3xl mb-3" style={{ color: C.crimson }}>🎉 Enquiry Sent!</h2>
                    <p className="serif text-[#4a4a52]">We'll get in touch with you shortly.</p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="relative pt-10 p-8 bg-white rounded-3xl shadow-lg border border-[#e8dcc8]" style={{ background: C.ivory }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c0392b] to-[#96281b] rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <h2 className="display text-2xl font-bold mb-6" style={{ color: C.ink }}>Business Hours</h2>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="label mb-2">Regular Days</h3>
                    <p className="serif">Monday - Saturday</p>
                    <p className="font-semibold" style={{ color: C.crimson }}>9:00 AM - 8:00 PM</p>
                  </div>
                  <div>
                    <h3 className="label mb-2">Festival Season</h3>
                    <p className="serif">Extended Hours</p>
                    <p className="font-semibold" style={{ color: C.crimson }}>8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1c1c1e] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="serif text-[#7c7c88] mb-4">
              As per 2018 Supreme Court order, online sale of firecrackers are not permitted.
            </p>
            <p className="text-sm text-[#7c7c88]">
              Copyright © 2025 <span style={{ color: C.saffron }}>Sree Palaniyappa Crackers</span>. All rights reserved.<span style={{ color: C.saffron }}>SPD Solutions</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}