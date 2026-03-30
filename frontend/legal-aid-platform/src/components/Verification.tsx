import React, { useEffect, useState } from "react";

// FIX: Verification was a full page that tried to render AdminSidebar without
// the required props (active / setActive), causing a TypeScript error and a
// broken layout with a duplicate sidebar.
//
// Solution: strip the page shell entirely. AdminPanel already owns the layout
// (Navbar + AdminSidebar + <main>). This component is now a plain section that
// AdminPanel drops into <main> — exactly like ProfileManagement, Matches, etc.

interface VerificationItem {
  id: number;
  name: string;
  role: string;
  organization: string;
  location: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function Verification() {
  const [filters, setFilters] = useState({ role: "", status: "", location: "" });
  const [data, setData] = useState<VerificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // TODO: replace with a real API call, e.g.:
    // const res = await axios.get("http://localhost:8081/api/admin/verification");
    // setData(res.data);
    setData([
      { id: 1, name: "Alice Johnson",  role: "Lawyer", organization: "Justice Advocates LLP",  location: "New York, NY",     status: "Pending"  },
      { id: 2, name: "Bob Williams",   role: "NGO",    organization: "Community Legal Aid",     location: "Los Angeles, CA",  status: "Approved" },
      { id: 3, name: "Charlie Brown",  role: "Lawyer", organization: "Liberty Law Group",       location: "Chicago, IL",      status: "Rejected" },
      { id: 4, name: "Diana Prince",   role: "NGO",    organization: "Human Rights Defense",    location: "Washington, DC",   status: "Pending"  },
      { id: 5, name: "Eve Adams",      role: "Lawyer", organization: "Family Law Solutions",    location: "Houston, TX",      status: "Approved" },
    ]);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleAction = (id: number, action: "Approved" | "Rejected") => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  const getStatusStyle = (status: string) => {
    if (status === "Pending")  return "bg-blue-50 text-blue-600";
    if (status === "Approved") return "bg-green-50 text-green-600";
    if (status === "Rejected") return "bg-red-50 text-red-600";
    return "";
  };

  // Apply filters
  const filtered = data.filter((item) => {
    const matchRole     = !filters.role     || item.role === filters.role;
    const matchStatus   = !filters.status   || item.status === filters.status;
    const matchLocation = !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchRole && matchStatus && matchLocation;
  });

  const totalPages   = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast  = indexOfFirst + itemsPerPage;
  const currentData  = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Verification</h2>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border flex flex-wrap gap-4 items-center">
        <select name="role" onChange={handleFilterChange} className="border px-3 py-2 rounded-lg text-sm">
          <option value="">Role</option>
          <option value="Lawyer">Lawyer</option>
          <option value="NGO">NGO</option>
        </select>

        <select name="status" onChange={handleFilterChange} className="border px-3 py-2 rounded-lg text-sm">
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Search location..."
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg text-sm w-56"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4">Role</th>
              <th className="text-left px-4">Organization</th>
              <th className="text-left px-4">Location</th>
              <th className="text-left px-4">Status</th>
              <th className="text-center px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                  <td className="px-4 text-gray-600">{item.role}</td>
                  <td className="px-4 text-gray-600">{item.organization}</td>
                  <td className="px-4 text-gray-600">{item.location}</td>
                  <td className="px-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 text-center space-x-2 py-2">
                    <button
                      onClick={() => handleAction(item.id, "Approved")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "Rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
          <p className="text-gray-500">
            Showing {filtered.length === 0 ? 0 : indexOfFirst + 1}–{Math.min(indexOfLast, filtered.length)} of {filtered.length}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}