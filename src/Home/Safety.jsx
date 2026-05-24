import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye, Users, Heart, Sparkles, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import Navbar from "../Component/Navbar"
import "../App.css"

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const C = {
  ivory:    "#fdf8f0",
  cream:    "#faf3e4",
  parchment:"#f5e9c9",
  crimson:  "#c0392b",
  crimsonD: "#96281b",
  saffron:  "#e67e22",
  saffronL: "#f39c12",
  charcoal: "#1c1c1e",
  ink:      "#2c2c2e",
  slate:    "#4a4a52",
  muted:    "#7c7c88",
  border:   "#e8dcc8",
  borderD:  "#d4c4a0",
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&family=Barlow:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { background: ${C.ivory}; color: ${C.ink}; font-family: 'Barlow', sans-serif; }
    .display { font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }
    .serif   { font-family: 'Lora', serif; }
    .label   { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.crimson}; display: block; }
    .btn-primary { display:inline-flex; align-items:center; gap:10px; background:${C.crimson}; color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; padding:14px 32px; border-radius:4px; border:none; cursor:pointer; transition:all 0.25s ease; text-decoration:none; }
    .btn-primary:hover { background:${C.crimsonD}; transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${C.crimsonD}44; }
    .btn-outline { display:inline-flex; align-items:center; gap:10px; background:transparent; color:${C.crimson}; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.04em; padding:12px 28px; border-radius:4px; border:2px solid ${C.crimson}; cursor:pointer; transition:all 0.25s ease; text-decoration:none; }
    .btn-outline:hover { background:${C.crimson}; color:#fff; transform:translate(-2px,-2px); }
  `}</style>
)

const navLinks = ["Home","About Us","Price List","Safety Tips","Contact Us"]

const dosData = [
  { icon: CheckCircle, num: "01", title: "Follow Instructions", description: "Always read and follow the instructions printed on each firework package carefully before use. Never assume — always verify." },
  { icon: Shield, num: "02", title: "Buy Authorised Products", description: "Purchase fireworks only from licensed and reputable manufacturers like Sree Palaniyappa Crackers to ensure certified quality." },
  { icon: Eye, num: "03", title: "Use Open Spaces Only", description: "Light fireworks only in outdoor areas with ample open space, well away from buildings, trees, and flammable materials." },
  { icon: Users, num: "04", title: "One Person, Safe Distance", description: "Only one designated adult should light fireworks. All others must maintain at least 10 feet of safe distance." },
  { icon: Droplets, num: "05", title: "Keep Water Nearby", description: "Always have water buckets or a garden hose within reach for immediate fire suppression if needed." },
  { icon: Heart, num: "06", title: "Supervise Children", description: "Mandatory adult supervision whenever children are near fireworks. Never leave them unattended — even with sparklers." },
]

const dontsData = [
  { icon: XCircle, num: "01", title: "No Homemade Fireworks", description: "Never attempt to make your own fireworks or modify commercial ones. The risk of catastrophic injury is extremely high." },
  { icon: Flame, num: "02", title: "Never Relight Duds", description: "If a firework fails to ignite, do not attempt to relight it. Wait 30 minutes, then soak it fully in water before disposal." },
  { icon: AlertTriangle, num: "03", title: "Avoid Loose Clothing", description: "Loose, flowing fabric can catch fire instantly. Wear close-fitting cotton clothing when handling fireworks." },
  { icon: XCircle, num: "04", title: "Don't Handle Used Ones", description: "Never pick up used fireworks — they may contain active chemical components and can still cause serious injury." },
  { icon: Shield, num: "05", title: "No Pockets or Damp Storage", description: "Never carry fireworks in your pockets. Avoid storing near heat sources, open flames, or in damp/humid environments." },
  { icon: Eye, num: "06", title: "Never Use Indoors", description: "Fireworks are strictly for outdoor use. Never ignite them inside buildings, vehicles, or any confined/enclosed spaces." },
]

/* ─── Rotating firework backdrop ─────────────────────────────────────────── */
const FireworkBackdrop = () => {
  const sw = typeof window !== "undefined" ? window.innerWidth : 1920
  const sh = typeof window !== "undefined" ? window.innerHeight : 1080
  const configs = [
    { delay: 0, start: { x: -50, y: sh * 0.8 }, burst: { x: sw * 0.2, y: sh * 0.3 }, color: C.crimson },
    { delay: 3, start: { x: sw + 50, y: sh * 0.9 }, burst: { x: sw * 0.8, y: sh * 0.25 }, color: "#9b59b6" },
    { delay: 6, start: { x: sw * 0.1, y: -50 }, burst: { x: sw * 0.4, y: sh * 0.4 }, color: C.saffron },
    { delay: 9, start: { x: sw * 0.9, y: sh + 50 }, burst: { x: sw * 0.6, y: sh * 0.35 }, color: C.saffronL },
  ]
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {configs.map((cfg, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <motion.div style={{ position: "absolute", width: 10, height: 28, borderRadius: "100px", left: cfg.start.x, top: cfg.start.y, background: cfg.color, boxShadow: `0 0 20px ${cfg.color}` }}
            animate={{ x: [0, cfg.burst.x - cfg.start.x], y: [0, cfg.burst.y - cfg.start.y], opacity: [1, 1, 0] }}
            transition={{ duration: 2, delay: cfg.delay, repeat: Infinity, repeatDelay: 12, ease: "easeOut" }} />
          <motion.div style={{ position: "absolute", left: cfg.burst.x, top: cfg.burst.y, transform: "translate(-50%,-50%)" }}
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, delay: cfg.delay + 2, repeat: Infinity, repeatDelay: 10 }}>
            {Array.from({ length: 20 }).map((_, k) => {
              const a = k * 18 * Math.PI / 180
              return (
                <motion.div key={k} style={{ position: "absolute", width: 8, height: 8, borderRadius: "100%", background: cfg.color, boxShadow: `0 0 12px ${cfg.color}` }}
                  animate={{ x: [0, Math.cos(a) * (sw * 0.15)], y: [0, Math.sin(a) * (sw * 0.15)], opacity: [1, 0], scale: [1, 0] }}
                  transition={{ duration: 3.5, delay: cfg.delay + 2, repeat: Infinity, repeatDelay: 10.5, ease: "easeOut" }} />
              )
            })}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export default function Safety() {
  return (
    <div style={{ minHeight: "100vh", background: C.ivory, color: C.ink, overflowX: "hidden", position: "relative" }}>
      <GlobalStyles />
      <FireworkBackdrop />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />

        {/* ══════════════ HERO ═════════════════════════════════════════════ */}
        <section style={{ paddingTop: "8rem", paddingBottom: "4rem", padding: "8rem 1.5rem 4rem", maxWidth: "80rem", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ width: 72, height: 72, background: C.crimson, borderRadius: "8px", boxShadow: `4px 4px 0 ${C.crimsonD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
              <Shield style={{ width: 36, height: 36, color: "#fff" }} />
            </motion.div>
            <span className="label" style={{ marginBottom: "1rem", display: "block" }}>Know Before You Ignite</span>
            <h1 className="display" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: C.ink, marginBottom: "1rem" }}>
              <span style={{ color: C.crimson }}>Safety</span> Guidelines
            </h1>
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.8, duration: 0.8 }}
              style={{ height: 3, background: C.crimson, borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <h2 className="display" style={{ fontSize: "clamp(1.1rem,2.5vw,1.6rem)", color: C.crimson, marginBottom: "1rem" }}>
              Sree Palaniyappa Crackers
            </h2>
            <p className="serif" style={{ fontStyle: "italic", fontSize: "18px", color: C.slate, maxWidth: "640px", margin: "0 auto", lineHeight: 1.75 }}>
              Your safety is our highest priority. Follow these essential guidelines for a joyful, incident-free fireworks experience. A moment of caution prevents a lifetime of regret.
            </p>
          </motion.div>
        </section>

        {/* ══════════════ DO'S ═════════════════════════════════════════════ */}
        <section style={{ padding: "5rem 1.5rem", background: C.cream }} className="stripe-bg">
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ marginBottom: "3.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 56, height: 56, background: "#2e7d32", borderRadius: "8px", boxShadow: `3px 3px 0 #1b5e20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle style={{ width: 28, height: 28, color: "#fff" }} />
                </div>
                <div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#2e7d32", display: "block", marginBottom: 4 }}>Best Practices</span>
                  <h2 className="display" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", color: C.ink }}>Safety Do's</h2>
                </div>
              </div>
              <div style={{ marginTop: "0.75rem", width: 64, height: 3, background: "#2e7d32", borderRadius: 2 }} />
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {dosData.map(({ icon: Icon, num, title, description }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}
                  style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "1.75rem", cursor: "default", transition: "all 0.28s ease", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2e7d32"; e.currentTarget.style.transform = "translate(-4px,-4px)"; e.currentTarget.style.boxShadow = "6px 6px 0 #2e7d32"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ position: "absolute", top: -8, right: -4, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "5rem", color: "rgba(46,125,50,0.05)", lineHeight: 1, userSelect: "none" }}>{num}</div>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 52, height: 52, background: "rgba(46,125,50,0.08)", border: "1.5px dashed #2e7d32", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                      <Icon style={{ width: 24, height: 24, color: "#2e7d32" }} />
                    </div>
                    <h3 className="display" style={{ fontSize: "1.05rem", color: C.ink, marginBottom: "0.6rem" }}>{title}</h3>
                    <p style={{ color: C.slate, fontSize: "13.5px", lineHeight: 1.7 }}>{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ DON'TS ═══════════════════════════════════════════ */}
        <section style={{ padding: "5rem 1.5rem", background: C.ivory }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ marginBottom: "3.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 56, height: 56, background: C.crimson, borderRadius: "8px", boxShadow: `3px 3px 0 ${C.crimsonD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <XCircle style={{ width: 28, height: 28, color: "#fff" }} />
                </div>
                <div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: C.crimson, display: "block", marginBottom: 4 }}>Strict Prohibitions</span>
                  <h2 className="display" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", color: C.ink }}>Safety Don'ts</h2>
                </div>
              </div>
              <div style={{ marginTop: "0.75rem", width: 64, height: 3, background: C.crimson, borderRadius: 2 }} />
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {dontsData.map(({ icon: Icon, num, title, description }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}
                  style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "1.75rem", cursor: "default", transition: "all 0.28s ease", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.transform = "translate(-4px,-4px)"; e.currentTarget.style.boxShadow = `6px 6px 0 ${C.crimson}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ position: "absolute", top: -8, right: -4, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "5rem", color: `rgba(192,57,43,0.05)`, lineHeight: 1, userSelect: "none" }}>{num}</div>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 52, height: 52, background: `rgba(192,57,43,0.07)`, border: `1.5px dashed ${C.crimson}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                      <Icon style={{ width: 24, height: 24, color: C.crimson }} />
                    </div>
                    <h3 className="display" style={{ fontSize: "1.05rem", color: C.ink, marginBottom: "0.6rem" }}>{title}</h3>
                    <p style={{ color: C.slate, fontSize: "13.5px", lineHeight: 1.7 }}>{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ EMERGENCY ════════════════════════════════════════ */}
        <section style={{ padding: "5rem 1.5rem" }}>
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              style={{ background: C.crimson, borderRadius: "8px", padding: "3rem", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: `8px 8px 0 ${C.crimsonD}` }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <AlertTriangle style={{ width: 32, height: 32, color: "#fff" }} />
                </motion.div>
                <h3 className="display" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", color: "#fff", marginBottom: "1.5rem" }}>Emergency Guidelines</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", textAlign: "left" }}>
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "1.5rem", backdropFilter: "blur(4px)" }}>
                    <h4 style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                      <Flame style={{ width: 18, height: 18 }} /> In Case of Fire
                    </h4>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {["Use water or sand to extinguish flames","Never use bare hands to put out fire","Call emergency services immediately","Move away from all unused fireworks"].map(item => (
                        <li key={item} style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "1.5rem", backdropFilter: "blur(4px)" }}>
                    <h4 style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                      <Heart style={{ width: 18, height: 18 }} /> In Case of Injury
                    </h4>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {["Seek immediate medical attention","Do not remove embedded particles","Cool burns with running cold water","Always keep a first aid kit accessible"].map(item => (
                        <li key={item} style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ marginTop: "1.5rem", background: "rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1rem 1.5rem" }}>
                  <p className="serif" style={{ fontStyle: "italic", fontSize: "16px", color: "rgba(255,255,255,0.9)", lineHeight: 1.65 }}>
                    "Safety is not a guideline — it is a responsibility. Celebrate responsibly and create beautiful memories that last."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════════════════════════════════ */}
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
    </div>
  )
}