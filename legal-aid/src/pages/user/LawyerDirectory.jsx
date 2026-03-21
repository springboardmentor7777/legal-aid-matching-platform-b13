import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const LawyerDirectory = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: "", expertise: "", location: "", verified: "" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 9 });
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.expertise) params.append("expertise", filters.expertise);
      if (filters.location) params.append("location", filters.location);
      if (filters.verified !== "") params.append("verified", filters.verified);
      const res = await API.get(`/directory/lawyers?${params}`);
      setLawyers(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLawyers(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchLawyers(); };
  const handleReset = () => { setFilters({ keyword: "", expertise: "", location: "", verified: "" }); setPage(0); };

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Find a Lawyer</h1>
          <p style={styles.subtitle}>{totalElements} verified lawyers available</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={styles.filterCard}>
        <form onSubmit={handleSearch} style={styles.filterForm}>
          <input value={filters.keyword} onChange={e => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="🔍 Search by name, expertise, location..."
            style={{ ...styles.filterInput, flex: 2 }} />
          <input value={filters.expertise} onChange={e => setFilters({ ...filters, expertise: e.target.value })}
            placeholder="Expertise (e.g. property)"
            style={styles.filterInput} />
          <input value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}
            placeholder="Location (e.g. Delhi)"
            style={styles.filterInput} />
          <select value={filters.verified} onChange={e => setFilters({ ...filters, verified: e.target.value })}
            style={styles.filterInput}>
            <option value="">All Lawyers</option>
            <option value="true">Verified Only ✅</option>
            <option value="false">Unverified</option>
          </select>
          <button type="submit" style={styles.searchBtn}>Search</button>
          <button type="button" onClick={handleReset} style={styles.resetBtn}>Reset</button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div style={styles.loading}>Searching lawyers...</div>
      ) : lawyers.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>⚖️</div>
          <h3 style={styles.emptyTitle}>No lawyers found</h3>
          <p style={styles.emptyText}>Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {lawyers.map(l => (
              <div key={l.id} style={styles.lawyerCard}>
                <div style={styles.cardTop}>
                  <div style={styles.avatar}>{l.name?.[0] || "L"}</div>
                  <div style={styles.cardInfo}>
                    <div style={styles.lawyerName}>{l.name}</div>
                    <div style={styles.lawyerSpec}>{l.specialization || "Legal Professional"}</div>
                  </div>
                  {l.verified && <span style={styles.verifiedBadge}>✅ Verified</span>}
                </div>

                <div style={styles.tags}>
                  {l.expertise && <span style={styles.tag}>{l.expertise}</span>}
                  {l.location && <span style={{ ...styles.tag, background: "#F0FDF4", color: "#166534" }}>📍 {l.location}</span>}
                  {l.isAvailable
                    ? <span style={{ ...styles.tag, background: "#F0FDF4", color: "#166534" }}>● Available</span>
                    : <span style={{ ...styles.tag, background: "#FEF2F2", color: "#DC2626" }}>● Unavailable</span>
                  }
                </div>

                <div style={styles.cardDetails}>
                  {l.experienceYears && (
                    <div style={styles.detail}><span style={styles.detailIcon}>🏆</span>{l.experienceYears} years experience</div>
                  )}
                  {l.contactInfo && (
                    <div style={styles.detail}><span style={styles.detailIcon}>📞</span>{l.contactInfo}</div>
                  )}
                  {l.email && (
                    <div style={styles.detail}><span style={styles.detailIcon}>✉️</span>{l.email}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={styles.pageBtn}>← Previous</button>
              <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={styles.pageBtn}>Next →</button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#64748B" },
  filterCard: { background: "white", borderRadius: "12px", padding: "20px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  filterForm: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  filterInput: {
    padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "8px",
    fontSize: "13px", outline: "none", fontFamily: "inherit", flex: 1, minWidth: "140px"
  },
  searchBtn: {
    padding: "10px 20px", background: "#0F1F3D", color: "white",
    border: "none", borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
  },
  resetBtn: {
    padding: "10px 16px", background: "transparent", border: "1.5px solid #E2E8F0",
    borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B"
  },
  loading: { textAlign: "center", padding: "60px", color: "#94A3B8" },
  empty: { textAlign: "center", padding: "80px", background: "white", borderRadius: "12px" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", marginBottom: "8px", fontFamily: "'Georgia', serif" },
  emptyText: { color: "#64748B", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  lawyerCard: {
    background: "white", borderRadius: "12px", padding: "22px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9"
  },
  cardTop: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" },
  avatar: {
    width: "44px", height: "44px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0F1F3D, #1a3560)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "700", color: "#C9A84C", flexShrink: 0
  },
  cardInfo: { flex: 1 },
  lawyerName: { fontSize: "14px", fontWeight: "700", color: "#0F1F3D" },
  lawyerSpec: { fontSize: "11px", color: "#94A3B8", marginTop: "2px" },
  verifiedBadge: { fontSize: "10px", fontWeight: "600", color: "#166534", background: "#F0FDF4", padding: "2px 8px", borderRadius: "20px" },
  tags: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" },
  tag: { fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "20px", background: "#EFF6FF", color: "#1D4ED8" },
  cardDetails: { display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid #F1F5F9", paddingTop: "12px" },
  detail: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748B" },
  detailIcon: { fontSize: "12px" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "28px" },
  pageBtn: {
    padding: "8px 16px", border: "1.5px solid #E2E8F0", background: "white",
    borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
    color: "#374151"
  },
  pageInfo: { fontSize: "13px", color: "#64748B" },
};

export default LawyerDirectory;