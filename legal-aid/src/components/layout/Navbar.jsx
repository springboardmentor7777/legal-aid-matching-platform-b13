import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/submit-case": "Submit a Case",
  "/my-cases": "My Cases",
  "/matches": "Matches",
  "/chat": "Messages",
  "/appointments": "Appointments",
  "/notifications": "Notifications",
  "/lawyers": "Lawyer Directory",
  "/profile": "Profile",
  "/admin": "Admin Dashboard",
  "/admin/users": "Manage Users",
  "/admin/lawyers": "Manage Lawyers",
  "/admin/ngos": "Manage NGOs",
  "/lawyer/cases": "Assigned Cases",
  "/ngo/cases": "Community Cases",
};

const roleColors = {
  USER:   { bg: "#EFF6FF", color: "#1D4ED8" },
  LAWYER: { bg: "#F0FDF4", color: "#166534" },
  NGO:    { bg: "#FFF7ED", color: "#9A3412" },
  ADMIN:  { bg: "#FAF5FF", color: "#7E22CE" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rc = roleColors[user?.role] || roleColors.USER;
  const title = pageTitles[location.pathname] || "LegalAid";

  return (
    <div style={s.navbar}>
      <div style={s.left}>
        <div style={s.pageTitle}>{title}</div>
        <div style={s.breadcrumb}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      </div>
      <div style={s.right}>
        <div style={{ ...s.roleBadge, background: rc.bg, color: rc.color }}>
          {user?.role}
        </div>
        <button onClick={() => { logout(); navigate("/login"); }} style={s.signOutBtn}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

const s = {
  navbar: { height: "60px", background: "white", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0, boxShadow: "0 1px 0 #F1F5F9" },
  left: {},
  pageTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  breadcrumb: { fontSize: "11px", color: "#94A3B8", marginTop: "1px" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  roleBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", letterSpacing: "0.3px" },
  signOutBtn: { fontSize: "12px", color: "#64748B", background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600" },
};

export default Navbar;