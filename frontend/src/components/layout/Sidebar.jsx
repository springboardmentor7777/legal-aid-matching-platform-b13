import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const menuItems = {
  USER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Submit Case", path: "/submit-case", icon: "📝" },
    { name: "My Cases", path: "/my-cases", icon: "📁" },
    { name: "Find Lawyers", path: "/lawyers", icon: "⚖️" },
  ],
  LAWYER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Assigned Cases", path: "/lawyer/cases", icon: "⚖️" },
    { name: "Schedule", path: "/lawyer/schedule", icon: "📅" },
  ],
  NGO: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Cases", path: "/ngo/cases", icon: "📁" },
    { name: "Lawyers", path: "/ngo/lawyers", icon: "⚖️" },
  ],
  ADMIN: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Lawyers", path: "/admin/lawyers", icon: "⚖️" },
    { name: "NGOs", path: "/admin/ngos", icon: "🤝" },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);

  const items = menuItems[user?.role] || menuItems.USER;

  // Fetch profile when dropdown opens
  useEffect(() => {
    if (dropdownOpen && !profile) {
      API.get("/profile/me")
        .then(res => setProfile(res.data))
        .catch(() => {});
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleColors = {
    USER: { bg: "#EFF6FF", color: "#1D4ED8" },
    LAWYER: { bg: "#F0FDF4", color: "#166534" },
    NGO: { bg: "#FFF7ED", color: "#9A3412" },
    ADMIN: { bg: "#FDF4FF", color: "#7E22CE" },
  };
  const badge = roleColors[user?.role] || roleColors.USER;

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚖️</span>
        <span style={styles.logoText}>LegalAid</span>
      </div>

      {/* User Card with Dropdown */}
      <div ref={dropdownRef} style={styles.userWrapper}>
        <div style={styles.userCard} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div style={styles.avatar}>{user?.role?.[0] || "U"}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>My Account</div>
            <span style={{ ...styles.badge, background: badge.bg, color: badge.color }}>
              {user?.role}
            </span>
          </div>
          <span style={{ ...styles.chevron, transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▾
          </span>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div style={styles.dropdown}>
            {profile ? (
              <>
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownAvatar}>
                    {profile.fullName?.[0] || "U"}
                  </div>
                  <div>
                    <div style={styles.dropdownName}>{profile.fullName}</div>
                    <div style={styles.dropdownEmail}>{profile.email}</div>
                  </div>
                </div>

                <div style={styles.dropdownDivider} />

                <div style={styles.dropdownItem}>
                  <span style={styles.dropdownItemIcon}>🪪</span>
                  <div>
                    <div style={styles.dropdownItemLabel}>Role</div>
                    <div style={styles.dropdownItemValue}>{profile.role}</div>
                  </div>
                </div>

                <div style={styles.dropdownItem}>
                  <span style={styles.dropdownItemIcon}>🆔</span>
                  <div>
                    <div style={styles.dropdownItemLabel}>User ID</div>
                    <div style={styles.dropdownItemValue}>#{user?.userId}</div>
                  </div>
                </div>

                <div style={styles.dropdownDivider} />

                <Link
                  to="/profile"
                  style={styles.dropdownBtn}
                  onClick={() => setDropdownOpen(false)}
                >
                  ✏️ Edit Profile
                </Link>

                <button onClick={handleLogout} style={styles.dropdownLogout}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div style={styles.dropdownLoading}>Loading...</div>
            )}
          </div>
        )}
      </div>

      <div style={styles.divider} />

      {/* Nav Items */}
      <nav style={styles.nav}>
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={styles.linkReset}>
              <div style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}>
                <span style={styles.navIcon}>{item.icon}</span>
                <span style={{ ...styles.navLabel, ...(active ? styles.navLabelActive : {}) }}>
                  {item.name}
                </span>
                {active && <div style={styles.activeIndicator} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div style={styles.bottom}>
        <div style={styles.divider} />
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px", minHeight: "100vh", background: "#0F1F3D",
    display: "flex", flexDirection: "column", padding: "24px 16px",
    fontFamily: "'Georgia', serif", flexShrink: 0, position: "relative"
  },
  logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingLeft: "8px" },
  logoIcon: { fontSize: "22px" },
  logoText: { fontSize: "18px", fontWeight: "700", color: "#C9A84C", letterSpacing: "0.5px" },

  // User card
  userWrapper: { position: "relative" },
  userCard: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.06)", borderRadius: "10px",
    padding: "12px", cursor: "pointer", userSelect: "none"
  },
  avatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700", color: "#0F1F3D", flexShrink: 0
  },
  userInfo: { flex: 1 },
  userName: { fontSize: "12px", color: "#94A3B8", marginBottom: "3px" },
  badge: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },
  chevron: { fontSize: "12px", color: "#94A3B8", transition: "transform 0.2s" },

  // Dropdown
  dropdown: {
    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
    background: "white", borderRadius: "12px", zIndex: 999,
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden"
  },
  dropdownHeader: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "16px", background: "linear-gradient(135deg, #0F1F3D, #1a3560)"
  },
  dropdownAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700", color: "#0F1F3D", flexShrink: 0
  },
  dropdownName: { fontSize: "13px", fontWeight: "700", color: "white", marginBottom: "2px" },
  dropdownEmail: { fontSize: "11px", color: "#94A3B8" },
  dropdownDivider: { height: "1px", background: "#F1F5F9" },
  dropdownItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 16px"
  },
  dropdownItemIcon: { fontSize: "16px" },
  dropdownItemLabel: { fontSize: "10px", color: "#94A3B8", marginBottom: "1px" },
  dropdownItemValue: { fontSize: "13px", fontWeight: "600", color: "#0F1F3D" },
  dropdownBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", fontSize: "13px", color: "#1D4ED8",
    textDecoration: "none", fontWeight: "600", width: "100%",
    boxSizing: "border-box"
  },
  dropdownLogout: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", fontSize: "13px", color: "#EF4444",
    background: "transparent", border: "none", cursor: "pointer",
    fontFamily: "inherit", fontWeight: "600", width: "100%",
    textAlign: "left", borderTop: "1px solid #F1F5F9"
  },
  dropdownLoading: { padding: "20px", textAlign: "center", fontSize: "13px", color: "#94A3B8" },

  divider: { height: "1px", background: "rgba(255,255,255,0.08)", margin: "16px 0" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  linkReset: { textDecoration: "none" },
  navItem: {
    display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
    borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", position: "relative"
  },
  navItemActive: { background: "rgba(201,168,76,0.15)" },
  navIcon: { fontSize: "16px", width: "20px", textAlign: "center" },
  navLabel: { fontSize: "13px", color: "#94A3B8", fontWeight: "500" },
  navLabelActive: { color: "#C9A84C", fontWeight: "600" },
  activeIndicator: {
    position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)",
    width: "3px", height: "20px", background: "#C9A84C", borderRadius: "2px"
  },
  bottom: { marginTop: "auto" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "8px", width: "100%",
    padding: "10px 12px", background: "transparent", border: "none",
    color: "#EF4444", fontSize: "13px", cursor: "pointer", borderRadius: "8px",
    fontFamily: "inherit", fontWeight: "500"
  },
};

export default Sidebar;