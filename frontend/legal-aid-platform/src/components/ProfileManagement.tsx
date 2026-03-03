import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  role: "NGO" | "LAWYER" | "CITIZEN";
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const USERS_PER_PAGE = 5;

const api = axios.create({
  baseURL: "http://localhost:8081/api/admin",
});

export default function ProfileManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update Status
  const updateStatus = async (
    id: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.put(`/verify/${id}`, { status });
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete User
  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchRole =
        roleFilter === "ALL" || u.role === roleFilter;

      const matchStatus =
        statusFilter === "ALL" || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredUsers.length / USERS_PER_PAGE
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Profile Management
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Roles</option>
          <option value="NGO">NGO</option>
          <option value="LAWYER">Lawyer</option>
          <option value="CITIZEN">Citizen</option>
        </select>

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

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mb-4">Loading users...</p>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-blue-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : u.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {u.status === "PENDING" && (
                      <>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() =>
                            updateStatus(u.id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() =>
                            updateStatus(u.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => deleteUser(u.id)}
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