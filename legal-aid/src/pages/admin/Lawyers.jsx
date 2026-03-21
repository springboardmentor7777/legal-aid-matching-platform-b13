import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/directory/lawyers?size=100")
      .then(res => setLawyers(res.data.content || []))
      .catch(() => {
        // Fallback — get from users table filtered by LAWYER role
        API.get("/admin/dashboard/recent-users")
          .then(res => setLawyers((res.data || []).filter(u => u.role === "LAWYER")))
          .catch(err => console.error(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = lawyers.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.expertise?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Lawyers Management</h1>
          <p style={styles.subtitle}>{lawyers.length} lawyers registered</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, email or expertise..."
          style={styles.searchInput} />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading lawyers...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>⚖️</div>
          <p style={styles.emptyText}>No lawyers registered yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((l, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>{(l.name || l.fullName)?.[0] || "L"}</div>
                <div style={styles.cardInfo}>
                  <div style={styles.name}>{l.name || l.fullName}</div>
                  <div style={styles.email}>{l.email}</div>
                </div>
                <span style={{
                  ...styles.verifiedBadge,
                  background: l.verified ? "#F0FDF4" : "#FEF2F2",
                  color: l.verified ? "#166534" : "#DC2626"
                }}>
                  {l.verified ? "✅ Verified" : "Unverified"}
                </span>
              </div>

              <div style={styles.tags}>
                {l.expertise && <span style={styles.tag}>{l.expertise}</span>}
                {l.specialization && <span style={styles.tag}>{l.specialization}</span>}
                {l.location && <span style={{ ...styles.tag, background: "#F0FDF4", color: "#166534" }}>📍 {l.location}</span>}
                {l.isAvailable !== undefined && (
                  l.isAvailable
                    ? <span style={{ ...styles.tag, background: "#F0FDF4", color: "#166534" }}>● Available</span>
                    : <span style={{ ...styles.tag, background: "#FEF2F2", color: "#DC2626" }}>● Unavailable</span>
                )}
              </div>

              <div style={styles.details}>
                {l.experienceYears && <span style={styles.detail}>🏆 {l.experienceYears} yrs exp</span>}
                {l.contactInfo && <span style={styles.detail}>📞 {l.contactInfo}</span>}
                {l.createdAt && <span style={styles.detail}>📅 {new Date(l.createdAt).toLocaleDateString("en-IN")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  toolbar: { marginBottom: "20px" },
  searchInput: { width: "100%", maxWidth: "400px", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  loading: { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "80px", background: "white", borderRadius: "12px" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyText: { color: "#64748B", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  card: { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" },
  cardTop: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #0F1F3D, #1a3560)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#C9A84C", flexShrink: 0 },
  cardInfo: { flex: 1 },
  name: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D" },
  email: { fontSize: "11px", color: "#94A3B8", marginTop: "2px" },
  verifiedBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", flexShrink: 0 },
  tags: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" },
  tag: { fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "20px", background: "#EFF6FF", color: "#1D4ED8" },
  details: { display: "flex", gap: "12px", borderTop: "1px solid #F1F5F9", paddingTop: "10px", flexWrap: "wrap" },
  detail: { fontSize: "11px", color: "#64748B" },
};

export default Lawyers;