import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/admin/login", { username, password });
      // Store token and set role as ADMIN
      login({
        accessToken: res.data.accessToken,
        refreshToken: res.data.accessToken,
        role: "ADMIN",
        userId: "admin",
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardTop}>
          <div style={styles.shield}>🛡️</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Restricted access — authorized personnel only</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Admin username"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = "#C9A84C"}
              onBlur={e => e.target.style.borderColor = "#334155"}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = "#C9A84C"}
              onBlur={e => e.target.style.borderColor = "#334155"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Access Admin Panel →"}
          </button>
        </form>

        <p style={styles.backLink}>
          Not an admin?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Go to regular login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(160deg, #0A1628 0%, #0F1F3D 100%)",
    fontFamily: "'Georgia', serif"
  },
  card: {
    background: "#1E2D4A", borderRadius: "16px", padding: "48px",
    width: "100%", maxWidth: "400px",
    border: "1px solid rgba(201,168,76,0.2)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)"
  },
  cardTop: { textAlign: "center", marginBottom: "32px" },
  shield: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "24px", fontWeight: "700", color: "white", marginBottom: "8px" },
  subtitle: { fontSize: "13px", color: "#94A3B8" },
  errorBox: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#FCA5A5", padding: "12px 16px", borderRadius: "8px",
    fontSize: "13px", marginBottom: "20px"
  },
  field: { marginBottom: "20px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: {
    width: "100%", padding: "12px 14px", border: "1.5px solid #334155",
    borderRadius: "8px", fontSize: "14px", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit", color: "white", background: "#0F1F3D"
  },
  btn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
    color: "#0F1F3D", border: "none", borderRadius: "8px",
    fontSize: "14px", fontWeight: "700", cursor: "pointer",
    fontFamily: "inherit", marginTop: "8px"
  },
  backLink: { textAlign: "center", fontSize: "12px", color: "#64748B", marginTop: "24px" },
  link: { color: "#C9A84C", cursor: "pointer", fontWeight: "600" },
};

export default AdminLogin;