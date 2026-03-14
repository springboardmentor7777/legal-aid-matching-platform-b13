import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Match {
  id: number;
  caseTitle: string;
  lawyerName: string;
  citizenName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  matchedDate: string;
}

const api = axios.create({
  baseURL: "http://localhost:8081/api/admin",
});

const MATCHES_PER_PAGE = 5;

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch matches
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get("/matches");
      setMatches(res.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Update status
  const updateStatus = async (
    id: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.put(`/matches/verify/${id}`, { status });
      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  // Delete match
  const deleteMatch = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this match?"))
      return;

    try {
      await api.delete(`/matches/delete/${id}`);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  // Filtering
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchSearch =
        m.caseTitle.toLowerCase().includes(search.toLowerCase()) ||
        m.lawyerName.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || m.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [matches, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredMatches.length / MATCHES_PER_PAGE
  );

  const paginatedMatches = filteredMatches.slice(
    (page - 1) * MATCHES_PER_PAGE,
    page * MATCHES_PER_PAGE
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Match Management
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          placeholder="Search by case or lawyer..."
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading && (
        <p className="text-gray-500 mb-4">Loading matches...</p>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-blue-900">
            <tr>
              <th className="p-3 text-left">Case</th>
              <th className="p-3 text-left">Lawyer</th>
              <th className="p-3 text-left">Citizen</th>
              <th className="p-3 text-left">Matched Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMatches.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No matches found.
                </td>
              </tr>
            ) : (
              paginatedMatches.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{m.caseTitle}</td>
                  <td className="p-3">{m.lawyerName}</td>
                  <td className="p-3">{m.citizenName}</td>
                  <td className="p-3">{m.matchedDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        m.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : m.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {m.status === "PENDING" && (
                      <>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() =>
                            updateStatus(m.id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() =>
                            updateStatus(m.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => deleteMatch(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}