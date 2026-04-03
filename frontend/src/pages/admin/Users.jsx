import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Try the dedicated users endpoint first, fallback to recent-users
    Promise.allSettled([
      API.get("/admin/users"),
      API.get("/admin/dashboard/recent-users"),
    ]).then(([usersRes, recentRes]) => {
      let allUsers = [];

      if (usersRes.status === "fulfilled") {
        const data = usersRes.value.data;
        allUsers = Array.isArray(data) ? data : data?.content || data?.users || [];
      }

      if (allUsers.length === 0 && recentRes.status === "fulfilled") {
        allUsers = recentRes.value.data || [];
      }

      setUsers(allUsers.filter(u => u.role === "USER" || !u.role));
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  };

  return (
    <Layout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users Management</h1>
          <p style={styles.subtitle}>{users.length} total users registered</p>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statPill}>
            <span style={{ fontSize:"16px" }}>👥</span>
            <span style={{ fontWeight:"700", color:"#1D4ED8" }}>{users.length}</span>
            <span style={{ color:"#94A3B8", fontSize:"11px" }}>Citizens</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={styles.searchInput}
        />
        {search && (
          <button onClick={() => setSearch("")} style={styles.clearBtn}>Clear</button>
        )}
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.empty}>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>⏳</div>
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>🔍</div>
            No users found.
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>User ID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const joined = formatDate(u.createdAt ?? u.joinedAt ?? u.registeredAt ?? u.created_at);
                  return (
                    <tr key={u.id ?? u.userId ?? i} style={styles.tr}>
                      <td style={{ ...styles.td, color:"#94A3B8", width:"40px" }}>{i + 1}</td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>{u.fullName?.[0]?.toUpperCase() || "U"}</div>
                          <div>
                            <div style={{ fontWeight:"600", color:"#0F1F3D", fontSize:"13px" }}>
                              {u.fullName || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...styles.td, color:"#64748B" }}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>USER</span>
                      </td>
                      <td style={{ ...styles.td }}>
                        {joined ? (
                          <span style={{ color:"#374151", fontSize:"12px" }}>{joined}</span>
                        ) : (
                          <span style={{ color:"#CBD5E1", fontSize:"12px", fontStyle:"italic" }}>Not available</span>
                        )}
                      </td>
                      <td style={{ ...styles.td, color:"#94A3B8", fontSize:"11px", fontFamily:"monospace" }}>
                        {u.id ?? u.userId ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={styles.tableFooter}>
              Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
              {search && ` matching "${search}"`}
            </div>
          </>
        )}
      </div>

      {/* Info note about joined date */}
      <div style={styles.infoNote}>
        ℹ️ "Joined" date is populated only when your backend returns the <code>createdAt</code> field for users.
        If dates show "Not available", check your <code>/admin/users</code> or <code>/admin/dashboard/recent-users</code> API response.
      </div>
    </Layout>
  );
};

const styles = {
  header:      { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" },
  title:       { fontSize:"24px", fontWeight:"700", color:"#0F1F3D", fontFamily:"'Georgia', serif", marginBottom:"4px" },
  subtitle:    { fontSize:"13px", color:"#64748B" },
  statsRow:    { display:"flex", gap:"10px" },
  statPill:    { display:"flex", alignItems:"center", gap:"8px", background:"white", padding:"10px 16px", borderRadius:"10px", border:"1px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  toolbar:     { marginBottom:"16px", display:"flex", gap:"10px", alignItems:"center" },
  searchInput: { width:"100%", maxWidth:"400px", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  clearBtn:    { padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"13px", color:"#64748B", background:"white", cursor:"pointer", fontFamily:"inherit" },
  tableCard:   { background:"white", borderRadius:"12px", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", border:"1px solid #F1F5F9" },
  empty:       { textAlign:"center", padding:"60px", color:"#94A3B8", fontSize:"14px" },
  table:       { width:"100%", borderCollapse:"collapse" },
  th:          { fontSize:"10px", fontWeight:"700", color:"#94A3B8", padding:"12px 14px", textAlign:"left", borderBottom:"2px solid #F1F5F9", textTransform:"uppercase", letterSpacing:"0.5px" },
  tr:          { borderBottom:"1px solid #F8FAFC" },
  td:          { fontSize:"13px", color:"#0F1F3D", padding:"12px 14px", verticalAlign:"middle" },
  userCell:    { display:"flex", alignItems:"center", gap:"10px" },
  avatar:      { width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg, #0F1F3D, #1a3560)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700", color:"#C9A84C", flexShrink:0 },
  badge:       { fontSize:"10px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px", background:"#EFF6FF", color:"#1D4ED8" },
  tableFooter: { fontSize:"12px", color:"#94A3B8", textAlign:"center", padding:"14px", borderTop:"1px solid #F1F5F9", background:"#FAFAFA" },
  infoNote:    { marginTop:"12px", padding:"10px 14px", background:"#F0F9FF", border:"1px solid #BAE6FD", borderRadius:"8px", fontSize:"12px", color:"#0369A1" },
};

export default Users;
