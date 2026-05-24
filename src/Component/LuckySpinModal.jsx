import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  crimson: "#c0392b",
  crimsonD: "#96281b",
  saffron: "#e67e22",
  ivory: "#fdf8f0",
  cream: "#faf3e4",
  parchment: "#f5e9c9",
  ink: "#2c2c2e",
  muted: "#7c7c88",
  border: "#e8dcc8",
  green: "#2e7d32",
};

const LuckySpinModal = ({ 
  isOpen, 
  onClose, 
  freeProducts, 
  onAddFreeProduct 
}) => {
  const canvasRef = useRef(null);
  const spinRef = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Limit to maximum 8 segments for better wheel visibility
  const displayProducts = useMemo(() => {
    if (!freeProducts || freeProducts.length === 0) return [];
    return freeProducts.slice(0, 8);
  }, [freeProducts]);

  const drawWheel = useCallback((rot = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || displayProducts.length === 0) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;
    const count = displayProducts.length;
    const arc = (2 * Math.PI) / count;

    ctx.clearRect(0, 0, size, size);

    // Outer shadow ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, 2 * Math.PI);
    ctx.fillStyle = C.parchment;
    ctx.fill();

    for (let i = 0; i < count; i++) {
      const start = rot + i * arc - Math.PI / 2; // Start from top
      const end = start + arc;

      // Segment
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10.5px 'Syne', sans-serif";
      const label = (displayProducts[i]?.productname || `Prize ${i + 1}`)
        .substring(0, 13);
      ctx.fillText(label, r - 14, 5);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = C.crimson;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = C.crimson;
    ctx.font = "bold 9.5px 'Syne', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPIN", cx, cy - 3);
    ctx.fillText("WIN!", cx, cy + 11);
  }, [displayProducts]);

  // Draw initial wheel when modal opens
  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setIsSpinning(false);
      setRotation(0);
      setTimeout(() => drawWheel(0), 80);
    }
  }, [isOpen, drawWheel]);

  const COLORS = [
    C.crimson, 
    C.saffron, 
    "#2e7d32", 
    "#1565c0", 
    C.crimsonD, 
    "#6a1b9a", 
    "#00838f", 
    "#bf360c"
  ];

  const handleSpin = () => {
    if (isSpinning || displayProducts.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const count = displayProducts.length;
    const arc = (2 * Math.PI) / count;
    const winIndex = Math.floor(Math.random() * count);

    // Calculate target angle so the winning segment lands at the top (pointer)
    const targetAngle = -(winIndex * arc + arc / 2) + Math.PI / 2;

    const totalSpin = (6 + Math.random() * 3) * 2 * Math.PI; // 6 to 9 full spins
    const finalRotation = totalSpin + targetAngle;

    const duration = 4200;
    const startTime = performance.now();
    const startRotation = rotation;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const currentRot = startRotation + finalRotation * ease;

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        spinRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setResult(displayProducts[winIndex]);
      }
    };

    spinRef.current = requestAnimationFrame(animate);
  };

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, []);

  const handleClaim = () => {
    if (result) {
      onAddFreeProduct(result);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 65,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(28,28,30,0.75)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.82, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.82, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: C.ivory,
            border: `2px solid ${C.crimson}`,
            borderRadius: "10px",
            boxShadow: `10px 10px 0 ${C.crimsonD}`,
            maxWidth: "27rem",
            width: "100%",
            padding: "2rem",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: C.crimson,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "5px 16px",
                borderRadius: "100px",
                marginBottom: "0.8rem",
              }}
            >
              🎁 LUCKY SPIN
            </span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1.45rem",
                color: C.ink,
                marginBottom: "0.3rem",
                letterSpacing: "-0.02em",
              }}
            >
              Spin &amp; Win a Free Gift!
            </h2>
            <p style={{ color: C.muted, fontSize: "13.5px", lineHeight: 1.4 }}>
              {freeProducts.length > 0
                ? `${freeProducts.length} surprise gifts available`
                : "No free products available at the moment"}
            </p>
          </div>

          {/* Wheel Container */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            {/* Pointer */}
            <div
              style={{
                position: "absolute",
                top: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "13px solid transparent",
                borderRight: "13px solid transparent",
                borderTop: `24px solid ${C.crimson}`,
                zIndex: 3,
                filter: "drop-shadow(0 3px 6px rgba(192,57,43,0.4))",
              }}
            />

            <canvas
              ref={canvasRef}
              width={260}
              height={260}
              style={{
                borderRadius: "50%",
                border: `4px solid ${C.crimson}`,
                boxShadow: `0 0 0 8px ${C.parchment}, 0 0 0 10px ${C.border}`,
              }}
            />
          </div>

          {/* Win Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  background: "rgba(46,125,50,0.08)",
                  border: `1.5px solid rgba(46,125,50,0.4)`,
                  borderRadius: "8px",
                  padding: "14px 18px",
                  marginBottom: "1.25rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: C.green, fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em" }}>
                  🎉 YOU WON!
                </p>
                <p
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "15.5px",
                    color: C.ink,
                    margin: "6px 0",
                  }}
                >
                  {result.productname}
                </p>
                <p style={{ color: C.green, fontWeight: 600, fontSize: "13px" }}>
                  Added as FREE gift • ₹0.00
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px 0",
                background: "transparent",
                color: C.crimson,
                border: `2px solid ${C.crimson}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "13.5px",
              }}
            >
              Skip
            </button>

            {result ? (
              <button
                onClick={handleClaim}
                style={{
                  flex: 2,
                  padding: "11px 0",
                  background: C.green,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "13.5px",
                }}
              >
                Claim & Continue →
              </button>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning || displayProducts.length === 0}
                style={{
                  flex: 2,
                  padding: "11px 0",
                  background: isSpinning ? C.parchment : C.crimson,
                  color: isSpinning ? C.muted : "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isSpinning || displayProducts.length === 0 ? "not-allowed" : "pointer",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                {isSpinning ? "Spinning..." : "🎰 SPIN NOW!"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LuckySpinModal;