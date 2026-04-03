import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchLawyers(); }, []);

  const fetchLawyers = () => {
    setLoading(true);
    API.get("/directory/lawyers?size=200")
      .then(res => setLawyers(res.data?.content || res.data || []))
      .catch(() =>
        API.get("/admin/dashboard/recent-users")
          .then(res => setLawyers((res.data || []).filter(u => u.role === "LAWYER")))
          .catch(err => console.error(err))
      )
      .finally(() => setLoading(false));
  };

  const filtered = lawyers.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.expertise?.toLowerCase().includes(search.toLowerCase()) ||
    l.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Lawyers Management</h1>
          <p style={styles.subtitle}>{lawyers.length} lawyers registered</p>
        </div>
        <div style={styles.statsRow}>
          <div style={{ ...styles.statPill, borderColor:"#86EFAC" }}>
            <span style={{ fontSize:"14px" }}>✅</span>
            <span style={{ fontWeight:"700", color:"#166534" }}>{lawyers.filter(l => l.verified === true).length}</span>
            <span style={{ color:"#94A3B8", fontSize:"11px" }}>Verified</span>
          </div>
          <div style={{ ...styles.statPill, borderColor:"#FDE68A" }}>
            <span style={{ fontSize:"14px" }}>⏳</span>
            <span style={{ fontWeight:"700", color:"#D97706" }}>{lawyers.filter(l => l.verified !== true).length}</span>
            <span style={{ color:"#94A3B8", fontSize:"11px" }}>Pending</span>
          </div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, email or expertise..."
          style={styles.searchInput} />
        {search && <button onClick={() => setSearch("")} style={styles.clearBtn}>Clear</button>}
        <button onClick={fetchLawyers} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading lawyers...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>⚖️</div>
          <p style={styles.emptyText}>No lawyers found.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((l, i) => {
            const isVerified = l.verified === true;
            return (
              <div key={i} style={{ ...styles.card, borderTop: `3px solid ${isVerified ? "#22C55E" : "#F59E0B"}` }}>
                <div style={styles.cardTop}>
                  <div style={{ ...styles.avatar, background: isVerified
                    ? "linear-gradient(135deg,#166534,#22C55E)"
                    : "linear-gradient(135deg,#0F1F3D,#1a3560)" }}>
                    {(l.name || l.fullName)?.[0] || "L"}
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.name}>{l.name || l.fullName}</div>
                    <div style={styles.email}>{l.email}</div>
                  </div>
                  <span style={{
                    ...styles.verifiedBadge,
                    background: isVerified ? "#F0FDF4" : "#FFFBEB",
                    color: isVerified ? "#166534" : "#D97706",
                    border: `1px solid ${isVerified ? "#86EFAC" : "#FDE68A"}`,
                  }}>
                    {isVerified ? "✅ Verified" : "⏳ Pending"}
                  </span>
                </div>

                <div style={styles.tags}>
                  {l.expertise && <span style={styles.tag}>{l.expertise}</span>}
                  {l.specialization && l.specialization !== l.expertise && <span style={styles.tag}>{l.specialization}</span>}
                  {l.location && <span style={{ ...styles.tag, background:"#F0FDF4", color:"#166534" }}>📍 {l.location}</span>}
                  {l.isAvailable !== undefined && (
                    <span style={{ ...styles.tag, background: l.isAvailable ? "#F0FDF4" : "#FEF2F2", color: l.isAvailable ? "#166534" : "#DC2626" }}>
                      {l.isAvailable ? "● Available" : "● Unavailable"}
                    </span>
                  )}
                </div>

                <div style={styles.details}>
                  {l.experienceYears && <span style={styles.detail}>🏆 {l.experienceYears} yrs exp</span>}
                  {l.contactInfo     && <span style={styles.detail}>📞 {l.contactInfo}</span>}
                  {l.createdAt       && <span style={styles.detail}>📅 {new Date(l.createdAt).toLocaleDateString("en-IN")}</span>}
                </div>

                {!isVerified && (
                  <div style={styles.pendingNote}>
                    Go to <strong>Verification</strong> panel to approve this lawyer
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

const styles = {
  header:       { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" },
  title:        { fontSize:"24px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia', serif", marginBottom:"4px" },
  subtitle:     { fontSize:"13px", color:"#64748B" },
  statsRow:     { display:"flex", gap:"10px" },
  statPill:     { display:"flex", alignItems:"center", gap:"8px", background:"white", padding:"10px 16px", borderRadius:"10px", border:"1.5px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  toolbar:      { marginBottom:"16px", display:"flex", gap:"10px", alignItems:"center", flexWrap:"wrap" },
  searchInput:  { width:"100%", maxWidth:"380px", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  clearBtn:     { padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", color:"#64748B", background:"white", cursor:"pointer", fontFamily:"inherit" },
  refreshBtn:   { padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", color:"#0F1F3D", background:"white", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" },
  loading:      { textAlign:"center", padding:"60px", color:"#94A3B8" },
  empty:        { textAlign:"center", padding:"80px", background:"white", borderRadius:"12px" },
  emptyIcon:    { fontSize:"48px", marginBottom:"12px" },
  emptyText:    { color:"#64748B", fontSize:"14px" },
  grid:         { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px" },
  card:         { background:"white", borderRadius:"12px", padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", border:"1px solid #F1F5F9" },
  cardTop:      { display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" },
  avatar:       { width:"40px", height:"40px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:"700", color:"white", flexShrink:0 },
  cardInfo:     { flex:1 },
  name:         { fontSize:"14px", fontWeight:"700", color:"#0F1F3D" },
  email:        { fontSize:"11px", color:"#94A3B8", marginTop:"2px" },
  verifiedBadge:{ fontSize:"10px", fontWeight:"700", padding:"3px 9px", borderRadius:"20px", flexShrink:0, whiteSpace:"nowrap" },
  tags:         { display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"10px" },
  tag:          { fontSize:"10px", fontWeight:"600", padding:"3px 8px", borderRadius:"20px", background:"#EFF6FF", color:"#1D4ED8" },
  details:      { display:"flex", gap:"12px", borderTop:"1px solid #F1F5F9", paddingTop:"10px", flexWrap:"wrap" },
  detail:       { fontSize:"11px", color:"#64748B" },
  pendingNote:  { marginTop:"12px", padding:"8px 12px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", fontSize:"11px", color:"#92400E" },
};

export default Lawyers;
