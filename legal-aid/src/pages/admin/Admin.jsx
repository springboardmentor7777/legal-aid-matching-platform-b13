import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import CaseDetailModal from "../../components/common/CaseDetailModal";

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => { fetchData(); }, []);

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

  const generateMatches = async (caseId, caseTitle) => {
    setMatchLoading(caseId);
    try {
      const res = await API.post(`/matches/generate/${caseId}`);
      const count = res.data?.length || 0;
      toast.success(`${count} match(es) generated for "${caseTitle}"`);
      fetchData();
    } catch (err) {
      toast.error("Failed to generate matches");
    } finally {
      setMatchLoading(null);
    }
  };

  const roleColors = {
    USER:   { bg: "#EFF6FF", color: "#1D4ED8" },
    LAWYER: { bg: "#F0FDF4", color: "#166534" },
    NGO:    { bg: "#FFF7ED", color: "#9A3412" },
    ADMIN:  { bg: "#FDF4FF", color: "#7E22CE" },
  };

  const statusColors = {
    SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8" },
    ACTIVE:    { bg: "#FFF7ED", color: "#C2410C" },
    RESOLVED:  { bg: "#F0FDF4", color: "#166534" },
    PENDING:   { bg: "#FFFBEB", color: "#92400E" },
    CLOSED:    { bg: "#F1F5F9", color: "#475569" },
  };

  return (
    <Layout>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.subtitle}>Platform overview and management</p>
        </div>
        {health && (
          <div style={{
            ...s.healthBadge,
            background: health.status === "UP" ? "#F0FDF4" : "#FEF2F2",
            color: health.status === "UP" ? "#166534" : "#DC2626",
            border: `1px solid ${health.status === "UP" ? "#86EFAC" : "#FECACA"}`
          }}>
            {health.status === "UP" ? "● System Healthy" : "● System Issue"}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={s.statsGrid}>
        {[
          { label: "Total Users",     value: stats?.totalUsers     ?? "—", icon: "👥", color: "#1D4ED8", path: "/admin/users" },
          { label: "Total Lawyers",   value: stats?.totalLawyers   ?? "—", icon: "⚖️", color: "#166534", path: "/admin/lawyers" },
          { label: "Total NGOs",      value: stats?.totalNgos      ?? "—", icon: "🤝", color: "#9A3412", path: "/admin/ngos" },
          { label: "Total Cases",     value: stats?.totalCases     ?? "—", icon: "📁", color: "#C9A84C", path: null },
          { label: "Active Cases",    value: stats?.activeCases    ?? "—", icon: "⚡", color: "#C2410C", path: null },
          { label: "Resolved Cases",  value: stats?.resolvedCases  ?? "—", icon: "✅", color: "#059669", path: null },
          { label: "Pending Cases",   value: stats?.pendingCases   ?? "—", icon: "⏳", color: "#92400E", path: null },
          { label: "Verified Lawyers",value: stats?.verifiedLawyers?? "—", icon: "✔️", color: "#7E22CE", path: null },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statTop}>
              <span style={s.statIcon}>{stat.icon}</span>
              <span style={{ ...s.statValue, color: stat.color }}>{loading ? "—" : stat.value}</span>
            </div>
            <div style={s.statBottom}>
              <span style={s.statLabel}>{stat.label}</span>
              {stat.path && <Link to={stat.path} style={s.statLink}>Manage →</Link>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={s.quickActions}>
        {[
          { icon: "👥", label: "Manage Users",   desc: "View and manage all users",   path: "/admin/users",   color: "#1D4ED8" },
          { icon: "⚖️", label: "Manage Lawyers", desc: "Verify and manage lawyers",   path: "/admin/lawyers", color: "#166534" },
          { icon: "🤝", label: "Manage NGOs",    desc: "Verify and manage NGOs",      path: "/admin/ngos",    color: "#9A3412" },
        ].map(a => (
          <Link key={a.label} to={a.path} style={s.actionCard}>
            <div style={{ ...s.actionIcon, background: a.color + "18", color: a.color }}>{a.icon}</div>
            <div>
              <div style={s.actionLabel}>{a.label}</div>
              <div style={s.actionDesc}>{a.desc}</div>
            </div>
            <span style={s.actionArrow}>→</span>
          </Link>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* Recent Users */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <h2 style={s.sectionTitle}>Recent Users</h2>
            <Link to="/admin/users" style={s.viewAll}>View all →</Link>
          </div>
          {loading ? (
            <div style={s.loading}>Loading...</div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => {
                  const rc = roleColors[u.role] || roleColors.USER;
                  return (
                    <tr key={i} style={s.tr}>
                      <td style={s.td}>{u.fullName}</td>
                      <td style={{ ...s.td, color: "#64748B" }}>{u.email}</td>
                      <td style={s.td}>
                        <span style={{ ...s.roleBadge, background: rc.bg, color: rc.color }}>{u.role}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Cases */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <h2 style={s.sectionTitle}>Recent Cases</h2>
            <span style={s.hint}>Click ⚡ to assign lawyers</span>
          </div>
          {loading ? (
            <div style={s.loading}>Loading...</div>
          ) : recentCases.length === 0 ? (
            <div style={s.empty}>No recent cases.</div>
          ) : (
            <div style={s.casesList}>
              {recentCases.map((c, i) => {
                const sc = statusColors[c.status] || statusColors.SUBMITTED;
                const caseId = c.caseId || c.id;
                const isGenerating = matchLoading === caseId;
                return (
                  <div key={i} style={s.caseRow}>
                    <div style={{ flex: 1 }}>
                      <div style={s.caseName}>{c.caseTitle || c.title}</div>
                      <div style={s.caseMeta}>{c.category} · {c.location}</div>
                    </div>
                    <div style={s.caseActions}>
                      {/* View Details button */}
                      <button
                        onClick={() => setSelectedCaseId(caseId)}
                        style={s.viewBtn}
                        title="View case details"
                      >
                        👁 View
                      </button>

                      {/* Status badge */}
                      <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>
                        {c.status}
                      </span>

                      {/* Assign button — only for SUBMITTED cases */}
                      {c.status === "SUBMITTED" && (
                        <button
                          onClick={() => generateMatches(caseId, c.caseTitle || c.title)}
                          disabled={isGenerating}
                          style={{ ...s.assignBtn, opacity: isGenerating ? 0.6 : 1 }}
                          title="Generate matches and assign to lawyers/NGOs"
                        >
                          {isGenerating ? "⏳" : "⚡ Assign"}
                        </button>
                      )}

                      {c.status === "ACTIVE" && (
                        <span style={s.assignedBadge}>✅ Assigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
    </Layout>
  );
};

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  healthBadge: { fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { background: "white", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  statIcon: { fontSize: "20px" },
  statValue: { fontSize: "26px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { fontSize: "11px", color: "#64748B" },
  statLink: { fontSize: "11px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },

  quickActions: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" },
  actionCard: { display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "12px", padding: "18px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  actionIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 },
  actionLabel: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", marginBottom: "2px" },
  actionDesc: { fontSize: "11px", color: "#94A3B8" },
  actionArrow: { marginLeft: "auto", fontSize: "16px", color: "#C9A84C" },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  tableCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  viewAll: { fontSize: "12px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  hint: { fontSize: "11px", color: "#94A3B8", fontStyle: "italic" },
  loading: { textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: "13px" },
  empty: { textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: "13px" },

  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", padding: "8px 0", textAlign: "left", borderBottom: "1px solid #F1F5F9", textTransform: "uppercase", letterSpacing: "0.5px" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { fontSize: "13px", color: "#0F1F3D", padding: "10px 0" },
  roleBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },

  casesList: { display: "flex", flexDirection: "column", gap: "10px" },
  caseRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#F8FAFC", borderRadius: "8px", gap: "10px" },
  caseName: { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", marginBottom: "2px" },
  caseMeta: { fontSize: "11px", color: "#94A3B8" },
  caseActions: { display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 },
  statusBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px" },
  viewBtn: { fontSize: "11px", color: "#1D4ED8", background: "#EFF6FF", border: "none", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" },
  assignBtn: { background: "#0F1F3D", color: "white", border: "none", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  assignedBadge: { fontSize: "11px", color: "#166534", background: "#F0FDF4", padding: "3px 8px", borderRadius: "6px", fontWeight: "600" },
};

export default Admin;