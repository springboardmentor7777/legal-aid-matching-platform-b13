import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import CaseDetailModal from "../../components/common/CaseDetailModal";
import ScheduleCallModal from "../../components/common/ScheduleCallModal";

const Matches = () => {
  const currentUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
  const role = currentUser.role;
  if (role === "LAWYER") return <LawyerNgoView role="LAWYER" />;
  if (role === "NGO")    return <LawyerNgoView role="NGO" />;
  return <UserRequestsView />;
};

// ─── USER: view requests they sent ───────────────────────────────────────────
// ONLY shows REQUESTED / ACCEPTED / REJECTED — hides old PENDING admin-generated matches
const UserRequestsView = () => {
  const [matches, setMatches]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [caseId, setCaseId]         = useState(null);
  const [scheduleMatch, setScheduleMatch] = useState(null);
  const [filter, setFilter]         = useState("ALL");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/matches/my");
      // Only show requests the user directly sent — exclude old admin-generated PENDING matches
      const userSent = (res.data || []).filter(m =>
        ["REQUESTED", "ACCEPTED", "REJECTED", "CANCELLED"].includes(m.status)
      );
      setMatches(userSent);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  const cancel = async (matchId) => {
    setCancelling(matchId);
    try {
      await API.put(`/matches/${matchId}/cancel`);
      toast.success("Request cancelled");
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to cancel"); }
    finally { setCancelling(null); }
  };

  const sc = {
    REQUESTED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Request Sent",  icon: "📨" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Accepted",       icon: "✅" },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", label: "Declined",       icon: "❌" },
    CANCELLED: { bg: "#F1F5F9", color: "#94A3B8", border: "#E2E8F0", label: "Cancelled",      icon: "🔒" },
  };

  const filterTabs = ["ALL", "REQUESTED", "ACCEPTED", "REJECTED"];
  const filtered = filter === "ALL" ? matches : matches.filter(m => m.status === filter);

  const accepted  = matches.filter(m => m.status === "ACCEPTED").length;
  const pending   = matches.filter(m => m.status === "REQUESTED").length;

  return (
    <Layout>
      {caseId && <CaseDetailModal caseId={caseId} onClose={() => setCaseId(null)} />}
      {scheduleMatch && (
        <ScheduleCallModal
          match={scheduleMatch}
          onClose={() => setScheduleMatch(null)}
          onSuccess={() => { setScheduleMatch(null); toast.success("Appointment booked!"); }}
        />
      )}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>🔗 My Requests</h1>
          <p style={s.subtitle}>Case requests you sent to lawyers and NGOs</p>
        </div>
        <div style={s.pills}>
          <Pill val={pending}  lbl="Awaiting" clr="#1D4ED8" bg="#EFF6FF" bd="#BFDBFE" />
          <Pill val={accepted} lbl="Accepted"  clr="#166534" bg="#F0FDF4" bd="#86EFAC" />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={s.filterRow}>
        {filterTabs.map(f => (
          <TB key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "ALL" ? `All (${matches.length})` : `${sc[f]?.label} (${matches.filter(m => m.status === f).length})`}
          </TB>
        ))}
      </div>

      {loading ? (
        <div style={s.center}>Loading...</div>
      ) : matches.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔗</div>
          <h3 style={s.emptyTitle}>No requests yet</h3>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "16px" }}>
            Go to Find Lawyers/NGOs to send case requests.
          </p>
          <a href="/lawyers" style={s.findBtn}>⚖️ Find Lawyers & NGOs</a>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color: "#64748B", fontSize: "13px" }}>No {filter.toLowerCase()} requests.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(m => {
            const badge = sc[m.status] || sc.REQUESTED;
            return (
              <div key={m.id} style={{ ...s.card, borderTop: `4px solid ${badge.border}` }}>

                {/* Status badge */}
                <div style={s.cardTop}>
                  <span style={{ ...s.badge, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                    {badge.icon} {badge.label}
                  </span>
                  {m.matchDate && (
                    <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                      {new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>

                {/* Who they sent to */}
                <div style={s.profRow}>
                  <div style={{ ...s.avatar, background: m.profileType === "LAWYER" ? "#EFF6FF" : "#FFF7ED" }}>
                    {m.profileType === "LAWYER" ? "⚖️" : "🤝"}
                  </div>
                  <div>
                    <div style={s.profName}>{m.profileName || "—"}</div>
                    <div style={s.profMeta}>
                      {m.profileType}
                      {m.profileExpertise ? ` · ${m.profileExpertise}` : ""}
                      {m.profileLocation  ? ` · 📍 ${m.profileLocation}` : ""}
                    </div>
                  </div>
                </div>

                {/* Case */}
                <div style={s.caseBox}>
                  <span style={s.caseLbl}>📁 CASE</span>
                  <span style={s.caseTtl}>{m.caseTitle || `Case #${m.caseId}`}</span>
                  <button onClick={() => setCaseId(m.caseId)} style={s.viewBtn}>👁</button>
                </div>

                {/* Status-specific actions */}
                {m.status === "REQUESTED" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                    <div style={s.awaitingBar}>📨 Request sent — awaiting response</div>
                    <button onClick={() => cancel(m.id)} disabled={cancelling === m.id}
                      style={{ ...s.cancelBtn, opacity: cancelling === m.id ? 0.6 : 1 }}>
                      {cancelling === m.id ? "Cancelling..." : "✕ Cancel Request"}
                    </button>
                  </div>
                )}

                {m.status === "ACCEPTED" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                    <div style={s.acceptedBar}>✅ Accepted — chat & appointments active</div>
                    {/* Schedule a Call button — only for ACCEPTED */}
                    <button onClick={() => setScheduleMatch(m)} style={s.scheduleBtn}>
                      📅 Schedule a Call
                    </button>
                  </div>
                )}

                {m.status === "REJECTED" && (
                  <div style={s.rejectedBar}>❌ Declined — find another lawyer/NGO</div>
                )}

                {m.status === "CANCELLED" && (
                  <div style={s.cancelledBar}>🔒 Case already assigned to someone else</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

// ─── LAWYER / NGO: incoming case requests ────────────────────────────────────
const LawyerNgoView = ({ role }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(null);
  const [caseId, setCaseId]   = useState(null);
  const [filter, setFilter]   = useState("ALL");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/matches/assigned");
      setMatches(res.data || []);
    } catch { toast.error("Failed to load case requests"); }
    finally { setLoading(false); }
  };

  const accept = async (matchId) => {
    setBusy(matchId + "acc");
    try {
      await API.put(`/matches/${matchId}/accept`);
      toast.success("Case accepted! Chat and appointments are now active.");
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to accept"); }
    finally { setBusy(null); }
  };

  const reject = async (matchId) => {
    setBusy(matchId + "rej");
    try {
      await API.put(`/matches/${matchId}/reject`);
      toast.success("Case declined.");
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to decline"); }
    finally { setBusy(null); }
  };

  const sc = {
    REQUESTED: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA", label: "New Request", icon: "🔔" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Accepted",    icon: "✅" },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", label: "Declined",    icon: "❌" },
  };

  const newReqs  = matches.filter(m => m.status === "REQUESTED").length;
  const accepted = matches.filter(m => m.status === "ACCEPTED").length;
  const filtered = filter === "ALL" ? matches : matches.filter(m => m.status === filter);

  return (
    <Layout>
      {caseId && <CaseDetailModal caseId={caseId} onClose={() => setCaseId(null)} />}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>{role === "LAWYER" ? "⚖️" : "🤝"} Case Requests</h1>
          <p style={s.subtitle}>Citizens are requesting your help. Review and decide.</p>
        </div>
        <div style={s.pills}>
          <Pill val={newReqs}  lbl="New"      clr="#C2410C" bg="#FFF7ED" bd="#FED7AA" />
          <Pill val={accepted} lbl="Accepted" clr="#166534" bg="#F0FDF4" bd="#86EFAC" />
        </div>
      </div>

      <div style={s.filterRow}>
        {["ALL", "REQUESTED", "ACCEPTED", "REJECTED"].map(f => (
          <TB key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "ALL" ? `All (${matches.length})` : `${f === "REQUESTED" ? `🔔 New (${newReqs})` : sc[f]?.label + ` (${matches.filter(m=>m.status===f).length})`}`}
          </TB>
        ))}
      </div>

      {loading ? (
        <div style={s.center}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{role === "LAWYER" ? "⚖️" : "🤝"}</div>
          <h3 style={s.emptyTitle}>{filter === "ALL" ? "No case requests yet" : `No ${sc[filter]?.label?.toLowerCase() || filter} requests`}</h3>
          <p style={{ color: "#64748B", fontSize: "13px" }}>Citizens will send requests after browsing your profile.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(m => {
            const badge = sc[m.status] || sc.REQUESTED;
            const isNew = m.status === "REQUESTED";
            return (
              <div key={m.id} style={{
                ...s.card,
                borderTop: `4px solid ${badge.border}`,
                ...(isNew ? { boxShadow: "0 4px 20px rgba(194,65,12,0.12)" } : {}),
              }}>
                <div style={s.cardTop}>
                  <span style={{ ...s.badge, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                    {badge.icon} {badge.label}
                  </span>
                  {m.matchDate && (
                    <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                      {new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>

                {/* Case details */}
                <div style={s.caseBoxLg}>
                  <span style={{ fontSize: "22px" }}>📁</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.profName}>{m.caseTitle || `Case #${m.caseId}`}</div>
                    <div style={s.profMeta}>
                      {m.clientName && <span>👤 {m.clientName} · </span>}
                      {m.caseCategory && <span>{m.caseCategory}</span>}
                      {m.caseLocation  && <span> · 📍 {m.caseLocation}</span>}
                    </div>
                  </div>
                </div>

                <button onClick={() => setCaseId(m.caseId)} style={s.viewFull}>
                  👁 View Full Case Details
                </button>

                {m.status === "REQUESTED" && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    <button onClick={() => accept(m.id)} disabled={!!busy}
                      style={{ ...s.acceptBtn, opacity: busy === m.id + "acc" ? 0.7 : 1 }}>
                      {busy === m.id + "acc" ? "Accepting..." : "✓ Accept Case"}
                    </button>
                    <button onClick={() => reject(m.id)} disabled={!!busy}
                      style={{ ...s.declineBtn, opacity: busy === m.id + "rej" ? 0.7 : 1 }}>
                      {busy === m.id + "rej" ? "..." : "✕ Decline"}
                    </button>
                  </div>
                )}
                {m.status === "ACCEPTED" && (
                  <div style={s.acceptedBar}>✅ Accepted — chat and appointments active</div>
                )}
                {m.status === "REJECTED" && (
                  <div style={s.rejectedBar}>❌ You declined this case</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

// ─── Shared components ────────────────────────────────────────────────────────
const Pill = ({ val, lbl, clr, bg, bd }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 18px",
    background: bg, border: `1px solid ${bd}`, borderRadius: "12px", minWidth: "64px" }}>
    <span style={{ fontSize: "22px", fontWeight: "800", color: clr, lineHeight: 1 }}>{val}</span>
    <span style={{ fontSize: "10px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", marginTop: "2px" }}>{lbl}</span>
  </div>
);
const TB = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", border: `1.5px solid ${active ? "#0F1F3D" : "#E2E8F0"}`,
    background: active ? "#0F1F3D" : "white", color: active ? "white" : "#64748B",
    borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
    fontWeight: "600", whiteSpace: "nowrap",
  }}>
    {children}
  </button>
);

const s = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  title:       { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle:    { fontSize: "13px", color: "#64748B" },
  pills:       { display: "flex", gap: "10px" },
  filterRow:   { display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" },
  center:      { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty:       { textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" },
  emptyTitle:  { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  findBtn:     { display: "inline-block", padding: "10px 20px", background: "#0F1F3D", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "700" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card:        { background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "12px" },
  cardTop:     { display: "flex", justifyContent: "space-between", alignItems: "center" },
  badge:       { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" },
  profRow:     { display: "flex", alignItems: "center", gap: "12px" },
  avatar:      { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  profName:    { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "3px" },
  profMeta:    { fontSize: "12px", color: "#94A3B8" },
  caseBox:     { background: "#F8FAFC", borderRadius: "8px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px" },
  caseBoxLg:   { background: "#F8FAFC", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px" },
  caseLbl:     { fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", flexShrink: 0 },
  caseTtl:     { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", flex: 1 },
  viewBtn:     { background: "white", border: "1.5px solid #E2E8F0", borderRadius: "6px", fontSize: "14px", cursor: "pointer", padding: "4px 8px", flexShrink: 0 },
  viewFull:    { width: "100%", padding: "9px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", color: "#0F1F3D" },
  awaitingBar: { padding: "10px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textAlign: "center", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" },
  acceptedBar: { padding: "10px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textAlign: "center", background: "#F0FDF4", color: "#166534", border: "1px solid #86EFAC" },
  rejectedBar: { padding: "10px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textAlign: "center", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", marginTop: "auto" },
  cancelledBar:{ padding: "10px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textAlign: "center", background: "#F1F5F9", color: "#94A3B8", border: "1px solid #E2E8F0", marginTop: "auto" },
  cancelBtn:   { width: "100%", padding: "9px", background: "white", color: "#DC2626", border: "1.5px solid #FECACA", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  scheduleBtn: { width: "100%", padding: "11px", background: "#7C3AED", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  acceptBtn:   { flex: 1, padding: "10px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  declineBtn:  { padding: "10px 16px", background: "white", color: "#DC2626", border: "1.5px solid #FECACA", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
};

export default Matches;