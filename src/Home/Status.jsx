import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, User, Calendar, Download, ChevronDown, ChevronUp, AlertCircle, ArrowRight
} from "lucide-react"
import Navbar from "../Component/Navbar"
import { API_BASE_URL } from "../../Config"

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
    .btn-primary { display:inline-flex; align-items:center; gap:10px; background:${C.crimson}; color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; padding:14px 32px; border-radius:4px; border:none; cursor:pointer; transition:all 0.25s ease; }
    .btn-primary:hover { background:${C.crimsonD}; transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${C.crimsonD}44; }
    input:focus, select:focus { outline: 2px solid ${C.crimson} !important; outline-offset: 0 !important; }
  `}</style>
)

const statusConfig = {
  pending:   { color: C.saffron, bg: `rgba(230,126,34,0.1)`, border: `rgba(230,126,34,0.3)`, icon: Clock },
  confirmed: { color: "#1565c0", bg: "rgba(21,101,192,0.08)", border: "rgba(21,101,192,0.25)", icon: CheckCircle },
  packed:    { color: "#6a1b9a", bg: "rgba(106,27,154,0.08)", border: "rgba(106,27,154,0.25)", icon: Package },
  dispatched:{ color: C.saffron, bg: `rgba(230,126,34,0.1)`, border: `rgba(230,126,34,0.3)`, icon: Truck },
  delivered: { color: "#2e7d32", bg: "rgba(46,125,50,0.08)", border: "rgba(46,125,50,0.25)", icon: CheckCircle },
  booked:    { color: "#2e7d32", bg: "rgba(46,125,50,0.08)", border: "rgba(46,125,50,0.25)", icon: CheckCircle },
  canceled:  { color: C.crimson, bg: `rgba(192,57,43,0.08)`, border: `rgba(192,57,43,0.25)`, icon: AlertCircle },
}

const Status = () => {
  const [searchForm, setSearchForm] = useState({ customer_name: "", mobile_number: "" })
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedTimelines, setExpandedTimelines] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "mobile_number") {
      const cleaned = value.replace(/\D/g, "").slice(-10)
      setSearchForm(prev => ({ ...prev, [name]: cleaned }))
    } else {
      setSearchForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const toggleTimeline = (orderId) => {
    setExpandedTimelines(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const searchOrders = async () => {
    if (!searchForm.customer_name.trim() || !searchForm.mobile_number.trim()) { alert("Please enter both name and mobile number"); return; }
    if (searchForm.mobile_number.length !== 10) { alert("Please enter a valid 10-digit mobile number"); return; }
    setIsLoading(true)
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_name: searchForm.customer_name.trim(), mobile_number: searchForm.mobile_number }) }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_name: searchForm.customer_name.trim(), mobile_number: searchForm.mobile_number }) }),
      ])
      const [bookingsData, quotationsData] = await Promise.all([bookingsRes.json(), quotationsRes.json()])
      const allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map(order => ({ ...order, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map(order => ({ ...order, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setOrders(allOrders)
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching orders:", error)
      alert("Error searching orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getOrderTimeline = (order) => {
    const timeline = [{ status: "Order Placed", date: order.created_at, completed: true, icon: Package }]
    if (["confirmed","packed","dispatched","delivered","booked"].includes(order.status))
      timeline.push({ status: "Confirmed", date: order.updated_at || order.created_at, completed: true, icon: CheckCircle })
    if (["packed","dispatched","delivered"].includes(order.status))
      timeline.push({ status: "Packed", date: order.processing_date || order.updated_at, completed: true, icon: Package })
    if (["dispatched","delivered"].includes(order.status))
      timeline.push({ status: "Dispatched", date: order.dispatch_date || order.updated_at, completed: true, icon: Truck, transport: { company: order.transport_name, tracking_number: order.lr_number, driver_contact: order.transport_contact } })
    if (order.status === "delivered")
      timeline.push({ status: "Delivered", date: order.delivery_date || order.updated_at, completed: true, icon: CheckCircle })
    return timeline
  }

  const downloadInvoice = async (order) => {
    try {
      const endpoint = order.type === "booking" ? `/api/direct/invoice/${order.order_id}` : `/api/direct/quotation/${order.quotation_id}`
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${order.customer_name}-${order.order_id || order.quotation_id}.pdf`)
      document.body.appendChild(link); link.click(); document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) { console.error("Error downloading invoice:", error); alert("Error downloading invoice. Please try again.") }
  }

  const formatPrice = (price) => { const num = Number.parseFloat(price); return isNaN(num) ? "0.00" : num.toFixed(2) }
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <>
      <GlobalStyles />
      <Navbar />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", maxWidth: "56rem", margin: "0 auto", padding: "7rem 1.5rem 6rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="label" style={{ marginBottom: "0.75rem" }}>Search by name & mobile</span>
            <h1 className="display" style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", color: C.ink, marginBottom: "0.75rem" }}>
              Track Your<br/><span style={{ color: C.crimson }}>Orders</span>
            </h1>
            <p className="serif" style={{ fontStyle: "italic", color: C.muted, fontSize: "15px" }}>Enter your details below to view all bookings and quotations</p>
          </div>

          {/* ── Search Form ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fff", border: `2px solid ${C.border}`, borderRadius: "8px", padding: "2rem", marginBottom: "3rem", maxWidth: "26rem", margin: "0 auto 3rem", boxShadow: `4px 4px 0 ${C.parchment}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <span className="label" style={{ marginBottom: "0.5rem" }}>Full Name</span>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: C.muted }} />
                  <input type="text" name="customer_name" placeholder="Enter your full name"
                    value={searchForm.customer_name} onChange={handleInputChange}
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${C.border}`, borderRadius: "4px", background: C.cream, fontFamily: "'Barlow', sans-serif", fontSize: "14px", color: C.ink }} />
                </div>
              </div>
              <div>
                <span className="label" style={{ marginBottom: "0.5rem" }}>Mobile Number</span>
                <div style={{ position: "relative" }}>
                  <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: C.muted }} />
                  <input type="tel" name="mobile_number" placeholder="10-digit mobile number"
                    value={searchForm.mobile_number} onChange={handleInputChange} maxLength={10}
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${C.border}`, borderRadius: "4px", background: C.cream, fontFamily: "'Barlow', sans-serif", fontSize: "14px", color: C.ink }} />
                </div>
              </div>
              <button onClick={searchOrders} disabled={isLoading} className="btn-primary" style={{ width: "100%", justifyContent: "center", opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}>
                {isLoading ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "100%", animation: "spin 0.8s linear infinite" }} />Searching…</>
                ) : (
                  <><Search style={{ width: 16, height: 16 }} />Track Orders</>
                )}
              </button>
            </div>
          </motion.div>

          {/* ── Results ── */}
          <AnimatePresence>
            {hasSearched && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "5rem 0" }}>
                    <div style={{ width: 72, height: 72, background: `rgba(192,57,43,0.06)`, border: `2px dashed ${C.border}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                      <Package style={{ width: 32, height: 32, color: C.muted }} />
                    </div>
                    <h3 className="display" style={{ fontSize: "1.4rem", color: C.ink, marginBottom: "0.5rem" }}>No Orders Found</h3>
                    <p className="serif" style={{ fontStyle: "italic", color: C.muted, fontSize: "15px" }}>
                      No orders match the provided details. Please verify your name and mobile number.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                      <div style={{ width: 4, height: 28, background: C.crimson, borderRadius: 2 }} />
                      <h2 className="display" style={{ fontSize: "1.6rem", color: C.ink }}>
                        Your Orders <span style={{ color: C.crimson }}>({orders.length})</span>
                      </h2>
                    </div>

                    {orders.map((order) => {
                      const key = `${order.type}-${order.id}`
                      const status = order.status?.toLowerCase() || "pending"
                      const cfg = statusConfig[status] || statusConfig.pending
                      const StatusIcon = cfg.icon
                      const timeline = getOrderTimeline(order)
                      const isExpanded = expandedTimelines[key]

                      return (
                        <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: "8px", overflow: "hidden", transition: "border-color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = C.crimson}
                          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                          <div style={{ padding: "1.5rem" }}>
                            {/* Order top row */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                    <h3 className="display" style={{ fontSize: "1.1rem", color: C.ink }}>
                                      {order.type === "booking" ? `Order #${order.order_id}` : `Quote #${order.quotation_id}`}
                                    </h3>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: cfg.color }}>
                                      <StatusIcon style={{ width: 12, height: 12 }} />
                                      {status}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "12px", color: C.muted }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                      <Calendar style={{ width: 12, height: 12 }} />{formatDate(order.created_at)}
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                      <MapPin style={{ width: 12, height: 12 }} />{order.district}, {order.state}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span className="display" style={{ fontSize: "1.6rem", color: C.crimson }}>₹{formatPrice(order.total)}</span>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => downloadInvoice(order)}
                                      style={{ width: 36, height: 36, background: "rgba(46,125,50,0.08)", border: "1px solid rgba(46,125,50,0.25)", borderRadius: "4px", color: "#2e7d32", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(46,125,50,0.15)"; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(46,125,50,0.08)"; }}>
                                      <Download style={{ width: 14, height: 14 }} />
                                    </button>
                                    <button onClick={() => toggleTimeline(key)}
                                      style={{ width: 36, height: 36, background: `rgba(192,57,43,0.08)`, border: `1px solid rgba(192,57,43,0.25)`, borderRadius: "4px", color: C.crimson, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                                      onMouseEnter={e => { e.currentTarget.style.background = `rgba(192,57,43,0.15)`; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = `rgba(192,57,43,0.08)`; }}>
                                      {isExpanded ? <ChevronUp style={{ width: 15, height: 15 }} /> : <ChevronDown style={{ width: 15, height: 15 }} />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Timeline */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                                  style={{ overflow: "hidden", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: `1.5px solid ${C.parchment}` }}>
                                  <p className="label" style={{ marginBottom: "1rem" }}>Order Timeline</p>
                                  <div style={{ position: "relative" }}>
                                    {timeline.map((step, idx, arr) => {
                                      const StepIcon = step.icon
                                      return (
                                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingBottom: idx < arr.length - 1 ? "1rem" : 0, position: "relative" }}>
                                          {idx < arr.length - 1 && (
                                            <div style={{ position: "absolute", left: 14, top: 32, width: 2, height: "calc(100% - 8px)", background: step.completed ? "#2e7d32" : C.parchment, borderRadius: 2 }} />
                                          )}
                                          <div style={{ width: 28, height: 28, borderRadius: "4px", background: step.completed ? "rgba(46,125,50,0.1)" : C.cream, border: `1.5px solid ${step.completed ? "#2e7d32" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                                            <StepIcon style={{ width: 13, height: 13, color: step.completed ? "#2e7d32" : C.muted }} />
                                          </div>
                                          <div style={{ flex: 1, paddingTop: 4 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", color: step.completed ? C.ink : C.muted }}>{step.status}</p>
                                              {step.date && <p style={{ fontSize: "11px", color: C.muted, fontFamily: "'Barlow', sans-serif" }}>{formatDate(step.date)}</p>}
                                            </div>
                                            {step.transport?.company && (
                                              <p style={{ fontSize: "12px", color: C.slate, marginTop: 2 }}>Transport: {step.transport.company}{step.transport.tracking_number ? ` · LR# ${step.transport.tracking_number}` : ""}</p>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

export default Status