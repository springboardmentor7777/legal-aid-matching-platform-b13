import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logoLink}>⚖️ LegalAid</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.roleTag}>{user.role}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.signIn}>Sign In</Link>
            <Link to="/register" style={styles.getStarted}>Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: "60px", background: "white",
    borderBottom: "1px solid #E2E8F0", fontFamily: "'Georgia', serif",
    position: "sticky", top: 0, zIndex: 100
  },
  left: {},
  logoLink: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", textDecoration: "none" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  roleTag: {
    fontSize: "11px", fontWeight: "700", padding: "3px 10px",
    background: "#EFF6FF", color: "#1D4ED8", borderRadius: "20px"
  },
  signIn: { fontSize: "14px", color: "#374151", textDecoration: "none" },
  getStarted: {
    fontSize: "13px", fontWeight: "600", color: "white",
    background: "#0F1F3D", padding: "8px 16px", borderRadius: "8px",
    textDecoration: "none"
  },
  logoutBtn: {
    fontSize: "13px", color: "#EF4444", background: "transparent",
    border: "1px solid #FECACA", padding: "6px 14px",
    borderRadius: "8px", cursor: "pointer", fontFamily: "inherit"
  },
};

export default Navbar;