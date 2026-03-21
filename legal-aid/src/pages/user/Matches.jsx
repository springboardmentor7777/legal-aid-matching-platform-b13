import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import CaseDetailModal from "../../components/common/CaseDetailModal";
import ScheduleCallModal from "../../components/common/ScheduleCallModal";

// Root component — routes to correct view based on role
const Matches = () => {
  const currentUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
  const role = currentUser.role;
  if (role === "LAWYER") return <LawyerNgoMatchesView role="LAWYER" />;
  if (role === "NGO")    return <LawyerNgoMatchesView role="NGO" />;
  return <UserMatchesView />;
};

// ─── USER VIEW ────────────────────────────────────────────────────────────────
const UserMatchesView = () => {
  const [matches, setMatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busy, setBusy]           = useState(null);
  const [caseId, setCaseId]       = useState(null);
  const [scheduleMatch, setScheduleMatch] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType]     = useState("ALL");
  const [sortBy, setSortBy]             = useState("score");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/matches/my");
      setMatches(res.data || []);
    } catch (e) {
      toast.error("Failed to load matches");
    } finally { setLoading(false); }
  };

  const sendRequest = async (matchId) => {
    setBusy(matchId + "req");
    try {
      await API.put(`/matches/${matchId}/request`);
      toast.success("Request sent! Waiting for response.");
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to send request"); }
    finally { setBusy(null); }
  };

  const sc = {
    PENDING:   { bg: "#F1F5F9", color: "#475569", label: "Pending",   icon: "⏳", border: "#E2E8F0" },
    REQUESTED: { bg: "#EFF6FF", color: "#1D4ED8", label: "Requested", icon: "📨", border: "#BFDBFE" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", label: "Accepted",  icon: "✅", border: "#86EFAC" },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", label: "Rejected",  icon: "❌", border: "#FECACA" },
  };
  const scoreBg = s => s >= 80 ? "#F0FDF4" : s >= 60 ? "#FFFBEB" : "#EFF6FF";
  const scoreClr = s => s >= 80 ? "#166534" : s >= 60 ? "#92400E" : "#1D4ED8";

  let list = [...matches];
  if (filterStatus !== "ALL") list = list.filter(m => m.status === filterStatus);
  if (filterType   !== "ALL") list = list.filter(m => m.profileType === filterType);
  if (sortBy === "score") list.sort((a,b) => (b.matchScore||0) - (a.matchScore||0));
  else list.sort((a,b) => new Date(b.matchDate) - new Date(a.matchDate));

  return (
    <Layout>
      {caseId && <CaseDetailModal caseId={caseId} onClose={() => setCaseId(null)} />}
      {scheduleMatch && <ScheduleCallModal match={scheduleMatch} onClose={() => setScheduleMatch(null)} onSuccess={() => { setScheduleMatch(null); load(); }} />}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>🔗 My Matches</h1>
          <p style={s.sub}>Lawyers and NGOs matched to your cases. Send a request to connect.</p>
        </div>
        <div style={s.pills}>
          <Pill val={matches.length} lbl="Total" />
          <Pill val={matches.filter(m=>m.status==="REQUESTED").length} lbl="Requested" clr="#1D4ED8" bg="#EFF6FF" bd="#BFDBFE" />
          <Pill val={matches.filter(m=>m.status==="ACCEPTED").length}  lbl="Accepted"  clr="#166534" bg="#F0FDF4" bd="#86EFAC" />
        </div>
      </div>

      <FilterBar>
        <FG label="Role">
          {["ALL","LAWYER","NGO"].map(t => <TB key={t} active={filterType===t} onClick={()=>setFilterType(t)}>{t==="ALL"?"All":t==="LAWYER"?"⚖️ Lawyers":"🤝 NGOs"}</TB>)}
        </FG>
        <FG label="Status">
          {["ALL","PENDING","REQUESTED","ACCEPTED","REJECTED"].map(st => <TB key={st} active={filterStatus===st} onClick={()=>setFilterStatus(st)}>{st==="ALL"?"All":sc[st]?.label}</TB>)}
        </FG>
        <FG label="Sort">
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={s.sel}>
            <option value="score">Score ↓</option><option value="date">Date ↓</option>
          </select>
        </FG>
        <button onClick={()=>{setFilterType("ALL");setFilterStatus("ALL");setSortBy("score");}} style={s.reset}>↺ Reset</button>
      </FilterBar>

      <p style={s.count}>Showing {list.length} of {matches.length}</p>

      {loading ? <div style={s.center}>Loading matches...</div>
        : matches.length === 0 ? <Empty icon="🔍" title="No matches yet" text="Submit a case first. An admin will generate matches." />
        : list.length === 0 ? <Empty icon="🔎" title="No results" text="Try adjusting filters." />
        : <div style={s.grid}>
          {list.map(m => {
            const badge = sc[m.status] || sc.PENDING;
            return (
              <div key={m.id} style={{...s.card, borderTop:`4px solid ${badge.border}`}}>
                <div style={s.cardTop}>
                  <span style={{...s.badge, background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`}}>{badge.icon} {badge.label}</span>
                  <div style={{...s.score, background:scoreBg(m.matchScore), color:scoreClr(m.matchScore)}}>
                    <span style={s.scoreNum}>{m.matchScore}%</span>
                    <span style={s.scoreWord}>match</span>
                  </div>
                </div>
                <div style={s.profRow}>
                  <div style={s.avatar}>{m.profileType==="LAWYER"?"⚖️":"🤝"}</div>
                  <div>
                    <div style={s.profName}>{m.profileName||"—"}</div>
                    <div style={s.profMeta}>
                      <span style={s.typeTag}>{m.profileType}</span>
                      {m.profileVerified && <span style={s.verTag}>✅ Verified</span>}
                    </div>
                  </div>
                </div>
                <div style={s.caseBox}>
                  <span style={s.caseLbl}>📁 YOUR CASE</span>
                  <span style={s.caseTtl}>{m.caseTitle||`Case #${m.caseId}`}</span>
                </div>
                <div style={s.tags}>
                  {m.profileExpertise && <Tag>{m.profileExpertise}</Tag>}
                  {m.profileLocation  && <Tag>📍 {m.profileLocation}</Tag>}
                  {m.experienceYears  && <Tag>🏆 {m.experienceYears} yrs</Tag>}
                </div>

                {m.status === "PENDING" && (
                  <button onClick={() => sendRequest(m.id)} disabled={!!busy} style={{...s.primaryBtn, opacity:busy===m.id+"req"?0.7:1}}>
                    {busy===m.id+"req" ? "Sending..." : "📨 Send Request"}
                  </button>
                )}
                {m.status === "REQUESTED" && <InfoBar bg="#EFF6FF" clr="#1D4ED8" bd="#BFDBFE">📨 Request sent — awaiting response</InfoBar>}
                {m.status === "ACCEPTED" && (
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"auto"}}>
                    <InfoBar bg="#F0FDF4" clr="#166534" bd="#86EFAC">✅ Accepted — chat & appointments active</InfoBar>
                    <button onClick={() => setScheduleMatch(m)} style={s.scheduleBtn}>📅 Schedule a Call</button>
                  </div>
                )}
                {m.status === "REJECTED" && <InfoBar bg="#FEF2F2" clr="#DC2626" bd="#FECACA">❌ Declined — try another match</InfoBar>}
              </div>
            );
          })}
        </div>}
    </Layout>
  );
};

// ─── LAWYER / NGO VIEW ────────────────────────────────────────────────────────
const LawyerNgoMatchesView = ({ role }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(null);
  const [caseId, setCaseId]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      // /matches/assigned uses JWT to identify the lawyer/NGO — no profileId needed
      const res = await API.get("/matches/assigned");
      setMatches(res.data || []);
    } catch (e) {
      toast.error("Failed to load case requests");
    } finally { setLoading(false); }
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
    PENDING:   { bg: "#F1F5F9", color: "#475569", label: "Pending",     icon: "⏳", border: "#E2E8F0" },
    REQUESTED: { bg: "#FFF7ED", color: "#C2410C", label: "New Request",  icon: "🔔", border: "#FED7AA" },
    ACCEPTED:  { bg: "#F0FDF4", color: "#166534", label: "Accepted",    icon: "✅", border: "#86EFAC" },
    REJECTED:  { bg: "#FEF2F2", color: "#DC2626", label: "Declined",    icon: "❌", border: "#FECACA" },
  };

  let list = [...matches];
  if (filterStatus !== "ALL") list = list.filter(m => m.status === filterStatus);
  if (sortBy === "score") list.sort((a,b) => (b.matchScore||0) - (a.matchScore||0));
  else list.sort((a,b) => new Date(b.matchDate) - new Date(a.matchDate));

  const newReqs = matches.filter(m => m.status === "REQUESTED").length;

  return (
    <Layout>
      {caseId && <CaseDetailModal caseId={caseId} onClose={() => setCaseId(null)} />}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>{role === "LAWYER" ? "⚖️" : "🤝"} Case Requests</h1>
          <p style={s.sub}>Review cases matched to your profile. Accept to start working with the client.</p>
        </div>
        <div style={s.pills}>
          <Pill val={matches.length} lbl="Total" />
          <Pill val={newReqs} lbl="New Requests" clr="#C2410C" bg="#FFF7ED" bd="#FED7AA" />
          <Pill val={matches.filter(m=>m.status==="ACCEPTED").length} lbl="Accepted" clr="#166534" bg="#F0FDF4" bd="#86EFAC" />
        </div>
      </div>

      <FilterBar>
        <FG label="Status">
          {["ALL","PENDING","REQUESTED","ACCEPTED","REJECTED"].map(st => (
            <TB key={st} active={filterStatus===st} onClick={()=>setFilterStatus(st)}>
              {st==="ALL" ? "All" : st==="REQUESTED" ? `🔔 New${newReqs>0?` (${newReqs})`:""}`  : sc[st]?.label}
            </TB>
          ))}
        </FG>
        <FG label="Sort">
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={s.sel}>
            <option value="date">Date ↓</option><option value="score">Score ↓</option>
          </select>
        </FG>
        <button onClick={()=>{setFilterStatus("ALL");setSortBy("date");}} style={s.reset}>↺ Reset</button>
      </FilterBar>

      <p style={s.count}>Showing {list.length} of {matches.length}</p>

      {loading ? <div style={s.center}>Loading case requests...</div>
        : matches.length === 0 ? <Empty icon={role==="LAWYER"?"⚖️":"🤝"} title="No cases yet" text="Cases appear here when citizens send requests to you." />
        : list.length === 0 ? <Empty icon="🔎" title="No results" text="Try adjusting filters." />
        : <div style={s.grid}>
          {list.map(m => {
            const badge = sc[m.status] || sc.PENDING;
            const isNew = m.status === "REQUESTED";
            return (
              <div key={m.id} style={{...s.card, borderTop:`4px solid ${badge.border}`, ...(isNew?{boxShadow:"0 4px 20px rgba(194,65,12,0.12)"}:{})}}>
                <div style={s.cardTop}>
                  <span style={{...s.badge, background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`}}>{badge.icon} {badge.label}</span>
                  <div style={{...s.score, background:"#F0FDF4", color:"#166534"}}>
                    <span style={s.scoreNum}>{m.matchScore}%</span>
                    <span style={s.scoreWord}>match</span>
                  </div>
                </div>

                {/* Lawyer/NGO sees the CASE, not themselves */}
                <div style={s.caseBoxLg}>
                  <span style={{fontSize:"20px",flexShrink:0}}>📁</span>
                  <div>
                    <div style={s.profName}>{m.caseTitle || `Case #${m.caseId}`}</div>
                    <div style={s.tags}>
                      {m.caseCategory && <Tag>{m.caseCategory}</Tag>}
                      {m.caseLocation  && <Tag>📍 {m.caseLocation}</Tag>}
                    </div>
                  </div>
                </div>

                {m.matchDate && <p style={s.dateText}>🗓 {new Date(m.matchDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>}

                <button onClick={() => setCaseId(m.caseId)} style={s.viewBtn}>👁 View Full Case Details</button>

                {m.status === "PENDING"   && <InfoBar bg="#F8FAFC" clr="#94A3B8" bd="#E2E8F0">⏳ Waiting — citizen hasn't sent a request yet</InfoBar>}
                {m.status === "REQUESTED" && (
                  <div style={{display:"flex",gap:"8px",marginTop:"auto"}}>
                    <button onClick={()=>accept(m.id)} disabled={!!busy} style={{...s.acceptBtn,opacity:busy===m.id+"acc"?0.7:1}}>
                      {busy===m.id+"acc"?"Accepting...":"✓ Accept Case"}
                    </button>
                    <button onClick={()=>reject(m.id)} disabled={!!busy} style={{...s.declineBtn,opacity:busy===m.id+"rej"?0.7:1}}>
                      {busy===m.id+"rej"?"...":"✕ Decline"}
                    </button>
                  </div>
                )}
                {m.status === "ACCEPTED"  && <InfoBar bg="#F0FDF4" clr="#166534" bd="#86EFAC">✅ Accepted — chat and appointments active</InfoBar>}
                {m.status === "REJECTED"  && <InfoBar bg="#FEF2F2" clr="#DC2626" bd="#FECACA">❌ You declined this case</InfoBar>}
              </div>
            );
          })}
        </div>}
    </Layout>
  );
};

// ─── Shared small components ──────────────────────────────────────────────────
const Pill = ({val, lbl, clr="#0F1F3D", bg="#F8FAFC", bd="#E2E8F0"}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 18px",background:bg,border:`1px solid ${bd}`,borderRadius:"12px",minWidth:"64px"}}>
    <span style={{fontSize:"22px",fontWeight:"800",color:clr,lineHeight:1}}>{val}</span>
    <span style={{fontSize:"10px",color:"#94A3B8",fontWeight:"600",textTransform:"uppercase",marginTop:"2px"}}>{lbl}</span>
  </div>
);
const FilterBar = ({children}) => <div style={s.filterBar}>{children}</div>;
const FG = ({label, children}) => (
  <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
    <span style={{fontSize:"10px",fontWeight:"700",color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</span>
    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>{children}</div>
  </div>
);
const TB = ({active, onClick, children}) => (
  <button onClick={onClick} style={{padding:"5px 12px",border:`1.5px solid ${active?"#0F1F3D":"#E2E8F0"}`,background:active?"#0F1F3D":"white",color:active?"white":"#64748B",borderRadius:"8px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit",fontWeight:"600",whiteSpace:"nowrap"}}>
    {children}
  </button>
);
const Tag = ({children}) => <span style={{fontSize:"11px",color:"#64748B",background:"#F1F5F9",padding:"3px 8px",borderRadius:"6px"}}>{children}</span>;
const InfoBar = ({bg,clr,bd,children}) => <div style={{padding:"10px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:"600",textAlign:"center",marginTop:"auto",background:bg,color:clr,border:`1px solid ${bd}`}}>{children}</div>;
const Empty = ({icon,title,text}) => (
  <div style={{textAlign:"center",padding:"80px",background:"white",borderRadius:"16px"}}>
    <div style={{fontSize:"56px",marginBottom:"16px"}}>{icon}</div>
    <h3 style={{fontSize:"18px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"8px"}}>{title}</h3>
    <p style={{color:"#64748B",fontSize:"14px"}}>{text}</p>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  header:    {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"16px"},
  title:     {fontSize:"24px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  sub:       {fontSize:"13px",color:"#64748B"},
  pills:     {display:"flex",gap:"10px",flexWrap:"wrap"},
  filterBar: {background:"white",borderRadius:"12px",padding:"14px 18px",marginBottom:"14px",display:"flex",gap:"18px",alignItems:"flex-end",flexWrap:"wrap",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",border:"1px solid #F1F5F9"},
  sel:       {padding:"5px 12px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"12px",fontFamily:"inherit",outline:"none",background:"white",color:"#374151"},
  reset:     {padding:"5px 14px",border:"1.5px solid #FECACA",background:"white",borderRadius:"8px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit",color:"#DC2626",fontWeight:"600",alignSelf:"flex-end"},
  count:     {fontSize:"12px",color:"#94A3B8",marginBottom:"16px"},
  center:    {textAlign:"center",padding:"60px",color:"#94A3B8"},
  grid:      {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"20px"},
  card:      {background:"white",borderRadius:"16px",padding:"20px",boxShadow:"0 4px 12px rgba(0,0,0,0.06)",border:"1px solid #F1F5F9",display:"flex",flexDirection:"column",gap:"14px"},
  cardTop:   {display:"flex",justifyContent:"space-between",alignItems:"center"},
  badge:     {fontSize:"11px",fontWeight:"700",padding:"4px 10px",borderRadius:"20px"},
  score:     {display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 12px",borderRadius:"10px"},
  scoreNum:  {fontSize:"20px",fontWeight:"800",lineHeight:1},
  scoreWord: {fontSize:"9px",fontWeight:"700",textTransform:"uppercase"},
  profRow:   {display:"flex",alignItems:"center",gap:"12px"},
  avatar:    {width:"48px",height:"48px",background:"#EFF6FF",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0},
  profName:  {fontSize:"15px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  profMeta:  {display:"flex",gap:"6px",alignItems:"center"},
  typeTag:   {fontSize:"10px",color:"#64748B",background:"#F1F5F9",padding:"2px 8px",borderRadius:"4px",fontWeight:"700"},
  verTag:    {fontSize:"10px",color:"#166534",background:"#F0FDF4",padding:"2px 8px",borderRadius:"4px",fontWeight:"700"},
  caseBox:   {background:"#F8FAFC",borderRadius:"8px",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"2px"},
  caseBoxLg: {background:"#F8FAFC",borderRadius:"10px",padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:"10px"},
  caseLbl:   {fontSize:"10px",fontWeight:"700",color:"#94A3B8",textTransform:"uppercase"},
  caseTtl:   {fontSize:"13px",fontWeight:"600",color:"#0F1F3D"},
  tags:      {display:"flex",gap:"6px",flexWrap:"wrap"},
  dateText:  {fontSize:"11px",color:"#94A3B8",margin:0},
  primaryBtn:{width:"100%",padding:"11px",background:"#1D4ED8",color:"white",border:"none",borderRadius:"10px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",marginTop:"auto"},
  scheduleBtn:{width:"100%",padding:"10px",background:"#7C3AED",color:"white",border:"none",borderRadius:"10px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"},
  viewBtn:   {width:"100%",padding:"10px",background:"white",color:"#0F1F3D",border:"1.5px solid #E2E8F0",borderRadius:"10px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"},
  acceptBtn: {flex:1,padding:"11px",background:"#0F1F3D",color:"white",border:"none",borderRadius:"10px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"},
  declineBtn:{padding:"11px 16px",background:"white",color:"#DC2626",border:"1.5px solid #FECACA",borderRadius:"10px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"},
};

export default Matches;