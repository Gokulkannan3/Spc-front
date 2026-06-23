import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaArrowLeft, FaArrowRight, FaInfoCircle, FaExpand, FaCompress, FaDownload } from "react-icons/fa";
import { ShoppingCart, Search, Filter, X, Download, Gift, Tag, Bold } from "lucide-react";
import Navbar from "../Component/Navbar";
import { API_BASE_URL } from "../../Config";
import RocketLoader from "../Component/RocketLoader";
import ToasterNotification from "../Component/ToasterNotification";
import SuccessAnimation from "../Component/SuccessAnimation";
import ModernCarousel from "../Component/ModernCarousel";
import LoadingSpinner from "../Component/LoadingSpinner";
import jsPDF from 'jspdf';
import "../App.css";
import need from '../spc.jpg';

const C = {
  ivory:    "#351418", // Balanced Royal Maroon backdrop (softer and slightly lighter dark tone)
  cream:    "#6e3137", // Lighter warm maroon contrast for sections & cards
  parchment:"#5e2a2f", // Textured accent borders
  crimson:  "#e74c3c", // Vibrant crimson for great contrast readability
  crimsonD: "#c0392b", 
  crimsonL: "#ff6b6b",
  saffron:  "#e67e22",
  saffronL: "#f39c12",
  ember:    "#d35400",
  charcoal: "#200a0d", // Deep base for footer block text alignment
  ink:      "#fdf8f0", // Clean warm ivory text for flawless dark mode legibility
  slate:    "#e8dcc8", // Light muted subheader text
  muted:    "#bca9ab", // Perfectly balanced mid-tone description labels
  border:   "#5e2a2f", // Coordinating system framework lines
  borderD:  "#70353a",
}
const MIN_PURCHASE = 2000;

