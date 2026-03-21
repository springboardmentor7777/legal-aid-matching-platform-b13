import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/cases/my")
      .then(res => setCases(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total = cases.length;
  const submitted = cases.filter(c => c.status === "SUBMITTED").length;
  const active = cases.filter(c => c.status === "ACTIVE").length;
  const resolved = cases.filter(c => c.status === "RESOLVED").length;

  const statusColor = {
    SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8" },
    ACTIVE: { bg: "#F0FDF4", color: "#166534" },
    RESOLVED: { bg: "#F0FDF4", color: "#166534" },
    PENDING: { bg: "#FFFBEB", color: "#92400E" },
    CLOSED: { bg: "#F1F5F9", color: "#475569" },
  };

  return (
    <Layout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome back 👋</h1>
          <p style={styles.subtitle}>Here's an overview of your legal cases</p>
        </div>
        <Link to="/submit-case" style={styles.submitBtn}>+ Submit New Case</Link>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Cases", value: total, icon: "📁", color: "#0F1F3D" },
          { label: "Submitted", value: submitted, icon: "📝", color: "#1D4ED8" },
          { label: "Active", value: active, icon: "⚡", color: "#059669" },
          { label: "Resolved", value: resolved, icon: "✅", color: "#C9A84C" },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            </div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          {[
            { icon: "📝", label: "Submit Case", desc: "File a new legal case", path: "/submit-case", color: "#0F1F3D" },
            { icon: "⚖️", label: "Find Lawyers", desc: "Browse verified lawyers", path: "/lawyers", color: "#1D4ED8" },
            { icon: "📁", label: "My Cases", desc: "View all your cases", path: "/my-cases", color: "#059669" },
            { icon: "👤", label: "Profile", desc: "Update your details", path: "/profile", color: "#C9A84C" },
          ].map(a => (
            <Link key={a.label} to={a.path} style={styles.actionCard}>
              <div style={{ ...styles.actionIcon, background: a.color }}>{a.icon}</div>
              <div style={styles.actionLabel}>{a.label}</div>
              <div style={styles.actionDesc}>{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Cases */}
      <div style={styles.casesSection}>
        <div style={styles.casesHeader}>
          <h2 style={styles.sectionTitle}>Recent Cases</h2>
          <Link to="/my-cases" style={styles.viewAll}>View all →</Link>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading cases...</div>
        ) : cases.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📂</div>
            <p style={styles.emptyText}>No cases submitted yet.</p>
            <Link to="/submit-case" style={styles.emptyBtn}>Submit your first case</Link>
          </div>
        ) : (
          <div style={styles.casesList}>
            {cases.slice(0, 5).map(c => {
              const sc = statusColor[c.status] || statusColor.SUBMITTED;
              return (
                <div key={c.id} style={styles.caseCard}>
                  <div style={styles.caseLeft}>
                    <div style={styles.caseId}>#{c.id}</div>
                    <div>
                      <div style={styles.caseTitle}>{c.title || c.caseTitle}</div>
                      <div style={styles.caseMeta}>
                        {c.category} · {c.location} · {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <div style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                    {c.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  subtitle: { fontSize: "14px", color: "#64748B", marginTop: "4px" },
  submitBtn: {
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)", color: "white",
    padding: "10px 20px", borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", textDecoration: "none"
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: {
    background: "white", borderRadius: "12px", padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  statIcon: { fontSize: "22px" },
  statValue: { fontSize: "28px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statLabel: { fontSize: "12px", color: "#64748B", fontWeight: "500" },
  quickActions: { marginBottom: "28px" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0F1F3D", marginBottom: "14px", fontFamily: "'Georgia', serif" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" },
  actionCard: {
    background: "white", borderRadius: "12px", padding: "20px", textDecoration: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "block"
  },
  actionIcon: {
    width: "40px", height: "40px", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", marginBottom: "10px"
  },
  actionLabel: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", marginBottom: "3px" },
  actionDesc: { fontSize: "11px", color: "#94A3B8" },
  casesSection: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  casesHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  viewAll: { fontSize: "13px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  loading: { textAlign: "center", padding: "40px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "48px" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyText: { color: "#64748B", marginBottom: "16px" },
  emptyBtn: {
    background: "#0F1F3D", color: "white", padding: "10px 20px",
    borderRadius: "8px", fontSize: "13px", textDecoration: "none", fontWeight: "600"
  },
  casesList: { display: "flex", flexDirection: "column", gap: "10px" },
  caseCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", background: "#F8FAFC", borderRadius: "8px",
    border: "1px solid #E2E8F0"
  },
  caseLeft: { display: "flex", alignItems: "center", gap: "16px" },
  caseId: {
    fontSize: "11px", fontWeight: "700", color: "#94A3B8",
    background: "#E2E8F0", padding: "3px 8px", borderRadius: "4px"
  },
  caseTitle: { fontSize: "14px", fontWeight: "600", color: "#0F1F3D", marginBottom: "3px" },
  caseMeta: { fontSize: "11px", color: "#94A3B8", textTransform: "capitalize" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" },
};

export default UserDashboard;