import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles, Rocket, Volume2, Bomb, Disc, CloudSun,
  Heart, SmilePlus, Clock, ArrowRight, Gift, Copy,
  ShoppingCart, X, AlertTriangle
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { FaInfoCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import Navbar from "../Component/Navbar"
import "../App.css"
import { API_BASE_URL } from "../../Config"
import about from "../spc.jpg"
import need from "../spc.jpg"

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const C = {
  ivory:    "#fdf8f0",
  cream:    "#faf3e4",
  parchment:"#f5e9c9",
  crimson:  "#c0392b",
  crimsonD: "#96281b",
  crimsonL: "#e74c3c",
  saffron:  "#e67e22",
  saffronL: "#f39c12",
  ember:    "#d35400",
  charcoal: "#1c1c1e",
  ink:      "#2c2c2e",
  slate:    "#4a4a52",
  muted:    "#7c7c88",
  border:   "#e8dcc8",
  borderD:  "#d4c4a0",
}

/* ─── Global styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&family=Barlow:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { background: #fdf8f0; color: #2c2c2e; font-family: 'Barlow', sans-serif; }
    .display { sans-serif; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }
    .serif   { font-family: 'Lora', serif; }
    .label   { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #c0392b; }
    .stripe-bg { background-image: repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(192,57,43,0.025) 6px, rgba(192,57,43,0.025) 7px); }
    .pill { display:inline-flex; align-items:center; gap:6px; background:#c0392b; color:#fff; font-family:'Barlow',sans-serif; font-weight:600; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:4px 12px; border-radius:100px; }
    .pill-saffron { background:#e67e22; color:#fff; }
    .btn-primary { display:inline-flex; align-items:center; gap:10px; background:#c0392b; color:#fff; sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; padding:14px 32px; border-radius:4px; border:none; cursor:pointer; transition:all 0.25s ease; }
    .btn-primary:hover { background:#96281b; transform:translate(-2px,-2px); box-shadow:4px 4px 0 #96281b44; }
    .btn-outline { display:inline-flex; align-items:center; gap:10px; background:transparent; color:#c0392b; sans-serif; font-weight:700; font-size:13px; letter-spacing:0.04em; padding:12px 28px; border-radius:4px; border:2px solid #c0392b; cursor:pointer; transition:all 0.25s ease; }
    .btn-outline:hover { background:#c0392b; color:#fff; transform:translate(-2px,-2px); }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:#faf3e4; }
    ::-webkit-scrollbar-thumb { background:#c0392b; border-radius:3px; }
    .hscroll { scrollbar-width:thin; scrollbar-color:#c0392b #faf3e4; }
    @keyframes spc-pulse {
      0%,100%{opacity:1;transform:scale(1)}
      50%{opacity:0.5;transform:scale(0.7)}
    }
  `}</style>
)

/* ─── Static data ───────────────────────────────────────────────────────── */
const categories = [
  { name: "Sparklers",             icon: Sparkles,  description: "Cascading golden showers for intimate celebrations" },
  { name: "Rockets",               icon: Rocket,    description: "Sky-piercing bursts of aerial brilliance" },
  { name: "Single Sound Crackers", icon: Volume2,   description: "Crisp festive reports with traditional character" },
  { name: "Atom Bombs",            icon: Bomb,      description: "Earth-shaking percussion for grand occasions" },
  { name: "Ground Chakkars",       icon: Disc,      description: "Whirling rings of light at ground level" },
  { name: "Sky Shots",             icon: CloudSun,  description: "Magnificent aerial canvases across the night sky" },
]
const statsData = [
  { label:"Customer Satisfaction", value:100, icon:Heart,    suffix:"%" },
  { label:"Products Available",    value:200, icon:Sparkles, suffix:"+" },
  { label:"Happy Clients",         value:500, icon:SmilePlus,suffix:"+" },
  { label:"Years of Experience",   value:15,  icon:Clock,    suffix:"+" },
]
const navLinks = ["Home","About Us","Price List","Safety Tips","Contact Us"]

/* ─── Utility ───────────────────────────────────────────────────────────── */
const genPositions = (count) => {
  const positions = []
  const sw = typeof window !== "undefined" ? window.innerWidth  : 1920
  const sh = typeof window !== "undefined" ? window.innerHeight : 1080
  if (sw < 768) {
    for (let i = 0; i < count; i++) positions.push({ x:0, y: -sh*0.2 + i*120 })
  } else {
    const pad=150, mx=sw-pad*2, my=sh-pad*2
    for (let i=0;i<count;i++){
      let p,ok=false,t=0
      while(!ok&&t<50){ p={x:Math.random()*mx-mx/2,y:Math.random()*my-my/2}; ok=positions.every(e=>Math.hypot(p.x-e.x,p.y-e.y)>=200); t++ }
      if(p) positions.push(p)
    }
  }
  return positions
}

/* ══════════════════════════════════════════════════════
   INTRO LOADER
   ══════════════════════════════════════════════════════ */
const LOADER_PALETTES = [
  ["rgb(192,57,43)","rgb(231,76,60)","rgb(255,180,120)","rgb(255,220,160)"],
  ["rgb(230,126,34)","rgb(243,156,18)","rgb(255,200,60)","rgb(255,240,180)"],
  ["rgb(142,68,173)","rgb(155,89,182)","rgb(210,160,220)","rgb(240,220,255)"],
  ["rgb(192,57,43)","rgb(255,120,80)","rgb(255,200,100)","rgb(255,255,200)"],
]
const ROCKET_SCHEDULE = [400, 1200, 2100, 3000, 3900]
const LOADER_DURATION = 4800

class LoaderParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 4
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed - 1
    this.alpha   = 1
    this.radius  = 1.5 + Math.random() * 2
    this.color   = color
    this.decay   = 0.012 + Math.random() * 0.015
    this.gravity = 0.07
    this.trail   = []
  }
  update() {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha })
    if (this.trail.length > 6) this.trail.shift()
    this.vy += this.gravity
    this.x  += this.vx
    this.y  += this.vy
    this.alpha -= this.decay
    this.vx *= 0.98
  }
  draw(ctx) {
    for (let i = 0; i < this.trail.length; i++) {
      const t  = this.trail[i]
      const ta = t.a * (i / this.trail.length) * 0.35
      ctx.beginPath()
      ctx.arc(t.x, t.y, this.radius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = this.color.replace(")", `,${ta})`).replace("rgb", "rgba")
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color.replace(")", `,${this.alpha})`).replace("rgb", "rgba")
    ctx.fill()
  }
}

class LoaderRocket {
  constructor(W, H) {
    this.x  = W * 0.2 + Math.random() * W * 0.6
    this.y  = H + 10
    this.tx = W * 0.2 + Math.random() * W * 0.6
    this.ty = H * 0.15 + Math.random() * H * 0.4
    const dist  = Math.hypot(this.tx - this.x, this.ty - this.y)
    const speed = 6
    this.vx    = (this.tx - this.x) / dist * speed
    this.vy    = (this.ty - this.y) / dist * speed
    this.trail = []
    this.burst = false
  }
  update(particles) {
    if (this.burst) return
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 12) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    if (this.y <= this.ty) {
      this.burst = true
      const pal   = LOADER_PALETTES[Math.floor(Math.random() * LOADER_PALETTES.length)]
      const count = 55 + Math.floor(Math.random() * 30)
      for (let i = 0; i < count; i++)
        particles.push(new LoaderParticle(this.x, this.y, pal[Math.floor(Math.random() * pal.length)]))
    }
  }
  draw(ctx) {
    if (this.burst) return
    this.trail.forEach((t, i) => {
      const a = (i / this.trail.length) * 0.5
      ctx.beginPath()
      ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,200,100,${a})`
      ctx.fill()
    })
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
  }
}

function IntroLoader({ onComplete }) {
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const startRef    = useRef(null)
  const rocketsRef  = useRef([])
  const particlesRef= useRef([])

  const [progress, setProgress] = useState(0)
  const [ready,    setReady   ] = useState(false)
  const [exiting,  setExiting ] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    let W, H

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let scheduleIdx = 0

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current

      ctx.fillStyle = "rgba(13,10,6,0.22)"
      ctx.fillRect(0, 0, W, H)

      while (scheduleIdx < ROCKET_SCHEDULE.length && elapsed >= ROCKET_SCHEDULE[scheduleIdx]) {
        rocketsRef.current.push(new LoaderRocket(W, H))
        scheduleIdx++
      }

      rocketsRef.current.forEach(r => { r.update(particlesRef.current); r.draw(ctx) })

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        particlesRef.current[i].update()
        particlesRef.current[i].draw(ctx)
        if (particlesRef.current[i].alpha <= 0) particlesRef.current.splice(i, 1)
      }

      const p = Math.min(100, Math.round((elapsed / LOADER_DURATION) * 100))
      setProgress(p)
      if (p >= 100) setReady(true)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  const exit = () => {
    setExiting(true)
    setTimeout(() => { onComplete?.() }, 700)
  }

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(exit, 1000)
    return () => clearTimeout(t)
  }, [ready]) // eslint-disable-line

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: "easeInOut" } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#0d0a06",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.4)",
              color: "#e08070", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.22em", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 100, marginBottom: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#c0392b",
                animation: "spc-pulse 1.4s ease infinite", display: "inline-block",
              }}/>
              Sivakasi · Est. 2009
            </div>

            <h1 style={{
              fontWeight: 800,
              fontSize: "clamp(2rem,6vw,3rem)", color: "#fff",
              lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 6,
            }}>
              Sree Palaniyappa<br/>
              <span style={{ color: "#c0392b" }}>Crackers</span>
            </h1>

            <p style={{
              fontFamily: "'Lora', serif", fontStyle: "italic",
              fontSize: 15, color: "rgba(255,255,255,0.4)",
              marginBottom: 32, letterSpacing: "0.01em",
            }}>
              "Every burst of light is a memory made"
            </p>

            <div style={{
              width: 220, height: 2, background: "rgba(255,255,255,0.08)",
              borderRadius: 2, margin: "0 auto 10px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", background: "#c0392b", borderRadius: 2,
                width: progress + "%", transition: "width 0.06s linear",
              }}/>
            </div>
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.3)",
              fontWeight: 600, letterSpacing: "0.1em",
              fontFamily: "'Barlow', sans-serif", marginBottom: 8,
            }}>
              {progress < 100 ? progress + "%" : "Welcome!"}
            </div>

            <AnimatePresence>
              {ready && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={exit}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    background: "#c0392b", color: "#fff",
                    fontWeight: 700,
                    fontSize: 13, letterSpacing: "0.06em",
                    padding: "12px 28px", borderRadius: 4, border: "none",
                    cursor: "pointer", marginTop: 8,
                  }}
                >
                  Enter the Store →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Firework ──────────────────────────────────────────────────────────── */
const Firework = ({ delay=0,startPosition,endPosition,burstPosition,colors,onBurstComplete,promocode,onCopyPromo,copiedPromos }) => {
  const sw = typeof window!=="undefined" ? window.innerWidth : 1920
  useEffect(() => {
    if(onBurstComplete){ const t=setTimeout(onBurstComplete,delay+3000); return ()=>clearTimeout(t) }
  },[delay,onBurstComplete])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div className="absolute w-3 h-8 rounded-full"
        style={{left:startPosition.x,top:startPosition.y,background:`linear-gradient(180deg,${colors.primary},${colors.secondary},${colors.tertiary})`,boxShadow:`0 0 20px ${colors.primary}`}}
        animate={{x:[0,endPosition.x-startPosition.x],y:[0,endPosition.y-startPosition.y],opacity:[1,1,0],scale:[1,1.2,0.8]}}
        transition={{duration:2,delay,ease:"easeOut"}}/>
      <motion.div className="absolute" style={{left:burstPosition.x,top:burstPosition.y,transform:"translate(-50%,-50%)"}}
        initial={{opacity:0}} animate={{opacity:[0,1,0.8,0]}} transition={{duration:5,delay:delay+2}}>
        {Array.from({length:32}).map((_,i)=>{
          const a=i*11.25*Math.PI/180,d=sw<768?sw*0.08:sw*0.15
          return <motion.div key={`p${i}`} className="absolute w-4 h-4 rounded-full"
            style={{background:colors.burst[i%colors.burst.length],boxShadow:`0 0 15px ${colors.burst[i%colors.burst.length]}`}}
            animate={{x:[0,Math.cos(a)*d*0.3,Math.cos(a)*d*0.7,Math.cos(a)*d],y:[0,Math.sin(a)*d*0.3,Math.sin(a)*d*0.7,Math.sin(a)*d],opacity:[1,0.9,0.5,0],scale:[1,1.3,0.8,0]}}
            transition={{duration:4,delay:delay+2,ease:"easeOut"}}/>
        })}
        {Array.from({length:48}).map((_,i)=>{
          const a=i*7.5*Math.PI/180,d=sw<768?sw*0.05:sw*0.1
          return <motion.div key={`s${i}`} className="absolute w-2 h-2 rounded-full"
            style={{background:colors.sparkles[i%colors.sparkles.length],boxShadow:`0 0 10px ${colors.sparkles[i%colors.sparkles.length]}`}}
            animate={{x:[0,Math.cos(a)*d*0.4,Math.cos(a)*d*0.8,Math.cos(a)*d*1.2],y:[0,Math.sin(a)*d*0.4,Math.sin(a)*d*0.8,Math.sin(a)*d*1.2],opacity:[1,0.8,0.4,0],scale:[1,0.8,0.4,0]}}
            transition={{duration:3.5,delay:delay+2.3,ease:"easeOut"}}/>
        })}
        <motion.div className="absolute w-40 h-40 rounded-full"
          style={{background:`radial-gradient(circle,${colors.center}aa 0%,${colors.secondary}66 30%,transparent 70%)`,transform:"translate(-50%,-50%)"}}
          animate={{scale:[0,4,2,0],opacity:[0,1,0.3,0]}} transition={{duration:2.5,delay:delay+2,ease:"easeOut"}}/>
      </motion.div>
      {promocode && !copiedPromos.includes(promocode.code) && (
        <motion.div initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:delay+4,duration:0.5}}
          className="absolute pointer-events-auto px-6 py-4 rounded-2xl font-bold text-lg"
          style={{left:burstPosition.x,top:burstPosition.y,transform:"translate(-50%,-50%)",background:"#fff",border:`3px solid ${C.crimson}`,boxShadow:`6px 6px 0 ${C.crimson},0 0 40px rgba(192,57,43,0.2)`,zIndex:45,maxWidth:sw<768?"260px":"auto"}}>
          <div className="flex items-center gap-3">
            <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:"linear"}}>
              <Gift className="w-6 h-6" style={{color:C.crimson}}/>
            </motion.div>
            <div className="text-center">
              <div className="font-extrabold text-xl" style={{color:C.crimson,letterSpacing:"0.08em"}}>{promocode.code}</div>
              <div className="px-3 py-1 rounded-full text-sm font-bold mt-1" style={{background:C.saffron,color:"#fff"}}>{promocode.discount}% OFF</div>
            </div>
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
              onClick={()=>{navigator.clipboard.writeText(promocode.code);onCopyPromo(promocode.code)}}
              className="p-2 rounded-lg transition-all" style={{background:`rgba(192,57,43,0.08)`,border:`1px solid rgba(192,57,43,0.25)`}}>
              <Copy className="w-4 h-4" style={{color:C.crimson}}/>
            </motion.button>
          </div>
          {Array.from({length:6}).map((_,k)=>(
            <motion.div key={k}
              animate={{scale:[0,1,0],rotate:[0,360],x:[0,Math.cos(k*60)*25,0],y:[0,Math.sin(k*60)*25,0]}}
              transition={{duration:2,repeat:Infinity,delay:k*0.2}}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{background:C.saffron,boxShadow:`0 0 8px ${C.saffron}`}}/>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/* ─── Rocket Badge Animation ────────────────────────────────────────────── */
const RocketBadgeAnimation = ({ isActive,onComplete,promocodes,onCopyPromo,copiedPromos }) => {
  const [fw,setFw] = useState([])
  const [done,setDone] = useState(false)
  const [showX,setShowX] = useState(false)
  const [triggered,setTriggered] = useState(false)
  const [positions,setPositions] = useState([])
  const sw = typeof window!=="undefined"?window.innerWidth:1920
  const sh = typeof window!=="undefined"?window.innerHeight:1080
  const palettes = [
    {primary:C.crimson,secondary:C.crimsonL,tertiary:"#f1948a",center:C.crimson,burst:["#c0392b","#e74c3c","#f1948a","#fad7a0","#fadbd8"],sparkles:["#fff","#fde8e8","#f5b7b1","#e74c3c"]},
    {primary:C.saffron,secondary:C.saffronL,tertiary:"#fad7a0",center:C.saffron,burst:["#e67e22","#f39c12","#f7dc6f","#fdebd0","#fef9e7"],sparkles:["#fff","#fef9e7","#f7dc6f","#f39c12"]},
    {primary:C.ember,secondary:C.saffron,tertiary:"#f7dc6f",center:C.ember,burst:["#d35400","#e67e22","#f39c12","#fad7a0","#fef9e7"],sparkles:["#fff","#fef5e7","#f5cba7","#e67e22"]},
    {primary:"#8e44ad",secondary:"#9b59b6",tertiary:"#bb8fce",center:"#8e44ad",burst:["#8e44ad","#9b59b6","#bb8fce","#d7bde2","#e8daef"],sparkles:["#fff","#f5eef8","#d7bde2","#9b59b6"]},
  ]
  useEffect(()=>{ if(promocodes.length>0) setPositions(genPositions(promocodes.length)) },[promocodes.length])
  useEffect(()=>{
    if(isActive&&promocodes.length>0&&!triggered){ setTriggered(true); fire(0) }
  },[isActive,promocodes.length,triggered])
  const fire = idx => {
    if(idx>=promocodes.length){ setTimeout(()=>{setDone(true);onComplete()},1000); return }
    const pos=positions[idx]||{x:0,y:0}, burst={x:sw/2+pos.x,y:sh/2+pos.y}
    setFw(p=>[...p,{index:idx,startPosition:{x:sw/2,y:sh-100},endPosition:burst,burstPosition:burst,colors:palettes[idx%palettes.length],promocode:promocodes[idx]}])
    if(idx===0) setShowX(true)
    setTimeout(()=>fire(idx+1),3000)
  }
  const closeAll = () => { setFw([]); setShowX(false); promocodes.forEach(p=>{ if(!copiedPromos.includes(p.code)) onCopyPromo(p.code) }) }
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 pointer-events-none z-40">
          {showX && (
            <motion.button initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}}
              whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={closeAll}
              className="fixed top-8 right-8 z-50 pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
              style={{background:C.crimson,color:"#fff",border:"3px solid #fff"}}>
              <X className="w-6 h-6"/>
            </motion.button>
          )}
          {fw.map(f=>(
            <Firework key={`fw-${f.index}`} delay={0}
              startPosition={f.startPosition} endPosition={f.endPosition}
              burstPosition={f.burstPosition} colors={f.colors}
              promocode={f.promocode} onCopyPromo={onCopyPromo} copiedPromos={copiedPromos}/>
          ))}
          {done && (
            <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:1}}
              className="fixed bottom-8 right-8 z-50 pointer-events-auto">
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                onClick={()=>window.location.href="/price-list"} className="btn-primary shadow-2xl">
                <ShoppingCart className="w-5 h-5"/> Shop the Collection <ArrowRight className="w-5 h-5"/>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Carousel ──────────────────────────────────────────────────────────── */
const ModernCarousel = ({ media }) => {
  const [idx,setIdx] = useState(0)
  const tx = useRef(null)
  const items = useMemo(()=>{
    const raw = media&&typeof media==="string"?JSON.parse(media):Array.isArray(media)?media:[]
    return raw.sort((a,b)=>{
      const pri=s=>s.startsWith("data:video/")?2:s.startsWith("data:image/gif")||s.endsWith(".gif")?1:0
      return pri(typeof a==="string"?a:"")-pri(typeof b==="string"?b:"")
    })
  },[media])
  const isVid=s=>typeof s==="string"&&s.startsWith("data:video/")
  const prev=()=>setIdx(i=>i===0?items.length-1:i-1)
  const next=()=>setIdx(i=>i===items.length-1?0:i+1)
  if(!items.length) return (
    <div className="w-full h-52 rounded-lg mb-4 overflow-hidden flex items-center justify-center"
      style={{background:C.cream,border:`1px solid ${C.border}`}}>
      <img src={need} alt="placeholder" className="object-contain h-full"/>
    </div>
  )
  return (
    <div className="relative w-full h-52 rounded-lg mb-4 overflow-hidden group"
      style={{border:`1px solid ${C.border}`}}
      onTouchStart={e=>{tx.current=e.touches[0].clientX}}
      onTouchMove={e=>{ if(!tx.current)return; const d=tx.current-e.touches[0].clientX; if(Math.abs(d)>50){d>0?next():prev();tx.current=null} }}
      onTouchEnd={()=>{tx.current=null}}>
      <div className="absolute inset-0" style={{background:C.cream}}/>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.35}} className="absolute inset-0">
          {isVid(items[idx])
            ? <video src={items[idx]} autoPlay muted loop className="w-full h-full object-cover"/>
            : <img src={items[idx]||"/placeholder.svg"} alt="Product" className="w-full h-full object-cover"/>}
        </motion.div>
      </AnimatePresence>
      {items.length>1&&(
        <>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background:"rgba(0,0,0,0.12)"}}/>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{background:"rgba(255,255,255,0.92)",border:`1px solid ${C.border}`}}>
            <FaArrowLeft style={{color:C.crimson,fontSize:"11px"}}/>
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{background:"rgba(255,255,255,0.92)",border:`1px solid ${C.border}`}}>
            <FaArrowRight style={{color:C.crimson,fontSize:"11px"}}/>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_,i)=>(
              <button key={i} onClick={()=>setIdx(i)} className="w-2 h-2 rounded-full transition-all"
                style={{background:i===idx?C.crimson:"rgba(192,57,43,0.3)"}}/>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon:Icon,value,label,suffix,delay }) {
  const [count,setCount] = useState(0)
  const [ref,inView] = useInView({triggerOnce:true,threshold:0.3})
  useEffect(()=>{
    if(inView&&count===0){
      let s=0; const t=setInterval(()=>{ s+=Math.ceil(value/100); if(s>=value){setCount(value);clearInterval(t)}else setCount(s) },Math.max(Math.floor(2000/value),20))
    }
  },[inView,value,count])
  return (
    <motion.div ref={ref} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.6,delay}} viewport={{once:true}}
      className="group relative overflow-hidden text-center"
      style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"8px",padding:"2rem 1.5rem",transition:"all 0.3s ease",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.crimson;e.currentTarget.style.transform="translate(-4px,-4px)";e.currentTarget.style.boxShadow=`6px 6px 0 ${C.crimson}`}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      <div className="absolute -top-1 -right-2 font-extrabold pointer-events-none select-none"
        style={{color:`rgba(192,57,43,0.05)`,fontSize:"5rem",lineHeight:1}}>{value}</div>
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto transition-transform duration-300 group-hover:scale-110"
          style={{background:`rgba(192,57,43,0.07)`,border:`1.5px dashed rgba(192,57,43,0.3)`}}>
          <Icon className="w-7 h-7" style={{color:C.crimson}}/>
        </div>
        <div className="mb-1">
          <span style={{fontWeight:800,fontSize:"2.5rem",color:C.crimson,lineHeight:1}}>{count}</span>
          <span style={{fontWeight:800,fontSize:"1.5rem",color:C.saffron,lineHeight:1}}>{suffix}</span>
        </div>
        <p style={{fontWeight:600,fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:C.slate}}>{label}</p>
      </div>
    </motion.div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function Home() {
  const [loaded,setLoaded]             = useState(false)   // ← intro loader
  const [banners,setBanners]           = useState([])
  const [slide,setSlide]               = useState(0)
  const [fastRunning,setFastRunning]   = useState([])
  const [selProduct,setSelProduct]     = useState(null)
  const [showModal,setShowModal]       = useState(false)
  const [promocodes,setPromocodes]     = useState([])
  const [showRocket,setShowRocket]     = useState(false)
  const [copiedPromos,setCopiedPromos] = useState([])
  const [launched,setLaunched]         = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({target:containerRef,offset:["start start","end start"]})
  const heroY       = useTransform(scrollYProgress,[0,1],["0%","25%"])
  const heroOpacity = useTransform(scrollYProgress,[0,0.3],[1,0])
  const navigate = useNavigate()

  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/banners`).then(r=>r.json()).then(d=>setBanners(d.filter(b=>b.is_active))).catch(console.error)
    const i=setInterval(()=>fetch(`${API_BASE_URL}/api/banners`).then(r=>r.json()).then(d=>setBanners(d.filter(b=>b.is_active))),1200000)
    return()=>clearInterval(i)
  },[])
  useEffect(()=>{
    const load=()=>fetch(`${API_BASE_URL}/api/products`).then(r=>r.json()).then(d=>setFastRunning(d.data.filter(p=>p.fast_running))).catch(console.error)
    load(); const i=setInterval(load,5000); return()=>clearInterval(i)
  },[])
  useEffect(()=>{
    const load=()=>fetch(`${API_BASE_URL}/api/promocodes`).then(r=>r.json()).then(d=>setPromocodes(d.filter(p=>p.is_active!==false))).catch(console.error)
    load(); const i=setInterval(load,30000); return()=>clearInterval(i)
  },[])
  useEffect(()=>{
    if(banners.length>1){ const i=setInterval(()=>setSlide(p=>(p+1)%banners.length),5000); return()=>clearInterval(i) }
  },[banners])

  /* ── Show loader on first visit ── */
  if (!loaded) return <IntroLoader onComplete={() => setLoaded(true)} />

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden" style={{background:C.ivory,color:C.ink}}>
      <GlobalStyles/>
      <Navbar/>

      <RocketBadgeAnimation isActive={showRocket} onComplete={()=>{}}
        promocodes={promocodes} onCopyPromo={code=>setCopiedPromos(p=>[...p,code])} copiedPromos={copiedPromos}/>

      {/* ── Product modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal&&selProduct&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:"rgba(28,28,30,0.55)",backdropFilter:"blur(6px)"}}
            onClick={()=>{setShowModal(false);setSelProduct(null)}}>
            <motion.div initial={{scale:0.85,y:30}} animate={{scale:1,y:0}} exit={{scale:0.85,y:30}}
              onClick={e=>e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{background:"#fff",border:`2px solid ${C.crimson}`,borderRadius:"8px",boxShadow:`8px 8px 0 ${C.crimson}`}}>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="display text-2xl mb-2" style={{color:C.ink}}>{selProduct.productname}</h2>
                    <div className="flex items-center gap-3">
                      <span className="pill pill-saffron">{selProduct.discount}% OFF</span>
                      <span className="display text-2xl" style={{color:C.crimson}}>₹{((selProduct.price*(100-selProduct.discount))/100).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={()=>{setShowModal(false);setSelProduct(null)}}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
                    style={{background:`rgba(192,57,43,0.08)`,color:C.crimson,border:`1px solid rgba(192,57,43,0.25)`}}>×</button>
                </div>
                <ModernCarousel media={selProduct.image}/>
                <h3 className="text-base font-semibold mb-2" style={{color:C.ink,}}>About this product</h3>
                <p className="mb-6 leading-relaxed" style={{color:C.slate,fontSize:"15px"}}>
                  {selProduct.description||"A premium quality firework crafted for your most memorable celebrations."}
                </p>
                <button onClick={()=>navigate("/price-list")} className="btn-primary w-full justify-center">
                  Send Enquiry <ArrowRight className="w-5 h-5"/>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════ HERO ════════════════════════════════════ */}
      <motion.section style={{y:heroY,opacity:heroOpacity}} className="relative hundred:pt-32 mobile:pt-10 pb-0 px-4 sm:px-8 lg:px-12">
        <div className="hundred:max-w-6xl mobile:-auto mx-auto">
          {/* Banner */}
          <div 
            className="relative rounded-t-2xl overflow-hidden w-full mobile:max-h-[140px] hundred:max-h-[100%]"
            style={{
              height: "clamp(160px, 45vw, 390px)", 
              border: `2px solid ${C.borderD}`,
              borderBottom: "none",
              boxShadow: `6px 6px 0 ${C.crimson}`,
              maxWidth: "100%"
            }}
          >
            <AnimatePresence mode="wait">
              {banners.map((b, i) => slide === i && (
                <motion.div 
                  key={b.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.9 }} 
                  className="absolute inset-0"
                >
                  <img 
                    src={b.image_url.startsWith("https") ? b.image_url : `${API_BASE_URL}${b.image_url}`} 
                    alt={`Banner ${b.id}`} 
                    className="w-full h-full object-contain bg-[#f5e9c9]"   // ← Changed to contain
                    style={{ 
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      margin: "0 auto"
                    }}
                  />
                  <div className="absolute inset-0" 
                    style={{background: "linear-gradient(to right, rgba(28,28,30,0.35) 0%, transparent 65%)"}}/>
                </motion.div>
              ))}
            </AnimatePresence>

            {banners.length > 1 && (
              <div className="absolute bottom-5 right-6 flex gap-2 z-10">
                {banners.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSlide(i)} 
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === slide ? "32px" : "8px",
                      background: i === slide ? C.crimson : "rgba(255,255,255,0.5)"
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats ribbon */}
          <div className="grid grid-cols-4 divide-x" style={{background:C.crimson,borderRadius:"0 0 12px 12px",boxShadow:`6px 4px 0 ${C.crimsonD}`}}>
            {[["200+","Products"],["500+","Clients"],["100%","Satisfaction"],["15+","Years"]].map(([v,l],i)=>(
              <div key={i} className="py-4 text-center" style={{borderRight:i<3?"1px solid rgba(255,255,255,0.2)":undefined}}>
                <div className="font-extrabold text-xl text-white">{v}</div>
                <div className="text-xs text-white" style={{opacity:0.7,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow',sans-serif"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════ FAST RUNNING ════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 stripe-bg" style={{background:C.cream}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="label mb-2">Flying off the shelves</p>
              <h2 className="display" style={{fontSize:"clamp(2rem,4vw,3rem)",color:C.ink}}>Fast-Running<br/>Favourites</h2>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <div style={{width:"48px",height:"3px",background:C.crimson,borderRadius:"2px"}}/>
              <div style={{width:"16px",height:"3px",background:C.saffron,borderRadius:"2px"}}/>
              <div style={{width:"8px",height:"3px",background:C.parchment,borderRadius:"2px"}}/>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory hscroll">
            {fastRunning.map((product,i)=>{
              const orig=parseFloat(product.price)
              const final=(orig-orig*product.discount/100).toFixed(2)
              return (
                <motion.div key={product.serial_number}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.08}} viewport={{once:true}}
                  className="flex-none w-[272px] snap-center"
                  style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"hidden",transition:"all 0.28s ease"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.crimson;e.currentTarget.style.transform="translate(-4px,-4px)";e.currentTarget.style.boxShadow=`6px 6px 0 ${C.crimson}`}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div className="relative">
                    <ModernCarousel media={product.image}/>
                    <div className="absolute top-3 left-3"><span className="pill">{product.discount}% OFF</span></div>
                    <button onClick={()=>{setSelProduct(product);setShowModal(true)}}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{background:"#fff",border:`1px solid ${C.border}`}}>
                      <FaInfoCircle style={{color:C.crimson,fontSize:"14px"}}/>
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-3 line-clamp-2" style={{color:C.ink}}>{product.productname}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-sm line-through" style={{color:C.muted}}>₹{orig}</span>
                      <span className="display text-2xl" style={{color:C.crimson}}>₹{final}</span>
                      <span className="text-xs" style={{color:C.muted}}>/{product.per}</span>
                    </div>
                    <button onClick={()=>navigate("/price-list")} className="btn-primary w-full justify-center text-sm" style={{padding:"10px 16px"}}>
                      Enquire Now <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════ ABOUT ═══════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 lg:px-12" style={{background:C.ivory}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} transition={{duration:0.7}} viewport={{once:true}} className="relative">
              <div className="relative rounded-lg overflow-hidden" style={{border:`2px solid ${C.borderD}`}}>
                <img src={about||"/placeholder.svg"} alt="Sree Palaniyappa Crackers" className="w-full h-96 object-cover" style={{display:"block"}}/>
                <div className="absolute inset-0" style={{background:"linear-gradient(135deg,rgba(192,57,43,0.06) 0%,transparent 60%)"}}/>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-lg -z-10"
                style={{border:`2px solid ${C.parchment}`,background:C.parchment}}/>
              <div className="absolute -top-5 -left-5 w-20 h-20 rounded-full flex flex-col items-center justify-center"
                style={{background:C.crimson,border:"4px solid #fff",boxShadow:`4px 4px 0 ${C.crimsonD}`}}>
                <span className="text-white font-extrabold text-xl leading-none">15</span>
                <span className="text-white text-xs" style={{opacity:0.85,letterSpacing:"0.1em"}}>YRS</span>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} transition={{duration:0.7}} viewport={{once:true}} className="space-y-6">
              <div>
                <p className="label mb-3">Our Heritage</p>
                <h2 className="display mb-3" style={{fontSize:"clamp(2rem,3.5vw,2.75rem)",color:C.ink}}>
                  Welcome to<br/><span style={{color:C.crimson}}>Sree Palaniyappa<br/>Crackers</span>
                </h2>
              </div>
              <div className="space-y-4" style={{color:C.slate,fontSize:"16px",lineHeight:1.8}}>
                <p>Sree Palaniyappa Crackers has grown from a passionate hobby into one of Sivakasi's most trusted fireworks establishments — built entirely on the joy of customer celebrations.</p>
                <p>We deliver uncompromising quality at the most competitive pricing in town, making every festival, wedding, and milestone a night to remember.</p>
                <p>From manufacturing through wholesale to retail, we stand as a name synonymous with safety, brilliance, and the very best crackers Sivakasi has to offer.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg"
                style={{background:`rgba(230,126,34,0.07)`,border:`1.5px solid rgba(230,126,34,0.25)`}}>
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{color:C.saffron}}/>
                <p className="text-sm" style={{color:C.slate}}>We don't support online shopping. Products listed are for reference only — contact us to place your order directly.</p>
              </div>
              <button onClick={()=>navigate("/about-us")} className="btn-outline">Our Full Story <ArrowRight className="w-4 h-4"/></button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORIES ══════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 lg:px-12" style={{background:C.cream}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="label mb-2">Browse by type</p>
              <h2 className="display" style={{fontSize:"clamp(2rem,4vw,3rem)",color:C.ink}}>The Full<br/>Collection</h2>
            </div>
            <p className="serif italic" style={{color:C.muted,maxWidth:"260px",lineHeight:1.65,fontSize:"15px"}}>
              Six distinct categories, each with its own character
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(({name,icon:Icon,description},i)=>(
              <motion.div key={i}
                initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.1}} viewport={{once:true}}
                style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"8px",padding:"2rem",cursor:"pointer",transition:"all 0.28s ease"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.crimson;e.currentTarget.style.transform="translate(-4px,-4px)";e.currentTarget.style.boxShadow=`6px 6px 0 ${C.crimson}`}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{background:`rgba(192,57,43,0.07)`,border:`1.5px dashed ${C.crimson}`}}>
                    <Icon className="w-7 h-7" style={{color:C.crimson}}/>
                  </div>
                  <span style={{fontSize:"3rem",fontWeight:800,color:`rgba(192,57,43,0.07)`,lineHeight:1}}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                </div>
                <h3 className="font-extrabold text-lg mb-2" style={{color:C.ink}}>{name}</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{color:C.muted}}>{description}</p>
                <button onClick={()=>navigate("/price-list")} className="btn-outline text-sm" style={{padding:"8px 20px"}}>
                  Explore <ArrowRight className="w-4 h-4"/>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ═════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 relative overflow-hidden" style={{background:C.crimson}}>
        <div className="absolute inset-0 pointer-events-none"
          style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.09) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="display text-white" style={{fontSize:"clamp(5rem,18vw,16rem)",opacity:0.05,whiteSpace:"nowrap",letterSpacing:"-0.04em"}}>DIWALI</span>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}>
            <p className="mb-4" style={{fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>Order Now · Fast Delivery</p>
            <h2 className="display text-white mb-6" style={{fontSize:"clamp(2.5rem,6vw,5rem)"}}>
              Light Up Your<br/>Grandest Moment
            </h2>
            <p className="mb-10 text-white mx-auto max-w-xl" style={{opacity:0.8,fontSize:"17px",fontFamily:"'Lora',serif",fontStyle:"italic",lineHeight:1.7}}>
              Browse our complete range, select what dazzles you, and send an enquiry — we'll respond within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={()=>navigate("/price-list")}
                className="inline-flex items-center gap-3 px-10 py-4 rounded font-bold transition-all duration-250"
                style={{background:"#fff",color:C.crimson,fontWeight:800,fontSize:"15px",letterSpacing:"0.04em",boxShadow:`4px 4px 0 ${C.crimsonD}`}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translate(-2px,-2px)";e.currentTarget.style.boxShadow=`6px 6px 0 ${C.crimsonD}`}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`4px 4px 0 ${C.crimsonD}`}}>
                View Full Price List <ArrowRight className="w-5 h-5"/>
              </button>
              <button onClick={()=>navigate("/contact-us")}
                className="inline-flex items-center gap-3 px-10 py-4 rounded font-bold transition-all"
                style={{background:"transparent",color:"#fff",border:"2px solid rgba(255,255,255,0.55)",fontWeight:700,fontSize:"15px",letterSpacing:"0.04em"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ STATS ════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 lg:px-12" style={{background:C.ivory}}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7}} viewport={{once:true}} className="text-center mb-14">
            <p className="label mb-2">By the numbers</p>
            <h2 className="display" style={{fontSize:"clamp(2rem,4vw,3rem)",color:C.ink}}>Trust Earned Over<br/>Decades</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {statsData.map((s,i)=><StatCard key={i} {...s} delay={i*0.15}/>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════════════════ */}
      <footer style={{background:C.charcoal,color:"rgba(255,255,255,0.6)",borderTop:`4px solid ${C.crimson}`}}>
        <div className="px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between" style={{background:C.crimson}}>
          <span className="text-white font-extrabold text-lg" style={{fontFamily:"'Syne',sans-serif",letterSpacing:"0.08em"}}>Sree Palaniyappa Cracakers</span>
          <span className="text-white text-xs" style={{opacity:0.8,fontFamily:"'Barlow',sans-serif",letterSpacing:"0.15em"}}>SIVAKASI · EST. 2009</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-14 mobile:mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7}} viewport={{once:true}}>
              <h3 className="text-white font-extrabold text-xl mb-4" style={{fontFamily:"'Syne',sans-serif"}}>About Us</h3>
              <p className="text-sm leading-relaxed mb-6" style={{color:"rgba(255,255,255,0.45)",lineHeight:1.8}}>Products crafted to your specifications. Dedicated to making every celebration extraordinary since 2009.</p>
              <button onClick={()=>navigate("/about-us")}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{color:C.saffronL,fontFamily:"'Syne',sans-serif"}}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                onMouseLeave={e=>e.currentTarget.style.color=C.saffronL}>
                Read more <ArrowRight className="w-4 h-4"/>
              </button>
            </motion.div>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}} viewport={{once:true}}>
              <h3 className="text-white font-extrabold text-xl mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Contact</h3>
              <div className="space-y-3 text-sm" style={{color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>
                <p><span className="text-white font-semibold">Shop:</span><br/>Vaanakkar street, Salem, Tamil Nadu</p>
                <a href="tel:+918124259430" className="block hover:text-white transition-colors">+91 81242 59430</a>
                <a href="mailto:sreepalaniyappacrackers@gmail.com" className="hover:text-white transition-colors">sreepalaniyappacrackers@gmail.com</a>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}} viewport={{once:true}}>
              <h3 className="text-white font-extrabold text-xl mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map(link=>(
                  <li key={link}>
                    <a href={link==="Home"?`/`:`/${link.toLowerCase().replace(/ /g,"-")}`}
                      className="text-sm flex items-center gap-2 transition-colors"
                      style={{color:"rgba(255,255,255,0.4)"}}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                      onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
                      <span style={{color:C.crimson}}>→</span> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:"2rem",textAlign:"center"}}>
            <p className="text-xs leading-relaxed mb-3 mx-auto" style={{color:"rgba(255,255,255,0.28)",maxWidth:"640px"}}>
              As per the 2018 Supreme Court order, online sale of firecrackers is not permitted. All products listed are for reference only. Submit your enquiry — our team will contact you within 24 hours.
            </p>
            <p className="text-xs" style={{color:"rgba(255,255,255,0.28)"}}>
              © 2025 <span style={{color:C.saffronL}}>Sree Palaniyappa Crackers</span>. All rights reserved.{" "}
              Developed by <span style={{color:C.saffronL}}>SPD Solutions</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}