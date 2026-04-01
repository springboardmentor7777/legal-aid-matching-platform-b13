import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import CaseDetailModal from "../../components/common/CaseDetailModal";

// Simple bar chart (no library)
const BarChart = ({ data, title }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 320, H = 130, PAD = 32, barW = Math.floor((W - PAD * 2) / data.length) - 8;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", marginBottom: "8px",
        textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 30}`} overflow="visible">
        {[0, 0.5, 1].map((r, i) => (
          <g key={i}>
            <line x1={PAD} y1={PAD + (1-r)*H} x2={W-PAD} y2={PAD + (1-r)*H} stroke="#F1F5F9" strokeWidth="1"/>
            <text x={PAD-4} y={PAD + (1-r)*H + 4} textAnchor="end" fontSize="9" fill="#94A3B8">{Math.round(r*max)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const bh = (d.value / max) * H;
          const x  = PAD + i * (barW + 8);
          const y  = PAD + H - bh;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={bh} rx="4" fill={d.color} opacity="0.85"/>
              <text x={x + barW/2} y={PAD+H+14} textAnchor="middle" fontSize="9" fill="#64748B">{d.label}</text>
              {d.value > 0 && <text x={x + barW/2} y={y-4} textAnchor="middle" fontSize="9" fontWeight="700" fill={d.color}>{d.value}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const DonutChart = ({ data, title }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 48, cx = 75, cy = 65;
  let angle = -Math.PI / 2;
  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle);
    return { ...d, x1, y1, x2, y2, large: sweep > Math.PI ? 1 : 0, sweep };
  });
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", marginBottom: "8px",
        textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg width="150" height="130">
          <text x={cx} y={cy-5} textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F1F3D">{total}</text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#94A3B8">Total</text>
          {slices.map((sl, i) => sl.sweep > 0.01 && (
            <path key={i} d={`M${cx},${cy} L${sl.x1},${sl.y1} A${R},${R} 0 ${sl.large},1 ${sl.x2},${sl.y2} Z`}
              fill={sl.color} opacity="0.88"/>
          ))}
          <circle cx={cx} cy={cy} r={R*0.55} fill="white"/>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: d.color, flexShrink: 0 }}/>
              <span style={{ fontSize: "11px", color: "#64748B" }}>{d.label}</span>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#0F1F3D", marginLeft: "auto", paddingLeft: "8px" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [stats, setStats]             = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [health, setHealth]           = useState(null);
  const [loading, setLoading]         = useState(true);
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const roleColors = {
    USER:   { bg: "#EFF6FF", color: "#1D4ED8" },
    LAWYER: { bg: "#F0FDF4", color: "#166534" },
    NGO:    { bg: "#FFF7ED", color: "#9A3412" },
    ADMIN:  { bg: "#FDF4FF", color: "#7E22CE" },
  };

  const statusColors = {
    OPEN:      { bg: "#EFF6FF", color: "#1D4ED8" },
    ASSIGNED:  { bg: "#F0FDF4", color: "#166534" },
    RESOLVED:  { bg: "#DCFCE7", color: "#059669" },
    SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8" },
    ACTIVE:    { bg: "#FFF7ED", color: "#C2410C" },
    PENDING:   { bg: "#FFFBEB", color: "#92400E" },
    CLOSED:    { bg: "#F1F5F9", color: "#475569" },
  };

  const userBarData = [
    { label: "Citizens",  value: stats?.totalUsers   || 0, color: "#1D4ED8" },
    { label: "Lawyers",   value: stats?.totalLawyers || 0, color: "#166534" },
    { label: "NGOs",      value: stats?.totalNgos    || 0, color: "#9A3412" },
  ];
  const caseDonutData = [
    { label: "Open",     value: stats?.pendingCases  || 0, color: "#3B82F6" },
    { label: "Assigned", value: stats?.activeCases   || 0, color: "#22C55E" },
    { label: "Resolved", value: stats?.resolvedCases || 0, color: "#059669" },
  ];

  return (
    <Layout>
      {selectedCaseId && <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.subtitle}>Monitor platform activity — cases are self-assigned by users</p>
        </div>
        {health && (
          <div style={{ ...s.healthBadge,
            background: health.status === "UP" ? "#F0FDF4" : "#FEF2F2",
            color:      health.status === "UP" ? "#166534" : "#DC2626",
            border:     `1px solid ${health.status === "UP" ? "#86EFAC" : "#FECACA"}`,
          }}>
            {health.status === "UP" ? "● System Healthy" : "● System Issue"}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={s.statsGrid}>
        {[
          { label: "Total Users",      value: stats?.totalUsers      ?? "—", icon: "👥", color: "#1D4ED8", path: "/admin/users"   },
          { label: "Total Lawyers",    value: stats?.totalLawyers    ?? "—", icon: "⚖️", color: "#166534", path: "/admin/lawyers" },
          { label: "Total NGOs",       value: stats?.totalNgos       ?? "—", icon: "🤝", color: "#9A3412", path: "/admin/ngos"    },
          { label: "Total Cases",      value: stats?.totalCases      ?? "—", icon: "📁", color: "#C9A84C", path: null },
          { label: "Open Cases",       value: stats?.pendingCases    ?? "—", icon: "🔓", color: "#1D4ED8", path: null },
          { label: "Assigned Cases",   value: stats?.activeCases     ?? "—", icon: "✅", color: "#166534", path: null },
          { label: "Resolved Cases",   value: stats?.resolvedCases   ?? "—", icon: "🏁", color: "#059669", path: null },
          { label: "Verified Lawyers", value: stats?.verifiedLawyers ?? "—", icon: "✔️", color: "#7E22CE", path: null },
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

      {/* Charts */}
      {!loading && stats && (
        <div style={s.chartsRow}>
          <div style={s.chartCard}>
            <h2 style={s.sectionTitle}>User Distribution</h2>
            <BarChart data={userBarData} title="Registered users by role" />
          </div>
          <div style={s.chartCard}>
            <h2 style={s.sectionTitle}>Case Status Overview</h2>
            <DonutChart data={caseDonutData} title="Cases by current status" />
          </div>
          <div style={s.chartCard}>
            <h2 style={s.sectionTitle}>Lawyer Verification</h2>
            <DonutChart data={[
              { label: "Verified",   value: stats?.verifiedLawyers || 0, color: "#166534" },
              { label: "Unverified", value: (stats?.totalLawyers||0) - (stats?.verifiedLawyers||0), color: "#E2E8F0" },
            ]} title="Lawyer verification status" />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={s.quickActions}>
        {[
          { icon: "👥", label: "Manage Users",   desc: "View and manage all users",  path: "/admin/users",   color: "#1D4ED8" },
          { icon: "⚖️", label: "Manage Lawyers", desc: "Verify and manage lawyers",  path: "/admin/lawyers", color: "#166534" },
          { icon: "🤝", label: "Manage NGOs",    desc: "Verify and manage NGOs",     path: "/admin/ngos",    color: "#9A3412" },
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
          {loading ? <div style={s.loading}>Loading...</div> : (
            <table style={s.table}>
              <thead><tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Role</th>
              </tr></thead>
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

        {/* Recent Cases — monitoring only, no assign button */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <h2 style={s.sectionTitle}>Recent Cases</h2>
            <span style={s.hint}>Admin view only — users self-assign</span>
          </div>
          {loading ? <div style={s.loading}>Loading...</div>
            : recentCases.length === 0 ? <div style={s.empty}>No cases yet.</div>
            : (
              <div style={s.casesList}>
                {recentCases.map((c, i) => {
                  const sc     = statusColors[c.status] || statusColors.OPEN;
                  const caseId = c.caseId || c.id;
                  return (
                    <div key={i} style={s.caseRow}>
                      <div style={{ flex: 1 }}>
                        <div style={s.caseName}>{c.caseTitle || c.title}</div>
                        <div style={s.caseMeta}>
                          {c.category   && <span>{c.category}</span>}
                          {c.location   && <span> · {c.location}</span>}
                          {c.clientName && <span style={{ color: "#0F1F3D", fontWeight: "600" }}> · 👤 {c.clientName}</span>}
                        </div>
                        {/* Show who accepted the case */}
                        {(c.status === "ASSIGNED" || c.status === "ACTIVE") && (c.lawyerName || c.ngoName) && (
                          <div style={s.acceptedBy}>
                            {c.lawyerName ? "⚖️" : "🤝"} Accepted by {c.lawyerName || c.ngoName}
                          </div>
                        )}
                      </div>
                      <div style={s.caseActions}>
                        <button onClick={() => setSelectedCaseId(caseId)} style={s.viewBtn}>
                          👁 View
                        </button>
                        <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>
                          {c.status}
                        </span>
                      </div>
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

const s = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title:       { fontSize: "22px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle:    { fontSize: "13px", color: "#64748B" },
  healthBadge: { fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px" },
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard:    { background: "white", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  statTop:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  statIcon:    { fontSize: "20px" },
  statValue:   { fontSize: "26px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statBottom:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel:   { fontSize: "11px", color: "#64748B" },
  statLink:    { fontSize: "11px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  chartsRow:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" },
  chartCard:   { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  quickActions:{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" },
  actionCard:  { display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "12px", padding: "18px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  actionIcon:  { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 },
  actionLabel: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", marginBottom: "2px" },
  actionDesc:  { fontSize: "11px", color: "#94A3B8" },
  actionArrow: { marginLeft: "auto", fontSize: "16px", color: "#C9A84C" },
  twoCol:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  tableCard:   { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle:{ fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  viewAll:     { fontSize: "12px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" },
  hint:        { fontSize: "11px", color: "#94A3B8", fontStyle: "italic" },
  loading:     { textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: "13px" },
  empty:       { textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: "13px" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { fontSize: "10px", fontWeight: "700", color: "#94A3B8", padding: "8px 0", textAlign: "left", borderBottom: "1px solid #F1F5F9", textTransform: "uppercase", letterSpacing: "0.5px" },
  tr:          { borderBottom: "1px solid #F8FAFC" },
  td:          { fontSize: "13px", color: "#0F1F3D", padding: "10px 0" },
  roleBadge:   { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },
  casesList:   { display: "flex", flexDirection: "column", gap: "10px" },
  caseRow:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px", background: "#F8FAFC", borderRadius: "8px", gap: "10px" },
  caseName:    { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", marginBottom: "2px" },
  caseMeta:    { fontSize: "11px", color: "#94A3B8", marginBottom: "4px" },
  acceptedBy:  { fontSize: "11px", color: "#166534", fontWeight: "600", background: "#F0FDF4", padding: "3px 8px", borderRadius: "6px", display: "inline-block" },
  caseActions: { display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 },
  statusBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px" },
  viewBtn:     { fontSize: "11px", color: "#1D4ED8", background: "#EFF6FF", border: "none", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" },
};

export default Admin;