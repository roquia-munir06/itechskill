import React, { useState, useEffect, useCallback } from "react";
import { getAllOrders, approveOrder, rejectOrder } from "../api/api";
import {
  FiRefreshCw, FiSearch, FiCheck, FiX, FiEye, FiClock,
  FiDollarSign, FiPackage, FiAlertCircle, FiImage,
  FiSmartphone, FiUser, FiMail, FiCreditCard, FiCalendar,
  FiChevronDown, FiCheckCircle, FiXCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
/* ═══════════════════════════════════════════════════════════
   STATUS CONFIG
═══════════════════════════════════════════════════════════ */
const STATUS = {
  pending:  { label: "Pending",  color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: FiClock        },
  approved: { label: "Approved", color: "#059669", bg: "#f0fdf4", border: "#86efac", icon: FiCheckCircle  },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: FiXCircle      },
};

/* ═══════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, value, label, color, bg }) => (
  <div style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
    padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 140,
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1228", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SCREENSHOT MODAL
═══════════════════════════════════════════════════════════ */
const ScreenshotModal = ({ url, onClose }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: 24,
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      maxWidth: 600, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
    }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "#1a1228", fontSize: "0.9rem" }}>📸 Payment Screenshot</span>
        <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700, color: "#6b7280" }}>✕ Close</button>
      </div>
      <img src={url} alt="Payment proof" style={{ width: "100%", maxHeight: 500, objectFit: "contain", display: "block" }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   REJECT MODAL
═══════════════════════════════════════════════════════════ */
const RejectModal = ({ order, onConfirm, onClose, loading }) => {
  const [reason, setReason] = useState("");
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440,
        padding: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: "2rem", textAlign: "center", marginBottom: 10 }}>⚠️</div>
        <h3 style={{ textAlign: "center", margin: "0 0 6px", color: "#1a1228", fontSize: "1rem", fontWeight: 800 }}>Reject Order</h3>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.82rem", marginBottom: 18 }}>
          Rejecting order for <strong>{order.userName}</strong>. Optionally provide a reason.
        </p>
        <textarea
          placeholder="Reason for rejection (optional)..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
            borderRadius: 8, fontSize: "0.85rem", fontFamily: "inherit",
            resize: "vertical", minHeight: 80, outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", border: "1.5px solid #e5e7eb", borderRadius: 8,
            background: "#fff", color: "#6b7280", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem",
          }}>Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={loading} style={{
            flex: 1, padding: "11px", border: "none", borderRadius: 8,
            background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem",
            opacity: loading ? 0.6 : 1,
          }}>{loading ? "Rejecting…" : "Confirm Reject"}</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ORDER DETAIL MODAL
═══════════════════════════════════════════════════════════ */
const OrderDetailModal = ({ order, onClose, onApprove, onReject, actionLoading }) => {
  const s = STATUS[order.status] || STATUS.pending;
  const isWhatsApp = !order.screenshotUrl;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9998, padding: 24, overflowY: "auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#22013a,#7c1abd)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fcd34d", fontWeight: 800, fontSize: "0.95rem" }}>Order Details</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginTop: 2 }}>#{order._id?.slice(-8).toUpperCase()}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", fontWeight: 700 }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Status */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: s.bg, border: `1px solid ${s.border}`, marginBottom: 20 }}>
            <s.icon size={13} color={s.color} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: s.color }}>{s.label}</span>
          </div>

          {/* Student Info */}
          <div style={{ background: "#faf5ff", border: "1px solid #ede9f8", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#22013a", fontSize: "0.82rem", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student Info</div>
            <Row icon={FiUser}     label="Name"   value={order.userName} />
            <Row icon={FiMail}     label="Email"  value={order.userEmail} />
            <Row icon={FiCalendar} label="Date"   value={new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })} />
          </div>

          {/* Payment Info */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#22013a", fontSize: "0.82rem", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment Info</div>
            <Row icon={FiCreditCard} label="Method" value={order.paymentMethod} />
            <Row icon={FiDollarSign} label="Amount" value={order.totalAmount} highlight />
            {order.transactionId && <Row icon={FiPackage} label="Txn ID" value={order.transactionId} />}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: "0.77rem", color: "#6b7280", width: 90 }}>Proof</span>
              {isWhatsApp
                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}><FaWhatsapp size={12}/> Via WhatsApp</span>
                : <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700, color: "#1d4ed8" }}><FiImage size={12}/> Screenshot uploaded</span>
              }
            </div>
          </div>

          {/* Courses */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: "#f3f4f6", padding: "9px 14px", fontWeight: 700, color: "#22013a", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>📚 Courses</div>
            {(order.courses || []).map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderTop: i > 0 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <span style={{ fontSize: "0.83rem", color: "#374151", fontWeight: 500 }}>{c.title}</span>
                <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#1a1228" }}>{c.price}</span>
              </div>
            ))}
          </div>

          

          {isWhatsApp && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <FaWhatsapp size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.83rem" }}>Check WhatsApp for screenshot</div>
                <div style={{ fontSize: "0.75rem", color: "#15803d", marginTop: 3, lineHeight: 1.5 }}>
                  This student chose to send proof via WhatsApp. Check your WhatsApp before approving.
                </div>
              </div>
            </div>
          )}

         {/* Actions — always visible */}