const GLOBAL_STYLES_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { background: ${C.ivory}; color: ${C.ink}; sans-serif; }
  .display { font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }
  .serif { font-family: 'Lora', serif; }
  .label { sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.crimson}; }
  .pill { display:inline-flex; align-items:center; gap:6px; background:${C.crimson}; color:#fff;font-weight:600; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:4px 12px; border-radius:100px; }
  .pill-saffron { background:${C.saffron}; color:#fff; }
  .pill-green { background:${C.green}; color:#fff; }
  .pill-brand { background:${C.brand}; color:#fff; }
  .btn-primary { display:inline-flex; align-items:center; gap:10px; background:${C.crimson}; color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; padding:14px 32px; border-radius:4px; border:none; cursor:pointer; transition:all 0.25s ease; }
  .btn-primary:hover { background:${C.crimsonD}; transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${C.crimsonD}44; }
  .btn-outline { display:inline-flex; align-items:center; gap:10px; background:transparent; color:${C.crimson}; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.04em; padding:12px 28px; border-radius:4px; border:2px solid ${C.crimson}; cursor:pointer; transition:all 0.25s ease; }
  .btn-outline:hover { background:${C.crimson}; color:#fff; transform:translate(-2px,-2px); }
  .type-chip { padding:10px 22px; border-radius:50px; font-family:'Syne',sans-serif; font-weight:600; font-size:13.5px; white-space:nowrap; cursor:pointer; transition:all 0.25s ease; border:1.5px solid ${C.border}; background:#fff; color:${C.ink}; }
  .type-chip.active { background:${C.crimson}; color:#fff; border-color:${C.crimson}; box-shadow:4px 4px 0 ${C.crimsonD}33; }
  .brand-chip { padding:8px 18px; border-radius:50px; font-family:'Syne',sans-serif; font-weight:600; font-size:12.5px; white-space:nowrap; cursor:pointer; transition:all 0.25s ease; border:1.5px solid ${C.border}; background:#fff; color:${C.ink}; }
  .brand-chip.active { background:${C.brand}; color:#fff; border-color:${C.brand}; box-shadow:4px 4px 0 rgba(21,101,192,0.25); }
  .hscroll::-webkit-scrollbar { height:6px; }
  .hscroll::-webkit-scrollbar-thumb { background:${C.crimson}; border-radius:3px; }
  @keyframes marquee { 0% { transform:translateX(100%); } 100% { transform:translateX(-100%); } }
  .animate-marquee { display:inline-block; animation:marquee 18s linear infinite; white-space:nowrap; }
  .search-input-group { position:relative; }
  .search-input-group input { width:100%; padding:11px 14px 11px 40px; border:1.5px solid ${C.border}; border-radius:4px; background:#fff; font-size:14px; color:${C.ink}; outline:none; transition:border-color 0.2s; }
  .search-input-group input:focus { border-color:${C.crimson}; }
  .search-input-group .icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); pointer-events:none; }
  .product-card-selected { background: ${C.selectedBg} !important; border-color: ${C.selectedBorder} !important; }
  @keyframes pipelineShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .pipeline-fill {
    background: linear-gradient(90deg, ${C.crimson} 0%, ${C.saffron} 50%, ${C.crimson} 100%);
    background-size: 200% auto;
    animation: pipelineShimmer 2s linear infinite;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pipeline-fill-complete {
    background: linear-gradient(90deg, ${C.green} 0%, #43a047 50%, ${C.green} 100%);
    background-size: 200% auto;
    animation: pipelineShimmer 2s linear infinite;
  }
  @media (max-width: 640px) {
    .mobile\\:text-sm { font-size: 0.875rem !important; }
    .mobile\\:text-xs { font-size: 0.75rem !important; }
    .mobile\\:p-3 { padding: 0.75rem !important; }
    .mobile\\:gap-2 { gap: 0.5rem !important; }
    .mobile\\:w-full { width: 100% !important; }
    .mobile\\:flex-col { flex-direction: column !important; }
    .mobile\\:hidden { display: none !important; }
    .mobile\\:rounded-t-xl { border-radius: 1rem 1rem 0 0 !important; }
    .mobile\\:max-h-screen { max-height: 100vh !important; }
    .mobile\\:bottom-0 { bottom: 0 !important; }
    .mobile\\:px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
    .mobile\\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("pricelist-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "pricelist-styles";
  styleEl.textContent = GLOBAL_STYLES_CSS;
  document.head.appendChild(styleEl);
}

const roundPrice = (v) => Math.round(parseFloat(v) || 0);
const formatPercentage = (v) => Math.round(Number.parseFloat(v)).toString();
const formatPrice = (price) => String(roundPrice(price));
const capitalize = str =>
  str ? str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
const serialSort = (a, b) =>
  new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare(
    a.serial_number, b.serial_number
  );

const ORDERED_TYPES = [
  "One sound crackers","Ground Chakkar","Flower Pots","Twinkling Star","Rockets","Bombs",
  "Repeating Shots","Comets Sky Shots","Fancy pencil varieties","Fountain and Fancy Novelties",
  "Matches","Guns and Caps","Sparklers","Premium Sparklers","Gift Boxes","Kids Special ",
];

const MinPurchasePipeline = memo(({ subtotalRaw, onCartOpen, isUnlocked }) => {
  const progress = Math.min((subtotalRaw / MIN_PURCHASE) * 100, 100);
  const remaining = Math.max(0, MIN_PURCHASE - subtotalRaw);

  return (
    <motion.div
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 55,
        background:'white',
        color: "#000",
        padding: "0.45rem 1.25rem 0.55rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.22)",
        cursor: isUnlocked ? "pointer" : "default",
        transition: "background 0.5s ease",
      }}
      onClick={isUnlocked ? onCartOpen : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem", gap: 12}}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isUnlocked ? (
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", letterSpacing: "0.03em" }}>
              🎉 Cart!
            </span>
          ) : (
            <span style={{ fontWeight: 1000, fontSize: "18px" }}>
              Add ₹{formatPrice(remaining)} more to open cart
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontWeight: 1000, fontSize: "20px" }}>
            ₹{formatPrice(subtotalRaw)}
            <span style={{ fontSize: "10px", fontWeight: 400, opacity: 0.7 }}> / ₹{MIN_PURCHASE}</span>
          </span>
          {isUnlocked && (
            <span style={{
              background: "rgba(255,255,255,0.2)", borderRadius: "4px",
              padding: "2px 10px", fontSize: "12px",
              fontWeight: 400,
            }}>View Cart →</span>
          )}
        </div>
      </div>
      <div style={{
        height: 6,
        background: "rgba(255,255,255,0.18)",
        borderRadius: 100,
        overflow: "hidden",
        position: "relative",
      }}>
        <div
          className={isUnlocked ? "pipeline-fill pipeline-fill-complete" : "pipeline-fill"}
          style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: 100,
          }}
        />
        {!isUnlocked && (
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: `${100 - progress}%`,
            background: "rgba(255,255,255,0.08)",
            borderRadius: "0 100px 100px 0",
          }} />
        )}
      </div>
    </motion.div>
  );
});
MinPurchasePipeline.displayName = "MinPurchasePipeline";
const ProductCard = memo(({ product, count, onAdd, onRemove, onShowDetails, onImageClick }) => {
  const originalPrice = roundPrice(product.price);
  const discount = originalPrice * (product.discount / 100);
  const finalPrice = product.discount > 0
    ? formatPrice(originalPrice - discount)
    : formatPrice(originalPrice);

  const imageSrc = useMemo(() =>
    Array.isArray(product.images)
      ? product.images.find(img => !img.includes("/video/") && !img.toLowerCase().endsWith(".gif")) || need
      : need,
    [product.images]
  );

  const isSelected = count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isSelected ? "product-card-selected" : ""}
      style={{
        background:  C.cream,
        border: `1px solid ${isSelected ? C.selectedBorder : C.border}`,
        borderRadius: "15px",
        overflow: "hidden",
        transition: "all 0.28s ease",
        boxShadow: isSelected ? `3px 3px 0 ${C.selectedBorder}` : "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.crimson;
        e.currentTarget.style.transform = "translate(-4px,-4px)";
        e.currentTarget.style.boxShadow = `6px 6px 0 ${C.crimson}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isSelected ? C.selectedBorder : C.border;
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isSelected ? `3px 3px 0 ${C.selectedBorder}` : "";
      }}
    >
      <div style={{ position: "relative" }}>
        <ModernCarousel media={product.images} onImageClick={() => onImageClick(product.images)} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {product.discount > 0 && <span className="pill">{formatPercentage(product.discount)}% OFF</span>}
          {isSelected && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pill pill-green"
              style={{ fontSize: "9px", padding: "3px 8px" }}
            >
              ✓ In Cart
            </motion.span>
          )}
        </div>
        <button
          onClick={() => onShowDetails(product)}
          className="flex justify-center"
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, background: "#fff",
            border: `1px solid ${C.border}`, borderRadius: "24px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContext: "center",
          }}
        >
          <FaInfoCircle style={{ color: C.crimson, fontSize: 24 }} />
        </button>
      </div>
      <div className="p-5" style={{ background: C.cream, transition: "background 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <p style={{color:C.crimson, fontSize: "13px", letterSpacing: "0.1em", fontWeight: "bold" }}>
            {product.serial_number}
          </p>
          {product.brand && (
            <span style={{
              fontSize: "9px", color: C.brand, fontWeight: 400,
              background: `rgba(21,101,192,0.08)`, padding: "1px 5px", borderRadius: "100px",
            }}>{product.brand}</span>
          )}
        </div>
        
        <h3 style={{
          fontWeight: 800, fontSize: "clamp(13px, 3.5vw, 16px)", color: C.ink, // Fixed contrast visibility rule
          marginBottom: "0.4rem", display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.25,
        }} className="font-bold">{product.productname}</h3>
        
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 6px", marginBottom: "0.75rem" }}>
          {product.discount > 0 && (
            <span style={{ color:C.crimson, fontSize: "15px", textDecoration: "line-through", fontWeight: 700 }}>
              ₹{formatPrice(originalPrice)}
            </span>
          )}
          <span style={{ fontWeight: 1000, fontSize: "1.1rem", color: C.ink }}>₹{finalPrice}</span>
          <span style={{ fontSize: "10px", color: C.muted }}>/{product.per}</span>
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", width: "100%" }}>
          <AnimatePresence mode="wait" style={{display: "flex", justifyContent: "end", width: "100%"}}>
            {count > 0 ? (
              <motion.div key="qty" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: C.crimson, borderRadius: "4px", padding: 4, width: "100%"
                }} className="flex justify-end">
                <button onClick={() => onRemove(product)} style={{
                  width: 24, height: 24, background: "rgba(255,255,255,0.2)",
                  border: "none", borderRadius: "2px", color: "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FaMinus style={{ fontSize: 8 }} />
                </button>
                <span style={{
                  color: "#fff", fontWeight: 600,
                  fontSize: "13px", minWidth: "1.5rem", textAlign: "center",
                }}>{count}</span>
                <button onClick={() => onAdd(product)} style={{
                  width: 24, height: 24, background: "rgba(255,255,255,0.2)",
                  border: "none", borderRadius: "2px", color: "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FaPlus style={{ fontSize: 8 }} />
                </button>
              </motion.div>
            ) : (
              <motion.button key="add" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                onClick={() => onAdd(product)} className="btn-outline"
                style={{ color:"white", justifyContent: "center", padding: "6px", fontSize: "14px", width: '100%', fontWeight: "bolder" }}>
                <FaPlus style={{ fontSize: 9, marginRight: 2 }} /> Add to cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

const SPIN_COLORS = [
  C.crimson, C.saffron, "#2e7d32", "#1565c0",
  C.crimsonD, "#6a1b9a", "#00838f", "#bf360c",
];

// ─── Cracker Burst Animation Helper ──────────────────────────────────────────
function launchCrackerBurst(originEl) {
  if (!originEl) return;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const CRACKER_COLORS = [
    "#ff2a2a", "#ff9f43", "#f1c40f", "#2ecc71", 
    "#3498db", "#9b59b6", "#ff007f", "#00ffff"
  ];

  function spawnBurstShell(particleCount, baseSpeed, sparkRadius, delay) {
    setTimeout(() => {
      for (let i = 0; i < particleCount; i++) {
        const el = document.createElement("div");
        const color = CRACKER_COLORS[Math.floor(Math.random() * CRACKER_COLORS.length)];
        const size = 5 + Math.random() * 6;
        
        // Circular explosion physics vectors
        const angle = Math.random() * 2 * Math.PI;
        const speed = (0.4 + Math.random() * 0.6) * baseSpeed;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed - (Math.random() * 40); // slight upward rocket bias
        
        const rotation = Math.random() * 360;
        const duration = 0.6 + Math.random() * 0.5;

        el.style.cssText = `
          position: fixed;
          left: ${cx}px;
          top: ${cy}px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          box-shadow: 0 0 8px ${color}, 0 0 14px #fff;
          opacity: 1;
          transition:
            left ${duration}s cubic-bezier(0.1, 0.8, 0.25, 1),
            top ${duration}s cubic-bezier(0.1, 0.8, 0.25, 1),
            transform ${duration}s ease-out,
            opacity ${duration}s cubic-bezier(0.8, 0, 1, 1);
        `;
        document.body.appendChild(el);

        // Execute render cycle pipeline animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.left = `${cx + dx}px`;
            el.style.top = `${cy + dy}px`;
            el.style.transform = `rotate(${rotation}deg) scale(0.1)`;
            el.style.opacity = "0";
            setTimeout(() => el.remove(), duration * 1000);
          });
        });
      }
    }, delay);
  }

  // 💥 Multi-shell aerial repeater sequence simulation
  spawnBurstShell(60, 240, 150, 0);   // Primary Central Core Break
  spawnBurstShell(40, 340, 220, 150); // Secondary Wide Ring Outbreak
  spawnBurstShell(35, 160, 100, 350); // Tertiary Crackling Willow Finish
}

// ─── Dynamic Font Allocation Utility ─────────────────────────────────────────
function getDynamicWheelFontSize(labelLength, segmentCount) {
  // Scales beautifully according to wedge density constraints
  let baseSize = segmentCount > 6 ? 13 : 15;
  if (labelLength > 15) baseSize -= 2;
  if (labelLength > 22) baseSize -= 1.5;
  return Math.max(9.5, baseSize);
}

// ─── Main Lucky Spin Component ────────────────────────────────────────────────
const LuckySpinModal = memo(({ isOpen, onClose, freeProducts, onAddFreeProduct, onSkip, alreadyHasFree }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const animFrameRef = useRef(null);

  const segments = useMemo(() => {
    if (!freeProducts || freeProducts.length === 0) return [];
    return freeProducts.slice(0, 8); // Handles custom configurations up to 8 items smoothly
  }, [freeProducts]);

  const drawWheel = useCallback((rot = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || segments.length === 0) return;
    const ctx = canvas.getContext("2d");
    
    // Support modern High-DPI Retina Displays safely
    const size = canvas.width;
    const cx = size / 2, cy = size / 2, r = size / 2 - 8;
    const count = segments.length;
    const arc = (2 * Math.PI) / count;
    
    ctx.clearRect(0, 0, size, size);
    
    // Outer Border Lip Rings
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, 2 * Math.PI);
    ctx.fillStyle = C.parchment;
    ctx.fill();

    for (let i = 0; i < count; i++) {
      const start = rot + i * arc - Math.PI / 2;
      const end = start + arc;
      
      // Draw Wedge Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = SPIN_COLORS[i % SPIN_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Render Enhanced Scalable Typography Text Labels
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      
      const rawLabel = segments[i]?.productname || `Gift ${i + 1}`;
      const cleanLabel = rawLabel.substring(0, 28); // Cap cleanly to prevent layout overflows
      
      const fontSize = getDynamicWheelFontSize(cleanLabel.length, count);
      ctx.font = `bold ${fontSize}px`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 4;

      const words = cleanLabel.split(" ");
      // Check if text needs line-wrapping for maximum legibility
      if (words.length >= 2 && cleanLabel.length > 11) {
        const mid = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, mid).join(" ");
        const secondLine = words.slice(mid).join(" ");
        const lineSpacing = fontSize + 3;
        
        ctx.fillText(firstLine, r - 16, -lineSpacing / 2 + 3);
        ctx.fillText(secondLine, r - 16, lineSpacing / 2 + 3);
      } else {
        ctx.fillText(cleanLabel, r - 16, fontSize / 3);
      }
      ctx.restore();
    }

    // Centered Wheel Hub Cap Pin Button
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = C.crimson;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.fillStyle = C.crimson;
    ctx.font = "bold 10px 'Syne', sans-serif";
    ctx.shadowBlur = 0; // reset shadow filter rules context
    ctx.textAlign = "center";
    ctx.fillText("SPIN", cx, cy - 2);
    ctx.fillText("WIN!", cx, cy + 11);
  }, [segments]);

  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setIsSpinning(false);
      setCurrentRotation(0);
      setTimeout(() => drawWheel(0), 100);
    }
  }, [isOpen, drawWheel]);

  const handleSpin = () => {
    if (isSpinning || segments.length === 0) return;
    setIsSpinning(true);
    setResult(null);
    
    const count = segments.length;
    const arc = (2 * Math.PI) / count;
    const winIndex = Math.floor(Math.random() * count);
    
    const targetAngle = -(winIndex * arc) - (arc / 2) + (Math.PI * 2 * 6); // 6 full clean rotations
    const totalSpin = targetAngle + (Math.random() * 0.25 - 0.125); // randomized landing offsets
    const duration = 4400;
    const startTime = performance.now();
    const startRot = currentRotation;
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease-out velocity profile
      const rot = startRot + totalSpin * ease;
      
      setCurrentRotation(rot);
      drawWheel(rot);
      
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setResult(segments[winIndex]);
        // 🎇 Trigger the customized high-fidelity firecracker burst explosion!
        launchCrackerBurst(canvasRef.current);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleClaim = () => { if (result) onAddFreeProduct(result); };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 65,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          background: "rgba(28,28,30,0.7)", backdropFilter: "blur(8px)",
        }}
        onClick={onSkip}
      >
        <motion.div
          initial={{ scale: 0.8, y: 40, rotateX: 15 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: C.ivory, border: `2px solid ${C.crimson}`,
            borderRadius: "10px", boxShadow: `10px 10px 0 ${C.crimsonD}`,
            maxWidth: "24rem", width: "100%", padding: "1.75rem",
            fontFamily: "'Barlow', sans-serif", overflow: "hidden",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <span style={{
              display: "inline-block", background: C.crimson, color: "#fff",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "10px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "4px 14px", borderRadius: "100px", marginBottom: "0.6rem",
            }}>🎁 Lucky Draw</span>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem",
              color: C.ink, marginBottom: "0.25rem", letterSpacing: "-0.02em",
            }}>Spin &amp; Win a Free Gift!</h2>
            <p style={{ color: C.muted, fontSize: "12px", fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              {alreadyHasFree
                ? "You already claimed your free gift!"
                : segments.length > 0
                  ? `${segments.length} surprise gifts available — spin the wheel!`
                  : "No free products available right now."}
            </p>
            {alreadyHasFree && (
              <div style={{
                marginTop: 10, padding: "8px 12px",
                background: "rgba(46,125,50,0.08)", border: "1.5px solid rgba(46,125,50,0.3)",
                borderRadius: "6px", color: C.green,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "12px",
              }}>Only 1 free product per order is allowed</div>
            )}
          </div>
          
          {!alreadyHasFree && (
            <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
              <div style={{
                position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
                borderTop: `22px solid ${C.crimson}`,
                zIndex: 2, filter: `drop-shadow(0 2px 4px ${C.crimsonD}66)`,
              }} />
              {/* Increased size dimensions to 260px to provide larger structural landscape layout */}
              <canvas ref={canvasRef} width={260} height={260} style={{
                borderRadius: "50%", border: `3px solid ${C.crimson}`,
                boxShadow: `0 0 0 5px ${C.parchment}, 0 0 0 7px ${C.border}`,
                display: "block",
                width: "240px", height: "240px"
              }} />
            </div>
          )}
          
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  background: "rgba(46,125,50,0.07)",
                  border: `1.5px solid rgba(46,125,50,0.35)`,
                  borderRadius: "6px", padding: "12px 16px",
                  marginBottom: "1rem", textAlign: "center",
                }}
              >
                <p style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.green,
                  fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4,
                }}>🎉 You Won!</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.ink, fontSize: "14px", lineHeight: 1.3 }}>
                  {result.productname}
                </p>
                <p style={{ fontSize: "12px", color: C.green, fontWeight: 400, marginTop: 4 }}>
                  Added FREE to your cart · ₹0
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onSkip} style={{
              flex: 1, padding: "10px 0", background: "transparent", color: C.crimson,
              border: `2px solid ${C.crimson}`, borderRadius: "4px", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px",
            }}>Skip</button>
            {alreadyHasFree ? (
              <button onClick={onSkip} style={{
                flex: 2, padding: "10px 0", background: C.green, color: "#fff",
                border: "none", borderRadius: "4px", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px",
              }}>Continue →</button>
            ) : result ? (
              <button onClick={handleClaim} style={{
                flex: 2, padding: "10px 0", background: C.green, color: "#fff",
                border: "none", borderRadius: "4px", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px",
              }}>Claim &amp; Checkout →</button>
            ) : (
              <button onClick={handleSpin} disabled={isSpinning || segments.length === 0} style={{
                flex: 2, padding: "10px 0",
                background: isSpinning || segments.length === 0 ? C.parchment : C.crimson,
                color: isSpinning || segments.length === 0 ? C.muted : "#fff",
                border: "none", borderRadius: "4px",
                cursor: isSpinning || segments.length === 0 ? "not-allowed" : "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px",
                letterSpacing: "0.04em", transition: "all 0.2s",
              }}>{isSpinning ? "Spinning…" : "🎰 Spin!"}</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
LuckySpinModal.displayName = "LuckySpinModal";

const Pricelist = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [freeCartItem, setFreeCartItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isExpandedCart, setIsExpandedCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);
  const [minOrderMessage, setMinOrderMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    customer_name: "", address: "", district: "", state: "",
    mobile_number: "", email: "", customer_type: "User",
  });
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandSearchInput, setBrandSearchInput] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [promocode, setPromocode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [promocodes, setPromocodes] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const searchDebounce = useRef(null);
  const brandDebounce = useRef(null);
  const promoDebounce = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiBudget, setAiBudget] = useState("");
  const [aiPreferences, setAiPreferences] = useState({
    kids: false, sound: false, night: false, kidsnight: false,
  });
  const [suggestedCart, setSuggestedCart] = useState({});
  const typeScrollRef = useRef(null);

  const handleSearchInputChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => setSearchTerm(val), 220);
  }, []);

  const handleBrandSearchInputChange = useCallback((e) => {
    const val = e.target.value;
    setBrandSearchInput(val);
    setSelectedBrand("All");
    clearTimeout(brandDebounce.current);
    brandDebounce.current = setTimeout(() => setBrandSearchTerm(val), 220);
  }, []);

  const clearSearch = useCallback(() => { setSearchInput(""); setSearchTerm(""); }, []);
  const clearBrandSearch = useCallback(() => { setBrandSearchInput(""); setBrandSearchTerm(""); }, []);

  const showError = useCallback((message) => {
    setMinOrderMessage(message);
    setShowMinOrderModal(true);
    setTimeout(() => setShowMinOrderModal(false), 5000);
  }, []);

  const freeProductsList = useMemo(
    () => products.filter(p =>
      (typeof p.status === "string" && p.status.toLowerCase() === "free") ||
      p.free === true || p.is_free === true
    ),
    [products]
  );

  const brandList = useMemo(() => {
    const brands = new Set();
    products.forEach(p => { if (p.brand && p.brand.trim()) brands.add(p.brand.trim()); });
    return ["All", ...Array.from(brands).sort()];
  }, [products]);

  const downloadPDF = useCallback(async () => {
    if (!products.length) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yOffset = 20;
    doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.setTextColor(192, 57, 43);
    doc.text('SREE PALANIYAPPA CRACKERS', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;
    doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
    doc.text('Website - www.palaniyappacrackers.com', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 8;
    doc.text('Retail Pricelist - 2026', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 8;
    doc.text('Contact Number - +91 81242 5943', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 20;

    const fetchImageAsBase64 = (url) => new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image(); img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX = 80; let w = img.naturalWidth, h = img.naturalHeight;
          if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
          else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null); img.src = url;
    });

    const imageCache = {};
    const allProducts = ORDERED_TYPES.flatMap(type => {
      const typeKey = type.replace(/ /g, "_").toLowerCase();
      return products.filter(p => p.product_type.toLowerCase() === typeKey);
    });
    await Promise.all(allProducts.map(async (product) => {
      const images = Array.isArray(product.images) ? product.images : [];
      const imgUrl = images.find(img => img && !img.includes('/video/') && !img.toLowerCase().endsWith('.gif'));
      if (imgUrl) imageCache[product.serial_number] = await fetchImageAsBase64(imgUrl);
    }));

    const ROW_HEIGHT = 18; const IMG_SIZE = 14;
    for (const type of ORDERED_TYPES) {
      const typeKey = type.replace(/ /g, "_").toLowerCase();
      const typeProducts = products.filter(p => p.product_type.toLowerCase() === typeKey).sort(serialSort);
      if (!typeProducts.length) continue;
      const sectionHeaderHeight = 10;
      if (yOffset + sectionHeaderHeight > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yOffset = 20; }
      doc.setFillColor(220, 220, 220); doc.rect(10, yOffset, pageWidth - 20, sectionHeaderHeight, 'F');
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(40, 40, 40);
      doc.text(capitalize(type), 14, yOffset + 7); yOffset += sectionHeaderHeight + 1;
      const colHeaderHeight = 8;
      doc.setFillColor(192, 57, 43); doc.rect(10, yOffset, pageWidth - 20, colHeaderHeight, 'F');
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
      const cols = { sl: 12, code: 23, img: 39, name: 61, rate: 131, disc: 152, per: 176 };
      doc.text('Sl', cols.sl, yOffset + 5.5); doc.text('Code', cols.code, yOffset + 5.5);
      doc.text('Image', cols.img, yOffset + 5.5); doc.text('Product Name', cols.name, yOffset + 5.5);
      doc.text('Rate', cols.rate, yOffset + 5.5); doc.text('Disc. Rate', cols.disc, yOffset + 5.5);
      doc.text('Per', cols.per, yOffset + 5.5); yOffset += colHeaderHeight + 1;
      let slNo = 1;
      for (const product of typeProducts) {
        if (yOffset + ROW_HEIGHT > doc.internal.pageSize.getHeight() - 15) { doc.addPage(); yOffset = 20; }
        const discount = roundPrice(product.price) * (product.discount / 100);
        const discountedRate = roundPrice(product.price) - discount;
        if (slNo % 2 === 0) { doc.setFillColor(255, 247, 237); doc.rect(10, yOffset, pageWidth - 20, ROW_HEIGHT, 'F'); }
        doc.setDrawColor(220, 220, 220); doc.rect(10, yOffset, pageWidth - 20, ROW_HEIGHT);
        [21, 37, 59, 129, 150, 173].forEach(x => doc.line(x, yOffset, x, yOffset + ROW_HEIGHT));
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50);
        const textY = yOffset + ROW_HEIGHT / 2 + 1.5;
        doc.text(String(slNo++), cols.sl, textY);
        doc.text(product.serial_number || '', cols.code, textY);
        const nameLines = doc.splitTextToSize(product.productname, 66);
        const nameY = nameLines.length > 1 ? yOffset + 5 : textY;
        doc.text(nameLines.slice(0, 2), cols.name, nameY);
        doc.setTextColor(192, 57, 43);
        doc.text(`Rs.${formatPrice(product.price)}`, cols.rate, textY);
        doc.setTextColor(46, 125, 50);
        doc.text(`Rs.${formatPrice(discountedRate)}`, cols.disc, textY);
        doc.setTextColor(50, 50, 50);
        doc.text(product.per || '', cols.per, textY);
        const imgData = imageCache[product.serial_number];
        if (imgData) {
          try { doc.addImage(imgData, 'JPEG', cols.img - 1, yOffset + (ROW_HEIGHT - IMG_SIZE) / 2, IMG_SIZE, IMG_SIZE); } catch {}
        } else {
          doc.setFillColor(245, 245, 245);
          doc.rect(cols.img - 1, yOffset + (ROW_HEIGHT - IMG_SIZE) / 2, IMG_SIZE, IMG_SIZE, 'F');
          doc.setFontSize(6); doc.setTextColor(180, 180, 180);
          doc.text('No img', cols.img + 2, yOffset + ROW_HEIGHT / 2 + 1);
        }
        yOffset += ROW_HEIGHT;
      }
      yOffset += 6;
    }
    doc.save('SPC_Pricelist_2025.pdf');
  }, [products]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const savedCart = localStorage.getItem("firecracker-cart");
        if (savedCart) setCart(JSON.parse(savedCart));
        const savedFree = localStorage.getItem("firecracker-free-cart");
        if (savedFree) {
          const parsed = JSON.parse(savedFree);
          setFreeCartItem(Array.isArray(parsed) ? (parsed[0] || null) : parsed);
        }
        const [statesRes, productsRes, promocodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/locations/states`),
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/promocodes`),
        ]);
        const [statesData, productsData, promocodesData] = await Promise.all([
          statesRes.json(), productsRes.json(), promocodesRes.json(),
        ]);
        setStates(Array.isArray(statesData) ? statesData : []);
        const naturalSort = (a, b) =>
          new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare(a.productname, b.productname);
        const seenSerials = new Set();
        const normalizedProducts = productsData.data
          .filter(p => !seenSerials.has(p.serial_number) && seenSerials.add(p.serial_number))
          .map(product => ({
            ...product,
            images: product.image
              ? (typeof product.image === "string" ? JSON.parse(product.image) : product.image)
              : [],
          }))
          .sort(naturalSort);
        setProducts(normalizedProducts);
        setPromocodes(Array.isArray(promocodesData) ? promocodesData : []);
      } catch (err) { console.error(err); }
      finally { setTimeout(() => setIsLoading(false), 1500); }
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (customerDetails.state) {
      fetch(`${API_BASE_URL}/api/locations/states/${customerDetails.state}/districts`)
        .then(res => res.json()).then(data => setDistricts(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [customerDetails.state]);

  useEffect(() => { localStorage.setItem("firecracker-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("firecracker-free-cart", JSON.stringify(freeCartItem)); }, [freeCartItem]);

  const handleApplyPromo = useCallback((code) => {
    if (!code) { setAppliedPromo(null); return; }
    const found = promocodes.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (!found) { showError("Invalid promocode."); return; }
    if (found.end_date && new Date(found.end_date) < new Date()) {
      showError("This promocode has expired."); return;
    }
    setAppliedPromo(found);
  }, [promocodes, showError]);

  useEffect(() => {
    clearTimeout(promoDebounce.current);
    promoDebounce.current = setTimeout(() => {
      if (promocode && promocode !== "custom") handleApplyPromo(promocode);
      else setAppliedPromo(null);
    }, 500);
    return () => clearTimeout(promoDebounce.current);
  }, [promocode, handleApplyPromo]);

  const addToCart = useCallback((product) => {
    if (!product?.serial_number) return;
    if (typeof product.status === "string" && product.status.toLowerCase() === "free") return;
    setCart(prev => ({ ...prev, [product.serial_number]: (prev[product.serial_number] || 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((product) => {
    if (!product?.serial_number) return;
    setCart(prev => {
      const count = (prev[product.serial_number] || 1) - 1;
      const updated = { ...prev };
      if (count <= 0) delete updated[product.serial_number];
      else updated[product.serial_number] = count;
      return updated;
    });
  }, []);

  const updateCartQuantity = useCallback((product, quantity) => {
    if (!product?.serial_number) return;
    if (quantity < 0) quantity = 0;
    setCart(prev => {
      const updated = { ...prev };
      if (quantity === 0) delete updated[product.serial_number];
      else updated[product.serial_number] = quantity;
      return updated;
    });
  }, []);

  const removeFreeItem = useCallback(() => setFreeCartItem(null), []);

  const addToSuggestedCart = useCallback((product) => {
    if (!product?.serial_number) return;
    setSuggestedCart(prev => ({ ...prev, [product.serial_number]: (prev[product.serial_number] || 0) + 1 }));
  }, []);

  const removeFromSuggestedCart = useCallback((product) => {
    if (!product?.serial_number) return;
    setSuggestedCart(prev => {
      const count = (prev[product.serial_number] || 1) - 1;
      const updated = { ...prev };
      if (count <= 0) delete updated[product.serial_number];
      else updated[product.serial_number] = count;
      return updated;
    });
  }, []);

  const generateSuggestions = useCallback(() => {
    const budget = Number(aiBudget);
    if (!budget || budget <= 0) { showError("Please enter a valid budget"); return; }
    const categories = {
      kids: ["new_arrivals","fancy_pencil_varieties","twinkling_star","guns_and_caps","matches"],
      sound: ["bombs","one_sound_crackers"],
      night: ["repeating_shots","comets_sky_shots","new_arrivals","rockets"],
      kidsnight: ["fountain_and_fancy_novelties","flower_pots","ground_chakkar","sparklers","premium_sparklers"],
    };
    const selectedPrefs = ["night","kids","sound","kidsnight"].filter(p => aiPreferences[p]);
    if (!selectedPrefs.length) { showError("Select at least one preference"); return; }
    const budgetPerPref = budget / selectedPrefs.length;
    const tempCart = {};
    const sparklerSizeCount = {};
    const getSparklerSize = name => { const m = name?.match(/(\d+)\s*cm/i); return m ? m[1] : null; };
    for (const pref of selectedPrefs) {
      const phase1Budget = budgetPerPref * 0.70;
      const types = categories[pref];
      const byType = {};
      for (const type of types) byType[type] = [];
      products.filter(p =>
        types.includes(p.product_type?.toLowerCase()) &&
        !(typeof p.status === "string" && p.status.toLowerCase() === "free")
      ).forEach(p => {
        const type = p.product_type?.toLowerCase();
        if (byType[type]) byType[type].push({ ...p, finalPrice: roundPrice(p.price) * (1 - (p.discount || 0) / 100) });
      });
      for (const type of types) byType[type].sort(() => Math.random() - 0.5).sort((a, b) => {
        const d = a.finalPrice - b.finalPrice;
        return Math.abs(d) < 50 ? Math.random() - 0.5 : d;
      });
      const sorted = types.flatMap(type => byType[type] || []).filter(p => p.finalPrice > 0);
      let prefSpent = 0;
      for (const p of sorted) {
        if (prefSpent + p.finalPrice > phase1Budget || tempCart[p.serial_number]) continue;
        if (p.product_type === "sparklers" || p.product_type === "premium_sparklers") {
          const size = getSparklerSize(p.productname) || "unknown";
          if ((sparklerSizeCount[size] || 0) >= 3) continue;
          sparklerSizeCount[size] = (sparklerSizeCount[size] || 0) + 1;
        }
        tempCart[p.serial_number] = 1; prefSpent += p.finalPrice;
      }
      const phase2Budget = budgetPerPref * 0.30;
      const boostCandidates = types.flatMap(type =>
        Object.keys(tempCart).map(serial => {
          const p = products.find(x => x.serial_number === serial);
          if (!p || p.product_type?.toLowerCase() !== type) return null;
          return { ...p, finalPrice: roundPrice(p.price) * (1 - (p.discount || 0) / 100) };
        }).filter(Boolean).sort(() => Math.random() - 0.5)
      );
      let boostRemaining = phase2Budget;
      const boostThreshold = budgetPerPref * 0.02;
      let safetyLimit = 500;
      while (boostRemaining > boostThreshold && safetyLimit-- > 0) {
        let addedAny = false;
        for (const p of boostCandidates) {
          if (boostRemaining < p.finalPrice) continue;
          const maxQty = Math.max(1, Math.floor((budgetPerPref * 0.25) / p.finalPrice));
          const currentQty = tempCart[p.serial_number] || 0;
          if (currentQty >= maxQty) continue;
          tempCart[p.serial_number] = currentQty + 1;
          boostRemaining -= p.finalPrice;
          addedAny = true;
          if (boostRemaining <= boostThreshold) break;
        }
        if (!addedAny) break;
      }
    }
    setSuggestedCart(tempCart);
  }, [aiBudget, aiPreferences, products, showError]);

  const handleAiNext = useCallback(() => {
    if (aiStep === 0 && !aiBudget) return showError("Please enter a budget.");
    if (aiStep < 2) setAiStep(s => s + 1);
    else generateSuggestions();
  }, [aiStep, aiBudget, generateSuggestions, showError]);

  const handleAiBack = useCallback(() => {
    if (aiStep > 0) { if (aiStep === 2) setSuggestedCart({}); setAiStep(s => s - 1); }
  }, [aiStep]);

  const addSuggestedToCart = useCallback(() => {
    setCart(prev => {
      const updated = { ...prev };
      Object.entries(suggestedCart).forEach(([serial, qty]) => {
        updated[serial] = (updated[serial] || 0) + qty;
      });
      return updated;
    });
    setShowAiModal(false); setAiStep(0); setAiBudget("");
    setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
    setSuggestedCart({});
  }, [suggestedCart]);

  const totals = useMemo(() => {
    let net = 0, productDiscount = 0, subtotal = 0, promoDiscount = 0;
    for (const serial in cart) {
      const qty = cart[serial];
      const p = products.find(x => x.serial_number === serial);
      if (!p) continue;
      const orig = roundPrice(p.price);
      const disc = orig * (p.discount / 100);
      const after = orig - disc;
      net += orig * qty;
      productDiscount += disc * qty;
      subtotal += after * qty;
      if (appliedPromo && (!appliedPromo.product_type || p.product_type === appliedPromo.product_type))
        promoDiscount += (after * qty * appliedPromo.discount) / 100;
    }
    const afterPromo = subtotal - promoDiscount;
    const fee = afterPromo * 0.01;
    const total = afterPromo + fee;
    const save = productDiscount + promoDiscount;
    return {
      net: formatPrice(net),
      save: formatPrice(save),
      total: formatPrice(total),
      promo_discount: formatPrice(promoDiscount),
      product_discount: formatPrice(productDiscount),
      processing_fee: formatPrice(fee),
      originalTotal: subtotal,
      totalDiscount: productDiscount,
      subtotalRaw: subtotal,
    };
  }, [cart, products, appliedPromo]);

  const isCartUnlocked = totals.subtotalRaw >= MIN_PURCHASE;

  const handleCheckoutClick = useCallback(() => {
    if (!Object.keys(cart).length) { showError("Your cart is empty."); return; }
    if (!isCartUnlocked) {
      showError(`Minimum purchase is ₹${MIN_PURCHASE}. Add ₹${formatPrice(MIN_PURCHASE - totals.subtotalRaw)} more to proceed.`);
      return;
    }
    setIsCartOpen(false);
    if (totals.subtotalRaw > 3000) {
      setShowSpinModal(true);
    } else {
      setShowModal(true);
    }
  }, [cart, totals.subtotalRaw, isCartUnlocked, showError]);

  const handleSpinSkip = useCallback(() => {
    setShowSpinModal(false);
    setShowModal(true);
  }, []);

  const handleAddFreeProduct = useCallback((product) => {
    setFreeCartItem({ ...product, price: 0, is_free: true, quantity: 1 });
    setShowSpinModal(false);
    setShowModal(true);
  }, []);

  const handleRocketComplete = useCallback(() => {
    setShowLoader(false);
    setIsBookingLoading(false);
    setIsCartOpen(false);
    setShowModal(false);
    setShowSpinModal(false);
    setShowDetailsModal(false);
    setShowMinOrderModal(false);
    setIsExpandedCart(false);
    setCart({});
    setFreeCartItem(null);
    setCustomerDetails({
      customer_name: "", address: "", district: "", state: "",
      mobile_number: "", email: "", customer_type: "User",
    });
    setAppliedPromo(null);
    setPromocode("");
    setShowSuccess(true);
    setShowToaster(true);
  }, []);

  const handleFinalCheckout = useCallback(async () => {
    setIsBookingLoading(true);
    const order_id = `ORD-${Date.now()}`;
    const selectedProducts = Object.entries(cart).map(([serial, qty]) => {
      const product = products.find(p => p.serial_number === serial);
      return {
        id: product.id, product_type: product.product_type, quantity: qty,
        per: product.per, price: roundPrice(product.price), discount: product.discount,
        serial_number: product.serial_number, productname: product.productname,
        status: product.status,
      };
    });
    const freeProductPayload = freeCartItem ? [{
      id: freeCartItem.id, product_type: freeCartItem.product_type, quantity: 1,
      per: freeCartItem.per, price: 0, discount: 0,
      serial_number: freeCartItem.serial_number, productname: freeCartItem.productname,
      status: "free", is_free: true,
    }] : [];
    const allProducts = [...selectedProducts, ...freeProductPayload];
    if (!allProducts.length) { showError("Your cart is empty."); setIsBookingLoading(false); return; }
    if (!customerDetails.customer_name || !customerDetails.address ||
        !customerDetails.district || !customerDetails.state || !customerDetails.mobile_number) {
      showError("Please fill all required customer details."); setIsBookingLoading(false); return;
    }
    const mobile = customerDetails.mobile_number.replace(/\D/g, "").slice(-10);
    if (mobile.length !== 10) { showError("Mobile number must be 10 digits."); setIsBookingLoading(false); return; }
    const selectedState = customerDetails.state?.trim();
    const minOrder = states.find(s => s.name === selectedState)?.min_rate;
    if (minOrder && totals.originalTotal < minOrder) {
      showError(`Minimum order for ${selectedState} is ₹${minOrder}. Your total is ₹${formatPrice(totals.originalTotal)}.`);
      setIsBookingLoading(false); return;
    }
    try {
      setShowLoader(true);

      const bookingResponse = await fetch(`${API_BASE_URL}/api/direct/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id,
          products: allProducts,
          net_rate: Number(totals.net),
          you_save: Number(totals.save),
          processing_fee: Number(totals.processing_fee),
          total: Number(totals.total),
          promo_discount: Number(totals.promo_discount || "0"),
          free_item: freeCartItem ? {
            serial_number: freeCartItem.serial_number,
            productname: freeCartItem.productname,
            price: 0,
          } : null,
          customer_type: customerDetails.customer_type,
          customer_name: customerDetails.customer_name,
          address: customerDetails.address,
          mobile_number: mobile,
          email: customerDetails.email,
          district: customerDetails.district,
          state: customerDetails.state,
          promocode: appliedPromo?.code || null,
        }),
      });

      if (!bookingResponse.ok) {
        const errData = await bookingResponse.json();
        showError(errData.message || "Booking failed.");
        setShowLoader(false);
        setIsBookingLoading(false);
        return;
      }

      const bookingData = await bookingResponse.json();
      const confirmedOrderId = bookingData.order_id;

      const pdfResponse = await fetch(`${API_BASE_URL}/api/direct/invoice/${confirmedOrderId}`);
      if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const safeName = (customerDetails.customer_name || "order").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
        link.download = `${safeName}-${confirmedOrderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      handleRocketComplete();

    } catch (err) {
      showError("Something went wrong during checkout.");
      setShowLoader(false);
      setIsBookingLoading(false);
    }
  }, [cart, products, freeCartItem, customerDetails, states, totals, appliedPromo, showError, handleRocketComplete]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      const cleaned = value.replace(/\D/g, "").slice(-10);
      setCustomerDetails(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setCustomerDetails(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleShowDetails = useCallback((product) => {
    setSelectedProduct(product); setShowDetailsModal(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProduct(null); setShowDetailsModal(false);
  }, []);

  const handleImageClick = useCallback((media) => {
    const items = Array.isArray(media) ? media : [];
    setSelectedImages(items); setCurrentImageIndex(0); setShowImageModal(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false); setSelectedImages([]); setCurrentImageIndex(0);
  }, []);

  const productTypes = useMemo(() => {
    const available = [...new Set(
      products
        .filter(p => p.product_type !== "gift_box_dealers")
        .map(p => p.product_type || "Others")
    )];
    const filtered = ORDERED_TYPES.filter(t => available.includes(t.replace(/ /g, "_").toLowerCase()));
    return ["All", ...filtered];
  }, [products]);

  const grouped = useMemo(() => {
    const result = products.filter(p =>
      p.product_type !== "gift_box_dealers" &&
      !(typeof p.status === "string" && p.status.toLowerCase() === "free") &&
      (selectedType === "All" || p.product_type === selectedType.replace(/ /g, "_").toLowerCase()) &&
      (selectedBrand === "All" || (p.brand && p.brand.trim() === selectedBrand)) &&
      (!searchTerm || p.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!brandSearchTerm || (p.brand && p.brand.toLowerCase().includes(brandSearchTerm.toLowerCase())))
    ).reduce((acc, p) => {
      const key = p.product_type || "Others";
      acc[key] = acc[key] || [];
      acc[key].push(p);
      return acc;
    }, {});
    const orderedResult = {};
    ORDERED_TYPES.map(t => t.replace(/ /g, "_").toLowerCase()).forEach(t => {
      if (result[t]) orderedResult[t] = result[t].sort(serialSort);
    });
    return orderedResult;
  }, [products, selectedType, selectedBrand, searchTerm, brandSearchTerm]);

  const suggestedTotals = useMemo(() => {
    let total = 0;
    for (const serial in suggestedCart) {
      const qty = suggestedCart[serial];
      const p = products.find(x => x.serial_number === serial);
      if (!p) continue;
      total += (roundPrice(p.price) * (1 - p.discount / 100)) * qty;
    }
    return formatPrice(total);
  }, [suggestedCart, products]);

  const cartItemCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );

  if (isLoading) return <LoadingSpinner />;

  const SummaryRows = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: "12px" }}>
      {[
        { label: "Net Total", val: `₹${totals.net}`, color: C.ink },
        { label: "Product Discount", val: `−₹${totals.product_discount}`, color: C.crimson },
        ...(appliedPromo ? [{ label: `Promo (${appliedPromo.code})`, val: `−₹${totals.promo_discount}`, color: C.crimson }] : []),
        { label: "You Save", val: `−₹${totals.save}`, color: C.crimson },
        { label: "Processing Fee (1%)", val: `₹${totals.processing_fee}`, color: C.ink },
      ].map(({ label, val, color }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", color, fontWeight: 400 }}>
          <span>{label}</span><span>{val}</span>
        </div>
      ))}
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "14px",
        paddingTop: "0.4rem", borderTop: `2px solid ${C.parchment}`, color: C.crimson,
      }}>
        <span>Total</span><span>₹{totals.total}</span>
      </div>
    </div>
  );

  const PromoSelector = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {promocode === "custom" && (
        <input type="text" value="" onChange={e => setPromocode(e.target.value)}
          placeholder="Enter custom code"
          style={{
            width: "100%", padding: "8px 12px",
            border: `1.5px solid ${C.border}`, borderRadius: "4px",
            background: C.cream, fontFamily: "'Barlow', sans-serif",
            fontSize: "13px", color: C.ink,
          }} />
      )}
      {appliedPromo && (
        <p style={{
          color: C.green, fontSize: "11px",
          background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.25)",
          borderRadius: "4px", padding: "6px 10px",
        }}>
          ✓ {appliedPromo.code} — {formatPercentage(appliedPromo.discount)}% OFF applied
        </p>
      )}
    </div>
  );

  return (
    <>
      
      {cartItemCount > 0 && (
        <MinPurchasePipeline
          subtotalRaw={totals.subtotalRaw}
          onCartOpen={() => setIsCartOpen(true)}
          isUnlocked={isCartUnlocked}
        />
      )} 
      
      <div>
        <Navbar/>
      </div>

      <ToasterNotification show={showToaster} onClose={() => setShowToaster(false)} />
      <SuccessAnimation show={showSuccess} onDismiss={() => setShowSuccess(false)} />

      <LuckySpinModal
        isOpen={showSpinModal}
        onClose={handleSpinSkip}
        freeProducts={freeProductsList}
        onAddFreeProduct={handleAddFreeProduct}
        onSkip={handleSpinSkip}
        alreadyHasFree={!!freeCartItem}
      />

      <AnimatePresence>
        {showLoader && <RocketLoader onComplete={handleRocketComplete} />}

        {showMinOrderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[96] px-4"
            style={{ background: "rgba(28,28,30,0.6)", backdropFilter: "blur(6px)" }}>
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
              style={{
                background: "#fff", border: `2px solid ${C.crimson}`,
                borderRadius: "8px", boxShadow: `6px 6px 0 ${C.crimson}`,
                padding: "2.5rem", maxWidth: "400px", width: "100%", textAlign: "center",
              }}>
              <div style={{
                width: 48, height: 48, background: `rgba(192,57,43,0.08)`,
                borderRadius: "8px", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 1.25rem",
              }}>
                <X style={{ color: C.crimson, width: 24, height: 24 }} />
              </div>
              <h3 className="display" style={{ fontSize: "1.25rem", color: C.ink, marginBottom: "0.75rem" }}>Hold on!</h3>
              <p style={{ color: C.slate, fontSize: "14px", lineHeight: 1.7, marginBottom: "1.5rem" }}>{minOrderMessage}</p>
              <button onClick={() => setShowMinOrderModal(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Got it</button>
            </motion.div>
          </motion.div>
        )}

        {showDetailsModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(28,28,30,0.6)", backdropFilter: "blur(6px)" }}
            onClick={handleCloseDetails}>
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#fff", border: `2px solid ${C.crimson}`,
                borderRadius: "8px", boxShadow: `8px 8px 0 ${C.crimson}`,
                maxWidth: "28rem", width: "100%", maxHeight: "90vh", overflowY: "auto",
              }}>
              <div style={{ padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 className="display" style={{ fontSize: "1.4rem", color: C.crimson, marginBottom: "0.5rem" }}>
                      {selectedProduct.productname}
                    </h2>
                    {selectedProduct.brand && (
                      <span className="pill pill-brand" style={{ marginBottom: 8, display: "inline-flex" }}>
                        <Tag style={{ width: 10, height: 10 }} /> {selectedProduct.brand}
                      </span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                      {selectedProduct.discount > 0 && <span className="pill pill-saffron">{formatPercentage(selectedProduct.discount)}% OFF</span>}
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "1.5rem", color: C.crimson }}>
                        ₹{formatPrice(roundPrice(selectedProduct.price) * (1 - selectedProduct.discount / 100))}
                      </span>
                    </div>
                  </div>
                  <button onClick={handleCloseDetails} style={{
                    width: 36, height: 36, borderRadius: "4px",
                    border: `1.5px solid ${C.border}`, background: C.cream,
                    color: C.crimson, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>×</button>
                </div>
                <ModernCarousel media={selectedProduct.images} onImageClick={handleImageClick} />
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: C.crimson, marginBottom: "0.5rem" }}>About this product</h3>
                <p style={{ color: C.ivory, fontSize: "14px", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {selectedProduct.description || "A premium quality firework crafted for your most memorable celebrations."}
                </p>
                <button onClick={() => { addToCart(selectedProduct); handleCloseDetails(); }} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  <FaPlus style={{ width: 12, height: 12 }} /> Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: "rgba(28,28,30,0.6)", backdropFilter: "blur(6px)" }}
            onClick={() => { setIsCartOpen(false); setIsExpandedCart(false); }}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              onClick={e => e.stopPropagation()}
              className="mobile:rounded-t-xl mobile:w-full"
              style={{
                background: "#fff",
                border: `2px solid ${C.crimson}`,
                borderRadius: "12px 12px 0 0",
                boxShadow: `0 -4px 40px rgba(0,0,0,0.18)`,
                width: "100%",
                maxWidth: isExpandedCart ? "55rem" : "34rem",
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.5rem 1rem",
                borderBottom: `1.5px solid ${C.border}`,
                background: C.ivory,
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28,
                    background: `rgba(192,57,43,0.09)`,
                    border: `1.5px dashed ${C.crimson}`, borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <ShoppingCart style={{ width: 13, height: 13, color: C.crimson }} />
                  </div>
                  <div>
                    <p className="display" style={{ fontSize: "0.85rem", color: C.ink, lineHeight: 1.2 }}>Your Cart</p>
                    <p style={{ fontSize: "10px", color: C.crimson }}>
                      {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}{freeCartItem ? " + 1 free 🎁" : ""}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {!isCartUnlocked && cartItemCount > 0 && (
                    <span style={{
                      fontSize: "10px", color: C.saffron, fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                      background: "rgba(230,126,34,0.1)", border: "1px solid rgba(230,126,34,0.3)",
                      padding: "2px 7px", borderRadius: "100px", whiteSpace: "nowrap",
                    }}>
                      ₹{formatPrice(MIN_PURCHASE - totals.subtotalRaw)} to unlock
                    </span>
                  )}
                  {!isExpandedCart && Object.keys(cart).length > 0 && (
                    <button onClick={() => setIsExpandedCart(true)} style={{
                      width: 26, height: 26, borderRadius: "4px",
                      border: `1.5px solid ${C.border}`, background: C.cream,
                      color: C.slate, cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <FaExpand style={{ fontSize: 10 }} />
                    </button>
                  )}
                  <button onClick={() => { setIsCartOpen(false); setIsExpandedCart(false); }} style={{
                    width: 26, height: 26, borderRadius: "4px",
                    border: `1.5px solid ${C.border}`, background: C.cream,
                    color: C.crimson, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 15,
                  }}>×</button>
                </div>
              </div>

              {!isCartUnlocked && cartItemCount > 0 && (
                <div style={{
                  padding: "0.3rem 1rem",
                  background: C.parchment,
                  borderBottom: `1px solid ${C.borderD}`,
                  flexShrink: 0,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", fontWeight: 400, color: C.slate }}>
                      Min. purchase ₹{MIN_PURCHASE}
                    </span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: "11px", fontWeight: 400, color: C.crimson }}>
                      {Math.round((totals.subtotalRaw / MIN_PURCHASE) * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(0,0,0,0.08)", borderRadius: 100, overflow: "hidden" }}>
                    <div
                      className="pipeline-fill"
                      style={{
                        height: "100%",
                        width: `${Math.min((totals.subtotalRaw / MIN_PURCHASE) * 100, 100)}%`,
                        borderRadius: 100,
                      }}
                    />
                  </div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", color: C.saffron, marginTop: "0.15rem", fontWeight: 400 }}>
                    Add ₹{formatPrice(MIN_PURCHASE - totals.subtotalRaw)} more to unlock checkout
                  </p>
                </div>
              )}

              <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.875rem", display: "flex", flexDirection: "column", gap: 5, WebkitOverflowScrolling: "touch" }}>
                {Object.keys(cart).length === 0 && !freeCartItem ? (
                  <div style={{ textAlign: "center", padding: "1.75rem 0" }}>
                    <div style={{
                      width: 44, height: 44,
                      background: `rgba(192,57,43,0.06)`,
                      border: `1.5px dashed ${C.crimson}`, borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.6rem",
                    }}>
                      <ShoppingCart style={{ width: 18, height: 18, color: C.crimson, opacity: 0.4 }} />
                    </div>
                    <p className="display" style={{ color: C.muted, fontSize: "0.9rem" }}>Cart is empty</p>
                    <p style={{ color: C.muted, fontSize: "12px", fontFamily: "'Lora', serif", fontStyle: "italic", marginTop: 3 }}>
                      Add fireworks to begin your celebration
                    </p>
                  </div>
                ) : (
                  <>
                    {Object.entries(cart).map(([serial, qty]) => {
                      const product = products.find(p => p.serial_number === serial);
                      if (!product) return null;
                      const origPrice = roundPrice(product.price);
                      const discountAmt = (origPrice * product.discount) / 100;
                      const priceAfterDiscount = formatPrice(origPrice - discountAmt);
                      const imageSrc = Array.isArray(product.images)
                        ? product.images.filter(item => !item.includes("/video/") && !item.toLowerCase().endsWith(".gif"))[0] || need
                        : need;
                      return (
                        <motion.div key={serial} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 7,
                            padding: "18px",
                            background: C.cream,
                            border: `1px solid ${C.border}`, borderRadius: "7px",
                          }}>
                          <img src={imageSrc} alt={product.productname}
                            style={{ width: 38, height: 38, borderRadius: "5px", objectFit: "cover", border: `1px solid ${C.border}`, cursor: "pointer", flexShrink: 0 }}
                            onClick={() => handleImageClick(product.images)} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontWeight: 800, fontSize: "15px", color: C.ivory,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                              lineHeight: 1.3,
                            }}>{product.productname}</p>
                            {product.brand && (
                              <span style={{
                                display: "inline-block", marginTop: 1, fontSize: "9px", color: C.brand,
                                fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                                background: `rgba(21,101,192,0.08)`, padding: "1px 5px", borderRadius: "100px",
                              }}>{product.brand}</span>
                            )}
                            <p style={{ fontSize: "15px", color: C.crimson, fontWeight: 1000, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>
                              ₹{priceAfterDiscount} × {qty} = <span style={{ color: C.ink }}>₹{formatPrice((origPrice - discountAmt) * qty)}</span>
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                            <button onClick={() => removeFromCart(product)} style={{
                              width: 24, height: 24, background: C.parchment, color: C.crimson,
                              border: `1px solid ${C.borderD}`, borderRadius: "4px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}><FaMinus style={{ fontSize: 8 }} /></button>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "12px", minWidth: 16, textAlign: "center", color: C.ink }}>{qty}</span>
                            <button onClick={() => addToCart(product)} style={{
                              width: 24, height: 24, background: C.crimson, color: "#fff",
                              border: "none", borderRadius: "4px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}><FaPlus style={{ fontSize: 8 }} /></button>
                          </div>
                        </motion.div>
                      );
                    })}

                    {freeCartItem && (
                      <>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 7,
                          padding: "4px 0 2px", borderTop: `1.5px dashed ${C.border}`, marginTop: 2,
                        }}>
                          <Gift style={{ width: 11, height: 11, color: C.green }} />
                          <span style={{
                            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "9px",
                            letterSpacing: "0.18em", textTransform: "uppercase", color: C.green,
                          }}>Lucky Draw Free Gift</span>
                          <div style={{ flex: 1, height: "1px", background: `rgba(46,125,50,0.2)` }} />
                        </div>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 7, padding: "6px",
                            background: "rgba(46,125,50,0.05)", border: `1.5px solid rgba(46,125,50,0.25)`, borderRadius: "7px",
                          }}>
                          <img
                            src={Array.isArray(freeCartItem.images)
                              ? freeCartItem.images.filter(i => !i.includes("/video/") && !i.toLowerCase().endsWith(".gif"))[0] || need
                              : need}
                            alt={freeCartItem.productname}
                            style={{ width: 38, height: 38, borderRadius: "5px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(46,125,50,0.2)" }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "11px", color: C.ink,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                            }}>{freeCartItem.productname}</p>
                            <span style={{
                              display: "inline-block", marginTop: 3, background: C.green, color: "#fff",
                              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "9px",
                              letterSpacing: "0.1em", padding: "2px 7px", borderRadius: "100px",
                            }}>🎁 FREE · ₹0</span>
                          </div>
                          <button onClick={removeFreeItem} style={{
                            width: 22, height: 22,
                            background: "rgba(46,125,50,0.1)",
                            border: `1px solid rgba(46,125,50,0.3)`, borderRadius: "4px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: C.green, fontSize: 13, flexShrink: 0,
                          }}>×</button>
                        </motion.div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div style={{
                padding: "0.5rem 0.875rem",
                borderTop: `1.5px solid ${C.border}`,
                background: C.ivory,
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                flexShrink: 0,
              }}>
                {!isExpandedCart && (
                  <>
                    {totals.subtotalRaw > 0 && totals.subtotalRaw >= MIN_PURCHASE && totals.subtotalRaw <= 3000 && (
                      <div style={{
                        background: "rgba(230,126,34,0.07)", border: `1.5px solid rgba(230,126,34,0.3)`,
                        borderRadius: "6px", padding: "5px 10px",
                        fontFamily: "'Barlow', sans-serif", fontSize: "11px", color: C.saffron,
                      }}>
                        🎰 Add ₹{formatPrice(3000 - totals.subtotalRaw)} more to unlock the <strong>Lucky Spin</strong>!
                      </div>
                    )}
                    {totals.subtotalRaw > 3000 && (
                      <div style={{
                        background: "rgba(46,125,50,0.07)", border: `1.5px solid rgba(46,125,50,0.3)`,
                        borderRadius: "6px", padding: "5px 10px",
                        fontFamily: "'Barlow', sans-serif", fontSize: "11px", color: C.crimson, fontWeight: 400,
                      }}>
                        🎁 Lucky Spin unlocked! Spin to win a free gift at checkout.
                      </div>
                    )}
                    <PromoSelector />
                    <div style={{
                      background: `rgba(192,57,43,0.05)`, border: `1.5px solid rgba(192,57,43,0.2)`,
                      borderRadius: "6px", padding: "5px 10px", fontSize: "10px", color: C.slate,
                    }}>
                      <p>⚠ Delivery charges are payable to transport. Pickup at your own cost.</p>
                    </div>
                  </>
                )}

                <SummaryRows />

                {freeCartItem && (
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "3px 8px",
                    background: "rgba(46,125,50,0.06)",
                    border: "1px solid rgba(46,125,50,0.25)", borderRadius: "4px",
                    fontSize: "11px", color: C.green, fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                  }}>
                    <span>🎁 Lucky Draw Gift</span><span>₹0</span>
                  </div>
                )}

                {isExpandedCart ? (
                  <button onClick={() => setIsExpandedCart(false)} className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                    <FaCompress style={{ fontSize: 12 }} /> Collapse View
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => { setCart({}); setFreeCartItem(null); }} className="btn-outline"
                      style={{ flex: 1, justifyContent: "center", fontSize: "11px", padding: "7px 6px" }}>
                      Clear
                    </button>
                    <button
                      onClick={handleCheckoutClick}
                      disabled={!isCartUnlocked}
                      className="btn-primary"
                      style={{
                        flex: 2, justifyContent: "center", fontSize: "12px", padding: "7px 6px",
                        opacity: isCartUnlocked ? 1 : 0.5,
                        cursor: isCartUnlocked ? "pointer" : "not-allowed",
                        background: isCartUnlocked ? C.crimson : C.muted,
                      }}
                    >
                      {isCartUnlocked ? "Checkout →" : `₹${formatPrice(MIN_PURCHASE - totals.subtotalRaw)} more needed`}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showImageModal && selectedImages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)" }}
            onClick={handleCloseImageModal}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()} className="relative max-w-4xl w-full mx-4 max-h-[90vh]">
              <AnimatePresence mode="wait">
                <motion.div key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                  {selectedImages[currentImageIndex]?.includes("/video/")
                    ? <video src={selectedImages[currentImageIndex]} autoPlay muted loop
                        style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }} />
                    : <img src={selectedImages[currentImageIndex] || need} alt="Product"
                        style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }} />}
                </motion.div>
              </AnimatePresence>
              <button onClick={handleCloseImageModal} style={{
                position: "absolute", top: 12, right: 12, width: 36, height: 36,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>×</button>
              {selectedImages.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedImages.length - 1 : prev - 1)}
                    style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px",
                      color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}><FaArrowLeft style={{ fontSize: 12 }} /></button>
                  <button onClick={() => setCurrentImageIndex(prev => prev === selectedImages.length - 1 ? 0 : prev + 1)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px",
                      color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}><FaArrowRight style={{ fontSize: 12 }} /></button>
                  <div style={{
                    position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.5)", borderRadius: "100px",
                    padding: "4px 12px", color: "#fff", fontSize: "12px",
                  }}>
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {showAiModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(28,28,30,0.6)", backdropFilter: "blur(6px)" }}
            onClick={() => {
              setShowAiModal(false); setAiStep(0); setAiBudget("");
              setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
              setSuggestedCart({});
            }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#fff", border: `2px solid ${C.crimson}`,
                borderRadius: "8px", boxShadow: `8px 8px 0 ${C.crimson}`,
                maxWidth: "28rem", width: "100%", maxHeight: "90vh", overflowY: "auto",
              }}>
              <div style={{ padding: "1.75rem 1.75rem 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                  <div style={{
                    width: 44, height: 44, background: C.crimson, borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", boxShadow: `3px 3px 0 ${C.crimsonD}`,
                  }}>🤖</div>
                  <div>
                    <h2 className="display" style={{ fontSize: "1.1rem", color: C.ink }}>Smart Cart Builder</h2>
                    <p style={{ fontSize: "12px", color: C.muted, fontFamily: "'Barlow', sans-serif" }}>Let me craft your perfect celebration</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= aiStep ? C.crimson : C.parchment, transition: "all 0.3s",
                    }} />
                  ))}
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: "11px", fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}>
                  {["Budget", "Preferences", "Suggestions"].map((label, i) => (
                    <span key={i} style={{ color: i === aiStep ? C.crimson : C.muted }}>{label}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: "0 1.75rem 1.75rem" }}>
                <AnimatePresence mode="wait">
                  {aiStep === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ marginBottom: "1.5rem" }}>
                      <p style={{ color: C.slate, fontSize: "14px", marginBottom: "1rem", fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                        What's your total budget for fireworks?
                      </p>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>₹</span>
                        <input type="number" value={aiBudget} onChange={e => setAiBudget(e.target.value)}
                          style={{
                            width: "100%", paddingLeft: 32, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                            border: `2px solid ${C.border}`, borderRadius: "4px",
                            background: C.cream, fontFamily: "'Barlow', sans-serif",
                            fontWeight: 400, fontSize: "1.2rem", color: C.ink, outline: "none",
                          }}
                          placeholder="Enter amount" />
                      </div>
                    </motion.div>
                  )}
                  {aiStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ marginBottom: "1.5rem" }}>
                      <p style={{ color: C.slate, fontSize: "14px", marginBottom: "1rem", fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                        What kind of experience are you creating?
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { key: 'kids', emoji: '🧒', label: 'Kids Friendly', desc: 'Twinkling Star, Fancy Pencil, Novelties' },
                          { key: 'sound', emoji: '💥', label: 'Sound Crackers', desc: 'Bombs, Atom Bombs, One Sound' },
                          { key: 'night', emoji: '🚀', label: 'Night Sky Display', desc: 'Rockets, Repeating Shots, Sky Shots' },
                          { key: 'kidsnight', emoji: '✨', label: 'Kids Night Crackers', desc: 'Sparklers, Flower Pots, Fountains' },
                        ].map(({ key, emoji, label, desc }) => (
                          <label key={key} style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "14px 16px",
                            border: `2px solid ${aiPreferences[key] ? C.crimson : C.border}`,
                            borderRadius: "6px",
                            background: aiPreferences[key] ? `rgba(192,57,43,0.04)` : "#fff",
                            cursor: "pointer", transition: "all 0.2s",
                          }}>
                            <input type="checkbox" checked={aiPreferences[key]}
                              onChange={e => setAiPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                              style={{ display: "none" }} />
                            <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", color: aiPreferences[key] ? C.crimson : C.ink }}>{label}</p>
                              <p style={{ fontSize: "11px", color: C.muted, fontFamily: "'Barlow', sans-serif" }}>{desc}</p>
                            </div>
                            <div style={{
                              width: 20, height: 20, borderRadius: "4px",
                              border: `2px solid ${aiPreferences[key] ? C.crimson : C.border}`,
                              background: aiPreferences[key] ? C.crimson : "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                            }}>
                              {aiPreferences[key] && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
                            </div>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {aiStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div>
                          <p style={{ fontWeight: 700, color: C.ink }}>{Object.keys(suggestedCart).length} items suggested</p>
                          <p style={{ fontSize: "12px", color: C.muted, fontFamily: "'Barlow', sans-serif" }}>≈ ₹{suggestedTotals} total</p>
                        </div>
                        <button onClick={generateSuggestions} className="btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }}>↻ Regenerate</button>
                      </div>
                      {Object.keys(suggestedCart).length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2.5rem 0", color: C.muted }}>
                          <p style={{ fontSize: "14px" }}>No suggestions generated.</p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "38vh", overflowY: "auto" }}>
                          {Object.entries(suggestedCart).map(([serial, qty]) => {
                            const product = products.find(p => p.serial_number === serial);
                            if (!product) return null;
                            const origPr = roundPrice(product.price);
                            const discAmt = (origPr * product.discount) / 100;
                            const priceAfterDiscount = formatPrice(origPr - discAmt);
                            const imageSrc = Array.isArray(product.images) && product.images.length > 0
                              ? product.images.find(img => !img.includes("/video/")) || product.images[0]
                              : need;
                            return (
                              <div key={serial} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 12px", background: C.cream,
                                border: `1px solid ${C.border}`, borderRadius: "6px",
                              }}>
                                <img src={imageSrc} alt={product.productname}
                                  style={{ width: 52, height: 52, borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                                  onError={e => e.target.src = need} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{
                                    fontWeight: 700, fontSize: "12px", color: C.ink,
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                                  }}>{product.productname}</p>
                                  <p style={{ fontSize: "11px", color: C.crimson, marginTop: 2, fontWeight: 400 }}>₹{priceAfterDiscount} × {qty}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                  <button onClick={() => removeFromSuggestedCart(product)} style={{
                                    width: 26, height: 26, background: C.parchment, border: `1px solid ${C.border}`,
                                    borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.crimson,
                                  }}><FaMinus style={{ fontSize: 9 }} /></button>
                                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "13px", minWidth: 28, textAlign: "center" }}>{qty}</span>
                                  <button onClick={() => addToSuggestedCart(product)} style={{
                                    width: 26, height: 26, background: C.parchment, border: `1px solid ${C.border}`,
                                    borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.crimson,
                                  }}><FaPlus style={{ fontSize: 9 }} /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {Object.keys(suggestedCart).length > 0 && (
                        <button onClick={addSuggestedToCart} className="btn-primary"
                          style={{ width: "100%", justifyContent: "center", marginTop: "1rem", background: "#2e7d32", border: "none" }}>
                          ✓ Add All to Cart
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {aiStep > 0
                    ? <button onClick={handleAiBack} className="btn-outline" style={{ padding: "10px 20px", fontSize: "13px" }}>← Back</button>
                    : <div />}
                  <button onClick={handleAiNext} className="btn-primary" style={{ padding: "10px 24px", fontSize: "13px" }}>
                    {aiStep < 2 ? "Next →" : "Generate"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ paddingTop: "7rem", paddingBottom: "8rem", maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem 8rem" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "1.25rem" }}>
          <p className="label" style={{ marginBottom: "0.5rem" }}>Category</p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* Left arrow — desktop only */}
            <button
              className="hidden lg:flex"
              onClick={() => typeScrollRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
              style={{
                flexShrink: 0,
                width: 34, height: 34,
                background: "#fff",
                border: `1.5px solid ${C.border}`,
                borderRadius: "50%",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                color:C.crimson
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.crimson; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.crimson; }}
            >
              <FaArrowLeft style={{ fontSize: 11 }} />
            </button>

            {/* Scrollable chips */}
            <div
              ref={typeScrollRef}
              className="hscroll"
              style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "4px 0 8px", scrollbarWidth: "thin", flex: 1 }}
            >
              {productTypes.map(type => (
                <motion.button 
                  key={type} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedType(type)}
                  style={{ color: selectedType === type ? "#fff" : C.crimson }} // Dynamic white text when active
                  className={`type-chip ${selectedType === type ? "active" : ""}`}
                >
                  {type}
                </motion.button>
              ))}
            </div>

            {/* Right arrow — desktop only */}
            <button
              className="hidden lg:flex"
              onClick={() => typeScrollRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
              style={{
                flexShrink: 0,
                width: 34, height: 34,
                background: "#fff",
                border: `1.5px solid ${C.border}`,
                borderRadius: "50%",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                color: C.crimson,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.crimson; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.crimson; }}
            >
              <FaArrowRight style={{ fontSize: 11 }} />
            </button>

          </div>
        </motion.div>

        {brandList.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "3rem" }}>
            <p className="label" style={{ marginBottom: "0.5rem" }}>Brand</p>
            <div className="hscroll" style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "4px 0 8px", scrollbarWidth: "thin" }}>
              {brandList.map(brand => {
                const isSelected = selectedBrand === brand;
                return (
                  <motion.button 
                    key={brand} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setSelectedBrand(brand); setBrandSearchInput(""); setBrandSearchTerm(""); }}
                    style={{ 
                      background: isSelected ? "#1565c0" : "#ffffff", // Blue if selected, white if not
                      color: isSelected ? C.ink : C.crimson,          // C.ink on blue background, C.crimson on white background
                      borderColor: isSelected ? "#1565c0" : C.border
                    }}
                    className={`brand-chip ${isSelected ? "active" : ""}`}
                  >
                    {brand === "All" ? (
                      <>
                        <Tag style={{ 
                          width: 11, 
                          height: 11, 
                          display: "inline", 
                          marginRight: 4, 
                          color: isSelected ? C.ink : C.crimson // Sync icon color with text rules
                        }} />
                        All Brands
                      </>
                    ) : brand}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Download Pricelist Button - Top Center Below Brands */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={downloadPDF}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              fontSize: "14px",
              boxShadow: `4px 4px 0 ${C.crimsonD}44`,
            }}
          >
            <FaDownload style={{ fontSize: "16px" }} />
            📄 Download Full Pricelist
          </motion.button>
        </div>

        {Object.entries(grouped).map(([type, items], groupIndex) => (
          <motion.section key={type}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
            style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
              <div style={{ width: 4, height: 32, background: C.crimson, borderRadius: "2px", flexShrink: 0 }} />
              <h2 className="display" style={{ fontSize: "1.5rem", color: C.ink, textTransform: "capitalize" }}>
                {type.replace(/_/g, " ")}
              </h2>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${C.border}, transparent)` }} />
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "11px",
                letterSpacing: "0.15em", textTransform: "uppercase", color: C.crimson,
                background: `rgba(192,57,43,0.07)`, border: `1px solid rgba(192,57,43,0.2)`,
                padding: "4px 12px", borderRadius: "100px",
              }}>
                {items.length} items
              </span>
            </div>
            <div className="grid hundred:grid-cols-4 tab:grid-cols-4 mobile:grid-cols-2 w-auto gap-5">
              {items.map((product) => (
                <ProductCard
                  key={product.serial_number}
                  product={product}
                  count={cart[product.serial_number] || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  onShowDetails={handleShowDetails}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          </motion.section>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p className="display" style={{ color: C.muted, fontSize: "1.5rem" }}>No products found</p>
            <p style={{ color: C.muted, fontSize: "14px", marginTop: 8, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              Try adjusting your search or filter
            </p>
            <button onClick={() => { clearSearch(); clearBrandSearch(); setSelectedBrand("All"); setSelectedType("All"); }}
              className="btn-outline" style={{ marginTop: "1.5rem" }}>
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 mt-4"
            style={{ background: "rgba(28,28,30,0.6)", backdropFilter: "blur(6px)" }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              style={{
                background: "#fff", border: `2px solid ${C.crimson}`,
                borderRadius: "8px", boxShadow: `8px 8px 0 ${C.crimson}`,
                maxWidth: "26rem",
                width: "100%",
                maxHeight: "78vh",
                overflowY: "auto",
              }}>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.1rem" }}>
                  <div style={{
                    width: 34, height: 34, background: `rgba(192,57,43,0.08)`,
                    border: `1.5px dashed ${C.crimson}`, borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <ShoppingCart style={{ width: 15, height: 15, color: C.crimson }} />
                  </div>
                  <div>
                    <h2 className="display" style={{ fontSize: "1.05rem", color: C.ink }}>Customer Details</h2>
                    <p style={{ fontSize: "11px", color: C.muted, }}>Fill in your details to confirm booking</p>
                  </div>
                </div>

                {freeCartItem && (
                  <div style={{
                    background: "rgba(46,125,50,0.07)", border: `1.5px solid rgba(46,125,50,0.3)`,
                    borderRadius: "6px", padding: "8px 12px", marginBottom: "0.75rem",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Gift style={{ width: 14, height: 14, color: C.green, flexShrink: 0 }} />
                    <p style={{ fontSize: "12px", color: C.green, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                      🎁 Lucky Draw: "{freeCartItem.productname}" included FREE!
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {["customer_name", "address", "mobile_number", "email"].map(field => (
                    <div key={field}>
                      <p className="label" style={{ marginBottom: 4, fontSize: "10px" }}>
                        {field.replace(/_/g, " ")}{field !== "email" ? " *" : ""}
                      </p>
                      <input name={field} type={field === "email" ? "email" : "text"}
                        placeholder={`Enter ${field.replace(/_/g, " ")}`}
                        value={customerDetails[field]} onChange={handleInputChange}
                        style={{
                          width: "100%", padding: "8px 12px",
                          border: `1.5px solid ${C.border}`, borderRadius: "4px",
                          background: C.cream, fontFamily: "'Barlow', sans-serif",
                          fontSize: "13px", color: C.ink, outline: "none",
                        }}
                        required={field !== "email"} />
                    </div>
                  ))}
                  <div>
                    <p className="label" style={{ marginBottom: 4, fontSize: "10px" }}>State *</p>
                    <select name="state" value={customerDetails.state}
                      onChange={e => setCustomerDetails(prev => ({ ...prev, state: e.target.value, district: "" }))}
                      style={{
                        width: "100%", padding: "8px 12px",
                        border: `1.5px solid ${C.border}`, borderRadius: "4px",
                        background: C.cream, fontFamily: "'Barlow', sans-serif",
                        fontSize: "13px", color: C.ink, outline: "none",
                      }} required>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  {customerDetails.state && (
                    <div>
                      <p className="label" style={{ marginBottom: 4, fontSize: "10px" }}>City / Place *</p>
                      <select name="district" value={customerDetails.district} onChange={handleInputChange}
                        style={{
                          width: "100%", padding: "8px 12px",
                          border: `1.5px solid ${C.border}`, borderRadius: "4px",
                          background: C.cream, fontFamily: "'Barlow', sans-serif",
                          fontSize: "13px", color: C.ink, outline: "none",
                        }} required>
                        <option value="">Select Place / City</option>
                        {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div style={{
                    background: C.cream, border: `1.5px solid ${C.border}`,
                    borderRadius: "6px", padding: "0.75rem",
                  }}>
                    <p className="label" style={{ marginBottom: "0.5rem", fontSize: "10px" }}>Order Summary</p>
                    <SummaryRows />
                    {freeCartItem && (
                      <div style={{
                        marginTop: "0.5rem", paddingTop: "0.5rem",
                        borderTop: `2px dashed rgba(46,125,50,0.35)`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.35rem" }}>
                          <Gift style={{ width: 11, height: 11, color: C.crimson }} />
                          <p style={{
                            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "10px",
                            letterSpacing: "0.15em", textTransform: "uppercase", color: C.crimson,
                          }}>Lucky Draw — Free Gift</p>
                        </div>
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "6px 8px", background: "rgba(46,125,50,0.05)",
                          border: "1px solid rgba(46,125,50,0.2)", borderRadius: "4px",
                        }}>
                          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: "12px", color: C.ink, flex: 1 }}>
                            {freeCartItem.productname}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{ textDecoration: "line-through", color: C.muted, fontSize: "10px", fontFamily: "'Barlow', sans-serif" }}>
                              ₹{formatPrice(freeCartItem.price || 0)}
                            </span>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, color: C.green, fontSize: "13px" }}>₹0</span>
                          </div>
                        </div>
                        <p className="text-red-300" style={{
                          fontSize: "12px", marginTop: 4,
                          fontFamily: "'Barlow', sans-serif", fontStyle: "italic", textAlign: "right",
                        }}>* This item is free and not included in the total.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: 10 }}>
                  <button onClick={() => setShowModal(false)} className="btn-outline"
                    style={{ flex: 1, justifyContent: "center", fontSize: "12px", padding: "8px" }}>
                    Cancel
                  </button>
                  <button onClick={handleFinalCheckout} disabled={isBookingLoading} className="btn-primary"
                    style={{
                      flex: 1, justifyContent: "center", fontSize: "12px", padding: "8px",
                      opacity: isBookingLoading ? 0.75 : 1,
                      cursor: isBookingLoading ? "not-allowed" : "pointer",
                    }}>
                    {isBookingLoading ? "Booking…" : "Confirm Booking →"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Pricelist;