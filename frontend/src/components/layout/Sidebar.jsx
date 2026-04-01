import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { sidebarMenu as menuItems } from "../../config/sidebarMenu";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile]           = useState(null);
  const [unreadCount, setUnreadCount]   = useState(0);
  const dropdownRef = useRef(null);
  const items = menuItems[user?.role] || menuItems.USER;

  // Load real name immediately on mount — not just when dropdown opens
  useEffect(() => {
    API.get("/profile/me").then(res => setProfile(res.data)).catch(() => {});
  }, []);

  // Poll unread notifications every 30s
  useEffect(() => {
    const fetchUnread = () => {
      const u = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
      if (!u.userId) return;
      API.get(`/notifications?userId=${u.userId}`)
        .then(res => setUnreadCount((res.data || []).filter(n => !n.read).length))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleAccent = {
    USER:   "#4F9CF9",
    LAWYER: "#52D9A4",
    NGO:    "#F9A84F",
    ADMIN:  "#C084FC",
  };
  const accent = roleAccent[user?.role] || "#4F9CF9";

  // Display name — real name from profile API, falls back to role
  const displayName = profile?.fullName || user?.role || "User";
  const initials    = displayName[0].toUpperCase();

  return (
    <div style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoArea}>
        <div style={s.logoMark}>⚖</div>
        <div>
          <div style={s.logoText}>LegalAid</div>
          <div style={s.logoSub}>Platform</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* User card */}
      <div ref={dropdownRef} style={s.userWrap}>
        <div style={{ ...s.userCard, borderColor: accent + "40" }}
          onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div style={{ ...s.avatar, background: accent + "20", color: accent }}>
            {initials}
          </div>
          <div style={s.userInfo}>
            {/* Real name shown here instead of "My Account" */}
            <div style={s.userName}>{displayName}</div>
            <div style={{ ...s.rolePill, background: accent + "20", color: accent }}>
              {user?.role}
            </div>
          </div>
          <div style={{ ...s.chevron, transform: dropdownOpen ? "rotate(180deg)" : "none" }}>⌄</div>
        </div>

        {dropdownOpen && (
          <div style={s.dropdown}>
            <div style={{ ...s.dropHeader, background: accent + "15", borderBottom: `1px solid ${accent}30` }}>
              <div style={{ ...s.dropAvatar, background: accent + "25", color: accent }}>
                {initials}
              </div>
              <div>
                <div style={s.dropName}>{displayName}</div>
                <div style={s.dropEmail}>{profile?.email || "—"}</div>
              </div>
            </div>
            <div style={s.dropItem}>
              <span style={s.dropItemIcon}>🪪</span>
              <div>
                <div style={s.dropLbl}>Role</div>
                <div style={s.dropVal}>{user?.role}</div>
              </div>
            </div>
            <div style={s.dropItem}>
              <span style={s.dropItemIcon}>🆔</span>
              <div>
                <div style={s.dropLbl}>User ID</div>
                <div style={s.dropVal}>#{user?.userId}</div>
              </div>
            </div>
            <div style={s.dropDivider} />
            <Link to="/profile" style={s.dropLink} onClick={() => setDropdownOpen(false)}>
              ✏️ Edit Profile
            </Link>
            <button onClick={handleLogout} style={s.dropLogout}>🚪 Sign Out</button>
          </div>
        )}
      </div>

      <div style={s.divider} />

      {/* Nav items */}
      <nav style={s.nav}>
        {items.map(item => {
          const active            = location.pathname === item.path;
          const isNotifications   = item.path === "/notifications";
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <div style={{ ...s.navItem, ...(active ? { ...s.navActive, borderLeftColor: accent } : {}) }}>
                <span style={s.navIcon}>{item.icon}</span>
                <span style={{ ...s.navLabel, ...(active ? { color: accent, fontWeight: "600" } : {}) }}>
                  {item.name}
                </span>
                {/* Red badge for unread notifications */}
                {isNotifications && unreadCount > 0 && (
                  <div style={s.notifBadge}>{unreadCount > 9 ? "9+" : unreadCount}</div>
                )}
                {active && !isNotifications && (
                  <div style={{ ...s.activeDot, background: accent }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div style={s.divider} />
        <button onClick={handleLogout} style={s.logoutBtn}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );
};

const s = {
  sidebar:     { width: "248px", minHeight: "100vh", background: "#0A1628", display: "flex", flexDirection: "column", padding: "0 0 16px 0", fontFamily: "'Georgia', serif", flexShrink: 0 },
  logoArea:    { display: "flex", alignItems: "center", gap: "10px", padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  logoMark:    { width: "36px", height: "36px", background: "linear-gradient(135deg, #C9A84C, #E8C97A)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#0A1628", fontWeight: "700", flexShrink: 0 },
  logoText:    { fontSize: "16px", fontWeight: "700", color: "#C9A84C", letterSpacing: "0.3px" },
  logoSub:     { fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase" },
  divider:     { height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 16px" },
  userWrap:    { position: "relative", padding: "4px 12px" },
  userCard:    { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", cursor: "pointer", border: "1px solid transparent", transition: "border-color 0.2s" },
  avatar:      { width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 },
  userInfo:    { flex: 1, minWidth: 0 },
  userName:    { fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: "700", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  rolePill:    { fontSize: "9px", fontWeight: "700", padding: "1px 7px", borderRadius: "10px", display: "inline-block", letterSpacing: "0.5px" },
  chevron:     { fontSize: "14px", color: "rgba(255,255,255,0.35)", transition: "transform 0.2s" },
  dropdown:    { position: "absolute", top: "calc(100% + 6px)", left: "12px", right: "12px", background: "#1a2740", borderRadius: "12px", zIndex: 999, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" },
  dropHeader:  { display: "flex", alignItems: "center", gap: "10px", padding: "14px" },
  dropAvatar:  { width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", flexShrink: 0 },
  dropName:    { fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.9)", marginBottom: "1px" },
  dropEmail:   { fontSize: "11px", color: "rgba(255,255,255,0.45)" },
  dropItem:    { display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px" },
  dropItemIcon:{ fontSize: "14px" },
  dropLbl:     { fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "1px" },
  dropVal:     { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  dropDivider: { height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" },
  dropLink:    { display: "flex", alignItems: "center", gap: "8px", padding: "9px 14px", fontSize: "12px", color: "#4F9CF9", textDecoration: "none", fontWeight: "600" },
  dropLogout:  { display: "flex", alignItems: "center", gap: "8px", padding: "9px 14px", fontSize: "12px", color: "#F87171", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: "600", width: "100%", textAlign: "left", borderTop: "1px solid rgba(255,255,255,0.08)" },
  nav:         { display: "flex", flexDirection: "column", gap: "2px", padding: "4px 12px", flex: 1 },
  navItem:     { display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", cursor: "pointer", position: "relative", borderLeft: "2px solid transparent", transition: "background 0.15s" },
  navActive:   { background: "rgba(255,255,255,0.06)" },
  navIcon:     { fontSize: "15px", width: "20px", textAlign: "center", flexShrink: 0 },
  navLabel:    { fontSize: "13px", color: "rgba(255,255,255,0.55)", fontWeight: "500", flex: 1 },
  activeDot:   { position: "absolute", right: "10px", width: "5px", height: "5px", borderRadius: "50%" },
  notifBadge:  { background: "#EF4444", color: "white", fontSize: "9px", fontWeight: "800", padding: "1px 5px", borderRadius: "10px", minWidth: "16px", textAlign: "center" },
  logoutBtn:   { display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 24px", background: "transparent", border: "none", color: "#F87171", fontSize: "13px", cursor: "pointer", borderRadius: "0", fontFamily: "inherit" },
};

export default Sidebar;