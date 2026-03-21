import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import CaseDetailModal from "../../components/common/CaseDetailModal";

const statusConfig = {
  SUBMITTED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Submitted", dot: "#3B82F6" },
  ACTIVE:    { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Active",    dot: "#22C55E" },
  PENDING:   { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Pending",   dot: "#F59E0B" },
  RESOLVED:  { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Resolved",  dot: "#10B981" },
  CLOSED:    { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0", label: "Closed",    dot: "#94A3B8" },
};

const categoryIcons = {
  property: "🏠", criminal: "⚖️", family: "👨‍👩‍👧", consumer: "🛒",
  labour: "👷", civil: "📋", other: "📁",
};

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    API.get("/api/cases/my")
      .then(res => setCases(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? cases : cases.filter(c => c.status === filter);

  const counts = {
    ALL: cases.length,
    SUBMITTED: cases.filter(c => c.status === "SUBMITTED").length,
    ACTIVE: cases.filter(c => c.status === "ACTIVE").length,
    PENDING: cases.filter(c => c.status === "PENDING").length,
    RESOLVED: cases.filter(c => c.status === "RESOLVED").length,
  };

  return (
    <Layout>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Cases</h1>
          <p style={s.subtitle}>{cases.length} total case{cases.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link to="/submit-case" style={s.newBtn}>+ New Case</Link>
      </div>

      {/* Filter Tabs */}
      <div style={s.tabs}>
        {["ALL", "SUBMITTED", "ACTIVE", "PENDING", "RESOLVED"].map(t => {
          const sc = statusConfig[t];
          const active = filter === t;
          return (
            <button key={t} onClick={() => setFilter(t)}
              style={{ ...s.tab, ...(active ? { background: "#0F1F3D", color: "white", border: "1px solid #0F1F3D" } : {}) }}>
              {t !== "ALL" && <span style={{ ...s.tabDot, background: active ? "rgba(255,255,255,0.6)" : sc?.dot }} />}
              {t === "ALL" ? "All Cases" : sc?.label}
              <span style={{ ...s.tabBadge, background: active ? "rgba(255,255,255,0.15)" : "#F1F5F9", color: active ? "white" : "#64748B" }}>
                {counts[t]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div style={s.center}>Loading your cases...</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>📂</div>
          <h3 style={s.emptyTitle}>No cases found</h3>
          <p style={s.emptyText}>
            {filter === "ALL" ? "You haven't submitted any cases yet." : `No ${filter.toLowerCase()} cases.`}
          </p>
          {filter === "ALL" && (
            <Link to="/submit-case" style={s.emptyBtn}>Submit Your First Case →</Link>
          )}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(c => {
            const sc = statusConfig[c.status] || statusConfig.SUBMITTED;
            const catIcon = categoryIcons[(c.category || "").toLowerCase()] || "📁";
            const title = c.title || c.caseTitle || "Untitled";
            const desc = c.description || c.caseDescription || "";

            return (
              <div key={c.id} style={{ ...s.card, borderTop: `3px solid ${sc.dot}` }}
                onClick={() => setSelectedCaseId(c.id || c.caseId)}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* Card Header */}
                <div style={s.cardHeader}>
                  <span style={s.caseId}>Case #{c.id || c.caseId}</span>
                  <span style={{ ...s.statusPill, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    <span style={{ ...s.statusDot, background: sc.dot }} />
                    {sc.label}
                  </span>
                </div>

                {/* Category Icon + Title */}
                <div style={s.titleRow}>
                  <div style={s.catIcon}>{catIcon}</div>
                  <h3 style={s.caseTitle}>{title}</h3>
                </div>

                {/* Description */}
                {desc && (
                  <p style={s.desc}>{desc.slice(0, 90)}{desc.length > 90 ? "…" : ""}</p>
                )}

                {/* Meta Tags */}
                <div style={s.tags}>
                  {c.category && <span style={s.tag}>{c.category}</span>}
                  {c.location  && <span style={s.tag}>📍 {c.location}</span>}
                  {c.lawyerName && <span style={{ ...s.tag, background: "#F0FDF4", color: "#166534" }}>⚖️ {c.lawyerName}</span>}
                </div>

                {/* Footer */}
                <div style={s.footer}>
                  <span style={s.date}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                  <span style={s.viewHint}>Click to view details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CaseDetailModal caseId={selectedCaseId} onClose={() => setSelectedCaseId(null)} />
    </Layout>
  );
};

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#94A3B8" },
  newBtn: { background: "#0F1F3D", color: "white", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textDecoration: "none", fontFamily: "inherit" },

  tabs: { display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" },
  tab: { display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", border: "1px solid #E2E8F0", background: "white", borderRadius: "20px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", color: "#64748B", fontWeight: "600", transition: "all 0.15s" },
  tabDot: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },
  tabBadge: { fontSize: "10px", fontWeight: "700", padding: "1px 7px", borderRadius: "10px" },

  center: { textAlign: "center", padding: "60px", color: "#94A3B8", fontSize: "14px" },
  empty: { textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #F1F5F9" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  emptyText: { color: "#94A3B8", fontSize: "13px", marginBottom: "24px" },
  emptyBtn: { background: "#0F1F3D", color: "white", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", textDecoration: "none", fontWeight: "700" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },

  card: {
    background: "white", borderRadius: "14px", padding: "20px",
    border: "1px solid #E2E8F0", cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  caseId: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", background: "#F1F5F9", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.3px" },
  statusPill: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
  statusDot: { width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0 },

  titleRow: { display: "flex", alignItems: "flex-start", gap: "10px" },
  catIcon: { width: "36px", height: "36px", background: "#F8FAFC", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, border: "1px solid #F1F5F9" },
  caseTitle: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", lineHeight: "1.3", margin: 0 },

  desc: { fontSize: "12px", color: "#64748B", lineHeight: "1.6", margin: 0 },

  tags: { display: "flex", gap: "6px", flexWrap: "wrap" },
  tag: { fontSize: "11px", color: "#475569", background: "#F1F5F9", padding: "3px 8px", borderRadius: "6px", fontWeight: "500" },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #F8FAFC", marginTop: "auto" },
  date: { fontSize: "11px", color: "#94A3B8" },
  viewHint: { fontSize: "11px", color: "#94A3B8", fontStyle: "italic" },
};

export default MyCases;