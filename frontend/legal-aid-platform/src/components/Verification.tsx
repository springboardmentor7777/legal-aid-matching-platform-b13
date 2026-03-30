import React, { useEffect, useState } from "react";
import axios from "axios";

// ── Types matching backend DTOs ──────────────────────────────────────────────
//
// Backend VerificationDto is built from the User entity:
//   new VerificationDto(user.getId(), user.getName(), user.getRole(), user.getIsVerified())
//
// There is NO organization or location field in the DTO — those fields were
// removed from the mock data to match reality.
//
// Role is a Java enum (LAWYER | NGO) — arrives as a string in JSON.
// Approve endpoints:
//   PUT /admin/verify/lawyer/{id}
//   PUT /admin/verify/ngo/{id}
// There is no "Reject" endpoint — rejection is handled as UI-only state here
// (you can add a backend endpoint later without touching this component).

interface VerificationDto {
  id: number;
  name: string;
  role: string;         // "LAWYER" | "NGO"  (Java enum → JSON string)
  isVerified: boolean;
}

// UI extends the DTO with a local status field so Rejected can be shown
// without a backend call (no reject endpoint exists).
type UIStatus = "Pending" | "Approved" | "Rejected";

interface VerificationItem extends VerificationDto {
  uiStatus: UIStatus;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const BASE = "http://localhost:8081";

const getStatusStyle = (status: UIStatus) => {
  if (status === "Pending")  return "bg-blue-50 text-blue-600";
  if (status === "Approved") return "bg-green-50 text-green-600";
  if (status === "Rejected") return "bg-red-50 text-red-600";
  return "";
};

// ── Component ────────────────────────────────────────────────────────────────

export default function Verification() {
  const [filters, setFilters] = useState({ role: "", status: "", name: "" });
  const [data, setData]       = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ── Fetch verifications from backend ──────────────────────────────────────
  useEffect(() => {
    axios
      .get<VerificationDto[]>(`${BASE}/verifications`)
      .then((res) => {
        // Map each DTO to a UI item.
        // isVerified=true means already approved; false = pending.
        const items: VerificationItem[] = res.data.map((dto) => ({
          ...dto,
          uiStatus: dto.isVerified ? "Approved" : "Pending",
        }));
        setData(items);
      })
      .catch(() => setError("Failed to load verifications. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter change ──────────────────────────────────────────────────────────
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  // ── Approve action (calls the correct endpoint based on role) ─────────────
  const handleApprove = async (item: VerificationItem) => {
    // Already approved — no-op
    if (item.uiStatus === "Approved") return;

    // Pick endpoint based on role (backend enum is uppercase)
    const rolePath =
      item.role.toUpperCase() === "LAWYER" ? "lawyer" : "ngo";

    try {
      await axios.put(`${BASE}/verify/${rolePath}/${item.id}`);

      setData((prev) =>
        prev.map((d) =>
          d.id === item.id ? { ...d, isVerified: true, uiStatus: "Approved" } : d
        )
      );
    } catch {
      alert(`Failed to approve ${item.name}. Please try again.`);
    }
  };

  // ── Reject action (UI-only — no backend endpoint exists yet) ──────────────
  const handleReject = (id: number) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, uiStatus: "Rejected" } : d))
    );
  };

  // ── Apply filters ──────────────────────────────────────────────────────────
  const filtered = data.filter((item) => {
    const matchRole   = !filters.role   || item.role.toUpperCase() === filters.role.toUpperCase();
    const matchStatus = !filters.status || item.uiStatus === filters.status;
    const matchName   = !filters.name   || item.name.toLowerCase().includes(filters.name.toLowerCase());
    return matchRole && matchStatus && matchName;
  });

  const totalPages   = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast  = indexOfFirst + itemsPerPage;
  const currentData  = filtered.slice(indexOfFirst, indexOfLast);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Verification</h2>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border flex flex-wrap gap-4 items-center">
        {/* Role filter: values match Java enum (LAWYER / NGO) */}
        <select
          name="role"
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Role</option>
          <option value="LAWYER">Lawyer</option>
          <option value="NGO">NGO</option>
        </select>

        <select
          name="status"
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Replaced location search with name search — VerificationDto has no location */}
        <input
          type="text"
          name="name"
          placeholder="Search by name…"
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg text-sm w-56"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                {/* Role column — displays friendly label */}
                <th className="text-left px-4">Role</th>
                {/* Verified flag — derived from isVerified */}
                <th className="text-left px-4">Verified</th>
                <th className="text-left px-4">Status</th>
                <th className="text-center px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>

                    {/* Display role in title-case for readability */}
                    <td className="px-4 text-gray-600">
                      {item.role.charAt(0).toUpperCase() +
                        item.role.slice(1).toLowerCase()}
                    </td>

                    {/* isVerified flag */}
                    <td className="px-4 text-gray-600">
                      {item.isVerified ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>

                    <td className="px-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                          item.uiStatus
                        )}`}
                      >
                        {item.uiStatus}
                      </span>
                    </td>

                    <td className="px-4 text-center space-x-2 py-2">
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={item.uiStatus === "Approved"}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={item.uiStatus === "Rejected"}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
            <p className="text-gray-500">
              Showing{" "}
              {filtered.length === 0 ? 0 : indexOfFirst + 1}–
              {Math.min(indexOfLast, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
