import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, casesRes, healthRes] = await Promise.all([
          API.get("/admin/dashboard/stats"),
          API.get("/admin/dashboard/recent-users"),
          API.get("/admin/dashboard/recent-cases"),
          API.get("/admin/dashboard/system-health"),
        ]);
        setStats(statsRes.data);
        setRecentUsers(usersRes.data || []);
        setRecentCases(casesRes.data || []);
        setHealth(healthRes.data);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roleColors = {
    USER: { bg: "#EFF6FF", color: "#1D4ED8" },
    LAWYER: { bg: "#F0FDF4", color: "#166534" },
    NGO: { bg: "#FFF7ED", color: "#9A3412" },
    ADMIN: { bg: "#FDF4FF", color: "#7E22CE" },
  };

  const statusColors = {
    SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8" },
    ACTIVE: { bg: "#FFF7ED", color: "#C2410C" },
    RESOLVED: { bg: "#F0FDF4", color: "#166534" },
    PENDING: { bg: "#FFFBEB", color: "#92400E" },
    CLOSED: { bg: "#F1F5F9", color: "#475569" },
  };

  return (
    <Layout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Platform overview and management</p>
        </div>
        <div style={styles.headerRight}>
          {health && (
            <div style={{ ...styles.healthBadge, background: health.status === "UP" ? "#F0FDF4" : "#FEF2F2", color: health.status === "UP" ? "#166534" : "#DC2626", border: `1px solid ${health.status === "UP" ? "#86EFAC" : "#FECACA"}` }}>
              {health.status === "UP" ? "● System Healthy" : "● System Issue"}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥", color: "#1D4ED8", path: "/admin/users" },
          { label: "Total Lawyers", value: stats?.totalLawyers ?? "—", icon: "⚖️", color: "#166534", path: "/admin/lawyers" },
          { label: "Total NGOs", value: stats?.totalNgos ?? "—", icon: "🤝", color: "#9A3412", path: "/admin/ngos" },
          { label: "Total Cases", value: stats?.totalCases ?? "—", icon: "📁", color: "#C9A84C", path: null },
          { label: "Active Cases", value: stats?.activeCases ?? "—", icon: "⚡", color: "#C2410C", path: null },
          { label: "Resolved Cases", value: stats?.resolvedCases ?? "—", icon: "✅", color: "#059669", path: null },
          { label: "Pending Cases", value: stats?.pendingCases ?? "—", icon: "⏳", color: "#92400E", path: null },
          { label: "Verified Lawyers", value: stats?.verifiedLawyers ?? "—", icon: "✔️", color: "#7E22CE", path: null },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={{ ...styles.statValue, color: s.color }}>{loading ? "—" : s.value}</span>
            </div>
            <div style={styles.statBottom}>
              <span style={styles.statLabel}>{s.label}</span>
              {s.path && <Link to={s.path} style={styles.statLink}>Manage →</Link>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        {[
          { icon: "👥", label: "Manage Users", desc: "View and manage all users", path: "/admin/users", color: "#1D4ED8" },
          { icon: "⚖️", label: "Manage Lawyers", desc: "Verify and manage lawyers", path: "/admin/lawyers", color: "#166534" },
          { icon: "🤝", label: "Manage NGOs", desc: "Verify and manage NGOs", path: "/admin/ngos", color: "#9A3412" },
        ].map(a => (
          <Link key={a.label} to={a.path} style={styles.actionCard}>
            <div style={{ ...styles.actionIcon, background: a.color }}>{a.icon}</div>
            <div>
              <div style={styles.actionLabel}>{a.label}</div>
              <div style={styles.actionDesc}>{a.desc}</div>
            </div>
            <span style={styles.actionArrow}>→</span>
          </Link>
        ))}
      </div>

      <div style={styles.twoCol}>
        {/* Recent Users */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.sectionTitle}>Recent Users</h2>
            <Link to="/admin/users" style={styles.viewAll}>View all →</Link>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => {
                  const rc = roleColors[u.role] || roleColors.USER;
                  return (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{u.fullName}</td>
                      <td style={{ ...styles.td, color: "#64748B" }}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.roleBadge, background: rc.bg, color: rc.color }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Cases */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.sectionTitle}>Recent Cases</h2>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : recentCases.length === 0 ? (
            <div style={styles.empty}>No recent cases.</div>
          ) : (
            <div style={styles.casesList}>
              {recentCases.map((c, i) => {
                const sc = statusColors[c.status] || statusColors.SUBMITTED;
                return (
                  <div key={i} style={styles.caseRow}>
                    <div>
                      <div style={styles.caseName}>{c.title || c.caseTitle}</div>
                      <div style={styles.caseMeta}>{c.category} · {c.location}</div>
                    </div>
                    <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                      {c.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#64748B" },
  headerRight: { display: "flex", gap: "12px", alignItems: "center" },
  healthBadge: { fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { background: "white", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  statIcon: { fontSize: "20px" },
  statValue: { fontSize: "26px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { fontSize: "11px", color: "#64748B" },
  statLink: { fontSize: "11px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  quickActions: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" },
  actionCard: {
    display: "flex", alignItems: "center", gap: "14px", background: "white",
    borderRadius: "12px", padding: "18px", textDecoration: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9"
  },
  actionIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 },
  actionLabel: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", marginBottom: "2px" },
  actionDesc: { fontSize: "11px", color: "#94A3B8" },
  actionArrow: { marginLeft: "auto", fontSize: "16px", color: "#C9A84C" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  tableCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  viewAll: { fontSize: "12px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  loading: { textAlign: "center", padding: "30px", color: "#94A3B8" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", fontWeight: "700", color: "#94A3B8", padding: "8px 0", textAlign: "left", borderBottom: "1px solid #F1F5F9", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { fontSize: "13px", color: "#0F1F3D", padding: "10px 0" },
  roleBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },
  empty: { textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: "13px" },
  casesList: { display: "flex", flexDirection: "column", gap: "10px" },
  caseRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#F8FAFC", borderRadius: "8px" },
  caseName: { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", marginBottom: "2px" },
  caseMeta: { fontSize: "11px", color: "#94A3B8" },
  statusBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", flexShrink: 0 },
};

export default Admin;