import { useEffect, useState, useMemo, useCallback, memo } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

// ── Constants ─────────────────────────────────────────────────────────────
const MATCH_WEIGHTS = {
  EXPERTISE: 60,
  LOCATION: 40
};

const SCORE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 50
};

const STATUS_OPTIONS = {
  OPEN_CASES: ["OPEN", "SUBMITTED", "PENDING"]
};

// ── Calculate how well a lawyer/NGO matches user's cases ─────────────────
const calcMatchScore = (profile, userCases) => {
  if (!userCases || userCases.length === 0) return null;

  let best = 0;
  for (const c of userCases) {
    let score = 0;
    const exp = (profile.expertise || profile.specialization || "").toLowerCase();
    const loc = (profile.location || "").toLowerCase();
    const cat = (c.category || "").toLowerCase();
    const cloc = (c.location || "").toLowerCase();

    if (exp && cat && exp.includes(cat)) score += MATCH_WEIGHTS.EXPERTISE;
    if (loc && cloc && loc.includes(cloc)) score += MATCH_WEIGHTS.LOCATION;
    if (score > best) best = score;
  }
  return best > 0 ? best : null;
};

const scoreColor = (s) => {
  if (s >= SCORE_THRESHOLDS.HIGH) 
    return { color: "#166534", bg: "#F0FDF4", border: "#86EFAC" };
  if (s >= SCORE_THRESHOLDS.MEDIUM) 
    return { color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" };
  return { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
};

// ── Profile Card Component (Memoized) ────────────────────────────────────
const ProfileCard = memo(({ profile, type, matchScore, onRequest }) => {
  const isLawyer = type === "LAWYER";
  const unavailable = isLawyer && profile.isAvailable === false;
  const sc = matchScore ? scoreColor(matchScore) : null;

  return (
    <div style={{ ...pc.card, borderTop: sc ? `4px solid ${sc.border}` : "4px solid #E2E8F0" }}>
      {/* Match score badge — top right */}
      <div style={pc.topRow}>
        <div style={pc.avatarRow}>
          <div style={{ ...pc.avatar, background: isLawyer ? "#EFF6FF" : "#FFF7ED" }}>
            {isLawyer ? "⚖️" : "🤝"}
          </div>
          <div>
            <div style={pc.name}>{profile.name || profile.organizationName}</div>
            {profile.verified && <span style={pc.verified}>✅ Verified</span>}
          </div>
        </div>
        {/* Match % */}
        {matchScore !== null ? (
          <div style={{ ...pc.scoreBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            <div style={pc.scoreNum}>{matchScore}%</div>
            <div style={pc.scoreWord}>match</div>
          </div>
        ) : (
          <div style={{ ...pc.scoreBadge, background: "#F8FAFC", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
            <div style={pc.scoreNum}>—</div>
            <div style={pc.scoreWord}>match</div>
          </div>
        )}
      </div>

      <div style={pc.tags}>
        {profile.expertise && <span style={pc.tag}>📋 {profile.expertise}</span>}
        {profile.location && <span style={pc.tag}>📍 {profile.location}</span>}
        {isLawyer && profile.experienceYears && (
          <span style={pc.tag}>🏆 {profile.experienceYears} yrs exp</span>
        )}
        {!unavailable && isLawyer && (
          <span style={{ ...pc.tag, background: "#F0FDF4", color: "#166534" }}>● Available</span>
        )}
        {unavailable && (
          <span style={{ ...pc.tag, background: "#FEF2F2", color: "#DC2626" }}>● Unavailable</span>
        )}
      </div>

      {profile.specialization && (
        <p style={pc.spec}>Specialization: {profile.specialization}</p>
      )}

      {matchScore !== null && matchScore >= SCORE_THRESHOLDS.MEDIUM && (
        <div style={pc.matchNote}>
          🎯 Good match for your case
        </div>
      )}

      <button
        onClick={onRequest}
        disabled={unavailable}
        aria-label={`Request assistance from ${profile.name || profile.organizationName}`}
        style={{ ...pc.requestBtn, opacity: unavailable ? 0.5 : 1, cursor: unavailable ? "not-allowed" : "pointer" }}>
        📨 Send Case Request
      </button>
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";

// ── Loading Skeleton ──────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div style={s.grid}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} style={skeleton.card}>
        <div style={skeleton.avatar} />
        <div style={skeleton.title} />
        <div style={skeleton.line} />
        <div style={skeleton.line} />
        <div style={skeleton.button} />
      </div>
    ))}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────
const FindLawyers = () => {
  const [tab, setTab] = useState("LAWYER");
  const [lawyers, setLawyers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [myCases, setMyCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: "", expertise: "", location: "", verified: "" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Request modal
  const [requestModal, setRequestModal] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [sending, setSending] = useState(false);

  // Load user's open cases for matching and dropdown
  useEffect(() => {
    const fetchUserCases = async () => {
      try {
        const res = await API.get("/api/cases/my");
        const openCases = (res.data || []).filter(c =>
          STATUS_OPTIONS.OPEN_CASES.includes(c.status)
        );
        setMyCases(openCases);
      } catch (err) {
        console.error("Failed to fetch user cases:", err);
      }
    };
    fetchUserCases();
  }, []);

  // Fetch profiles with debounce
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 9 });
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.expertise) params.append("expertise", filters.expertise);
      if (filters.location) params.append("location", filters.location);
      if (filters.verified !== "") params.append("verified", filters.verified);

      const url = tab === "LAWYER" ? `/directory/lawyers?${params}` : `/directory/ngos?${params}`;
      const res = await API.get(url);
      
      if (tab === "LAWYER") {
        setLawyers(res.data.content || []);
      } else {
        setNgos(res.data.content || []);
      }
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
      toast.error("Failed to load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, tab, filters.keyword, filters.expertise, filters.location, filters.verified]);

  // Debounced search
  const debouncedFetch = useMemo(
    () => debounce(() => fetchProfiles(), 300),
    [fetchProfiles]
  );

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [page, tab, filters, debouncedFetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProfiles();
  };

  const handleReset = () => {
    setFilters({ keyword: "", expertise: "", location: "", verified: "" });
    setPage(0);
    // Fetch will be triggered by useEffect
  };

  const openModal = (profile) => {
    if (myCases.length === 0) {
      toast.error("No open cases found. Submit a case first.");
      return;
    }
    setRequestModal({
      profileId: profile.id,
      profileType: tab,
      profileName: profile.name || profile.organizationName
    });
    setSelectedCaseId(myCases[0]?.id?.toString() || "");
  };

  const sendRequest = async () => {
    if (!selectedCaseId) {
      toast.error("Please select a case");
      return;
    }
    
    setSending(true);
    try {
      await API.post("/matches/send-request", {
        caseId: parseInt(selectedCaseId),
        profileId: requestModal.profileId,
        profileType: requestModal.profileType,
      });
      toast.success(`Request sent to ${requestModal.profileName}!`);
      setRequestModal(null);
      setSelectedCaseId("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Failed to send request";
      toast.error(typeof msg === "string" ? msg : "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const profiles = tab === "LAWYER" ? lawyers : ngos;

  // Sort profiles — highest match score first (memoized)
  const sorted = useMemo(() => {
    return [...profiles].sort((a, b) => {
      const sa = calcMatchScore(a, myCases) || 0;
      const sb = calcMatchScore(b, myCases) || 0;
      return sb - sa;
    });
  }, [profiles, myCases]);

  return (
    <Layout>
      {/* Request Modal */}
      {requestModal && (
        <div 
          style={s.overlay} 
          onClick={() => setRequestModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHdr}>
              <h2 id="modal-title" style={s.modalTitle}>Send Case Request</h2>
              <button 
                onClick={() => setRequestModal(null)} 
                style={s.closeBtn}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalTo}>
                <span style={s.toLabel}>To:</span>
                <span style={s.toName}>
                  {requestModal.profileType === "LAWYER" ? "⚖️" : "🤝"} {requestModal.profileName}
                </span>
              </div>
              <label style={s.fieldLabel} htmlFor="case-select">
                Select your case
              </label>
              <select
                id="case-select"
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                style={s.caseSelect}
                aria-label="Choose a case to associate with this request"
              >
                <option value="">Choose a case...</option>
                {myCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.caseTitle || c.title} — {c.category} · {c.location}
                  </option>
                ))}
              </select>
              {myCases.length === 0 && (
                <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "8px" }}>
                  No open cases. Submit a case first.
                </p>
              )}
              <div style={s.modalActions}>
                <button onClick={() => setRequestModal(null)} style={s.cancelBtn}>
                  Cancel
                </button>
                <button
                  onClick={sendRequest}
                  disabled={sending || !selectedCaseId}
                  style={{
                    ...s.sendBtn,
                    opacity: sending || !selectedCaseId ? 0.6 : 1
                  }}
                  aria-label="Send request to selected professional"
                >
                  {sending ? "Sending..." : "📨 Send Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Find Legal Help</h1>
          <p style={s.subtitle}>
            Browse lawyers and NGOs — match scores show how well they fit your open cases
          </p>
        </div>
      </div>

      {/* Tab + count */}
      <div style={s.tabRow} role="tablist" aria-label="Professional type selector">
        <button
          role="tab"
          aria-selected={tab === "LAWYER"}
          onClick={() => {
            setTab("LAWYER");
            setPage(0);
          }}
          style={{ ...s.tabBtn, ...(tab === "LAWYER" ? s.tabActive : {}) }}
        >
          ⚖️ Lawyers
        </button>
        <button
          role="tab"
          aria-selected={tab === "NGO"}
          onClick={() => {
            setTab("NGO");
            setPage(0);
          }}
          style={{ ...s.tabBtn, ...(tab === "NGO" ? s.tabActive : {}) }}
        >
          🤝 NGOs
        </button>
        <span style={s.countBadge}>{totalElements} available</span>
        {myCases.length > 0 && (
          <span style={s.matchNote}>
            🎯 Scores based on your {myCases.length} open case{myCases.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filters */}
      <div style={s.filterCard}>
        <form onSubmit={handleSearch} style={s.filterForm}>
          <input
            value={filters.keyword}
            onChange={e => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="🔍 Search by name, expertise, location..."
            style={{ ...s.filterInput, flex: 2 }}
            aria-label="Search keyword"
          />
          <input
            value={filters.expertise}
            onChange={e => setFilters({ ...filters, expertise: e.target.value })}
            placeholder="Expertise (e.g. property)"
            style={s.filterInput}
            aria-label="Filter by expertise"
          />
          <input
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            placeholder="Location (e.g. Hyderabad)"
            style={s.filterInput}
            aria-label="Filter by location"
          />
          <select
            value={filters.verified}
            onChange={e => setFilters({ ...filters, verified: e.target.value })}
            style={s.filterInput}
            aria-label="Filter by verification status"
          >
            <option value="">All</option>
            <option value="true">Verified ✅</option>
            <option value="false">Unverified</option>
          </select>
          <button type="submit" style={s.searchBtn}>
            Search
          </button>
          <button type="button" onClick={handleReset} style={s.resetBtn}>
            Reset
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton />
      ) : sorted.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>
            {tab === "LAWYER" ? "⚖️" : "🤝"}
          </div>
          <h3 style={s.emptyTitle}>No {tab === "LAWYER" ? "lawyers" : "NGOs"} found</h3>
          <p style={{ color: "#64748B", fontSize: "13px" }}>
            Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <>
          <div style={s.grid}>
            {sorted.map(p => {
              const score = calcMatchScore(p, myCases);
              return (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  type={tab}
                  matchScore={score}
                  onRequest={() => openModal(p)}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={s.pagination}>
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                style={s.pageBtn}
                aria-label="Previous page"
              >
                ← Prev
              </button>
              <span style={s.pageInfo}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                style={s.pageBtn}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  tabRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  tabBtn: { padding: "9px 20px", border: "1.5px solid #E2E8F0", background: "white", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600", color: "#64748B", transition: "all 0.2s" },
  tabActive: { background: "#0F1F3D", color: "white", border: "1.5px solid #0F1F3D" },
  countBadge: { marginLeft: "auto", fontSize: "12px", color: "#64748B", background: "#F1F5F9", padding: "4px 12px", borderRadius: "20px" },
  matchNote: { fontSize: "12px", color: "#7C3AED", background: "#F5F3FF", padding: "4px 12px", borderRadius: "20px" },
  filterCard: { background: "white", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" },
  filterForm: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  filterInput: { padding: "8px 12px", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", fontFamily: "inherit", outline: "none", minWidth: "120px", flex: 1, transition: "border-color 0.2s" },
  searchBtn: { padding: "8px 18px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600", transition: "background 0.2s" },
  resetBtn: { padding: "8px 14px", background: "white", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  center: { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px" },
  pageBtn: { padding: "8px 18px", border: "1.5px solid #E2E8F0", background: "white", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  pageInfo: { fontSize: "13px", color: "#64748B" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  modal: { background: "white", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  modalHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #F1F5F9" },
  modalTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  closeBtn: { width: "32px", height: "32px", background: "#F1F5F9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#64748B", transition: "background 0.2s" },
  modalBody: { padding: "24px" },
  modalTo: { display: "flex", alignItems: "center", gap: "10px", background: "#F8FAFC", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" },
  toLabel: { fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase" },
  toName: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D" },
  fieldLabel: { fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" },
  caseSelect: { width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", background: "white" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" },
  cancelBtn: { padding: "10px 20px", background: "white", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  sendBtn: { padding: "10px 20px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" },
};

const pc = {
  card: { background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "12px", transition: "transform 0.2s, box-shadow 0.2s" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  avatarRow: { display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0 },
  avatar: { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  name: { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  verified: { fontSize: "10px", color: "#166534", background: "#F0FDF4", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" },
  scoreBadge: { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 12px", borderRadius: "10px", flexShrink: 0, minWidth: "56px" },
  scoreNum: { fontSize: "20px", fontWeight: "800", lineHeight: 1 },
  scoreWord: { fontSize: "9px", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" },
  tags: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { fontSize: "11px", color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: "6px" },
  spec: { fontSize: "12px", color: "#94A3B8", margin: 0 },
  matchNote: { fontSize: "11px", color: "#7C3AED", background: "#F5F3FF", padding: "6px 10px", borderRadius: "8px", textAlign: "center" },
  requestBtn: { width: "100%", padding: "11px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", marginTop: "auto", transition: "background 0.2s", cursor: "pointer" },
};

const skeleton = {
  card: { background: "white", borderRadius: "14px", padding: "20px", border: "1px solid #F1F5F9", animation: "pulse 1.5s ease-in-out infinite" },
  avatar: { width: "44px", height: "44px", borderRadius: "12px", background: "#F1F5F9", marginBottom: "12px" },
  title: { height: "20px", background: "#F1F5F9", borderRadius: "6px", marginBottom: "12px", width: "70%" },
  line: { height: "14px", background: "#F1F5F9", borderRadius: "4px", marginBottom: "8px", width: "90%" },
  button: { height: "42px", background: "#F1F5F9", borderRadius: "10px", marginTop: "12px" },
};

// Add keyframe animation for skeleton
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default FindLawyers;