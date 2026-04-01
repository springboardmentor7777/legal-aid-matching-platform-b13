import { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

/*
  API endpoints used:
  GET /admin/logs           → Page<SystemLog>  (Spring Pageable)
  GET /admin/logs/action/{action} → List<SystemLog>
  GET /admin/dashboard/system-health → Map<String,Object>

  SystemLog entity fields: id, action, username, role, details, status, timestamp
  SystemHealth fields: status ("UP"), timestamp, database, totalUsers, totalCases

  NOTE: SystemLog uses "action" (not "level") and "details" (not "message").
  We map: action → level badge,  details → message column,  username → source column.
*/

/* ── Level / Action Badge ── */
const ActionBadge = ({ action, status }) => {
  // Map backend action strings to visual severity
  const getStyle = (action, status) => {
    if (status === "FAILURE" || action?.includes("FAILED") || action?.includes("ERROR"))
      return { background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", label:"ERROR" };
    if (action?.includes("WARN") || action?.includes("REJECT"))
      return { background:"#FFFBEB", color:"#D97706", border:"1px solid #FDE68A", label:"WARN" };
    if (action?.includes("DEBUG") || action?.includes("QUERY"))
      return { background:"#F8FAFC", color:"#475569", border:"1px solid #E2E8F0", label:"DEBUG" };
    return { background:"#EFF6FF", color:"#1D4ED8", border:"1px solid #BFDBFE", label:"INFO" };
  };
  const s = getStyle(action, status);
  return (
    <span style={{ fontSize:"10px", fontWeight:"700", padding:"2px 7px", borderRadius:"4px",
      fontFamily:"monospace", background:s.background, color:s.color, border:s.border }}>
      {s.label}
    </span>
  );
};

/* ── Derived level for filtering ── */
const getLevel = (log) => {
  if (log.status === "FAILURE" || log.action?.includes("FAILED") || log.action?.includes("ERROR")) return "ERROR";
  if (log.action?.includes("WARN") || log.action?.includes("REJECT")) return "WARN";
  if (log.action?.includes("DEBUG") || log.action?.includes("QUERY")) return "DEBUG";
  return "INFO";
};

/* ══════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════ */
const SystemLogs = () => {
  const [logs,        setLogs]        = useState([]);
  const [health,      setHealth]      = useState(null);
  const [totalLogs,   setTotalLogs]   = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("ALL");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const timerRef = useRef(null);
  const PAGE_SIZE = 15;

  useEffect(() => { fetchAll(); }, [page]);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => fetchAll(), 10000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [autoRefresh, page]);

  const fetchAll = async () => {
    try {
      const [logsRes, healthRes] = await Promise.all([
        // /admin/logs uses Spring Pageable: ?page=N&size=N&sort=timestamp,desc
        API.get(`/admin/logs?page=${page}&size=${PAGE_SIZE}&sort=timestamp,desc`),
        API.get("/admin/dashboard/system-health"),
      ]);

      // Spring Page response: { content: [], totalElements, totalPages, ... }
      const logsData = logsRes.data;
      if (logsData?.content) {
        setLogs(logsData.content);
        setTotalLogs(logsData.totalElements || 0);
      } else if (Array.isArray(logsData)) {
        setLogs(logsData);
        setTotalLogs(logsData.length);
      }

      setHealth(healthRes.data);
    } catch (e) {
      console.error("SystemLogs fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* Client-side filter on already-fetched page */
  const filtered = logs.filter((l) => {
    const level = getLevel(l);
    const matchLevel  = filter === "ALL" || level === filter;
    const matchSearch = !search || [l.action, l.username, l.details, l.role, l.status]
      .some((f) => f?.toLowerCase().includes(search.toLowerCase()));
    return matchLevel && matchSearch;
  });

  /* Count severity across current page */
  const counts = logs.reduce((acc, l) => {
    const lv = getLevel(l);
    acc[lv] = (acc[lv] || 0) + 1;
    return acc;
  }, {});

  const totalPages = Math.ceil(totalLogs / PAGE_SIZE);

  /*
    SystemHealth fields from AdminDashboardService.getSystemHealth():
    { status: "UP", timestamp, database: "Connected", totalUsers, totalCases }
    No cpuUsage/memoryUsage/diskUsage — those aren't in the backend.
    We show what the backend actually returns.
  */

  return (
    <Layout>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>System Monitoring</h1>
          <p style={s.sub}>Platform health &amp; audit logs</p>
        </div>
        <div style={s.headerActions}>
          <label style={s.autoLabel}>
            <input type="checkbox" checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ accentColor:"#1D4ED8" }}/>
            <span>Auto-refresh (10s)</span>
          </label>
          <button onClick={() => { setPage(0); fetchAll(); }} style={s.refreshBtn}>↻ Refresh</button>
        </div>
      </div>

      {/* System Health — uses AdminDashboardService.getSystemHealth() fields */}
      <div style={s.healthGrid}>
        {/* status field */}
        <div style={s.healthCard}>
          <div style={s.healthTop}>
            <span style={{fontSize:"22px"}}>🖥️</span>
            <div style={{textAlign:"right"}}>
              <div style={{
                fontSize:"18px", fontWeight:"700", fontFamily:"'Georgia',serif",
                color: health?.status === "UP" ? "#059669" : "#DC2626"
              }}>
                {health?.status || "—"}
              </div>
              <div style={{fontSize:"11px", color:"#64748B"}}>System Status</div>
            </div>
          </div>
          <div style={{
            marginTop:"10px", fontSize:"11px", fontWeight:"700", padding:"3px 10px",
            borderRadius:"20px", display:"inline-block",
            background: health?.status === "UP" ? "#F0FDF4" : "#FEF2F2",
            color:       health?.status === "UP" ? "#166534" : "#DC2626",
            border:`1px solid ${health?.status === "UP" ? "#86EFAC" : "#FECACA"}`,
          }}>
            {health?.status === "UP" ? "● All systems operational" : "● System issue detected"}
          </div>
        </div>

        {/* database field */}
        <div style={s.healthCard}>
          <div style={s.healthTop}>
            <span style={{fontSize:"22px"}}>🗄️</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"18px", fontWeight:"700", fontFamily:"'Georgia',serif", color:"#059669"}}>
                {health?.database || "—"}
              </div>
              <div style={{fontSize:"11px", color:"#64748B"}}>Database</div>
            </div>
          </div>
        </div>

        {/* totalUsers field */}
        <div style={s.healthCard}>
          <div style={s.healthTop}>
            <span style={{fontSize:"22px"}}>👥</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"22px", fontWeight:"700", fontFamily:"'Georgia',serif", color:"#1D4ED8"}}>
                {health?.totalUsers ?? "—"}
              </div>
              <div style={{fontSize:"11px", color:"#64748B"}}>Total Users</div>
            </div>
          </div>
        </div>

        {/* totalCases field */}
        <div style={s.healthCard}>
          <div style={s.healthTop}>
            <span style={{fontSize:"22px"}}>📁</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"22px", fontWeight:"700", fontFamily:"'Georgia',serif", color:"#C9A84C"}}>
                {health?.totalCases ?? "—"}
              </div>
              <div style={{fontSize:"11px", color:"#64748B"}}>Total Cases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Log severity summary — derived from current page logs */}
      <div style={s.errorGrid}>
        {[
          { level:"ERROR", label:"Errors / Failures", icon:"🚨", color:"#DC2626", bg:"#FEF2F2", border:"#FECACA" },
          { level:"WARN",  label:"Warnings",          icon:"⚠️", color:"#D97706", bg:"#FFFBEB", border:"#FDE68A" },
          { level:"INFO",  label:"Info / Actions",    icon:"ℹ️", color:"#1D4ED8", bg:"#EFF6FF", border:"#BFDBFE" },
          { level:"DEBUG", label:"Debug / Queries",   icon:"🔍", color:"#475569", bg:"#F8FAFC", border:"#E2E8F0" },
        ].map((item) => (
          <button key={item.level}
            onClick={() => { setFilter(filter===item.level ? "ALL" : item.level); }}
            style={{
              ...s.errorCard,
              background: filter===item.level ? item.bg : "white",
              border:`1.5px solid ${filter===item.level ? item.border : "#F1F5F9"}`,
            }}>
            <span style={{fontSize:"20px"}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:"22px", fontWeight:"700", color:item.color, fontFamily:"'Georgia',serif"}}>
                {loading ? "—" : (counts[item.level] || 0)}
              </div>
              <div style={{fontSize:"11px", color:"#64748B"}}>{item.label} (this page)</div>
            </div>
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div style={s.logsCard}>
        <div style={s.toolbar}>
          <h2 style={s.sectionTitle}>
            Recent System Logs
            <span style={{fontSize:"11px", color:"#94A3B8", fontWeight:"400", marginLeft:"8px"}}>
              ({totalLogs} total)
            </span>
          </h2>
          <div style={s.toolbarRight}>
            <input type="text" placeholder="Search action, user, details…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}/>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={s.select}>
              {["ALL","ERROR","WARN","INFO","DEBUG"].map((l)=>(
                <option key={l} value={l}>{l==="ALL" ? "All Levels" : l}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={s.empty}>Loading logs…</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>No logs match your filter.</div>
        ) : (
          <>
            <table style={s.table}>
              <thead>
                <tr>
                  {/* SystemLog fields: timestamp, action, role, username, details, status */}
                  {["Timestamp","Level","Action","User (Role)","Details","Status"].map((h)=>(
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} style={s.tr}>
                    <td style={{...s.td, fontFamily:"monospace", fontSize:"11px", color:"#64748B", whiteSpace:"nowrap"}}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                    </td>
                    <td style={s.td}>
                      <ActionBadge action={log.action} status={log.status}/>
                    </td>
                    <td style={{...s.td, fontWeight:"600", color:"#0F1F3D", whiteSpace:"nowrap"}}>
                      {log.action || "—"}
                    </td>
                    <td style={{...s.td, whiteSpace:"nowrap"}}>
                      <div style={{fontSize:"12px", color:"#0F1F3D"}}>{log.username || "—"}</div>
                      {log.role && (
                        <div style={{fontSize:"10px", color:"#94A3B8"}}>{log.role}</div>
                      )}
                    </td>
                    <td style={{...s.td, color:"#374151", wordBreak:"break-word", maxWidth:"280px"}}>
                      {log.details || "—"}
                    </td>
                    <td style={s.td}>
                      <span style={{
                        fontSize:"10px", fontWeight:"700", padding:"2px 8px", borderRadius:"20px",
                        background: log.status==="SUCCESS" ? "#F0FDF4" : log.status==="FAILURE" ? "#FEF2F2" : "#F8FAFC",
                        color:      log.status==="SUCCESS" ? "#166534" : log.status==="FAILURE" ? "#DC2626" : "#475569",
                      }}>
                        {log.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination — server-side */}
            <div style={s.pagination}>
              <span style={s.pageInfo}>
                Page {page+1} of {totalPages} · {totalLogs} total logs
              </span>
              <div style={{display:"flex", gap:"6px"}}>
                <button onClick={()=>setPage(0)}            disabled={page===0}              style={{...s.pageBtn, opacity:page===0?0.4:1}}>«</button>
                <button onClick={()=>setPage(p=>p-1)}       disabled={page===0}              style={{...s.pageBtn, opacity:page===0?0.4:1}}>← Prev</button>
                <span style={{...s.pageBtn, ...s.pageBtnActive}}>{page+1}</span>
                <button onClick={()=>setPage(p=>p+1)}       disabled={page>=totalPages-1}    style={{...s.pageBtn, opacity:page>=totalPages-1?0.4:1}}>Next →</button>
                <button onClick={()=>setPage(totalPages-1)} disabled={page>=totalPages-1}    style={{...s.pageBtn, opacity:page>=totalPages-1?0.4:1}}>»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const s = {
  header:        {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px"},
  title:         {fontSize:"22px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  sub:           {fontSize:"13px",color:"#64748B"},
  headerActions: {display:"flex",gap:"12px",alignItems:"center"},
  autoLabel:     {display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",color:"#374151",cursor:"pointer"},
  refreshBtn:    {padding:"8px 16px",borderRadius:"8px",border:"1.5px solid #E2E8F0",fontSize:"13px",color:"#0F1F3D",background:"white",cursor:"pointer",fontFamily:"inherit",fontWeight:"600"},
  healthGrid:    {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"16px"},
  healthCard:    {background:"white",borderRadius:"12px",padding:"18px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:"1px solid #F1F5F9"},
  healthTop:     {display:"flex",justifyContent:"space-between",alignItems:"flex-start"},
  errorGrid:     {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"20px"},
  errorCard:     {display:"flex",alignItems:"center",gap:"14px",borderRadius:"12px",padding:"18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"},
  logsCard:      {background:"white",borderRadius:"12px",padding:"24px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:"1px solid #F1F5F9"},
  toolbar:       {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"12px"},
  toolbarRight:  {display:"flex",gap:"10px",alignItems:"center"},
  sectionTitle:  {fontSize:"15px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif"},
  searchInput:   {padding:"8px 12px",borderRadius:"8px",border:"1.5px solid #E2E8F0",fontSize:"13px",fontFamily:"inherit",outline:"none",width:"220px"},
  select:        {padding:"8px 12px",borderRadius:"8px",border:"1.5px solid #E2E8F0",fontSize:"13px",fontFamily:"inherit",outline:"none",cursor:"pointer",background:"white"},
  table:         {width:"100%",borderCollapse:"collapse"},
  th:            {fontSize:"10px",fontWeight:"700",color:"#94A3B8",padding:"8px 10px",textAlign:"left",borderBottom:"1px solid #F1F5F9",textTransform:"uppercase",letterSpacing:"0.5px"},
  tr:            {borderBottom:"1px solid #F8FAFC"},
  td:            {fontSize:"12px",padding:"10px 10px",verticalAlign:"top"},
  empty:         {textAlign:"center",padding:"48px",color:"#94A3B8",fontSize:"13px"},
  pagination:    {display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"16px",paddingTop:"16px",borderTop:"1px solid #F1F5F9"},
  pageInfo:      {fontSize:"12px",color:"#64748B"},
  pageBtn:       {padding:"6px 12px",borderRadius:"6px",border:"1.5px solid #E2E8F0",fontSize:"12px",color:"#374151",background:"white",cursor:"pointer",fontFamily:"inherit"},
  pageBtnActive: {background:"#0F1F3D",color:"white",border:"1.5px solid #0F1F3D"},
};

export default SystemLogs;