import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const statusConfig = {
  SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8", label: "Submitted" },
  ACTIVE: { bg: "#FFF7ED", color: "#C2410C", label: "Active" },
  PENDING: { bg: "#FFFBEB", color: "#92400E", label: "Pending" },
  RESOLVED: { bg: "#F0FDF4", color: "#166534", label: "Resolved" },
  CLOSED: { bg: "#F1F5F9", color: "#475569", label: "Closed" },
};

const NgoDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [cases, setCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("assigned");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, casesRes, lawyersRes] = await Promise.all([
          API.get("/ngo/dashboard/overview"),
          API.get("/ngo/dashboard/cases/assigned"),
          API.get("/ngo/dashboard/lawyers/available"),
        ]);
        setOverview(overviewRes.data);
        setCases(casesRes.data || []);
        setLawyers(lawyersRes.data || []);
      } catch (err) {
        console.error("Failed to load NGO dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCasesByTab = async (selectedTab) => {
    setTab(selectedTab);
    try {
      const endpoints = {
        assigned: "/ngo/dashboard/cases/assigned",
        completed: "/ngo/dashboard/cases/completed",
      };
      const res = await API.get(endpoints[selectedTab]);
      setCases(res.data || []);
    } catch (err) {
      console.error(err);
      setCases([]);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NGO Dashboard 🤝</h1>
          <p style={styles.subtitle}>Manage community cases and legal resources</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Cases", value: overview?.totalCases ?? "—", icon: "📁", color: "#1D4ED8" },
          { label: "Active Cases", value: overview?.activeCases ?? "—", icon: "⚡", color: "#C2410C" },
          { label: "Resolved Cases", value: overview?.resolvedCases ?? "—", icon: "✅", color: "#166534" },
          { label: "Assigned Lawyers", value: overview?.assignedLawyers ?? "—", icon: "⚖️", color: "#C9A84C" },
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

      <div style={styles.twoCol}>
        {/* Cases Section */}
        <div style={styles.casesCard}>
          <div style={styles.tabsRow}>
            {[
              { key: "assigned", label: "Assigned Cases" },
              { key: "completed", label: "Completed" },
            ].map(t => (
              <button key={t.key} onClick={() => fetchCasesByTab(t.key)}
                style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.loading}>Loading cases...</div>
          ) : cases.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>📂</div>
              <p style={styles.emptyText}>No {tab} cases found.</p>
            </div>
          ) : (
            <div style={styles.casesList}>
              {cases.map(c => {
                const sc = statusConfig[c.status] || statusConfig.SUBMITTED;
                return (
                  <div key={c.id} style={styles.caseCard}>
                    <div style={styles.caseTop}>
                      <div>
                        <span style={styles.caseId}>Case #{c.id || c.caseId}</span>
                        <h3 style={styles.caseTitle}>{c.title || c.caseTitle}</h3>
                      </div>
                      <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                    <div style={styles.caseMeta}>
                      {c.clientName && <span style={styles.metaItem}>👤 {c.clientName}</span>}
                      {c.category && <span style={styles.metaItem}>📂 {c.category}</span>}
                      {c.location && <span style={styles.metaItem}>📍 {c.location}</span>}
                      {c.lawyerName && <span style={styles.metaItem}>⚖️ {c.lawyerName}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Lawyers Panel */}
        <div style={styles.lawyersCard}>
          <h2 style={styles.sectionTitle}>Available Lawyers</h2>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : lawyers.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>⚖️</div>
              <p style={styles.emptyText}>No available lawyers right now.</p>
            </div>
          ) : (
            <div style={styles.lawyersList}>
              {lawyers.map(l => (
                <div key={l.id} style={styles.lawyerCard}>
                  <div style={styles.lawyerAvatar}>{l.name?.[0] || "L"}</div>
                  <div style={styles.lawyerInfo}>
                    <div style={styles.lawyerName}>{l.name}</div>
                    <div style={styles.lawyerMeta}>
                      {l.expertise && <span style={styles.lawyerTag}>{l.expertise}</span>}
                      {l.location && <span style={styles.lawyerLocation}>📍 {l.location}</span>}
                    </div>
                  </div>
                  <span style={styles.availableDot}>●</span>
                </div>
              ))}
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
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  statIcon: { fontSize: "22px" },
  statValue: { fontSize: "28px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statLabel: { fontSize: "12px", color: "#64748B" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" },
  casesCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  tabsRow: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: {
    padding: "8px 18px", border: "1.5px solid #E2E8F0", background: "white",
    borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B"
  },
  tabActive: { background: "#0F1F3D", color: "white", border: "1.5px solid #0F1F3D" },
  loading: { textAlign: "center", padding: "40px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "40px" },
  emptyIcon: { fontSize: "36px", marginBottom: "10px" },
  emptyText: { color: "#64748B", fontSize: "13px" },
  casesList: { display: "flex", flexDirection: "column", gap: "12px" },
  caseCard: { padding: "16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" },
  caseTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  caseId: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", background: "#E2E8F0", padding: "2px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "4px" },
  caseTitle: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", flexShrink: 0 },
  caseMeta: { display: "flex", gap: "14px", flexWrap: "wrap" },
  metaItem: { fontSize: "11px", color: "#94A3B8" },
  lawyersCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "16px" },
  lawyersList: { display: "flex", flexDirection: "column", gap: "10px" },
  lawyerCard: { display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#F8FAFC", borderRadius: "8px" },
  lawyerAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700", color: "#C9A84C", flexShrink: 0
  },
  lawyerInfo: { flex: 1 },
  lawyerName: { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", marginBottom: "3px" },
  lawyerMeta: { display: "flex", gap: "8px", alignItems: "center" },
  lawyerTag: { fontSize: "10px", fontWeight: "600", background: "#EFF6FF", color: "#1D4ED8", padding: "2px 6px", borderRadius: "10px" },
  lawyerLocation: { fontSize: "10px", color: "#94A3B8" },
  availableDot: { fontSize: "12px", color: "#16A34A" },
};

export default NgoDashboard;