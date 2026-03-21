import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Ngos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    // Fetch all users and filter by NGO role
    API.get("/admin/dashboard/recent-users")
      .then(res => {
        const onlyNgos = (res.data || []).filter(u => u.role === "NGO");
        setNgos(onlyNgos);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ngos.filter(n =>
    n.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    n.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NGO Management</h1>
          <p style={styles.subtitle}>{ngos.length} NGOs registered</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={styles.searchInput} />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading NGOs...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🤝</div>
          <p style={styles.emptyText}>No NGOs registered yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((n, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>{n.fullName?.[0] || "N"}</div>
                <div style={styles.cardInfo}>
                  <div style={styles.name}>{n.fullName}</div>
                  <div style={styles.email}>{n.email}</div>
                </div>
                <span style={styles.roleBadge}>NGO</span>
              </div>
              <div style={styles.details}>
                <div style={styles.detail}>
                  📅 Joined: {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN") : "—"}
                </div>
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
  cardTop: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  avatar: {
    width: "44px", height: "44px", borderRadius: "50%",
    background: "linear-gradient(135deg, #9A3412, #C2410C)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "700", color: "white", flexShrink: 0
  },
  cardInfo: { flex: 1 },
  name: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D" },
  email: { fontSize: "11px", color: "#94A3B8", marginTop: "2px" },
  roleBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "#FFF7ED", color: "#9A3412" },
  details: { borderTop: "1px solid #F1F5F9", paddingTop: "12px" },
  detail: { fontSize: "12px", color: "#64748B" },
};

export default Ngos;