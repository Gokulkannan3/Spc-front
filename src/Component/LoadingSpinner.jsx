import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

const C = {
  crimson: "#c0392b",
  crimsonD: "#96281b",
  ivory: "#fdf8f0",
  cream: "#faf3e4",
  parchment: "#f5e9c9",
  ink: "#2c2c2e",
  muted: "#7c7c88",
};

const LoadingSpinner = () => {
  const [showSlowNetworkMessage, setShowSlowNetworkMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowNetworkMessage(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100,
      background: C.ivory,
      fontFamily: "'Barlow', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Barlow:wght@400;500;600&display=swap');`}</style>
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          style={{ width: 72, height: 72, margin: "0 auto 1.75rem" }}
        >
          <div style={{
            width: "100%", height: "100%",
            border: `4px solid ${C.parchment}`,
            borderTop: `4px solid ${C.crimson}`,
            borderRadius: "50%",
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "1rem" }}
        >
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "1.5rem", color: C.crimson,
            marginBottom: "0.5rem", letterSpacing: "-0.02em",
          }}>
            Loading Products
          </h2>
          <p style={{ color: C.muted, fontSize: "14px", maxWidth: 280, margin: "0 auto", lineHeight: 1.6 }}>
            {showSlowNetworkMessage
              ? "Your network is slow. Please check your connection and try again."
              : "Fetching the finest fireworks from Sivakasi…"}
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.cream, border: `1.5px solid ${C.parchment}`,
            borderRadius: "100px", padding: "6px 18px",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.crimson }} />
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: "12px", letterSpacing: "0.1em",
            textTransform: "uppercase", color: C.crimson,
          }}>
            SP Crackers
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.crimson }} />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;