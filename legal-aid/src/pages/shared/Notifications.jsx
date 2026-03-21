import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";

const typeConfig = {
  NEW_MATCH:            { icon: "🔗", color: "#1D4ED8",  bg: "#EFF6FF",  border: "#BFDBFE", label: "New Match"         },
  MATCH_REQUESTED:      { icon: "📨", color: "#7C3AED",  bg: "#F5F3FF",  border: "#DDD6FE", label: "Request Received"  },
  MATCH_ACCEPTED:       { icon: "✅", color: "#166534",  bg: "#F0FDF4",  border: "#86EFAC", label: "Match Accepted"    },
  MATCH_REJECTED:       { icon: "❌", color: "#DC2626",  bg: "#FEF2F2",  border: "#FECACA", label: "Match Declined"    },
  APPOINTMENT_CREATED:  { icon: "📅", color: "#0D9488",  bg: "#F0FDFA",  border: "#99F6E4", label: "Appointment"       },
  APPOINTMENT_UPDATED:  { icon: "🔄", color: "#D97706",  bg: "#FFFBEB",  border: "#FDE68A", label: "Appt. Updated"     },
  MESSAGE:              { icon: "💬", color: "#7C3AED",  bg: "#F5F3FF",  border: "#DDD6FE", label: "Message"           },
  SYSTEM:               { icon: "🔔", color: "#64748B",  bg: "#F8FAFC",  border: "#E2E8F0", label: "System"            },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await API.get(`/notifications?userId=${u.userId}`);
      setNotifications(res.data || []);
    } catch { toast.error("Failed to load notifications"); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { toast.error("Failed to mark as read"); }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => API.put(`/notifications/${n.id}/read`)));
      setNotifications(p => p.map(n => ({ ...n, read: true })));
      toast.success("All marked as read");
    } catch { toast.error("Failed"); }
  };

  const unread = notifications.filter(n => !n.read).length;

  const filtered = filter === "ALL" ? notifications
    : filter === "UNREAD" ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const cfg = (type) => typeConfig[type] || typeConfig.SYSTEM;

  const tabs = ["ALL", "UNREAD", "NEW_MATCH", "MATCH_REQUESTED", "MATCH_ACCEPTED", "APPOINTMENT_CREATED"];

  return (
    <Layout>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Notifications
            {unread > 0 && <span style={s.unreadDot}>{unread}</span>}
          </h1>
          <p style={s.subtitle}>Stay updated on your cases, matches and messages</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={s.markAllBtn}>✓ Mark all read</button>
        )}
      </div>

      <div style={s.tabBar}>
        {tabs.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }}>
            {f === "ALL" ? "All"
              : f === "UNREAD" ? `Unread${unread > 0 ? ` (${unread})` : ""}`
              : cfg(f).label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.center}>Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyWrap}>
          <div style={s.emptyRing}>🔔</div>
          <h3 style={s.emptyTitle}>{filter === "UNREAD" ? "All caught up!" : "No notifications"}</h3>
          <p style={s.emptyText}>{filter === "UNREAD" ? "No unread notifications." : "Notifications about cases and matches appear here."}</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((n, i) => {
            const c = cfg(n.type);
            return (
              <div key={n.id} onClick={() => !n.read && markAsRead(n.id)}
                style={{ ...s.card, ...(n.read ? {} : { ...s.cardUnread, borderLeftColor: c.color }) }}>
                <div style={{ ...s.iconBox, background: c.bg, border: `1px solid ${c.border}` }}>
                  <span style={{ fontSize: "16px" }}>{c.icon}</span>
                </div>
                <div style={s.body}>
                  <div style={s.cardHeader}>
                    <span style={{ ...s.typePill, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{c.label}</span>
                    <span style={s.time}>{formatTime(n.createdAt)}</span>
                  </div>
                  <p style={{ ...s.message, color: n.read ? "#64748B" : "#0F1F3D" }}>{n.message}</p>
                </div>
                {!n.read && <div style={{ ...s.dot, background: c.color }} />}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" },
  unreadDot: { fontSize: "11px", fontWeight: "700", background: "#DC2626", color: "white", padding: "2px 8px", borderRadius: "20px" },
  subtitle: { fontSize: "13px", color: "#94A3B8" },
  markAllBtn: { fontSize: "12px", fontWeight: "700", color: "#0F1F3D", background: "white", border: "1px solid #E2E8F0", padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  tabBar: { display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" },
  tab: { padding: "6px 14px", border: "1px solid #E2E8F0", background: "white", borderRadius: "20px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", color: "#64748B", fontWeight: "600", transition: "all 0.15s" },
  tabActive: { background: "#0F1F3D", color: "white", border: "1px solid #0F1F3D" },
  center: { textAlign: "center", padding: "60px", color: "#94A3B8", fontSize: "14px" },
  emptyWrap: { textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1px solid #F1F5F9" },
  emptyRing: { fontSize: "48px", marginBottom: "16px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  emptyText: { color: "#94A3B8", fontSize: "13px" },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", borderRadius: "12px", padding: "16px", display: "flex", gap: "14px", alignItems: "flex-start", cursor: "pointer", border: "1px solid #F1F5F9", borderLeft: "3px solid transparent", transition: "box-shadow 0.15s" },
  cardUnread: { boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" },
  iconBox: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  body: { flex: 1 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  typePill: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "0.4px" },
  time: { fontSize: "11px", color: "#94A3B8" },
  message: { fontSize: "13px", lineHeight: "1.5", margin: 0 },
  dot: { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, marginTop: "5px" },
};

export default Notifications;