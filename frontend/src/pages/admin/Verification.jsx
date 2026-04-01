import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  PENDING:  { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", label: "Pending"  },
  APPROVED: { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", label: "Approved" },
  REJECTED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", label: "Rejected" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span style={{ fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px",
      background: s.bg, color: s.color, border:`1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
};

const Avatar = ({ name }) => {
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#1D4ED8","#166534","#9A3412","#7E22CE","#0891B2"];
  const color  = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div style={{ width:"40px", height:"40px", borderRadius:"50%", background: color + "20",
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      fontSize:"14px", fontWeight:"700", color, border:`1.5px solid ${color}30` }}>
      {initials}
    </div>
  );
};

const Verification = () => {
  const [lawyerEntries, setLawyerEntries] = useState([]);
  const [ngoEntries,    setNgoEntries]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("LAWYER"); // "LAWYER" | "NGO"
  const [filters,  setFilters]  = useState({ status: "" });
  const [search,   setSearch]   = useState("");
  const [acting,   setActing]   = useState({});
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => { fetchEntries(); }, []);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/verifications");
      const data = res.data;

      // Backend returns { pendingLawyers: [...], pendingNgos: [...] }
      // OR a flat array with a `role` field — handle both shapes.
      if (data && (data.pendingLawyers || data.pendingNgos)) {
        setLawyerEntries(normalise(data.pendingLawyers || [], "LAWYER"));
        setNgoEntries(normalise(data.pendingNgos    || [], "NGO"));
      } else {
        const flat = Array.isArray(data) ? data : [];
        setLawyerEntries(flat.filter((e) => e.role?.toUpperCase() === "LAWYER"));
        setNgoEntries(flat.filter((e) => e.role?.toUpperCase() === "NGO"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load verifications.");
    } finally {
      setLoading(false);
    }
  };

  /** Normalise raw backend objects so the UI always has consistent fields. */
  const normalise = (list, role) =>
    list.map((item) => ({
      // common
      profileId:       item.profileId,
      userId:          item.userId,
      id:              item.profileId ?? item.userId ?? item.id,
      role,
      email:           item.email,
      location:        item.location,
      contactInfo:     item.contactInfo,
      verified:        item.verified,
      // derive a human status from the `verified` boolean
      status: item.verified === true
        ? "APPROVED"
        : item.verified === false && item.verified !== undefined
          ? "REJECTED"
          : "PENDING",
      // lawyer-specific
      name:            item.fullName ?? item.name,
      organisation:    item.specialization ?? item.organisation,
      specialization:  item.specialization,
      experienceYears: item.experienceYears,
      expertise:       item.expertise,
      // ngo-specific (ngos often use organisation name)
      ...(role === "NGO" && { name: item.fullName ?? item.organisationName ?? item.name }),
    }));

  // ─── Approve / Reject ─────────────────────────────────────────────────────
  /**
   * The backend endpoints are:
   *   PUT /admin/verify/lawyer/{profileId}   body: { "verified": true|false }
   *   PUT /admin/verify/ngo/{profileId}      body: { "verified": true|false }
   *
   * Screenshots confirm 200 OK with this payload; sending `status` causes 500.
   */
  const applyAction = async (entry, action) => {
    const isApprove = action === "APPROVED";
    const profileId = entry.profileId ?? entry.id;
    const role      = entry.role?.toUpperCase();
    const url       = role === "LAWYER"
      ? `/admin/verify/lawyer/${profileId}`
      : `/admin/verify/ngo/${profileId}`;

    setActing((prev) => ({ ...prev, [profileId]: action }));
    try {
      await API.put(url, { verified: isApprove });
      toast.success(
        isApprove
          ? `✅ Approved: ${entry.name}`
          : `❌ Rejected: ${entry.name}`
      );

      const updateList = (list) =>
        list.map((e) =>
          (e.profileId ?? e.id) === profileId
            ? { ...e, verified: isApprove, status: action }
            : e
        );

      if (role === "LAWYER") setLawyerEntries((prev) => updateList(prev));
      else                   setNgoEntries((prev) => updateList(prev));

      // Close the detail modal if it's showing this entry
      if (viewItem && (viewItem.profileId ?? viewItem.id) === profileId) {
        setViewItem((v) => ({ ...v, verified: isApprove, status: action }));
      }
    } catch (e) {
      console.error(e);
      toast.error("Action failed. Please try again.");
    } finally {
      setActing((prev) => { const n = { ...prev }; delete n[profileId]; return n; });
    }
  };

  // ─── Filtering ────────────────────────────────────────────────────────────
  const activeList = tab === "LAWYER" ? lawyerEntries : ngoEntries;

  const filtered = activeList.filter((e) => {
    if (filters.status && e.status !== filters.status) return false;
    if (search && ![e.name, e.organisation, e.location, e.email].some(
      (f) => f?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });

  const counts = (list) => ({
    total:    list.length,
    pending:  list.filter((e) => e.status === "PENDING").length,
    approved: list.filter((e) => e.status === "APPROVED").length,
    rejected: list.filter((e) => e.status === "REJECTED").length,
  });
  const lc = counts(lawyerEntries);
  const nc = counts(ngoEntries);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* ── Detail Modal ── */}
      {viewItem && (
        <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && setViewItem(null)}>
          <div style={ms.modal}>
            <div style={ms.mHeader}>
              <h2 style={ms.mTitle}>Verification Details</h2>
              <button style={ms.mClose} onClick={() => setViewItem(null)}>✕</button>
            </div>
            <div style={ms.mBody}>
              <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px" }}>
                <Avatar name={viewItem.name} />
                <div>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:"#0F1F3D" }}>{viewItem.name}</div>
                  <div style={{ fontSize:"12px", color:"#64748B" }}>{viewItem.email}</div>
                </div>
              </div>
              {[
                ["Role",           viewItem.role],
                ["Profile ID",     viewItem.profileId],
                ["Specialization", viewItem.specialization],
                ["Expertise",      viewItem.expertise],
                ["Organisation",   viewItem.organisation],
                ["Location",       viewItem.location],
                ["Experience",     viewItem.experienceYears ? `${viewItem.experienceYears} yrs` : null],
                ["Contact",        viewItem.contactInfo],
                ["Status",         viewItem.status],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={ms.row}>
                  <span style={ms.rowLabel}>{label}</span>
                  <span style={ms.rowValue}>
                    {label === "Status" ? <StatusBadge status={value} /> : value}
                  </span>
                </div>
              ))}
            </div>
            {viewItem.status === "PENDING" && (
              <div style={ms.mFooter}>
                <button style={ms.approveBtn}
                  onClick={() => { applyAction(viewItem, "APPROVED"); setViewItem(null); }}>
                  ✓ Approve
                </button>
                <button style={ms.rejectBtn}
                  onClick={() => { applyAction(viewItem, "REJECTED"); setViewItem(null); }}>
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Verification Panel</h1>
          <p style={s.sub}>Review and approve lawyer &amp; NGO registrations</p>
        </div>
        <button onClick={fetchEntries} style={s.refreshBtn}>↻ Refresh</button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={s.summaryGrid}>
        {[
          { label:"Lawyers — Pending",  value: lc.pending,  color:"#D97706", icon:"⚖️" },
          { label:"Lawyers — Approved", value: lc.approved, color:"#166534", icon:"✅" },
          { label:"NGOs — Pending",     value: nc.pending,  color:"#7E22CE", icon:"🤝" },
          { label:"NGOs — Approved",    value: nc.approved, color:"#0891B2", icon:"✅" },
        ].map((c) => (
          <div key={c.label} style={s.summaryCard}>
            <span style={{ fontSize:"20px" }}>{c.icon}</span>
            <div style={{ fontSize:"22px", fontWeight:"700", color: c.color, fontFamily:"'Georgia',serif" }}>
              {loading ? "—" : c.value}
            </div>
            <div style={{ fontSize:"12px", color:"#64748B" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabBar}>
        {["LAWYER", "NGO"].map((t) => (
          <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
            onClick={() => { setTab(t); setFilters({ status:"" }); setSearch(""); }}>
            {t === "LAWYER" ? `⚖️ Lawyers (${lc.total})` : `🤝 NGOs (${nc.total})`}
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={s.filterBar}>
        <div style={s.filterRow}>
          <select value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            style={s.select}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <input
            type="text"
            placeholder={`Search ${tab === "LAWYER" ? "lawyers" : "NGOs"} by name, location, email…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...s.select, flex:1, minWidth:"220px" }}
          />
          <button onClick={() => { setFilters({ status:"" }); setSearch(""); }} style={s.clearBtn}>
            Clear
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={s.tableCard}>
        {loading ? (
          <div style={s.empty}>Loading verifications…</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>No entries match your filters.</div>
        ) : (
          <>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Name / Email", tab === "LAWYER" ? "Specialization" : "Organisation",
                    "Location", "Status", "Actions"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const pid      = entry.profileId ?? entry.id;
                  const isActing = !!acting[pid];
                  return (
                    <tr key={pid} style={s.tr}>
                      {/* Name */}
                      <td style={s.td}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <Avatar name={entry.name} />
                          <div>
                            <div style={{ fontWeight:"600", color:"#0F1F3D", fontSize:"13px" }}>
                              {entry.name}
                            </div>
                            <div style={{ fontSize:"11px", color:"#94A3B8" }}>{entry.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* Specialization / Organisation */}
                      <td style={{ ...s.td, color:"#374151" }}>
                        {entry.specialization || entry.organisation || "—"}
                      </td>
                      {/* Location */}
                      <td style={{ ...s.td, color:"#64748B" }}>
                        📍 {entry.location || "—"}
                      </td>
                      {/* Status */}
                      <td style={s.td}><StatusBadge status={entry.status} /></td>
                      {/* Actions */}
                      <td style={s.td}>
                        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                          <button style={s.viewBtn} onClick={() => setViewItem(entry)}>
                            👁 View
                          </button>
                          {entry.status === "PENDING" && (
                            <>
                              <button
                                style={{ ...s.approveBtn, opacity: isActing ? 0.6 : 1 }}
                                disabled={isActing}
                                onClick={() => applyAction(entry, "APPROVED")}
                              >
                                {isActing && acting[pid] === "APPROVED" ? "…" : "✓ Approve"}
                              </button>
                              <button
                                style={{ ...s.rejectBtn, opacity: isActing ? 0.6 : 1 }}
                                disabled={isActing}
                                onClick={() => applyAction(entry, "REJECTED")}
                              >
                                {isActing && acting[pid] === "REJECTED" ? "…" : "✕ Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={s.tableFooter}>
              Showing {filtered.length} of {activeList.length} entries
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  header:      { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" },
  title:       { fontSize:"22px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia',serif", marginBottom:"4px" },
  sub:         { fontSize:"13px", color:"#64748B" },
  refreshBtn:  { padding:"8px 16px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", color:"#0F1F3D", background:"white", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" },
  summaryGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" },
  summaryCard: { background:"white", borderRadius:"12px", padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9", display:"flex", flexDirection:"column", gap:"4px" },
  tabBar:      { display:"flex", gap:"8px", marginBottom:"16px" },
  tab:         { padding:"9px 20px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", fontFamily:"inherit", fontWeight:"600", cursor:"pointer", background:"white", color:"#64748B" },
  tabActive:   { background:"#0F1F3D", color:"white", border:"1.5px solid #0F1F3D" },
  filterBar:   { background:"white", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9" },
  filterRow:   { display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" },
  select:      { padding:"9px 12px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", fontFamily:"inherit", outline:"none", cursor:"pointer", background:"white", color:"#0F1F3D" },
  clearBtn:    { padding:"9px 14px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", color:"#64748B", background:"white", cursor:"pointer", fontFamily:"inherit" },
  tableCard:   { background:"white", borderRadius:"12px", padding:"24px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9" },
  table:       { width:"100%", borderCollapse:"collapse" },
  th:          { fontSize:"10px", fontWeight:"700", color:"#94A3B8", padding:"8px 12px", textAlign:"left", borderBottom:"1px solid #F1F5F9", textTransform:"uppercase", letterSpacing:"0.5px" },
  tr:          { borderBottom:"1px solid #F8FAFC" },
  td:          { fontSize:"13px", padding:"14px 12px", verticalAlign:"middle" },
  tableFooter: { fontSize:"12px", color:"#94A3B8", textAlign:"center", marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #F1F5F9" },
  viewBtn:     { fontSize:"11px", color:"#1D4ED8", background:"#EFF6FF", border:"none", padding:"5px 10px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  approveBtn:  { fontSize:"11px", color:"white", background:"#166534", border:"none", padding:"5px 10px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  rejectBtn:   { fontSize:"11px", color:"white", background:"#DC2626", border:"none", padding:"5px 10px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  empty:       { textAlign:"center", padding:"48px", color:"#94A3B8", fontSize:"13px" },
};

const ms = {
  overlay:    { position:"fixed", inset:0, background:"rgba(10,22,40,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" },
  modal:      { background:"white", borderRadius:"16px", width:"100%", maxWidth:"500px", maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.25)" },
  mHeader:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 16px", borderBottom:"1px solid #F1F5F9" },
  mTitle:     { fontSize:"16px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia',serif" },
  mClose:     { background:"none", border:"none", fontSize:"16px", color:"#94A3B8", cursor:"pointer", padding:"4px 8px", borderRadius:"6px" },
  mBody:      { padding:"20px 24px", overflowY:"auto", flex:1 },
  row:        { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F8FAFC", alignItems:"center" },
  rowLabel:   { fontSize:"12px", fontWeight:"600", color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.4px" },
  rowValue:   { fontSize:"13px", color:"#0F1F3D", fontWeight:"500" },
  mFooter:    { padding:"16px 24px", borderTop:"1px solid #F1F5F9", display:"flex", gap:"10px" },
  approveBtn: { flex:1, padding:"10px", background:"#166534", color:"white", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" },
  rejectBtn:  { flex:1, padding:"10px", background:"#DC2626", color:"white", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" },
};

export default Verification;