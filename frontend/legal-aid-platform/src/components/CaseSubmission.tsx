import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Case {
  id: number;
  title: string;
  description: string;
  submittedBy: string;
  role: "NGO" | "LAWYER" | "CITIZEN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedDate: string;
}

const api = axios.create({
  baseURL: "http://localhost:8081/api/admin",
});

const CASES_PER_PAGE = 5;

export default function CaseSubmission() {
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch Cases
  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cases");
      setCases(res.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Update Status
  const updateStatus = async (
    id: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.put(`/cases/verify/${id}`, { status });
      fetchCases();
    } catch (error) {
      console.error("Error updating case:", error);
    }
  };

  // Delete Case
  const deleteCase = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this case?"))
      return;

    try {
      await api.delete(`/cases/delete/${id}`);
      fetchCases();
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  // Filtering
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.submittedBy.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [cases, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredCases.length / CASES_PER_PAGE
  );

  const paginatedCases = filteredCases.slice(
    (page - 1) * CASES_PER_PAGE,
    page * CASES_PER_PAGE
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Case Submission Management
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          placeholder="Search by title or user..."
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
        <p className="text-gray-500 mb-4">Loading cases...</p>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-blue-900">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Submitted By</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No cases found.
                </td>
              </tr>
            ) : (
              paginatedCases.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.submittedBy}</td>
                  <td className="p-3">{c.role}</td>
                  <td className="p-3">{c.submittedDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        c.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {c.status === "PENDING" && (
                      <>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() =>
                            updateStatus(c.id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() =>
                            updateStatus(c.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => deleteCase(c.id)}
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