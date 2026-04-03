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
    <span style={{ fontSize:"11px", fontWeight:"700", padding:"4px 12px", borderRadius:"20px",
      background: s.bg, color: s.color, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
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
      fontSize:"14px", fontWeight:"700", color, border:`1.5px solid ${color}40` }}>
      {initials}
    </div>
  );
};

/**
 * verified === true  → APPROVED
 * verified === false → PENDING  (newly registered, not yet approved)
 * verified === null/undefined → PENDING
 */
const deriveStatus = (verified) => {
  if (verified === true) return "APPROVED";
  return "PENDING";
};

const Verification = () => {
  const [lawyerEntries, setLawyerEntries] = useState([]);
  const [ngoEntries,    setNgoEntries]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("LAWYER");
  const [filters,  setFilters]  = useState({ status: "" });
  const [search,   setSearch]   = useState("");
  const [acting,   setActing]   = useState({});
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const [verRes, lawyerRes, ngoRes] = await Promise.allSettled([
        API.get("/admin/verifications"),
        API.get("/directory/lawyers?size=200"),
        API.get("/admin/dashboard/recent-users"),
      ]);

      let lawyers = [];
      let ngos    = [];

      if (verRes.status === "fulfilled") {
        const data = verRes.value.data;
        if (data && (data.pendingLawyers || data.pendingNgos)) {
          lawyers = normalise(data.pendingLawyers || [], "LAWYER");
          ngos    = normalise(data.pendingNgos    || [], "NGO");
        } else if (Array.isArray(data)) {
          lawyers = data.filter(e => e.role?.toUpperCase() === "LAWYER").map(e => normaliseOne(e, "LAWYER"));
          ngos    = data.filter(e => e.role?.toUpperCase() === "NGO").map(e => normaliseOne(e, "NGO"));
        }
      }

      // Merge ALL lawyers from directory to catch newly registered unverified ones (verified=false)
      if (lawyerRes.status === "fulfilled") {
        const dirLawyers = lawyerRes.value.data?.content || lawyerRes.value.data || [];
        dirLawyers.forEach(l => {
          const id = l.profileId ?? l.id;
          const exists = lawyers.find(e => (e.profileId ?? e.id) === id);
          if (!exists) lawyers.push(normaliseOne(l, "LAWYER"));
        });
      }

      // Merge NGOs from recent-users
      if (ngoRes.status === "fulfilled") {
        const allUsers = ngoRes.value.data || [];
        allUsers.filter(u => u.role === "NGO").forEach(n => {
          const id = n.userId ?? n.id;
          const exists = ngos.find(e => (e.userId ?? e.id) === id);
          if (!exists) ngos.push(normaliseOne(n, "NGO"));
        });
      }

      setLawyerEntries(lawyers);
      setNgoEntries(ngos);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load verifications.");
    } finally {
      setLoading(false);
    }
  };

  const normalise = (list, role) => list.map(item => normaliseOne(item, role));

  const normaliseOne = (item, role) => ({
    profileId:       item.profileId,
    userId:          item.userId,
    id:              item.profileId ?? item.userId ?? item.id,
    role,
    email:           item.email,
    location:        item.location,
    contactInfo:     item.contactInfo,
    verified:        item.verified,
    status:          deriveStatus(item.verified),
    name:            item.fullName ?? item.name ?? (role === "NGO" ? item.organisationName : null),
    organisation:    item.specialization ?? item.organisation ?? item.organisationName,
    specialization:  item.specialization,
    experienceYears: item.experienceYears,
    expertise:       item.expertise,
    createdAt:       item.createdAt,
  });

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
      toast.success(isApprove ? `Approved: ${entry.name}` : `Rejected: ${entry.name}`);

      const updateList = (list) =>
        list.map((e) =>
          (e.profileId ?? e.id) === profileId
            ? { ...e, verified: isApprove, status: action }
            : e
        );

      if (role === "LAWYER") setLawyerEntries((prev) => updateList(prev));
      else                   setNgoEntries((prev) => updateList(prev));

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

  return (
    <Layout>
      {viewItem && (
        <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && setViewItem(null)}>
          <div style={ms.modal}>
            <div style={ms.mHeader}>
              <h2 style={ms.mTitle}>Verification Details</h2>
              <button style={ms.mClose} onClick={() => setViewItem(null)}>✕</button>
            </div>
            <div style={ms.mBody}>
              <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px",
                padding:"16px", background:"#F8FAFC", borderRadius:"12px" }}>
                <Avatar name={viewItem.name} />
                <div>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:"#0F1F3D" }}>{viewItem.name || "—"}</div>
                  <div style={{ fontSize:"12px", color:"#64748B", marginTop:"2px" }}>{viewItem.email}</div>
                  <div style={{ marginTop:"8px" }}><StatusBadge status={viewItem.status} /></div>
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
                ["Registered",     viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-IN") : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={ms.row}>
                  <span style={ms.rowLabel}>{label}</span>
                  <span style={ms.rowValue}>{value}</span>
                </div>
              ))}
            </div>
            {viewItem.status === "PENDING" ? (
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
            ) : (
              <div style={{ padding:"16px 24px", borderTop:"1px solid #F1F5F9", textAlign:"center" }}>
                <span style={{ fontSize:"13px", color:"#94A3B8" }}>
                  This {viewItem.role?.toLowerCase()} has already been {viewItem.status?.toLowerCase()}.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Verification Panel</h1>
          <p style={s.sub}>Review and approve lawyer &amp; NGO registrations</p>
        </div>
        <button onClick={fetchEntries} style={s.refreshBtn}>↻ Refresh</button>
      </div>

      <div style={s.summaryGrid}>
        {[
          { label:"Lawyers Pending",  value: lc.pending,  color:"#D97706", bg:"#FFFBEB", icon:"⏳" },
          { label:"Lawyers Approved", value: lc.approved, color:"#166534", bg:"#F0FDF4", icon:"✅" },
          { label:"NGOs Pending",     value: nc.pending,  color:"#7E22CE", bg:"#FAF5FF", icon:"⏳" },
          { label:"NGOs Approved",    value: nc.approved, color:"#0891B2", bg:"#F0F9FF", icon:"✅" },
        ].map((c) => (
          <div key={c.label} style={{ ...s.summaryCard, background: c.bg }}>
            <span style={{ fontSize:"22px" }}>{c.icon}</span>
            <div style={{ fontSize:"28px", fontWeight:"700", color: c.color, fontFamily:"'Georgia',serif" }}>
              {loading ? "—" : c.value}
            </div>
            <div style={{ fontSize:"12px", color:"#64748B", fontWeight:"600" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {(lc.pending + nc.pending) > 0 && !loading && (
        <div style={s.alertBanner}>
          <span style={{ fontSize:"18px" }}>🔔</span>
          <span style={{ fontSize:"13px", fontWeight:"600", color:"#92400E" }}>
            {lc.pending + nc.pending} registration{lc.pending + nc.pending > 1 ? "s" : ""} awaiting your approval
          </span>
          <button onClick={() => setFilters({ status:"PENDING" })} style={s.alertBtn}>
            View Pending
          </button>
        </div>
      )}

      <div style={s.tabBar}>
        {["LAWYER", "NGO"].map((t) => (
          <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
            onClick={() => { setTab(t); setFilters({ status:"" }); setSearch(""); }}>
            {t === "LAWYER" ? "⚖️" : "🤝"} {t === "LAWYER" ? "Lawyers" : "NGOs"}
            <span style={{ ...s.tabCount, background: tab === t ? "rgba(255,255,255,0.2)" : "#F1F5F9",
              color: tab === t ? "white" : "#64748B" }}>
              {t === "LAWYER" ? lc.total : nc.total}
            </span>
            {(t === "LAWYER" ? lc.pending : nc.pending) > 0 && (
              <span style={s.pendingDot}>{t === "LAWYER" ? lc.pending : nc.pending}</span>
            )}
          </button>
        ))}
      </div>

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
          {(filters.status || search) && (
            <button onClick={() => { setFilters({ status:"" }); setSearch(""); }} style={s.clearBtn}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div style={s.tableCard}>
        {loading ? (
          <div style={s.empty}>Loading verifications…</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>No entries match your filters.</div>
        ) : (
          <>
            <table style={s.table}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
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
                  const isPending = entry.status === "PENDING";
                  return (
                    <tr key={pid} style={{
                      ...s.tr,
                      borderLeft: isPending ? "3px solid #F59E0B" : "3px solid transparent",
                    }}>
                      <td style={s.td}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <Avatar name={entry.name} />
                          <div>
                            <div style={{ fontWeight:"600", color:"#0F1F3D", fontSize:"13px" }}>
                              {entry.name || "—"}
                            </div>
                            <div style={{ fontSize:"11px", color:"#94A3B8" }}>{entry.email}</div>
                            {entry.createdAt && (
                              <div style={{ fontSize:"10px", color:"#CBD5E1", marginTop:"1px" }}>
                                Joined {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ ...s.td, color:"#374151" }}>
                        {entry.specialization || entry.organisation || "—"}
                      </td>
                      <td style={{ ...s.td, color:"#64748B" }}>
                        {entry.location ? `📍 ${entry.location}` : "—"}
                      </td>
                      <td style={s.td}><StatusBadge status={entry.status} /></td>
                      <td style={s.td}>
                        <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
                          <button style={s.viewBtn} onClick={() => setViewItem(entry)}>
                            👁 View
                          </button>
                          {isPending && (
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
                          {entry.status === "APPROVED" && (
                            <button
                              style={{ ...s.rejectBtn, background:"#EF4444", opacity: isActing ? 0.6 : 1 }}
                              disabled={isActing}
                              onClick={() => applyAction(entry, "REJECTED")}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={s.tableFooter}>
              Showing <strong>{filtered.length}</strong> of <strong>{activeList.length}</strong> entries
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const s = {
  header:      { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" },
  title:       { fontSize:"22px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia',serif", marginBottom:"4px" },
  sub:         { fontSize:"13px", color:"#64748B" },
  refreshBtn:  { padding:"8px 16px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", color:"#0F1F3D", background:"white", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" },
  summaryGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" },
  summaryCard: { borderRadius:"12px", padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9", display:"flex", flexDirection:"column", gap:"6px" },
  alertBanner: { display:"flex", alignItems:"center", gap:"12px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"10px", padding:"12px 16px", marginBottom:"16px" },
  alertBtn:    { marginLeft:"auto", padding:"6px 14px", background:"#D97706", color:"white", border:"none", borderRadius:"6px", fontSize:"12px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" },
  tabBar:      { display:"flex", gap:"8px", marginBottom:"16px" },
  tab:         { padding:"10px 20px", borderRadius:"10px", border:"1.5px solid #E2E8F0", fontSize:"13px", fontFamily:"inherit", fontWeight:"600", cursor:"pointer", background:"white", color:"#64748B", display:"flex", alignItems:"center", gap:"8px", position:"relative" },
  tabActive:   { background:"#0F1F3D", color:"white", border:"1.5px solid #0F1F3D" },
  tabCount:    { fontSize:"11px", fontWeight:"700", padding:"2px 8px", borderRadius:"20px" },
  pendingDot:  { position:"absolute", top:"-6px", right:"-6px", background:"#EF4444", color:"white", fontSize:"10px", fontWeight:"700", width:"18px", height:"18px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid white" },
  filterBar:   { background:"white", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9" },
  filterRow:   { display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" },
  select:      { padding:"9px 12px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", fontFamily:"inherit", outline:"none", cursor:"pointer", background:"white", color:"#0F1F3D" },
  clearBtn:    { padding:"9px 14px", borderRadius:"8px", border:"1.5px solid #E2E8F0", fontSize:"13px", color:"#64748B", background:"white", cursor:"pointer", fontFamily:"inherit" },
  tableCard:   { background:"white", borderRadius:"12px", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", border:"1px solid #F1F5F9" },
  table:       { width:"100%", borderCollapse:"collapse" },
  th:          { fontSize:"10px", fontWeight:"700", color:"#94A3B8", padding:"12px 16px", textAlign:"left", borderBottom:"1px solid #F1F5F9", textTransform:"uppercase", letterSpacing:"0.5px" },
  tr:          { borderBottom:"1px solid #F8FAFC" },
  td:          { fontSize:"13px", padding:"14px 16px", verticalAlign:"middle" },
  tableFooter: { fontSize:"12px", color:"#94A3B8", textAlign:"center", padding:"14px 16px", borderTop:"1px solid #F1F5F9", background:"#FAFAFA" },
  viewBtn:     { fontSize:"11px", color:"#1D4ED8", background:"#EFF6FF", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  approveBtn:  { fontSize:"11px", color:"white", background:"#166534", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  rejectBtn:   { fontSize:"11px", color:"white", background:"#DC2626", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", whiteSpace:"nowrap" },
  empty:       { textAlign:"center", padding:"60px 48px", color:"#94A3B8", fontSize:"13px" },
};

const ms = {
  overlay:    { position:"fixed", inset:0, background:"rgba(10,22,40,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" },
  modal:      { background:"white", borderRadius:"16px", width:"100%", maxWidth:"500px", maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.25)" },
  mHeader:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 16px", borderBottom:"1px solid #F1F5F9" },
  mTitle:     { fontSize:"16px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia',serif" },
  mClose:     { background:"#F1F5F9", border:"none", fontSize:"14px", color:"#64748B", cursor:"pointer", padding:"6px 10px", borderRadius:"8px", fontWeight:"700" },
  mBody:      { padding:"20px 24px", overflowY:"auto", flex:1 },
  row:        { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F8FAFC", alignItems:"center" },
  rowLabel:   { fontSize:"11px", fontWeight:"700", color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.4px" },
  rowValue:   { fontSize:"13px", color:"#0F1F3D", fontWeight:"500" },
  mFooter:    { padding:"16px 24px", borderTop:"1px solid #F1F5F9", display:"flex", gap:"10px" },
  approveBtn: { flex:1, padding:"12px", background:"#166534", color:"white", border:"none", borderRadius:"10px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" },
  rejectBtn:  { flex:1, padding:"12px", background:"#DC2626", color:"white", border:"none", borderRadius:"10px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" },
};

export default Verification;
