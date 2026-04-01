import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/admin/dashboard/recent-users")
      .then(res => {
        const onlyUsers = (res.data || []).filter(u => u.role === "USER");
        setUsers(onlyUsers);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users Management</h1>
          <p style={styles.subtitle}>{users.length} total users registered</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.loading}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>No users found.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={{ ...styles.td, color: "#94A3B8" }}>{i + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>{u.fullName?.[0] || "U"}</div>
                      <span>{u.fullName}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: "#64748B" }}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>USER</span>
                  </td>
                  <td style={{ ...styles.td, color: "#94A3B8" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  toolbar: { marginBottom: "20px" },
  searchInput: {
    width: "100%", maxWidth: "400px", padding: "10px 14px",
    border: "1.5px solid #E2E8F0", borderRadius: "8px",
    fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box"
  },
  tableCard: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  loading: { textAlign: "center", padding: "40px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "40px", color: "#94A3B8", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", fontWeight: "700", color: "#94A3B8", padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #F1F5F9", textTransform: "uppercase", letterSpacing: "0.5px" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { fontSize: "13px", color: "#0F1F3D", padding: "12px" },
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "30px", height: "30px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", color: "#C9A84C", flexShrink: 0
  },
  badge: { fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "#EFF6FF", color: "#1D4ED8" },
};

export default Users;