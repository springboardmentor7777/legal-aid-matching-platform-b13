import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import CaseDetailModal from "../../components/common/CaseDetailModal";

const LawyerDashboard = () => {
  const [matches, setMatches]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState("active");
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [profile, setProfile]           = useState(null);
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    // Load real name for personalized title
    API.get("/profile/me").then(res => setProfile(res.data)).catch(() => {});

    // Load matches via /matches/assigned — this is the source of truth
    // The old /lawyer/dashboard/cases/assigned uses assignedTo FK which is never set
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await API.get("/matches/assigned");
      setMatches(res.data || []);
      // Also try to load availability from lawyer dashboard
      API.get("/lawyer/dashboard/overview")
        .then(res => setAvailability(res.data?.isAvailable ?? true))
        .catch(() => {});
    } catch (err) {
      console.error("Failed to load matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (val) => {
    try {
      await API.put("/lawyer/dashboard/availability", { isAvailable: val });
      setAvailability(val);
    } catch {}
  };

  // Stats derived from matches
  const total    = matches.length;
  const active   = matches.filter(m => m.status === "ACCEPTED").length;
  const pending  = matches.filter(m => m.status === "REQUESTED").length;
  const rejected = matches.filter(m => m.status === "REJECTED").length;

  // Tab filter
  const tabMap = {
    active:   matches.filter(m => m.status === "ACCEPTED"),
    pending:  matches.filter(m => m.status === "REQUESTED"),
    all:      matches,
  };
  const displayed = tabMap[tab] || [];

  // Personalized title
  const firstName = profile?.fullName?.split(" ")[0];
  const dashTitle = firstName ? `${firstName}'s Dashboard ⚖️` : "Lawyer Dashboard ⚖️";

  const statusConfig = {
    PENDING:   { bg: "#F1F5F9", color: "#475569", label: "Pending"    },
    REQUESTED: { bg: "#FFF7ED", color: "#C2410C", label: "New Request" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", label: "Active"      },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", label: "Declined"    },
  };

  return (
    <Layout>
      {selectedCaseId && (
        <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
      )}

      {/* Header */}
      <div style={st.header}>
        <div>
          <h1 style={st.title}>{dashTitle}</h1>
          <p style={st.subtitle}>Manage your assigned cases and schedule</p>
        </div>
        <div style={st.availRow}>
          <span style={st.availLabel}>Availability:</span>
          <button
            onClick={() => updateAvailability(!availability)}
            style={{
              ...st.availBtn,
              background: availability ? "#F0FDF4" : "#FEF2F2",
              color:      availability ? "#166534" : "#DC2626",
              border:     `1.5px solid ${availability ? "#86EFAC" : "#FECACA"}`,
            }}>
            {availability ? "● Available" : "● Unavailable"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={st.statsGrid}>
        {[
          { label: "Total Matches",    value: loading ? "—" : total,    icon: "📁", color: "#1D4ED8" },
          { label: "Active Cases",     value: loading ? "—" : active,   icon: "⚡", color: "#C2410C" },
          { label: "Pending Requests", value: loading ? "—" : pending,  icon: "🔔", color: "#92400E" },
          { label: "Declined",         value: loading ? "—" : rejected, icon: "❌", color: "#DC2626" },
        ].map(s => (
          <div key={s.label} style={st.statCard}>
            <div style={st.statTop}>
              <span style={st.statIcon}>{s.icon}</span>
              <span style={{ ...st.statValue, color: s.color }}>{s.value}</span>
            </div>
            <div style={st.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cases panel */}
      <div style={st.casesCard}>
        <div style={st.tabsRow}>
          {[
            { key: "active",  label: `Active Cases (${active})`          },
            { key: "pending", label: `Pending Requests (${pending})`     },
            { key: "all",     label: `All Matches (${total})`            },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ ...st.tab, ...(tab === t.key ? st.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={st.center}>Loading cases...</div>
        ) : displayed.length === 0 ? (
          <div style={st.empty}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📂</div>
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              {tab === "active"
                ? "No active cases yet. Accept case requests from Case Requests page."
                : tab === "pending" ? "No pending requests."
                : "No matches yet."}
            </p>
          </div>
        ) : (
          <div style={st.casesList}>
            {displayed.map(m => {
              const sc = statusConfig[m.status] || statusConfig.PENDING;
              return (
                <div key={m.id} style={st.caseCard}>
                  <div style={st.caseTop}>
                    <div>
                      <span style={st.caseIdBadge}>Case #{m.caseId}</span>
                      <h3 style={st.caseTitle}>{m.caseTitle || `Case #${m.caseId}`}</h3>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button onClick={() => setSelectedCaseId(m.caseId)} style={st.viewBtn}>
                        👁 View Case
                      </button>
                      <span style={{ ...st.statusBadge, background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>
                  <div style={st.caseMeta}>
                    {m.clientName   && <span style={st.metaItem}>👤 {m.clientName}</span>}
                    {m.caseCategory && <span style={st.metaItem}>📂 {m.caseCategory}</span>}
                    {m.caseLocation && <span style={st.metaItem}>📍 {m.caseLocation}</span>}
                    {m.matchScore   && <span style={st.metaItem}>🎯 {m.matchScore}% match</span>}
                    {m.matchDate    && (
                      <span style={st.metaItem}>
                        🗓 {new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
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

const st = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title:       { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle:    { fontSize: "14px", color: "#64748B" },
  availRow:    { display: "flex", alignItems: "center", gap: "10px" },
  availLabel:  { fontSize: "13px", color: "#64748B" },
  availBtn:    { padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
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
  empty:       { textAlign: "center", padding: "48px" },
  casesList:   { display: "flex", flexDirection: "column", gap: "12px" },
  caseCard:    { padding: "16px 20px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" },
  caseTop:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  caseIdBadge: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", background: "#E2E8F0", padding: "2px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "4px" },
  caseTitle:   { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  viewBtn:     { fontSize: "11px", color: "#1D4ED8", background: "#EFF6FF", border: "none", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", flexShrink: 0 },
  caseMeta:    { display: "flex", gap: "16px", flexWrap: "wrap" },
  metaItem:    { fontSize: "12px", color: "#94A3B8" },
};

export default LawyerDashboard;