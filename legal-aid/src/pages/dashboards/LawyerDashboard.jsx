import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import CaseDetailModal from "../../components/common/CaseDetailModal";

const statusConfig = {
  SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8", label: "Submitted" },
  ACTIVE: { bg: "#FFF7ED", color: "#C2410C", label: "Active" },
  PENDING: { bg: "#FFFBEB", color: "#92400E", label: "Pending" },
  RESOLVED: { bg: "#F0FDF4", color: "#166534", label: "Resolved" },
  CLOSED: { bg: "#F1F5F9", color: "#475569", label: "Closed" },
};

const LawyerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("assigned");
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, assignedRes] = await Promise.all([
          API.get("/lawyer/dashboard/overview"),
          API.get("/lawyer/dashboard/cases/assigned"),
        ]);
        setOverview(overviewRes.data);
        setCases(assignedRes.data || []);
      } catch (err) {
        console.error("Failed to load lawyer dashboard", err);
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
        assigned: "/lawyer/dashboard/cases/assigned",
        pending: "/lawyer/dashboard/cases/pending",
        completed: "/lawyer/dashboard/cases/completed",
      };
      const res = await API.get(endpoints[selectedTab]);
      setCases(res.data || []);
    } catch (err) {
      console.error(err);
      setCases([]);
    }
  };

  const updateAvailability = async (isAvailable) => {
    try {
      await API.put("/lawyer/dashboard/availability", { isAvailable });
      setOverview(prev => ({ ...prev, isAvailable }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Lawyer Dashboard ⚖️</h1>
          <p style={styles.subtitle}>Manage your assigned cases and schedule</p>
        </div>
        {overview && (
          <div style={styles.availabilityToggle}>
            <span style={styles.availLabel}>Availability:</span>
            <button
              onClick={() => updateAvailability(!overview.isAvailable)}
              style={{
                ...styles.availBtn,
                background: overview.isAvailable ? "#F0FDF4" : "#FEF2F2",
                color: overview.isAvailable ? "#166534" : "#DC2626",
                border: `1.5px solid ${overview.isAvailable ? "#86EFAC" : "#FECACA"}`,
              }}>
              {overview.isAvailable ? "● Available" : "● Unavailable"}
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Assigned Cases", value: overview?.assignedCases ?? "—", icon: "📁", color: "#1D4ED8" },
          { label: "Pending Cases", value: overview?.pendingCases ?? "—", icon: "⏳", color: "#92400E" },
          { label: "Completed Cases", value: overview?.completedCases ?? "—", icon: "✅", color: "#166534" },
          { label: "Today's Schedule", value: overview?.todaySchedule ?? "—", icon: "📅", color: "#C9A84C" },
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

      {/* Cases Section */}
      <div style={styles.casesCard}>
        {/* Tabs */}
        <div style={styles.tabsRow}>
          {[
            { key: "assigned", label: "Assigned" },
            { key: "pending", label: "Pending" },
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
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button onClick={() => setSelectedCaseId(c.id || c.caseId)} style={{ fontSize: "11px", color: "#1D4ED8", background: "#EFF6FF", border: "none", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" }}>👁 View</button>
                      <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>
                  <div style={styles.caseMeta}>
                    {c.clientName && <span style={styles.metaItem}>👤 {c.clientName}</span>}
                    {c.category && <span style={styles.metaItem}>📂 {c.category}</span>}
                    {c.location && <span style={styles.metaItem}>📍 {c.location}</span>}
                    {c.filingDate && (
                      <span style={styles.metaItem}>
                        📅 {new Date(c.filingDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
          <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#64748B" },
  availabilityToggle: { display: "flex", alignItems: "center", gap: "10px" },
  availLabel: { fontSize: "13px", color: "#64748B" },
  availBtn: { padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  statIcon: { fontSize: "22px" },
  statValue: { fontSize: "28px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statLabel: { fontSize: "12px", color: "#64748B" },
  casesCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  tabsRow: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: {
    padding: "8px 18px", border: "1.5px solid #E2E8F0", background: "white",
    borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B"
  },
  tabActive: { background: "#0F1F3D", color: "white", border: "1.5px solid #0F1F3D" },
  loading: { textAlign: "center", padding: "40px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "48px" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyText: { color: "#64748B", fontSize: "14px" },
  casesList: { display: "flex", flexDirection: "column", gap: "12px" },
  caseCard: { padding: "16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" },
  caseTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  caseId: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", background: "#E2E8F0", padding: "2px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "4px" },
  caseTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", flexShrink: 0 },
  caseMeta: { display: "flex", gap: "16px", flexWrap: "wrap" },
  metaItem: { fontSize: "12px", color: "#94A3B8" },
};

export default LawyerDashboard;