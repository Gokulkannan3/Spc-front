import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar, Download, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react"
import Navbar from "../Component/Navbar"
import { API_BASE_URL } from "../../Config"
import axios from 'axios'

const C = {
  void:       "#030712", 
  glass:      "rgba(15, 23, 42, 0.45)",
  glassL:     "rgba(30, 41, 59, 0.65)",
  gold:       "#f59e0b", 
  goldL:      "#fef08a",
  neonCyan:   "#06b6d4",
  neonPurple: "#8b5cf6",
  ink:        "#f8fafc", 
  slate:      "#cbd5e1", 
  muted:      "#64748b", 
  border:     "rgba(255, 255, 255, 0.07)", 
  borderH:    "rgba(255, 255, 255, 0.18)",
  crimson:    "#e74c3c",
  saffron:    "#f59e0b",
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&family=Syne:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { background: #030712; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    
    .display { font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; }
    .serif { font-family: 'Lora', serif; }
    .label { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #f59e0b; }
    
    .cosmic-mesh { 
      background-image: 
        radial-gradient(at 10% 15%, rgba(6, 182, 212, 0.05) 0px, transparent 50%),
        radial-gradient(at 90% 85%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(245, 158, 11, 0.02) 0px, transparent 70%);
    }
    
    .glassmorphic {
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }
    
    .pill { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
      background: rgba(245, 158, 11, 0.08); 
      color: #f59e0b; 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      font-weight: 700; 
      font-size: 11px; 
      letter-spacing: 0.05em; 
      text-transform: uppercase; 
      padding: 5px 14px; 
      border-radius: 100px; 
      border: 1px solid rgba(245, 158, 11, 0.15); 
    }
    
    .btn-primary { 
      display: inline-flex; 
      align-items: center; 
      gap: 10px; 
      background: linear-gradient(135deg, #f59e0b, #d97706); 
      color: #030712; 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      font-weight: 700; 
      font-size: 14px; 
      padding: 14px 32px; 
      border-radius: 12px; 
      border: none; 
      cursor: pointer; 
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
      box-shadow: 0 8px 30px rgba(245, 158, 11, 0.25); 
    }
    .btn-primary:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4); 
      background: linear-gradient(135deg, #fef08a, #f59e0b); 
    }
    
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #030712; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
    ::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
  `}</style>
)

const statusConfig = {
  pending:   { color: C.saffron, bg: `rgba(245,158,11,0.12)`, border: `rgba(245,158,11,0.3)`, icon: Clock },
  confirmed: { color: "#5dade2", bg: "rgba(93,173,226,0.12)", border: "rgba(93,173,226,0.3)", icon: CheckCircle },
  packed:    { color: "#bb8fce", bg: "rgba(187,143,206,0.12)", border: "rgba(187,143,206,0.3)", icon: Package },
  dispatched:{ color: C.saffron, bg: `rgba(245,158,11,0.12)`, border: `rgba(245,158,11,0.3)`, icon: Truck },
  delivered: { color: "#52be80", bg: "rgba(82,190,128,0.12)", border: "rgba(82,190,128,0.3)", icon: CheckCircle },
  booked:    { color: "#52be80", bg: "rgba(82,190,128,0.12)", border: "rgba(82,190,128,0.3)", icon: CheckCircle },
  canceled:  { color: C.crimson, bg: `rgba(231,76,60,0.15)`, border: `rgba(231,76,60,0.35)`, icon: AlertCircle },
}

const Status = () => {
  const [searchForm, setSearchForm] = useState({ mobile_number: "" })
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedTimelines, setExpandedTimelines] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const cleaned = value.replace(/\D/g, "").slice(-10)
    setSearchForm(prev => ({ ...prev, [name]: cleaned }))
  }

  const toggleTimeline = (orderId) => {
    setExpandedTimelines(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const fetchTransportDetails = async (orderId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tracking/filtered-bookings`, {
        params: { status: 'dispatched,delivered' }
      })
      const booking = res.data.find(b => b.order_id === orderId || b.id === orderId)
      return booking ? {
        transport_name: booking.transport_name,
        lr_number: booking.lr_number,
        transport_contact: booking.transport_contact
      } : null
    } catch (error) {
      console.error("Failed to fetch transport details:", error)
      return null
    }
  }

  const searchOrders = async () => {
    if (!searchForm.mobile_number.trim()) {
      alert("Please enter mobile number")
      return
    }
    if (searchForm.mobile_number.length !== 10) {
      alert("Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchForm)
        }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchForm)
        }),
      ])

      const [bookingsData, quotationsData] = await Promise.all([bookingsRes.json(), quotationsRes.json()])

      let allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map(order => ({ ...order, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map(order => ({ ...order, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      allOrders = await Promise.all(allOrders.map(async (order) => {
        if ((order.status === 'dispatched' || order.status === 'delivered') && order.type === "booking") {
          const transport = await fetchTransportDetails(order.order_id)
          if (transport) {
            return { ...order, ...transport }
          }
        }
        return order
      }))

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

    if (["confirmed", "packed", "dispatched", "delivered", "booked"].includes(order.status))
      timeline.push({ status: "Confirmed", date: order.updated_at || order.created_at, completed: true, icon: CheckCircle })

    if (["packed", "dispatched", "delivered"].includes(order.status))
      timeline.push({ status: "Packed", date: order.processing_date || order.updated_at, completed: true, icon: Package })

    if (["dispatched", "delivered"].includes(order.status))
      timeline.push({
        status: "Dispatched",
        date: order.dispatch_date || order.updated_at,
        completed: true,
        icon: Truck,
        transport: {
          company: order.transport_name,
          tracking_number: order.lr_number,
          contact: order.transport_contact
        }
      })

    if (order.status === "delivered")
      timeline.push({ status: "Delivered", date: order.delivery_date || order.updated_at, completed: true, icon: CheckCircle })

    return timeline
  }

  const downloadInvoice = async (order) => {
    try {
      const endpoint = order.type === "booking" 
        ? `/api/direct/invoice/${order.order_id}` 
        : `/api/direct/quotation/${order.quotation_id}`
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${order.customer_name || 'customer'}-${order.order_id || order.quotation_id}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading invoice:", error)
      alert("Error downloading invoice. Please try again.")
    }
  }

  const formatPrice = (price) => {
    const num = Number.parseFloat(price)
    return isNaN(num) ? "0.00" : num.toFixed(2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const hasTransportInfo = (order) => 
    (order.status?.toLowerCase() === 'dispatched' || order.status?.toLowerCase() === 'delivered') &&
    (order.transport_name || order.lr_number)

return (
    <>
      <GlobalStyles />
      <Navbar />

      <div className="min-h-screen bg-[#030712] pb-12" style={{ paddingTop: "5.5rem" }}>
        <main className="max-w-lg mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            <div className="text-center mb-8">
              <span className="label">TRACK ORDERS</span>
              <h1 className="display text-4xl mt-2 mb-2">Your Orders</h1>
              <p className="text-slate-400 text-[15px]">Enter mobile number to view bookings & quotations</p>
            </div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphic rounded-3xl p-6 mb-10"
            >
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="tel" 
                  name="mobile_number" 
                  placeholder="10-digit mobile number"
                  value={searchForm.mobile_number} 
                  onChange={handleInputChange} 
                  maxLength={10}
                  className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-base placeholder:text-slate-500 focus:border-[#f59e0b]"
                />
              </div>
              <button 
                onClick={searchOrders} 
                disabled={isLoading} 
                className="mt-4 w-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold py-4 rounded-2xl transition-all text-base"
              >
                {isLoading ? "Searching..." : "TRACK ORDERS"}
              </button>
            </motion.div>

            <AnimatePresence>
              {hasSearched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      No orders found for this number.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const key = `${order.type}-${order.id}`
                        const status = order.status?.toLowerCase() || "pending"
                        const cfg = statusConfig[status] || statusConfig.pending
                        const StatusIcon = cfg.icon
                        const isExpanded = expandedTimelines[key]

                        return (
                          <motion.div 
                            key={key}
                            className="glassmorphic rounded-3xl overflow-hidden"
                          >
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h3 className="display text-lg">
                                      {order.type === "booking" ? `${order.order_id}` : `#${order.quotation_id}`}
                                    </h3>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full" 
                                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                                      {status.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
                                    <Calendar size={15} />
                                    <span>{new Date(order.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                                    <MapPin size={15} />
                                    <span>{order.district}, {order.state}</span>
                                  </div>
                                  <div className="text-right">
                                  <div className="text-3xl text-white">₹{Number(order.total).toFixed(2)}</div>
                                </div>
                                </div>

                                
                              </div>

                              {/* Transport Details */}
                              {hasTransportInfo(order) && (
                                <div className="mt-5 p-5 bg-black/40 rounded-2xl border border-white/10">
                                  <p className="text-[#f59e0b] font-semibold mb-3 flex items-center gap-2">
                                    🚚 Transport Details
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Company:</strong> {order.transport_name}</div>
                                    {order.lr_number && <div><strong>LR Number:</strong> {order.lr_number}</div>}
                                    {order.transport_contact && (
                                      <div><strong>Contact:</strong> <a href={`tel:${order.transport_contact}`} className="text-[#f59e0b]">{order.transport_contact}</a></div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex justify-between items-center mt-6">
                                <button 
                                  onClick={() => downloadInvoice(order)}
                                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                >
                                  <Download size={20} />
                                  <span className="text-sm font-medium">Invoice</span>
                                </button>

                                <button 
                                  onClick={() => toggleTimeline(key)}
                                  className="flex items-center gap-1.5 text-slate-400 hover:text-white"
                                >
                                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                              </div>
                            </div>

                            {/* Timeline */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0 }} 
                                  animate={{ height: "auto" }} 
                                  exit={{ height: 0 }}
                                  className="border-t border-white/10 px-6 pb-6"
                                >
                                  {/* Timeline content here - can be enhanced further */}
                                </motion.div>
                              )}
                            </AnimatePresence>
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
      </div>
    </>
  )
}

export default Status