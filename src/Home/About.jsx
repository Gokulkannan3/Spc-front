import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Target, Eye, Rocket, ArrowRight, Phone, Mail, MapPin, Shield, Star } from "lucide-react"
import Navbar from "../Component/Navbar"
import fire from '../fire.jpg'

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
    .stripe-bg { background-image: repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(192,57,43,0.025) 6px, rgba(192,57,43,0.025) 7px); }
    .btn-primary { display:inline-flex; align-items:center; gap:10px; background:${C.crimson}; color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; padding:14px 32px; border-radius:4px; border:none; cursor:pointer; transition:all 0.25s ease; text-decoration:none; }
    .btn-primary:hover { background:${C.crimsonD}; transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${C.crimsonD}44; }
    .btn-outline { display:inline-flex; align-items:center; gap:10px; background:transparent; color:${C.crimson}; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.04em; padding:12px 28px; border-radius:4px; border:2px solid ${C.crimson}; cursor:pointer; transition:all 0.25s ease; text-decoration:none; }
    .btn-outline:hover { background:${C.crimson}; color:#fff; transform:translate(-2px,-2px); }
  `}</style>
)

const navLinks = ["Home","About Us","Price List","Safety Tips","Contact Us"]

const companyValues = [
  {
    icon: Target,
    label: "01",
    title: "Our Mission",
    content: "We place customers at the heart of everything — delivering exceptional quality, thoughtful packaging, dependable service, and fair pricing. Every product is market-tested and designed to make celebrations more brilliant."
  },
  {
    icon: Eye,
    label: "02",
    title: "Our Vision",
    content: "To be the most trusted fireworks name across India — reaching every home, every retailer, and every event planner who wants authentic Sivakasi craftsmanship. We exist to light up the sky of every occasion."
  },
  {
    icon: Shield,
    label: "03",
    title: "Our Values",
    content: "Safety is non-negotiable. Sri Planiyappa Crackers upholds rigorous quality control aligned with industry standards. We believe in innovation, transparency, and creating experiences that last long after the sparks fade."
  },
]

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: C.ivory, color: C.ink, overflowX: "hidden" }}>
      <GlobalStyles />
      <Navbar />

      <div style={{ paddingTop: "5rem" }}>

        {/* ══════════════ HERO ABOUT ══════════════════════════════════════ */}
        <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "5rem 1.5rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>

            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} style={{ position: "relative" }}>
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${C.borderD}` }}>
                <img src={fire} alt="Fireworks display" style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(192,57,43,0.08) 0%,transparent 60%)" }} />
              </div>
              <div style={{ position: "absolute", bottom: -12, right: -12, width: "100%", height: "100%", border: `2px solid ${C.parchment}`, background: C.parchment, borderRadius: "8px", zIndex: -1 }} />
              <div style={{ position: "absolute", top: -20, left: -20, width: 72, height: 72, borderRadius: "100%", background: C.crimson, border: "4px solid #fff", boxShadow: `4px 4px 0 ${C.crimsonD}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.25rem", lineHeight: 1 }}>15</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "10px", letterSpacing: "0.1em" }}>YRS</span>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <span className="label" style={{ marginBottom: "0.75rem" }}>Since 2009 · Sivakasi</span>
                <h1 className="display" style={{ fontSize: "clamp(2rem,3.5vw,2.75rem)", color: C.ink }}>
                  Discover<br/><span style={{ color: C.crimson }}>Sree Palaniyappa<br/>Fireworks</span>
                </h1>
                <div style={{ width: 64, height: 3, background: C.crimson, borderRadius: 2, marginTop: "1rem" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: C.slate, fontSize: "15px", lineHeight: 1.8 }}>
                <p><strong style={{ color: C.crimson }}>Sree Palaniyappa Fireworks</strong> is your premier destination for premium quality crackers, illuminating celebrations across India with unmatched brilliance and consistent joy.</p>
                <p>From vibrant festivals to intimate gatherings, we partner with Sivakasi's finest manufacturers to deliver innovative, safe, and spectacular products crafted to create lasting memories.</p>
                <p>Serving Tamil Nadu and beyond, we cater to families, event planners, and retailers with tailored solutions, competitive pricing, and a genuine passion for making every moment shine.</p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {[["✦", "Premium Quality"], ["✦", "Safety Certified"], ["✦", "Fast Delivery"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `rgba(192,57,43,0.07)`, border: `1.5px solid rgba(192,57,43,0.2)`, borderRadius: "100px", padding: "6px 16px" }}>
                    <span style={{ color: C.crimson, fontSize: "10px" }}>{icon}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "12px", color: C.ink, letterSpacing: "0.05em" }}>{text}</span>
                  </div>
                ))}
              </div>

              <div>
                <a href="/contact-us" className="btn-outline" style={{ alignSelf: "flex-start" }}>
                  Get in Touch <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ STRIP STAT ══════════════════════════════════════ */}
        <div style={{ background: C.crimson, borderTop: `4px solid ${C.crimsonD}` }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "none" }}>
              {[["200+","Products"],["500+","Happy Clients"],["100%","Satisfaction"],["15+","Years"]].map(([v,l],i) => (
                <div key={i} style={{ padding: "1.25rem", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
                  <div className="display" style={{ fontSize: "1.5rem", color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontFamily: "'Barlow', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ CTA SECTION ═════════════════════════════════════ */}
        <section style={{ padding: "5rem 1.5rem", margin: "0 1rem", borderRadius: "8px", overflow: "hidden", position: "relative", background: C.charcoal }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
            <span className="display" style={{ fontSize: "clamp(5rem,14vw,14rem)", color: "rgba(255,255,255,0.04)", whiteSpace: "nowrap", letterSpacing: "-0.04em" }}>SIVAKASI</span>
          </div>

          {/* Floating sparks */}
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: C.saffron, width: 6, height: 6, borderRadius: "100%", position: "absolute", left: `${(i / 16) * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.5 }}
              animate={{ y: [0, -80, 0], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }} />
          ))}

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            style={{ position: "relative", zIndex: 10, maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ width: 72, height: 72, background: C.crimson, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: `4px 4px 0 ${C.crimsonD}` }}>
              <Sparkles style={{ width: 36, height: 36, color: "#fff" }} />
            </motion.div>
            <h2 className="display" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: "#fff", marginBottom: "1rem" }}>
              🎆 Premium Fireworks.<br/>Exclusive Discounts.
            </h2>
            <p className="serif" style={{ fontStyle: "italic", fontSize: "17px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Celebrate every occasion with <span style={{ color: C.saffronL, fontStyle: "normal", fontWeight: 600 }}>Sree Palaniyappa Crackers</span> — your trusted partner for elite fireworks.
            </p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.65, fontFamily: "'Barlow', sans-serif" }}>
              Rockets, gift boxes, sky shots, sparklers and more — with quick enquiry and reliable doorstep delivery across Tamil Nadu.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <a href="tel:+918124259430" className="btn-primary" style={{ background: "#fff", color: C.crimson }}>
                <Phone style={{ width: 16, height: 16 }} /> +91 81242 59430
              </a>
              <a href="/price-list" className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                View Price List <ArrowRight style={{ width: 15, height: 15 }} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ══════════════ COMPANY VALUES ══════════════════════════════════ */}
        <section style={{ padding: "6rem 1.5rem", background: C.cream }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span className="label" style={{ marginBottom: "0.75rem" }}>The pillars we stand on</span>
              <h2 className="display" style={{ fontSize: "clamp(2rem,3.5vw,2.75rem)", color: C.ink }}>Our Foundation</h2>
              <div style={{ width: 64, height: 3, background: C.crimson, borderRadius: 2, margin: "1rem auto 0" }} />
              <p className="serif" style={{ fontStyle: "italic", color: C.muted, maxWidth: "480px", margin: "1rem auto 0", fontSize: "15px", lineHeight: 1.65 }}>
                Built on strong values and unwavering commitment to excellence, safety, and customer satisfaction
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {companyValues.map(({ icon: Icon, label, title, content }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.15 }} viewport={{ once: true }}
                  style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "2rem", cursor: "default", transition: "all 0.28s ease", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.transform = "translate(-4px,-4px)"; e.currentTarget.style.boxShadow = `6px 6px 0 ${C.crimson}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  {/* Ghost number */}
                  <div style={{ position: "absolute", top: -8, right: -4, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "5rem", color: `rgba(192,57,43,0.05)`, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{label}</div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ width: 56, height: 56, background: `rgba(192,57,43,0.07)`, border: `1.5px dashed ${C.crimson}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon style={{ width: 26, height: 26, color: C.crimson }} />
                    </div>
                    <h3 className="display" style={{ fontSize: "1.2rem", color: C.ink, marginBottom: "0.75rem" }}>{title}</h3>
                    <p style={{ color: C.slate, fontSize: "14px", lineHeight: 1.75 }}>{content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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