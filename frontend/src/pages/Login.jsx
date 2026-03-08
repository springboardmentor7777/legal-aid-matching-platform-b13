import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
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
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>⚖️ LegalAid</div>
          <h2 style={styles.tagline}>Justice is a right,<br />not a privilege.</h2>
          <p style={styles.subTagline}>
            Connecting citizens with verified lawyers and NGOs across India.
          </p>
          <div style={styles.stats}>
            <div style={styles.stat}><span style={styles.statNum}>2,400+</span><span style={styles.statLabel}>Cases Filed</span></div>
            <div style={styles.stat}><span style={styles.statNum}>800+</span><span style={styles.statLabel}>Lawyers</span></div>
            <div style={styles.stat}><span style={styles.statNum}>150+</span><span style={styles.statLabel}>NGOs</span></div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{...styles.btn, opacity: loading ? 0.7 : 1}}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Georgia', serif" },
  left: {
    width: "45%", background: "linear-gradient(160deg, #0F1F3D 0%, #1a3560 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "60px",
    position: "relative", overflow: "hidden"
  },
  leftContent: { position: "relative", zIndex: 1, color: "white" },
  logo: { fontSize: "22px", fontWeight: "700", color: "#C9A84C", marginBottom: "48px", letterSpacing: "1px" },
  tagline: { fontSize: "36px", fontWeight: "700", lineHeight: "1.3", color: "#fff", marginBottom: "16px" },
  subTagline: { fontSize: "15px", color: "#94A3B8", lineHeight: "1.7", marginBottom: "48px", maxWidth: "320px" },
  stats: { display: "flex", gap: "32px" },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { fontSize: "24px", fontWeight: "700", color: "#C9A84C" },
  statLabel: { fontSize: "12px", color: "#94A3B8", marginTop: "2px", letterSpacing: "0.5px" },
  right: {
    width: "55%", background: "#F8FAFC",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "60px"
  },
  card: {
    background: "white", borderRadius: "16px", padding: "48px",
    width: "100%", maxWidth: "420px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)"
  },
  title: { fontSize: "26px", fontWeight: "700", color: "#0F1F3D", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748B", marginBottom: "32px" },
  errorBox: {
    background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626",
    padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px"
  },
  field: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input: {
    width: "100%", padding: "12px 14px", border: "1.5px solid #E2E8F0",
    borderRadius: "8px", fontSize: "14px", color: "#1E293B",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit"
  },
  btn: {
    width: "100%", padding: "13px", background: "linear-gradient(135deg, #0F1F3D, #1a3560)",
    color: "white", border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", marginTop: "8px", letterSpacing: "0.3px",
    fontFamily: "inherit"
  },
  footer: { textAlign: "center", fontSize: "13px", color: "#64748B", marginTop: "24px" },
  link: { color: "#C9A84C", fontWeight: "600", textDecoration: "none" },
};

export default Login;