import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserType {
  id: number;
  name: string;
  role: string;
  email: string;
  submittedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface LogEntry {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [page, setPage] = useState(1);
  const usersPerPage = 5;

  const api = axios.create({ baseURL: "http://localhost:8081/api/admin" });

  const fetchUsers = async () => {
    try {
      const res = await api.get<UserType[]>("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get<LogEntry[]>("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/verify/${id}`, { status });
      fetchUsers();
      fetchLogs();
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/delete/${id}`);
      fetchUsers();
      fetchLogs();
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === "ALL" || u.status === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 border-r">
        <h1 className="font-bold text-xl mb-6 text-blue-900"> LEGAL AID MATCHING PLATFORM</h1>
        <nav className="flex flex-col space-y-3 text-gray-700 text-sm">
          <a href="#" className="hover:text-blue-600">Profile Management</a>
          <a href="#" className="hover:text-blue-600">Case Submission</a>
          <a href="#" className="hover:text-blue-600">Directory</a>
          <a href="#" className="hover:text-blue-600">Matches</a>
          <a href="#" className="hover:text-blue-600">Impact Dashboard</a>
          <a href="#" className="font-semibold text-blue-900">Admin Panel</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-900">Admin Panel</h2>
        <p className="text-gray-500 mb-6">
          Manage platform users, data ingestion, system health, and application settings.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-between mb-4 gap-4">
          <div className="flex space-x-2 items-center">
            <span className="font-semibold text-blue-900">Filter by Status:</span>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as any);
                setPage(1);
              }}
              className="border rounded px-3 py-1"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            className="border px-4 py-2 rounded w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* User Table */}
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 text-blue-900 font-semibold">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Submitted Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.submittedDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : user.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      {user.status === "PENDING" && (
                        <>
                          <button
                            className="text-green-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(user.id, "APPROVED");
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(user.id, "REJECTED");
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="text-gray-600 hover:underline ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUser(user.id);
                        }}
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
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-900 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-blue-900">User Details</h3>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Submitted Date:</strong> {selectedUser.submittedDate}</p>

              {selectedUser.status === "PENDING" && (
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => updateStatus(selectedUser.id, "APPROVED")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => updateStatus(selectedUser.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              )}

              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Activity Logs */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">Recent Activity Logs</h3>
          <div className="bg-white rounded-lg shadow p-4 max-h-60 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">No activity logs yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {logs.map((log) => (
                  <li key={log.id} className="border-b border-gray-200 pb-1">
                    <strong>{log.user}</strong> {log.action}{" "}
                    <span className="text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}