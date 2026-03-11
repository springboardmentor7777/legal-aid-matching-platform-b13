import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const statusConfig = {
  SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8", label: "Submitted" },
  ACTIVE: { bg: "#F0FDF4", color: "#166534", label: "Active" },
  PENDING: { bg: "#FFFBEB", color: "#92400E", label: "Pending" },
  RESOLVED: { bg: "#F0FDF4", color: "#166534", label: "Resolved" },
  CLOSED: { bg: "#F1F5F9", color: "#475569", label: "Closed" },
};

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await API.get("/api/cases/my");
        setCases(res.data);
      } catch (error) {
        console.error("Error fetching cases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

 const acceptCase = async (id) => {
    try {
      await API.put(`/api/cases/${id}/accept`);
      alert("Case accepted successfully");
    } catch (error) {
      console.error("Error accepting case", error);
    }
  };

  const declineCase = async (id) => {
    try {
      await API.put(`/api/cases/${id}/decline`);
      alert("Case declined");
    } catch (error) {
      console.error("Error declining case", error);
    }
  };

  const filtered = filter === "ALL" ? cases : cases.filter(c => c.status === filter);

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Cases</h1>
          <p style={styles.subtitle}>{cases.length} total case{cases.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link to="/submit-case" style={styles.newBtn}>+ New Case</Link>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {["ALL", "SUBMITTED", "ACTIVE", "PENDING", "RESOLVED"].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ ...styles.tab, ...(filter === t ? styles.tabActive : {}) }}>
            {t === "ALL" ? "All Cases" : statusConfig[t]?.label || t}
            <span style={{ ...styles.tabCount, ...(filter === t ? styles.tabCountActive : {}) }}>
              {t === "ALL" ? cases.length : cases.filter(c => c.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cases List */}
      {loading ? (
        <div style={styles.loading}>Loading your cases...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📂</div>
          <h3 style={styles.emptyTitle}>No cases found</h3>
          <p style={styles.emptyText}>
            {filter === "ALL" ? "You haven't submitted any cases yet." : `No cases with status "${filter}".`}
          </p>
          {filter === "ALL" && (
            <Link to="/submit-case" style={styles.emptyBtn}>Submit Your First Case →</Link>
          )}
        </div>
      ) : (
        <div style={styles.casesList}>
          {filtered.map(c => {
            const sc = statusConfig[c.status] || statusConfig.SUBMITTED;
            return (
              <div key={c.id} style={styles.caseCard}>
                <div style={styles.caseTop}>
                  <div style={styles.caseLeft}>
                    <span style={styles.caseId}>Case #{c.id}</span>
                    <h3 style={styles.caseTitle}>{c.title || c.caseTitle}</h3>
                  </div>
                  <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>

                <p style={styles.caseDesc}>
                  {(c.description || "").slice(0, 140)}
                  {(c.description || "").length > 140 ? "..." : ""}
                </p>

                <div style={styles.caseMeta}>
                  <span style={styles.metaItem}>📂 {c.category || "Uncategorized"}</span>
                  <span style={styles.metaItem}>📍 {c.location || "—"}</span>
                  <span style={styles.metaItem}>
                    📅 {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "—"}
                  </span>
                  {c.lawyerName && (
                    <span style={styles.metaItem}>⚖️ {c.lawyerName}</span>
                  )}
                </div>
                <div style={styles.actions}>
                  <Link to={`/case-details/${c.id}`} style={styles.viewBtn}>
                    View Details
                  </Link>

                  <button style={styles.acceptBtn} onClick={() => acceptCase(c.id)}>
                    Accept
                  </button>

                  <button style={styles.declineBtn} onClick={() => declineCase(c.id)}>
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  newBtn: {
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)", color: "white",
    padding: "10px 18px", borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", textDecoration: "none"
  },
  tabs: { display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" },
  tab: {
    padding: "8px 14px", border: "1.5px solid #E2E8F0", background: "white",
    borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
    color: "#64748B", display: "flex", alignItems: "center", gap: "6px"
  },
  tabActive: { border: "1.5px solid #0F1F3D", background: "#0F1F3D", color: "white" },
  tabCount: {
    background: "#F1F5F9", padding: "1px 6px",
    borderRadius: "10px", fontSize: "10px", fontWeight: "700", color: "#64748B"
  },
  tabCountActive: { background: "rgba(255,255,255,0.2)", color: "white" },
  loading: { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "80px", background: "white", borderRadius: "12px" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", marginBottom: "8px", fontFamily: "'Georgia', serif" },
  emptyText: { color: "#64748B", marginBottom: "24px", fontSize: "14px" },
  emptyBtn: {
    background: "#0F1F3D", color: "white", padding: "12px 24px",
    borderRadius: "8px", fontSize: "14px", textDecoration: "none", fontWeight: "600"
  },
  casesList: { display: "flex", flexDirection: "column", gap: "14px" },
  caseCard: {
    background: "white", borderRadius: "12px", padding: "22px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9"
  },
  caseTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  caseLeft: {},
  caseId: {
    fontSize: "10px", fontWeight: "700", color: "#94A3B8",
    background: "#F1F5F9", padding: "2px 8px", borderRadius: "4px",
    display: "inline-block", marginBottom: "6px"
  },
  caseTitle: { fontSize: "16px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", flexShrink: 0 },
  caseDesc: { fontSize: "13px", color: "#64748B", lineHeight: "1.7", marginBottom: "14px" },
  caseMeta: { display: "flex", gap: "20px", flexWrap: "wrap" },
  metaItem: { fontSize: "12px", color: "#94A3B8" },
};

export default MyCases;