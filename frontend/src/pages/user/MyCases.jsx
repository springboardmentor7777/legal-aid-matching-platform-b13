import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import CaseDetailModal from "../../components/common/CaseDetailModal";

const statusConfig = {
  OPEN:      { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Open",     dot: "#3B82F6",
               desc: "Awaiting lawyer/NGO — browse Find Lawyers to send requests" },
  ASSIGNED:  { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Assigned", dot: "#22C55E",
               desc: "A lawyer/NGO has accepted your case" },
  RESOLVED:  { bg: "#F0FDF4", color: "#059669", border: "#6EE7B7", label: "Resolved", dot: "#10B981",
               desc: "Case has been resolved" },
  CLOSED:    { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0", label: "Closed",   dot: "#94A3B8",
               desc: "Case is closed" },
  // Legacy statuses (for old data)
  SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Submitted", dot: "#3B82F6", desc: "" },
  ACTIVE:    { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA", label: "Active",    dot: "#F97316", desc: "" },
  PENDING:   { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Pending",   dot: "#F59E0B", desc: "" },
};

const categoryIcons = {
  property: "🏠", criminal: "⚖️", family: "👨‍👩‍👧", consumer: "🛒",
  labour: "👷", civil: "📋", "human rights": "🕊️", other: "📁",
};

const MyCases = () => {
  const [cases, setCases]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("ALL");
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    API.get("/api/cases/my")
      .then(res => setCases(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? cases : cases.filter(c => c.status === filter);

  const openCases     = cases.filter(c => c.status === "OPEN" || c.status === "SUBMITTED").length;
  const assignedCases = cases.filter(c => c.status === "ASSIGNED" || c.status === "ACTIVE").length;

  const filterTabs = ["ALL", "OPEN", "ASSIGNED", "RESOLVED", "CLOSED"];

  return (
    <Layout>
      {selectedCaseId && (
        <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Cases</h1>
          <p style={s.subtitle}>{cases.length} total case{cases.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/lawyers" style={s.findBtn}>⚖️ Find Lawyers / NGOs</Link>
          <Link to="/submit-case" style={s.newBtn}>+ New Case</Link>
        </div>
      </div>

      {/* Summary cards */}
      <div style={s.summaryRow}>
        <div style={s.summaryCard}>
          <span style={s.summaryNum}>{cases.length}</span>
          <span style={s.summaryLbl}>Total Cases</span>
        </div>
        <div style={{ ...s.summaryCard, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
          <span style={{ ...s.summaryNum, color: "#1D4ED8" }}>{openCases}</span>
          <span style={s.summaryLbl}>Open (seeking help)</span>
        </div>
        <div style={{ ...s.summaryCard, background: "#F0FDF4", border: "1px solid #86EFAC" }}>
          <span style={{ ...s.summaryNum, color: "#166534" }}>{assignedCases}</span>
          <span style={s.summaryLbl}>Assigned</span>
        </div>
      </div>

      {/* OPEN cases CTA */}
      {openCases > 0 && (
        <div style={s.ctaBanner}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <div style={{ flex: 1 }}>
            <div style={s.ctaTitle}>You have {openCases} open case{openCases > 1 ? "s" : ""} seeking legal help</div>
            <div style={s.ctaText}>Browse available lawyers and NGOs, then send your case for review.</div>
          </div>
          <Link to="/lawyers" style={s.ctaBtn}>Find Lawyers →</Link>
        </div>
      )}

      {/* Filter tabs */}
      <div style={s.tabs}>
        {filterTabs.map(t => {
          const sc     = statusConfig[t];
          const active = filter === t;
          const count  = t === "ALL" ? cases.length : cases.filter(c => c.status === t).length;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              ...s.tabBtn,
              ...(active ? { background: "#0F1F3D", color: "white", border: "1.5px solid #0F1F3D" } : {}),
            }}>
              {t === "ALL" ? "All" : sc?.label || t}
              <span style={{
                ...s.tabCount,
                background: active ? "rgba(255,255,255,0.2)" : "#F1F5F9",
                color:      active ? "white" : "#64748B",
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Case list */}
      {loading ? (
        <div style={s.center}>Loading cases...</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📁</div>
          <h3 style={s.emptyTitle}>{filter === "ALL" ? "No cases yet" : `No ${filter.toLowerCase()} cases`}</h3>
          {filter === "ALL" && (
            <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "16px" }}>
              Submit your first case to get started.
            </p>
          )}
          {filter === "ALL" && (
            <Link to="/submit-case" style={s.newBtn}>+ Submit a Case</Link>
          )}
        </div>
      ) : (
        <div style={s.caseList}>
          {filtered.map(c => {
            const sc    = statusConfig[c.status] || statusConfig.OPEN;
            const catIcon = categoryIcons[(c.category || "").toLowerCase()] || "📁";
            return (
              <div key={c.id} style={{ ...s.caseCard, borderLeft: `4px solid ${sc.border}` }}>
                <div style={s.caseTop}>
                  <div style={s.caseLeft}>
                    <span style={s.catIcon}>{catIcon}</span>
                    <div>
                      <div style={s.caseTitle}>{c.caseTitle || c.title}</div>
                      <div style={s.caseMeta}>
                        {c.category && <span>📂 {c.category}</span>}
                        {c.location  && <span>📍 {c.location}</span>}
                        {c.filingDate && (
                          <span>🗓 {new Date(c.filingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block", marginRight: "5px" }}/>
                      {sc.label}
                    </span>
                    <button onClick={() => setSelectedCaseId(c.id || c.caseId)} style={s.viewBtn}>
                      👁 View Details
                    </button>
                  </div>
                </div>

                {sc.desc && (
                  <div style={s.statusDesc}>{sc.desc}</div>
                )}

                {/* Show assigned lawyer/NGO if ASSIGNED */}
                {(c.status === "ASSIGNED" || c.status === "ACTIVE") && (c.lawyerName || c.ngoName) && (
                  <div style={s.assignedRow}>
                    <span style={s.assignedIcon}>{c.lawyerName ? "⚖️" : "🤝"}</span>
                    <span style={s.assignedName}>Handled by {c.lawyerName || c.ngoName}</span>
                  </div>
                )}

                {/* CTA for OPEN cases */}
                {(c.status === "OPEN" || c.status === "SUBMITTED") && (
                  <Link to="/lawyers" style={s.findHelpBtn}>
                    ⚖️ Find Lawyers / NGOs for this case →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

const s = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  title:       { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle:    { fontSize: "13px", color: "#64748B" },
  findBtn:     { padding: "9px 16px", background: "#0F1F3D", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "600" },
  newBtn:      { padding: "9px 16px", background: "white", color: "#0F1F3D", border: "1.5px solid #E2E8F0", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "600" },
  summaryRow:  { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" },
  summaryCard: { background: "white", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" },
  summaryNum:  { fontSize: "28px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  summaryLbl:  { fontSize: "12px", color: "#64748B" },
  ctaBanner:   { display: "flex", alignItems: "center", gap: "14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px" },
  ctaTitle:    { fontSize: "14px", fontWeight: "700", color: "#1D4ED8", marginBottom: "2px" },
  ctaText:     { fontSize: "12px", color: "#3B82F6" },
  ctaBtn:      { padding: "8px 16px", background: "#1D4ED8", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
  tabs:        { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  tabBtn:      { padding: "7px 16px", border: "1.5px solid #E2E8F0", background: "white", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" },
  tabCount:    { fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "10px" },
  center:      { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty:       { textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" },
  emptyTitle:  { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  caseList:    { display: "flex", flexDirection: "column", gap: "14px" },
  caseCard:    { background: "white", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" },
  caseTop:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  caseLeft:    { display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: 0 },
  catIcon:     { fontSize: "24px", flexShrink: 0 },
  caseTitle:   { fontSize: "16px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "6px" },
  caseMeta:    { display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "12px", color: "#94A3B8" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px", display: "flex", alignItems: "center" },
  viewBtn:     { fontSize: "12px", color: "#1D4ED8", background: "#EFF6FF", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600" },
  statusDesc:  { fontSize: "12px", color: "#64748B", background: "#F8FAFC", borderRadius: "8px", padding: "8px 12px", marginTop: "8px" },
  assignedRow: { display: "flex", alignItems: "center", gap: "8px", background: "#F0FDF4", borderRadius: "8px", padding: "8px 12px", marginTop: "8px" },
  assignedIcon:{ fontSize: "16px" },
  assignedName:{ fontSize: "13px", fontWeight: "600", color: "#166534" },
  findHelpBtn: { display: "inline-block", marginTop: "10px", fontSize: "12px", color: "#1D4ED8", fontWeight: "600", textDecoration: "none" },
};

export default MyCases;