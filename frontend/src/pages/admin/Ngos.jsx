import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Ngos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchNgos(); }, []);

  const fetchNgos = () => {
    setLoading(true);
    API.get("/admin/dashboard/recent-users")
      .then(res => setNgos((res.data || []).filter(u => u.role === "NGO")))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const filtered = ngos.filter(n =>
    n.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    n.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  };

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NGO Management</h1>
          <p style={styles.subtitle}>{ngos.length} NGOs registered</p>
        </div>
        <div style={styles.statsRow}>
          <div style={{ ...styles.statPill, borderColor:"#86EFAC" }}>
            <span style={{ fontSize:"14px" }}>✅</span>
            <span style={{ fontWeight:"700", color:"#166534" }}>{ngos.filter(n => n.verified === true).length}</span>
            <span style={{ color:"#94A3B8", fontSize:"11px" }}>Verified</span>
          </div>
          <div style={{ ...styles.statPill, borderColor:"#FDE68A" }}>
            <span style={{ fontSize:"14px" }}>⏳</span>
            <span style={{ fontWeight:"700", color:"#D97706" }}>{ngos.filter(n => n.verified !== true).length}</span>
            <span style={{ color:"#94A3B8", fontSize:"11px" }}>Pending</span>
          </div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={styles.searchInput} />
        {search && <button onClick={() => setSearch("")} style={styles.clearBtn}>Clear</button>}
        <button onClick={fetchNgos} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading NGOs...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🤝</div>
          <p style={styles.emptyText}>No NGOs found.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((n, i) => {
            const isVerified = n.verified === true;
            const joined = formatDate(n.createdAt ?? n.joinedAt ?? n.registeredAt);
            return (
              <div key={i} style={{ ...styles.card, borderTop: `3px solid ${isVerified ? "#22C55E" : "#A855F7"}` }}>
                <div style={styles.cardTop}>
                  <div style={{ ...styles.avatar, background: isVerified
                    ? "linear-gradient(135deg,#166534,#22C55E)"
                    : "linear-gradient(135deg,#9A3412,#C2410C)" }}>
                    {n.fullName?.[0]?.toUpperCase() || "N"}
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.name}>{n.fullName}</div>
                    <div style={styles.email}>{n.email}</div>
                  </div>
                  <span style={{
                    ...styles.roleBadge,
                    background: isVerified ? "#F0FDF4" : "#FFFBEB",
                    color: isVerified ? "#166534" : "#D97706",
                    border: `1px solid ${isVerified ? "#86EFAC" : "#FDE68A"}`,
                  }}>
                    {isVerified ? "✅ Verified" : "⏳ Pending"}
                  </span>
                </div>

                <div style={styles.details}>
                  <div style={styles.detail}>
                    📅 Joined: {joined
                      ? <span style={{ color:"#374151" }}>{joined}</span>
                      : <span style={{ color:"#CBD5E1", fontStyle:"italic" }}>Not available</span>}
                  </div>
                  {n.contactInfo && <div style={styles.detail}>📞 {n.contactInfo}</div>}
                  {n.location    && <div style={styles.detail}>📍 {n.location}</div>}
                </div>

                {!isVerified && (
                  <div style={styles.pendingNote}>
                    Go to <strong>Verification</strong> panel to approve this NGO
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
  header:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" },
  title:     { fontSize:"24px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia', serif", marginBottom:"4px" },
  subtitle:  { fontSize:"13px", color:"#64748B" },
  statsRow:  { display:"flex", gap:"10px" },
  statPill:  { display:"flex", alignItems:"center", gap:"8px", background:"white", padding:"10px 16px", borderRadius:"10px", border:"1.5px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  toolbar:   { marginBottom:"16px", display:"flex", gap:"10px", alignItems:"center" },
  searchInput:{ width:"100%", maxWidth:"380px", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  clearBtn:  { padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", color:"#64748B", background:"white", cursor:"pointer", fontFamily:"inherit" },
  refreshBtn:{ padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", color:"#0F1F3D", background:"white", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" },
  loading:   { textAlign:"center", padding:"60px", color:"#94A3B8" },
  empty:     { textAlign:"center", padding:"80px", background:"white", borderRadius:"12px" },
  emptyIcon: { fontSize:"48px", marginBottom:"12px" },
  emptyText: { color:"#64748B", fontSize:"14px" },
  grid:      { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px" },
  card:      { background:"white", borderRadius:"12px", padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", border:"1px solid #F1F5F9" },
  cardTop:   { display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" },
  avatar:    { width:"44px", height:"44px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:"700", color:"white", flexShrink:0 },
  cardInfo:  { flex:1 },
  name:      { fontSize:"14px", fontWeight:"700", color:"#0F1F3D" },
  email:     { fontSize:"11px", color:"#94A3B8", marginTop:"2px" },
  roleBadge: { fontSize:"10px", fontWeight:"700", padding:"3px 9px", borderRadius:"20px", flexShrink:0, whiteSpace:"nowrap" },
  details:   { borderTop:"1px solid #F1F5F9", paddingTop:"12px", display:"flex", flexDirection:"column", gap:"6px" },
  detail:    { fontSize:"12px", color:"#64748B" },
  pendingNote:{ marginTop:"12px", padding:"8px 12px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", fontSize:"11px", color:"#92400E" },
};

export default Ngos;
