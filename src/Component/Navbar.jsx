import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Info, IndianRupee, LocateFixed, ShieldCheck,
  PhoneCall, Sparkles, X, Menu, ShoppingCart, MapPin
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const C = {
  ivory:     "#fdf8f0",
  cream:     "#faf3e4",
  parchment: "#f5e9c9",
  crimson:   "#c0392b",
  crimsonD:  "#96281b",
  saffron:   "#e67e22",
  ink:       "#2c2c2e",
  muted:     "#7c7c88",
  border:    "#e8dcc8",
}

const navItems = [
  { name: "Home",    path: "/",            icon: Home },
  { name: "About",   path: "/about-us",    icon: Info },
  { name: "Cart",    path: "/price-list",  icon: ShoppingCart },
  { name: "Track",   path: "/status",      icon: MapPin },
  { name: "Safety",  path: "/safety-tips", icon: ShieldCheck },
  { name: "Contact", path: "/contact-us",  icon: PhoneCall },
]

const ITEM_SIZE = 62
const ITEM_GAP = 10
const FAB_SIZE = 68
const FAB_BOTTOM = 28

function getBottomOffset(reversedIndex) {
  return FAB_BOTTOM + FAB_SIZE + ITEM_GAP + reversedIndex * (ITEM_SIZE + ITEM_GAP)
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Check if current page is price-list
  const isPriceListPage = location.pathname === "/price-list"

  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])

  const handleNavigation = (path) => {
    navigate(path, { replace: true })
    window.scrollTo({ top: 0, behavior: "smooth" })
    setActiveTab(path)
    setMobileOpen(false)
  }

  const reversed = [...navItems].reverse()

  return (
    <>
      {/* ── DESKTOP NAVBAR ────────────────────────────────────────── */}
      {!isPriceListPage && (
        <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl shadow-xl border px-6 py-4 backdrop-blur-xl"
            style={{ background: C.ivory, borderColor: C.border }}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleNavigation("/")}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: `linear-gradient(135deg, ${C.crimson}, ${C.crimsonD})` }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="display text-2xl font-bold tracking-tight hidden hundred:block" style={{ color: C.ink }}>
                    Sree Palaniyappa
                  </h1>
                  <h1 className="display text-2xl font-bold tracking-tight hundred:hidden" style={{ color: C.ink }}>
                    SP
                  </h1>
                  <p className="label tracking-[2px] hidden hundred:hidden mobile:block" style={{ color: C.crimson }}>CRACKERS</p>
                </div>
              </motion.div>

              {/* Desktop links */}
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
                        isActive ? "text-white shadow-md" : "hover:bg-[#fdf8f0]"
                      }`}
                      style={{
                        background: isActive ? C.crimson : "transparent",
                        color: isActive ? "#fff" : C.ink,
                      }}
                    >
                      {item.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                          style={{ background: C.saffron }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Desktop CTA */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/price-list")}
                className="btn-primary hidden lg:flex items-center gap-2 text-sm md:text-base px-6 py-2.5 rounded-xl shadow-md text-white"
                style={{ background: `linear-gradient(135deg, ${C.crimson}, ${C.crimsonD})` }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Order Now</span>
              </motion.button>
            </div>
          </motion.div>
        </nav>
      )}

      {/* ── MOBILE VERTICAL STACK FAB ─────────────────────────────── */}
      <div className={isPriceListPage ? undefined : "lg:hidden"}>
        {/* Scrim */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 48,
                background: "rgba(28,28,30,0.65)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Nav items */}
        <AnimatePresence>
          {mobileOpen && reversed.map((item, ri) => {
            const Icon = item.icon
            const isActive = activeTab === item.path
            const bottomPx = getBottomOffset(ri)

            return (
              <motion.button
                key={item.path}
                initial={{
                  opacity: 0,
                  bottom: FAB_BOTTOM + FAB_SIZE / 2 - ITEM_SIZE / 2,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  bottom: bottomPx,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  bottom: FAB_BOTTOM + FAB_SIZE / 2 - ITEM_SIZE / 2,
                  scale: 0.4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 26,
                  delay: ri * 0.055,
                }}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  position: "fixed",
                  right: FAB_BOTTOM,
                  zIndex: 51,
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  borderRadius: "50%",
                  background: isActive
                    ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonD})`
                    : "#fff",
                  border: isActive
                    ? `3px solid ${C.saffron}`
                    : `2px solid ${C.border}`,
                  boxShadow: isActive
                    ? `0 0 28px rgba(230,126,34,0.55), 0 8px 22px rgba(192,57,43,0.38)`
                    : `0 6px 20px rgba(0,0,0,0.13)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Icon size={22} style={{ color: isActive ? "#fff" : C.crimson }} />
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isActive ? "#fff" : C.muted,
                  lineHeight: 1,
                }}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.span
                    animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      inset: -5,
                      borderRadius: "50%",
                      border: `2px solid ${C.saffron}`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          style={{
            position: "fixed",
            bottom: FAB_BOTTOM,
            right: FAB_BOTTOM,
            zIndex: 60,
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: "50%",
            background: mobileOpen
              ? C.ink
              : `linear-gradient(135deg, ${C.crimson}, ${C.crimsonD})`,
            boxShadow: mobileOpen
              ? "0 0 0 6px rgba(44,44,46,0.25)"
              : `0 0 38px rgba(192,57,43,0.55), 0 12px 30px rgba(192,57,43,0.38)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background 0.28s ease, box-shadow 0.28s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="hamburger"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}
              >
                <span style={{ display: "block", width: 24, height: 2.5, background: "#fff", borderRadius: 2 }} />
                <span style={{ display: "block", width: 17, height: 2.5, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
                <span style={{ display: "block", width: 24, height: 2.5, background: "#fff", borderRadius: 2 }} />
              </motion.div>
            )}
          </AnimatePresence>

          {!mobileOpen && (
            <motion.span
              animate={{ scale: [1, 1.65, 1], opacity: [0.38, 0, 0.38] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -7,
                borderRadius: "50%",
                border: `2px solid ${C.crimson}`,
                pointerEvents: "none",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Spacer */}
      <div className={isPriceListPage ? "h-0" : "h-24 lg:h-0"} />
    </>
  )
}