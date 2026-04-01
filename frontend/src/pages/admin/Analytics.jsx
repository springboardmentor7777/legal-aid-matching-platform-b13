import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

/*
  API endpoints (all ADMIN-only):
  GET /analytics/overview  → AnalyticsOverviewDTO
  GET /analytics/users     → UserAnalyticsDTO
  GET /analytics/cases     → CaseAnalyticsDTO
  GET /analytics/matches   → MatchAnalyticsDTO
  GET /analytics/activity  → ActivityAnalyticsDTO

  TrendPointDTO: { period: "2025-01", count: 42 }
  LocationCountDTO: { location, caseCount, lawyerCount, ngoCount }
*/

const fmt = (n) => (n == null ? "—" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));

/* ── Line Chart ── */
const LineChart = ({ datasets, title }) => {
  const allPts = datasets.flatMap((d) => d.points || []);
  if (!allPts.length) return <div style={cs.empty}>No trend data available yet.</div>;
  const allVals = allPts.map((p) => p.count);
  const max = Math.max(...allVals, 1);
  const labels = datasets[0]?.points?.map((p) => p.period?.slice(0, 7)) || [];
  const W = 480, H = 160, PL = 44, PR = 16, PT = 10, PB = 32;
  const iW = W - PL - PR, iH = H - PT - PB;
  const toX = (i) => PL + (i / Math.max(labels.length - 1, 1)) * iW;
  const toY = (v) => PT + iH - (v / max) * iH;
  return (
    <div>
      <div style={cs.chartTitle}>{title}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow:"visible" }}>
        {[0,0.25,0.5,0.75,1].map((r) => {
          const y = PT + iH - r * iH;
          return (
            <g key={r}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#F1F5F9" strokeWidth="1"/>
              <text x={PL-6} y={y+4} textAnchor="end" fontSize="9" fill="#94A3B8">{Math.round(r*max)}</text>
            </g>
          );
        })}
        {datasets.map((ds) => {
          const pts = ds.points || [];
          if (!pts.length) return null;
          const polyPts = pts.map((p,i) => `${toX(i)},${toY(p.count)}`).join(" ");
          const area = [`M${toX(0)},${toY(pts[0].count)}`, ...pts.map((p,i)=>`L${toX(i)},${toY(p.count)}`),
            `L${toX(pts.length-1)},${PT+iH}`,`L${toX(0)},${PT+iH}Z`].join(" ");
          return (
            <g key={ds.label}>
              <path d={area} fill={ds.color} opacity="0.07"/>
              <polyline points={polyPts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round"/>
              {pts.map((p,i) => <circle key={i} cx={toX(i)} cy={toY(p.count)} r="3" fill={ds.color}/>)}
            </g>
          );
        })}
        {labels.map((l,i) => (
          <text key={i} x={toX(i)} y={H+14} textAnchor="middle" fontSize="8" fill="#94A3B8">{l}</text>
        ))}
      </svg>
      <div style={cs.legend}>
        {datasets.map((ds) => (
          <span key={ds.label} style={cs.legendItem}>
            <span style={{...cs.legendDot, background:ds.color}}/>{ds.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Bar Chart — takes Map<String,Long> from backend ── */
const BarChart = ({ dataMap, title }) => {
  if (!dataMap || !Object.keys(dataMap).length)
    return <div style={cs.empty}>No category data available yet.</div>;
  const COLORS = ["#1D4ED8","#C9A84C","#059669","#7E22CE","#DC2626","#0891B2","#9A3412","#475569"];
  const entries = Object.entries(dataMap);
  const max = Math.max(...entries.map(([,v]) => v), 1);
  const W = 400, H = 140, PAD = 36;
  const barW = Math.max(Math.floor((W - PAD*2) / entries.length) - 10, 14);
  return (
    <div>
      <div style={cs.chartTitle}>{title}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+28}`} style={{ overflow:"visible" }}>
        {[0,0.5,1].map((r) => {
          const y = PAD + (1-r)*H;
          return (
            <g key={r}>
              <line x1={PAD} y1={y} x2={W-PAD} y2={y} stroke="#F1F5F9" strokeWidth="1"/>
              <text x={PAD-4} y={y+4} textAnchor="end" fontSize="9" fill="#94A3B8">{Math.round(r*max)}</text>
            </g>
          );
        })}
        {entries.map(([label, value], i) => {
          const bh = Math.max((value/max)*H, 2);
          const x = PAD + i*(barW+10);
          const y = PAD + H - bh;
          return (
            <g key={label}>
              <rect x={x} y={y} width={barW} height={bh} rx="5" fill={COLORS[i%COLORS.length]} opacity="0.85"/>
              <text x={x+barW/2} y={PAD+H+14} textAnchor="middle" fontSize="8" fill="#64748B">
                {label.length > 7 ? label.slice(0,6)+"…" : label}
              </text>
              {value > 0 && (
                <text x={x+barW/2} y={y-5} textAnchor="middle" fontSize="9" fontWeight="700" fill={COLORS[i%COLORS.length]}>
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={cs.legend}>
        {entries.map(([label], i) => (
          <span key={label} style={cs.legendItem}>
            <span style={{...cs.legendDot, background:COLORS[i%COLORS.length]}}/>{label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Donut Chart ── */
const DonutChart = ({ dataMap, data, title }) => {
  const COLORS = ["#1D4ED8","#166534","#9A3412","#7E22CE","#DC2626","#0891B2","#475569","#C9A84C"];
  const STATUS_COLORS = { PENDING:"#F59E0B", ACTIVE:"#1D4ED8", RESOLVED:"#059669", ASSIGNED:"#7E22CE", CLOSED:"#475569", ACCEPTED:"#059669", REJECTED:"#DC2626" };
  const entries = data
    ? data.map((d,i) => ({ label:d.label, value:d.value, color:d.color||COLORS[i%COLORS.length] }))
    : dataMap
    ? Object.entries(dataMap).map(([label, value], i) => ({ label, value, color: STATUS_COLORS[label] || COLORS[i%COLORS.length] }))
    : [];
  if (!entries.length) return <div style={cs.empty}>No data available yet.</div>;
  const total = entries.reduce((s,d) => s+(d.value||0), 0)||1;
  const R=52, cx=70, cy=70; let angle=-Math.PI/2;
  const slices = entries.map((d) => {
    const sweep = ((d.value||0)/total)*2*Math.PI;
    const x1=cx+R*Math.cos(angle), y1=cy+R*Math.sin(angle);
    angle+=sweep;
    const x2=cx+R*Math.cos(angle), y2=cy+R*Math.sin(angle);
    return {...d, x1,y1,x2,y2, large:sweep>Math.PI?1:0, sweep};
  });
  return (
    <div>
      <div style={cs.chartTitle}>{title}</div>
      <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
        <svg width="140" height="140">
          {slices.map((sl,i) => sl.sweep>0.01 && (
            <path key={i} d={`M${cx},${cy} L${sl.x1},${sl.y1} A${R},${R} 0 ${sl.large},1 ${sl.x2},${sl.y2} Z`}
              fill={sl.color} opacity="0.88"/>
          ))}
          <circle cx={cx} cy={cy} r={R*0.55} fill="white"/>
          <text x={cx} y={cy-6} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F1F3D">{fmt(total)}</text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#94A3B8">Total</text>
        </svg>
        <div style={{display:"flex", flexDirection:"column", gap:"7px"}}>
          {entries.map((d) => (
            <div key={d.label} style={{display:"flex", alignItems:"center", gap:"8px"}}>
              <div style={{width:"10px", height:"10px", borderRadius:"3px", background:d.color, flexShrink:0}}/>
              <span style={{fontSize:"12px", color:"#64748B", minWidth:"68px"}}>{d.label}</span>
              <span style={{fontSize:"12px", fontWeight:"700", color:"#0F1F3D"}}>
                {d.value??0} <span style={{color:"#94A3B8", fontWeight:"400"}}>({Math.round(((d.value||0)/total)*100)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── KPI Card ── */
const KpiCard = ({ label, value, icon, color, desc, loading }) => (
  <div style={cs.kpiCard}>
    <div style={{...cs.kpiIconBox, background:color+"18", marginBottom:"10px"}}>
      <span style={{fontSize:"18px"}}>{icon}</span>
    </div>
    <div style={{...cs.kpiValue, color}}>{loading ? "—" : fmt(value)}</div>
    <div style={cs.kpiLabel}>{label}</div>
    {desc && <div style={cs.kpiDesc}>{desc}</div>}
  </div>
);

/* ══════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════ */
const Analytics = () => {
  const [overview,  setOverview]  = useState(null);
  const [users,     setUsers]     = useState(null);
  const [cases,     setCases]     = useState(null);
  const [matches,   setMatches]   = useState(null);
  const [activity,  setActivity]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ovRes, usrRes, caseRes, matchRes, actRes] = await Promise.all([
        API.get("/analytics/overview"),
        API.get("/analytics/users"),
        API.get("/analytics/cases"),
        API.get("/analytics/matches"),
        API.get("/analytics/activity"),
      ]);
      setOverview(ovRes.data);
      setUsers(usrRes.data);
      setCases(caseRes.data);
      setMatches(matchRes.data);
      setActivity(actRes.data);
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  /*
    Exact field mapping from backend DTOs:

    AnalyticsOverviewDTO fields used:
      totalUsers, totalLawyers, totalNgos, totalAdmins, totalCases,
      matchedCases, resolvedCases, activeCases, pendingCases,
      totalMatches, activeAppointments, totalMessages, totalAppointments

    UserAnalyticsDTO fields used:
      byRole (Map<String,Long>) — keys: "Citizens","Lawyers","NGOs","Admins"
      newUsersOverTime (List<TrendPointDTO>) — { period, count }

    CaseAnalyticsDTO fields used:
      totalCases, activeCases, resolvedCases, pendingCases, matchedCases
      byCategory (Map<String,Long>) — actual DB category strings
      byStatus   (Map<String,Long>) — actual DB status strings
      newCasesOverTime (List<TrendPointDTO>)
      byLocation (List<LocationCountDTO>) — { location, caseCount, lawyerCount, ngoCount }

    MatchAnalyticsDTO fields used:
      totalMatches, lawyerMatches, ngoMatches
      byStatus (Map<String,Long>) — keys: PENDING, ACCEPTED, REJECTED
      matchesOverTime (List<TrendPointDTO>)

    ActivityAnalyticsDTO fields used:
      totalAppointments, activeAppointments, completedAppointments,
      totalMessages, activeChats
      appointmentsOverTime, messagesOverTime (List<TrendPointDTO>)
  */

  // Role donut from UserAnalyticsDTO.byRole (keys from backend: "Citizens","Lawyers","NGOs","Admins")
  const ROLE_COLORS = { Citizens:"#1D4ED8", Lawyers:"#166534", NGOs:"#9A3412", Admins:"#7E22CE" };
  const roleDonutData = users?.byRole
    ? Object.entries(users.byRole).map(([label, value]) => ({
        label, value, color: ROLE_COLORS[label] || "#94A3B8",
      }))
    : [];

  // Case status donut from CaseAnalyticsDTO.byStatus (real DB status strings)
  const STATUS_COLORS = { PENDING:"#F59E0B", ACTIVE:"#1D4ED8", RESOLVED:"#059669", ASSIGNED:"#7E22CE", CLOSED:"#475569" };
  const caseStatusData = cases?.byStatus
    ? Object.entries(cases.byStatus).map(([label, value]) => ({
        label, value, color: STATUS_COLORS[label] || "#94A3B8",
      }))
    : [];

  // Lawyer vs NGO matches from MatchAnalyticsDTO
  const matchTypeData = [
    { label:"Lawyer Matches", value: matches?.lawyerMatches ?? 0, color:"#166534" },
    { label:"NGO Matches",    value: matches?.ngoMatches    ?? 0, color:"#9A3412"  },
  ];

  const TABS = ["overview","trends","cases","geography"];

  return (
    <Layout>
      <div style={cs.pageHeader}>
        <div>
          <h1 style={cs.pageTitle}>Impact Analytics</h1>
          <p style={cs.pageSub}>Platform-wide metrics and growth insights</p>
        </div>
        <button onClick={fetchAll} disabled={loading} style={cs.refreshBtn}>
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* KPI Grid — all fields from AnalyticsOverviewDTO */}
      <div style={cs.kpiGrid}>
        <KpiCard label="Total Users"         value={overview?.totalUsers}         icon="👥" color="#1D4ED8" loading={loading} desc="All registered accounts"/>
        <KpiCard label="Total Lawyers"       value={overview?.totalLawyers}       icon="⚖️" color="#166534" loading={loading} desc="Legal professionals"/>
        <KpiCard label="Total NGOs"          value={overview?.totalNgos}          icon="🤝" color="#9A3412" loading={loading} desc="Aid organisations"/>
        <KpiCard label="Cases Submitted"     value={overview?.totalCases}         icon="📁" color="#C9A84C" loading={loading} desc="All time"/>
        <KpiCard label="Total Matches"       value={overview?.totalMatches}       icon="🔗" color="#7E22CE" loading={loading} desc="User–Lawyer/NGO connections"/>
        <KpiCard label="Resolved Cases"      value={overview?.resolvedCases}      icon="✅" color="#059669" loading={loading} desc="Successfully closed"/>
        <KpiCard label="Active Appointments" value={overview?.activeAppointments} icon="📅" color="#0891B2" loading={loading} desc="Pending + Confirmed"/>
        <KpiCard label="Total Messages"      value={overview?.totalMessages}      icon="💬" color="#475569" loading={loading} desc="Platform messages sent"/>
      </div>

      {/* Tab Bar */}
      <div style={cs.tabBar}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{...cs.tab, ...(activeTab===t ? cs.tabActive : {})}}>
            {{overview:"📊 Overview", trends:"📈 Trends", cases:"📁 Cases", geography:"🗺 Geography"}[t]}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab==="overview" && (
        <div style={cs.tabContent}>
          <div style={cs.chartsGrid2}>
            <div style={cs.chartCard}>
              {/* UserAnalyticsDTO.byRole → keys "Citizens","Lawyers","NGOs","Admins" */}
              <DonutChart data={roleDonutData} title="User Role Distribution"/>
            </div>
            <div style={cs.chartCard}>
              {/* CaseAnalyticsDTO.byStatus → real DB status strings */}
              <DonutChart data={caseStatusData} title="Case Status Overview"/>
            </div>
          </div>
          <div style={cs.chartCard}>
            <LineChart
              title="Platform Growth — Users, Cases & Matches"
              datasets={[
                { label:"New Users",   color:"#1D4ED8", points: users?.newUsersOverTime  || [] },
                { label:"New Cases",   color:"#C9A84C", points: cases?.newCasesOverTime  || [] },
                { label:"New Matches", color:"#059669", points: matches?.matchesOverTime || [] },
              ]}
            />
          </div>
          <div style={cs.chartCard}>
            {/* CaseAnalyticsDTO.byCategory → Map<String,Long> with real category strings */}
            <BarChart dataMap={cases?.byCategory} title="Cases by Legal Category"/>
          </div>
        </div>
      )}

      {/* ── Trends Tab ── */}
      {activeTab==="trends" && (
        <div style={cs.tabContent}>
          <div style={cs.chartCard}>
            {/* UserAnalyticsDTO.newUsersOverTime → List<TrendPointDTO> */}
            <LineChart title="New User Registrations Over Time"
              datasets={[{ label:"New Users", color:"#1D4ED8", points: users?.newUsersOverTime || [] }]}/>
          </div>
          <div style={cs.chartCard}>
            {/* CaseAnalyticsDTO.newCasesOverTime */}
            <LineChart title="New Cases Filed Over Time"
              datasets={[{ label:"New Cases", color:"#C9A84C", points: cases?.newCasesOverTime || [] }]}/>
          </div>
          <div style={cs.chartCard}>
            {/* MatchAnalyticsDTO.matchesOverTime */}
            <LineChart title="Matches Over Time"
              datasets={[{ label:"Matches", color:"#059669", points: matches?.matchesOverTime || [] }]}/>
          </div>
          <div style={cs.chartsGrid2}>
            <div style={cs.chartCard}>
              {/* ActivityAnalyticsDTO.appointmentsOverTime */}
              <LineChart title="Appointments Over Time"
                datasets={[{ label:"Appointments", color:"#0891B2", points: activity?.appointmentsOverTime || [] }]}/>
            </div>
            <div style={cs.chartCard}>
              {/* ActivityAnalyticsDTO.messagesOverTime */}
              <LineChart title="Messages Over Time"
                datasets={[{ label:"Messages", color:"#475569", points: activity?.messagesOverTime || [] }]}/>
            </div>
          </div>
        </div>
      )}

      {/* ── Cases Tab ── */}
      {activeTab==="cases" && (
        <div style={cs.tabContent}>
          <div style={cs.chartCard}>
            {/* CaseAnalyticsDTO.byCategory — Map<String,Long> */}
            <BarChart dataMap={cases?.byCategory} title="Cases by Legal Category"/>
          </div>
          <div style={cs.chartsGrid2}>
            <div style={cs.chartCard}>
              {/* CaseAnalyticsDTO.byStatus — Map<String,Long> */}
              <DonutChart data={caseStatusData} title="Cases by Status"/>
            </div>
            <div style={cs.chartCard}>
              {/* MatchAnalyticsDTO.lawyerMatches + ngoMatches */}
              <DonutChart data={matchTypeData} title="Matches: Lawyers vs NGOs"/>
            </div>
          </div>
          {/* MatchAnalyticsDTO.byStatus — keys: PENDING, ACCEPTED, REJECTED */}
          {matches?.byStatus && Object.keys(matches.byStatus).length > 0 && (
            <div style={cs.chartCard}>
              <DonutChart dataMap={matches.byStatus} title="Match Status Breakdown"/>
            </div>
          )}
          {/* Summary table */}
          <div style={cs.chartCard}>
            <div style={cs.chartTitle}>Case &amp; Match Summary</div>
            <table style={cs.table}>
              <thead>
                <tr>{["Metric","Count","Share"].map((h)=><th key={h} style={cs.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { label:"Total Cases Submitted", value: cases?.totalCases    ?? 0 },
                  { label:"Pending",               value: cases?.pendingCases  ?? 0 },
                  { label:"Active",                value: cases?.activeCases   ?? 0 },
                  { label:"Resolved",              value: cases?.resolvedCases ?? 0 },
                  { label:"Matched (any)",         value: cases?.matchedCases  ?? 0 },
                  { label:"Total Matches",         value: matches?.totalMatches  ?? 0 },
                  { label:"Lawyer Matches",        value: matches?.lawyerMatches ?? 0 },
                  { label:"NGO Matches",           value: matches?.ngoMatches    ?? 0 },
                ].map((row) => {
                  const base = cases?.totalCases || 1;
                  const pct  = Math.min(Math.round((row.value/base)*100), 100);
                  return (
                    <tr key={row.label} style={cs.tr}>
                      <td style={cs.td}>{row.label}</td>
                      <td style={{...cs.td, fontWeight:"700", color:"#0F1F3D"}}>{row.value}</td>
                      <td style={cs.td}>
                        <div style={cs.barWrap}>
                          <div style={{...cs.barFill, width:`${pct}%`}}/>
                          <span>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Geography Tab ── */}
      {activeTab==="geography" && (
        <div style={cs.tabContent}>
          <div style={cs.chartCard}>
            <div style={cs.chartTitle}>Geographic Distribution of Cases &amp; Providers</div>
            {/* CaseAnalyticsDTO.byLocation → List<LocationCountDTO> { location, caseCount, lawyerCount, ngoCount } */}
            <div style={cs.mapContainer}>
              <svg width="100%" viewBox="0 0 500 520" style={{maxHeight:"380px"}}>
                <path d="M180,40 L220,30 L260,45 L300,38 L340,60 L360,90 L370,130 L380,160 L390,200 L370,240 L360,280 L340,310 L320,340 L300,370 L280,400 L260,430 L240,460 L220,440 L200,420 L185,390 L170,360 L155,330 L145,300 L135,270 L130,240 L125,210 L130,180 L140,150 L150,120 L160,90 L165,65 Z"
                  fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2"/>
                {(cases?.byLocation || []).map((loc, i) => {
                  const COORDS = {
                    "Hyderabad":{x:295,y:310},"Mumbai":{x:195,y:270},"Delhi":{x:250,y:130},
                    "Bangalore":{x:260,y:360},"Chennai":{x:285,y:365},"Kolkata":{x:370,y:215},
                    "Pune":{x:210,y:280},"Jaipur":{x:215,y:155},"Ahmedabad":{x:175,y:195},
                    "Lucknow":{x:300,y:165},"Bhopal":{x:255,y:210},"Nagpur":{x:275,y:245},
                    "Chandigarh":{x:235,y:110},"Patna":{x:340,y:185},"Kochi":{x:245,y:400},
                    "Indore":{x:230,y:215},"Visakhapatnam":{x:340,y:295},"Surat":{x:170,y:215},
                  };
                  const coords = COORDS[loc.location];
                  if (!coords) return null;
                  const maxC = Math.max(...(cases.byLocation.map(l=>l.caseCount)), 1);
                  const r = Math.max(6, Math.min(20, (loc.caseCount/maxC)*20));
                  return (
                    <g key={i}>
                      <circle cx={coords.x} cy={coords.y} r={r}     fill="#1D4ED8" opacity="0.18"/>
                      <circle cx={coords.x} cy={coords.y} r={r*0.5} fill="#1D4ED8" opacity="0.7"/>
                      <text x={coords.x+r+4} y={coords.y+4}  fontSize="9" fill="#0F1F3D" fontWeight="600">{loc.location}</text>
                      <text x={coords.x+r+4} y={coords.y+14} fontSize="8" fill="#64748B">{loc.caseCount} cases</text>
                    </g>
                  );
                })}
                {(!cases?.byLocation || cases.byLocation.length===0) && (
                  <text x="250" y="260" textAnchor="middle" fontSize="12" fill="#94A3B8">No location data yet</text>
                )}
              </svg>
              <div style={cs.mapLegend}>
                <span style={cs.mapLegendItem}><span style={{...cs.mapDot,opacity:0.7}}/>Higher case volume</span>
                <span style={cs.mapLegendItem}><span style={{...cs.mapDot,opacity:0.25}}/>Lower case volume</span>
              </div>
            </div>
          </div>

          {/* LocationCountDTO table: location, caseCount, lawyerCount, ngoCount */}
          {cases?.byLocation?.length > 0 && (
            <div style={cs.chartCard}>
              <div style={cs.chartTitle}>Breakdown by Location</div>
              <table style={cs.table}>
                <thead>
                  <tr>{["Location","Cases","Lawyers","NGOs"].map((h)=><th key={h} style={cs.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {cases.byLocation.map((loc,i) => (
                    <tr key={i} style={cs.tr}>
                      <td style={{...cs.td, fontWeight:"600"}}>📍 {loc.location}</td>
                      <td style={cs.td}>{loc.caseCount   ?? 0}</td>
                      <td style={cs.td}>{loc.lawyerCount ?? 0}</td>
                      <td style={cs.td}>{loc.ngoCount    ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

const cs = {
  pageHeader:   {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px"},
  pageTitle:    {fontSize:"22px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  pageSub:      {fontSize:"13px",color:"#64748B"},
  refreshBtn:   {padding:"8px 18px",borderRadius:"8px",border:"1.5px solid #E2E8F0",fontSize:"13px",color:"#0F1F3D",background:"white",cursor:"pointer",fontFamily:"inherit",fontWeight:"600"},
  kpiGrid:      {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"},
  kpiCard:      {background:"white",borderRadius:"12px",padding:"18px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:"1px solid #F1F5F9"},
  kpiIconBox:   {width:"36px",height:"36px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"},
  kpiValue:     {fontSize:"26px",fontWeight:"700",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  kpiLabel:     {fontSize:"12px",color:"#64748B",fontWeight:"600"},
  kpiDesc:      {fontSize:"11px",color:"#94A3B8",marginTop:"2px"},
  tabBar:       {display:"flex",gap:"4px",marginBottom:"20px",background:"#F8FAFC",borderRadius:"10px",padding:"4px",width:"fit-content"},
  tab:          {padding:"8px 18px",borderRadius:"7px",border:"none",fontSize:"13px",color:"#64748B",background:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:"500"},
  tabActive:    {background:"white",color:"#0F1F3D",fontWeight:"700",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"},
  tabContent:   {display:"flex",flexDirection:"column",gap:"16px"},
  chartsGrid2:  {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  chartCard:    {background:"white",borderRadius:"12px",padding:"22px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:"1px solid #F1F5F9"},
  chartTitle:   {fontSize:"13px",fontWeight:"700",color:"#0F1F3D",marginBottom:"14px",fontFamily:"'Georgia',serif"},
  legend:       {display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"8px"},
  legendItem:   {display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"#64748B"},
  legendDot:    {width:"10px",height:"10px",borderRadius:"50%",flexShrink:0},
  table:        {width:"100%",borderCollapse:"collapse"},
  th:           {fontSize:"10px",fontWeight:"700",color:"#94A3B8",padding:"8px 0",textAlign:"left",borderBottom:"1px solid #F1F5F9",textTransform:"uppercase",letterSpacing:"0.5px"},
  tr:           {borderBottom:"1px solid #F8FAFC"},
  td:           {fontSize:"13px",color:"#374151",padding:"10px 0"},
  barWrap:      {display:"flex",alignItems:"center",gap:"8px",fontSize:"12px",color:"#64748B"},
  barFill:      {height:"6px",borderRadius:"3px",background:"#1D4ED8",opacity:"0.7"},
  empty:        {textAlign:"center",padding:"32px",color:"#94A3B8",fontSize:"13px"},
  mapContainer: {background:"#F8FAFC",borderRadius:"8px",padding:"12px"},
  mapLegend:    {display:"flex",gap:"16px",marginTop:"8px",justifyContent:"center"},
  mapLegendItem:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"#64748B"},
  mapDot:       {width:"12px",height:"12px",borderRadius:"50%",background:"#1D4ED8",display:"inline-block"},
};

export default Analytics;