<div style={{ display: "flex", gap: 10 }}>
  <button
    onClick={() => onReject(order)}
    disabled={actionLoading || order.status === "rejected"}
    style={{
      flex: 1, padding: "12px", border: "1.5px solid #fecaca", borderRadius: 10,
      background: order.status === "rejected" ? "#fecaca" : "#fef2f2",
      color: "#dc2626", fontWeight: 700, cursor: order.status === "rejected" ? "not-allowed" : "pointer",
      fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      opacity: actionLoading ? 0.6 : 1,
    }}
  ><FiX size={15}/> Reject</button>
  <button
    onClick={() => onApprove(order._id)}
    disabled={actionLoading || order.status === "approved"}
    style={{
      flex: 2, padding: "12px", border: "none", borderRadius: 10,
      background: order.status === "approved" ? "#86efac" : "linear-gradient(135deg,#059669,#10b981)",
      color: "#fff", fontWeight: 700, cursor: order.status === "approved" ? "not-allowed" : "pointer",
      fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      opacity: actionLoading ? 0.6 : 1, boxShadow: "0 3px 12px rgba(16,185,129,0.3)",
    }}
  ><FiCheck size={15}/> {actionLoading ? "Processing…" : "Approve & Enroll"}</button>
</div>

          {order.status === "rejected" && order.adminNote && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12 }}>
              <span style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 600 }}>Rejection reason: </span>
              <span style={{ fontSize: "0.78rem", color: "#dc2626" }}>{order.adminNote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ icon: Icon, label, value, highlight }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <Icon size={13} color="#9b8db0" style={{ flexShrink: 0 }} />
    <span style={{ fontSize: "0.77rem", color: "#6b7280", width: 80, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: "0.83rem", fontWeight: highlight ? 800 : 600, color: highlight ? "#22013a" : "#374151" }}>{value}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AdminOrdersPage() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectTarget,  setRejectTarget]  = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveOrder(id);
      showToast("Order approved! Student enrolled ✓");
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      showToast(err?.response?.data?.message || "Approval failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await rejectOrder(rejectTarget._id, reason);
      showToast("Order rejected");
      setRejectTarget(null);
      setSelectedOrder(null);
      await fetchOrders();
    } catch {
      showToast("Rejection failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const total    = orders.length;
  const pending  = orders.filter(o => o.status === "pending").length;
  const approved = orders.filter(o => o.status === "approved").length;
  const rejected = orders.filter(o => o.status === "rejected").length;

  // Filter + Search
  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.userName?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      o.paymentMethod?.toLowerCase().includes(q) ||
      o.totalAmount?.toLowerCase().includes(q) ||
      o.courses?.some(c => c.title?.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#1a1228", minHeight: "100vh", background: "#f4f4f6", display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 280, flex: 1, minWidth: 0 }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          .ao-row-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 7px; font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 700; transition: all 0.15s; }
          .ao-row-btn:hover { opacity: 0.85; }
          .ao-filter-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.18s; color: #6b7280; white-space: nowrap; }
          .ao-filter-btn.active { background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; border-color: transparent; }
          .ao-filter-btn:hover:not(.active) { border-color: #c4b5fd; color: #7c3aed; }
          .ao-table-row { background: #fff; border-bottom: 1px solid #f3f4f6; transition: background 0.15s; }
          .ao-table-row:hover { background: #faf8ff; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 99999,
            background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
            color: toast.type === "error" ? "#dc2626" : "#166534",
            padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}>
            {toast.type === "error" ? "❌" : "✅"} {toast.msg}
          </div>
        )}

        {/* Modals */}
        {screenshotUrl && <ScreenshotModal url={screenshotUrl} onClose={() => setScreenshotUrl(null)} />}
        {rejectTarget && (
          <RejectModal
            order={rejectTarget}
            onConfirm={handleRejectConfirm}
            onClose={() => setRejectTarget(null)}
            loading={actionLoading}
          />
        )}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onApprove={handleApprove}
            onReject={(o) => { setRejectTarget(o); }}
            actionLoading={actionLoading}
          />
        )}

        {/* Page Header */}
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 800, color: "#1a1228" }}>Orders & Payments</h1>
              <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "0.85rem" }}>
                Review payment proof and manage student enrollments
              </p>
            </div>
            <button onClick={fetchOrders} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", border: "1.5px solid #e5e7eb", borderRadius: 9,
              background: "#fff", fontFamily: "inherit", fontWeight: 700, fontSize: "0.85rem",
              color: "#374151", cursor: "pointer",
            }}>
              <FiRefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 32px 40px" }}>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
            <StatCard icon={FiPackage}     value={total}    label="Total"    color="#7c3aed" bg="#f3e8ff" />
            <StatCard icon={FiClock}       value={pending}  label="Pending"  color="#b45309" bg="#fffbeb" />
            <StatCard icon={FiCheck}       value={approved} label="Approved" color="#059669" bg="#f0fdf4" />
            <StatCard icon={FiAlertCircle} value={rejected} label="Rejected" color="#dc2626" bg="#fef2f2" />
          </div>

          {/* Search + Filter */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <FiSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={15} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, course, payment method..."
                style={{
                  width: "100%", padding: "10px 12px 10px 36px",
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: "0.88rem", fontFamily: "inherit", outline: "none", color: "#1a1228",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "all",      label: `All (${total})`         },
                { key: "pending",  label: `Pending (${pending})`   },
                { key: "approved", label: `Approved (${approved})` },
                { key: "rejected", label: `Rejected (${rejected})` },
              ].map(f => (
                <button key={f.key} className={`ao-filter-btn ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr",
              background: "linear-gradient(135deg,#22013a,#7c1abd)",
              padding: "12px 18px", gap: 10,
            }}>
              {["Student", "Courses", "Amount", "Method", "Status", "Actions"].map(h => (
                <div key={h} style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "#9ca3af", fontSize: "0.88rem" }}>
                <div style={{ marginBottom: 10, fontSize: "1.5rem" }}>⏳</div>
                Loading orders…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "#9ca3af", fontSize: "0.88rem" }}>
                <div style={{ marginBottom: 10, fontSize: "1.8rem" }}>📭</div>
                No orders found
              </div>
            ) : (
              filtered.map((order) => {
                const s = STATUS[order.status] || STATUS.pending;
                const isWhatsApp = !order.screenshotUrl;
                const isPending = order.status === "pending";
                return (
                  <div key={order._id} className="ao-table-row" style={{
                    display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr",
                    padding: "14px 18px", gap: 10, alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1228" }}>{order.userName}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 2 }}>{order.userEmail}</div>
                      <div style={{ fontSize: "0.68rem", color: "#c4b5d8", marginTop: 1 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      {(order.courses || []).slice(0, 2).map((c, i) => (
                        <div key={i} style={{ fontSize: "0.75rem", color: "#374151", fontWeight: 500, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                          {c.title}
                        </div>
                      ))}
                      {(order.courses || []).length > 2 && (
                        <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>+{order.courses.length - 2} more</div>
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#1a1228" }}>{order.totalAmount}</div>
                    <div>
                      <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#374151" }}>{order.paymentMethod}</div>
                      {isWhatsApp
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 3, background: "#f0fdf4", borderRadius: 4, padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700, color: "#16a34a" }}><FaWhatsapp size={9}/> WhatsApp</span>
                        : <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 3, background: "#eff6ff", borderRadius: 4, padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700, color: "#1d4ed8" }}><FiImage size={9}/> Uploaded</span>
                      }
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: s.bg, border: `1px solid ${s.border}` }}>
                      <s.icon size={11} color={s.color} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: s.color }}>{s.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <button className="ao-row-btn" onClick={() => setSelectedOrder(order)} style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                        <FiEye size={13}/> View
                      </button>
                        {isPending && (
                        <>
                          <button className="ao-row-btn" onClick={() => handleApprove(order._id)} style={{ background: "#f0fdf4", color: "#059669" }}>
                            <FiCheck size={13}/>
                          </button>
                          <button className="ao-row-btn" onClick={() => setRejectTarget(order)} style={{ background: "#fef2f2", color: "#dc2626" }}>
                            <FiX size={13}/>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filtered.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: "0.75rem", color: "#9ca3af" }}>
              Showing {filtered.length} of {total} orders
            </div>
          )}
        </div>

      </div> {/* closes inner content div */}
    </div>  
  );
}