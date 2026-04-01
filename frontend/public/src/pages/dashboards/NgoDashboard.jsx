import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import CaseDetailModal from "../../components/common/CaseDetailModal";

// ─── NGO Dashboard ────────────────────────────────────────────────────────────
// Uses /matches/assigned to get cases — same as the Case Requests page
// but shows accepted/active cases in a dashboard view with stats
const NgoDashboard = () => {
  const [matches, setMatches]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [tab, setTab]                 = useState("active");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/matches/assigned");
      setMatches(res.data || []);
    } catch (err) {
      console.error("NGO dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats derived from matches
  const total    = matches.length;
  const active   = matches.filter(m => m.status === "ACCEPTED").length;
  const pending  = matches.filter(m => m.status === "REQUESTED").length;
  const rejected = matches.filter(m => m.status === "REJECTED").length;

  // Filter by tab
  const tabMap = {
    active:   matches.filter(m => m.status === "ACCEPTED"),
    pending:  matches.filter(m => m.status === "REQUESTED"),
    all:      matches,
  };
  const displayed = tabMap[tab] || [];

  const statusConfig = {
    PENDING:   { bg: "#F1F5F9", color: "#475569", label: "Pending"   },
    REQUESTED: { bg: "#FFF7ED", color: "#C2410C", label: "Requested" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", label: "Active"    },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", label: "Declined"  },
  };

  return (
    <Layout>
      {selectedCaseId && (
        <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>NGO Dashboard 🤝</h1>
          <p style={s.subtitle}>Manage community cases and legal resources</p>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { label: "Total Matches",   value: total,    icon: "📁", color: "#1D4ED8" },
          { label: "Active Cases",    value: active,   icon: "⚡", color: "#C2410C" },
          { label: "Pending Requests",value: pending,  icon: "🔔", color: "#92400E" },
          { label: "Declined",        value: rejected, icon: "❌", color: "#DC2626" },
        ].map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statTop}>
              <span style={s.statIcon}>{st.icon}</span>
              <span style={{ ...s.statValue, color: st.color }}>{loading ? "—" : st.value}</span>
            </div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Cases panel */}
      <div style={s.casesCard}>
        <div style={s.tabsRow}>
          {[
            { key: "active",  label: `Active Cases (${active})` },
            { key: "pending", label: `Pending Requests (${pending})` },
            { key: "all",     label: `All Matches (${total})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={s.center}>Loading cases...</div>
        ) : displayed.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📂</div>
            <p style={s.emptyText}>
              {tab === "active" ? "No active cases yet. Accept case requests from the Case Requests page."
                : tab === "pending" ? "No pending requests."
                : "No matches yet."}
            </p>
          </div>
        ) : (
          <div style={s.casesList}>
            {displayed.map(m => {
              const sc = statusConfig[m.status] || statusConfig.PENDING;
              return (
                <div key={m.id} style={s.caseCard}>
                  <div style={s.caseTop}>
                    <div>
                      <span style={s.caseIdBadge}>Case #{m.caseId}</span>
                      <h3 style={s.caseTitle}>{m.caseTitle || `Case #${m.caseId}`}</h3>
                    </div>
                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={s.caseMeta}>
                    {m.caseCategory && <span style={s.metaItem}>📂 {m.caseCategory}</span>}
                    {m.caseLocation  && <span style={s.metaItem}>📍 {m.caseLocation}</span>}
                    {m.matchScore    && <span style={s.metaItem}>🎯 {m.matchScore}% match</span>}
                    {m.matchDate     && (
                      <span style={s.metaItem}>
                        🗓 {new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <div style={s.caseActions}>
                    <button onClick={() => setSelectedCaseId(m.caseId)} style={s.viewBtn}>
                      👁 View Case Details
                    </button>
                    {m.status === "ACCEPTED" && (
                      <span style={s.activePill}>✅ Chat & Appointments Active</span>
                    )}
                    {m.status === "REQUESTED" && (
                      <span style={s.pendingPill}>⏳ Awaiting your response — go to Case Requests</span>
                    )}
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

const s = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title:       { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle:    { fontSize: "14px", color: "#64748B" },
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard:    { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statTop:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  statIcon:    { fontSize: "22px" },
  statValue:   { fontSize: "28px", fontWeight: "700", fontFamily: "'Georgia', serif" },
  statLabel:   { fontSize: "12px", color: "#64748B" },
  casesCard:   { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  tabsRow:     { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  tab:         { padding: "8px 18px", border: "1.5px solid #E2E8F0", background: "white", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B", fontWeight: "600" },
  tabActive:   { background: "#0F1F3D", color: "white", border: "1.5px solid #0F1F3D" },
  center:      { textAlign: "center", padding: "40px", color: "#94A3B8" },
  empty:       { textAlign: "center", padding: "40px" },
  emptyText:   { color: "#64748B", fontSize: "13px", maxWidth: "400px", margin: "0 auto" },
  casesList:   { display: "flex", flexDirection: "column", gap: "12px" },
  caseCard:    { padding: "16px 20px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" },
  caseTop:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  caseIdBadge: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", background: "#E2E8F0", padding: "2px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "4px" },
  caseTitle:   { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", flexShrink: 0 },
  caseMeta:    { display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "12px" },
  metaItem:    { fontSize: "12px", color: "#64748B" },
  caseActions: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  viewBtn:     { padding: "7px 16px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", color: "#0F1F3D" },
  activePill:  { fontSize: "12px", fontWeight: "600", color: "#166534", background: "#F0FDF4", border: "1px solid #86EFAC", padding: "5px 12px", borderRadius: "20px" },
  pendingPill: { fontSize: "12px", fontWeight: "600", color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", padding: "5px 12px", borderRadius: "20px" },
};

export default NgoDashboard;