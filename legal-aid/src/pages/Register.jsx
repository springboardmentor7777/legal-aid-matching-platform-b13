import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const categories = ["Property", "Criminal", "Family", "Civil", "Labour", "Consumer", "Human Rights", "Other"];

const Register = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "USER",
    experienceYears: "", specialization: "", location: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "USER", label: "Citizen", desc: "I need legal help", icon: "👤" },
    { value: "LAWYER", label: "Lawyer", desc: "I provide legal services", icon: "⚖️" },
    { value: "NGO", label: "NGO", desc: "We support legal aid", icon: "🤝" },
  ];

  const isLawyer = form.role === "LAWYER";
  const isNgo = form.role === "NGO";

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>⚖️ LegalAid</div>
          <h2 style={styles.tagline}>Start your journey<br />to justice today.</h2>
          <p style={styles.subTagline}>
            Join thousands of citizens, lawyers, and NGOs on India's leading legal aid platform.
          </p>
          <div style={styles.features}>
            {["Free to join", "Verified professionals", "Secure & confidential", "24/7 access"].map(f => (
              <div key={f} style={styles.feature}>
                <span style={styles.check}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.subtitle}>Join the LegalAid platform — it's free</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>{isNgo ? "Organization Name" : "Full Name"}</label>
              <input name="fullName" placeholder={isNgo ? "Legal Aid Foundation" : "Rahul Sharma"} required
                onChange={handleChange} style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" required
                onChange={handleChange} style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input name="password" type="password" placeholder="Min. 6 characters" required
                onChange={handleChange} style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>I am a...</label>
              <div style={styles.roleGrid}>
                {roles.map(r => (
                  <div key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{ ...styles.roleCard, ...(form.role === r.value ? styles.roleCardActive : {}) }}>
                    <span style={styles.roleIcon}>{r.icon}</span>
                    <span style={styles.roleLabel}>{r.label}</span>
                    <span style={styles.roleDesc}>{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lawyer Fields */}
            {isLawyer && (
              <div style={styles.extraSection}>
                <div style={styles.extraSectionTitle}>
                  <span>⚖️</span><span>Lawyer Details</span>
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.field, flex: 1 }}>
                    <label style={styles.label}>Years of Experience <span style={styles.req}>*</span></label>
                    <input name="experienceYears" type="number" min="0" max="60"
                      placeholder="e.g. 5" value={form.experienceYears}
                      onChange={handleChange} required style={styles.input}
                      onFocus={e => e.target.style.borderColor = "#C9A84C"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                  <div style={{ ...styles.field, flex: 1 }}>
                    <label style={styles.label}>Location <span style={styles.req}>*</span></label>
                    <input name="location" placeholder="e.g. Hyderabad"
                      value={form.location} onChange={handleChange}
                      required style={styles.input}
                      onFocus={e => e.target.style.borderColor = "#C9A84C"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Specialization / Expertise <span style={styles.req}>*</span></label>
                  <select name="specialization" value={form.specialization}
                    onChange={handleChange} required style={styles.input}>
                    <option value="">Select your area of expertise...</option>
                    {categories.map(c => <option key={c} value={c}>{c} Law</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* NGO Fields */}
            {isNgo && (
              <div style={{ ...styles.extraSection, borderColor: "#D1FAE5" }}>
                <div style={{ ...styles.extraSectionTitle, color: "#065F46" }}>
                  <span>🤝</span><span>NGO Details</span>
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.field, flex: 1 }}>
                    <label style={styles.label}>Location <span style={styles.req}>*</span></label>
                    <input name="location" placeholder="e.g. Hyderabad"
                      value={form.location} onChange={handleChange}
                      required style={styles.input}
                      onFocus={e => e.target.style.borderColor = "#C9A84C"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                  <div style={{ ...styles.field, flex: 1 }}>
                    <label style={styles.label}>Area of Expertise <span style={styles.req}>*</span></label>
                    <select name="specialization" value={form.specialization}
                      onChange={handleChange} required style={styles.input}>
                      <option value="">Select expertise...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Georgia', serif" },
  left: {
    width: "40%", background: "linear-gradient(160deg, #0F1F3D 0%, #1a3560 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "60px",
  },
  leftContent: { color: "white" },
  logo: { fontSize: "22px", fontWeight: "700", color: "#C9A84C", marginBottom: "48px" },
  tagline: { fontSize: "32px", fontWeight: "700", lineHeight: "1.3", color: "#fff", marginBottom: "16px" },
  subTagline: { fontSize: "14px", color: "#94A3B8", lineHeight: "1.7", marginBottom: "40px" },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  feature: { fontSize: "14px", color: "#CBD5E1", display: "flex", alignItems: "center", gap: "10px" },
  check: { color: "#C9A84C", fontWeight: "700" },
  right: {
    width: "60%", background: "#F8FAFC",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px"
  },
  card: {
    background: "white", borderRadius: "16px", padding: "44px",
    width: "100%", maxWidth: "480px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
    maxHeight: "90vh", overflowY: "auto"
  },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", marginBottom: "6px" },
  subtitle: { fontSize: "14px", color: "#64748B", marginBottom: "28px" },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  req: { color: "#EF4444" },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0",
    borderRadius: "8px", fontSize: "14px", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit"
  },
  row: { display: "flex", gap: "12px" },
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" },
  roleCard: {
    border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "14px 10px",
    cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "4px", transition: "all 0.2s"
  },
  roleCardActive: { border: "1.5px solid #C9A84C", background: "#FFFBEB" },
  roleIcon: { fontSize: "22px" },
  roleLabel: { fontSize: "13px", fontWeight: "700", color: "#0F1F3D" },
  roleDesc: { fontSize: "10px", color: "#94A3B8" },
  extraSection: {
    background: "#F8FAFC", border: "1.5px solid #E2E8F0",
    borderRadius: "10px", padding: "16px", marginBottom: "18px"
  },
  extraSectionTitle: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "13px", fontWeight: "700", color: "#0F1F3D",
    marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0"
  },
  btn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)",
    color: "white", border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", marginTop: "4px", fontFamily: "inherit"
  },
  footer: { textAlign: "center", fontSize: "13px", color: "#64748B", marginTop: "20px" },
  link: { color: "#C9A84C", fontWeight: "600", textDecoration: "none" },
};

export default Register;