import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, User, Trash2 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
  action: string;
  user: string;
  timestamp: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const usersPerPage = 5;

  const API = axios.create({
    baseURL: "http://localhost:8081/api",
  });

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await API.get("/admin/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await API.put(`/admin/verify/${id}`, { status });
      fetchUsers();
      fetchLogs();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/delete/${id}`);
      fetchUsers();
      fetchLogs();
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  // Filter + Search logic
  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === "ALL" || u.status === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Chart Data for User Statuses
  const chartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Users",
        data: [
          users.filter((u) => u.status === "PENDING").length,
          users.filter((u) => u.status === "APPROVED").length,
          users.filter((u) => u.status === "REJECTED").length,
        ],
        backgroundColor: ["#F59E0B", "#22C55E", "#EF4444"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-white shadow px-8 py-4">
        <h1 className="text-xl font-bold text-blue-900">LegalMatch Pro</h1>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={18} />
        </div>
      </div>

      <div className="flex">

        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-6">
          <ul className="space-y-5 text-gray-700 text-sm">
            <li>Profile Management</li>
            <li>Case Submission</li>
            <li>Directory</li>
            <li>Matches</li>
            <li>Impact Dashboard</li>
            <li className="font-semibold text-blue-900">Admin Panel</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">

          {/* Header */}
          <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
          <p className="text-gray-500 mb-6">
            Manage platform users, data ingestion, system health, and application settings.
          </p>

          {/* Tabs */}
          <div className="flex space-x-6 border-b mb-6 text-sm">
            <button className="pb-2 border-b-2 border-blue-900 font-medium">
              User Verification
            </button>
            <button
              className="pb-2 text-gray-500 cursor-not-allowed"
              title="Coming soon"
              disabled
            >
              Directory Ingestion
            </button>
            <button
              className="pb-2 text-gray-500 cursor-not-allowed"
              title="Coming soon"
              disabled
            >
              System Logs
            </button>
            <button
              className="pb-2 text-gray-500 cursor-not-allowed"
              title="Coming soon"
              disabled
            >
              App Settings
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => u.status === "PENDING").length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Approved Users</p>
              <h3 className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.status === "APPROVED").length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Rejected Users</p>
              <h3 className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.status === "REJECTED").length}
              </h3>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">
            <h3 className="font-semibold mb-4">User Status Distribution</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="flex space-x-4">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f as any);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1 rounded-lg text-sm ${
                    filter === f
                      ? "bg-blue-900 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search users..."
              className="border rounded-lg px-4 py-2 text-sm w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl shadow overflow-auto max-h-[440px]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left sticky top-0">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.submittedDate}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : user.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="p-4 space-x-2 flex justify-center">
                        {user.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => updateStatus(user.id, "APPROVED")}
                              className="bg-blue-900 text-white px-3 py-1 rounded-lg hover:bg-blue-800 inline-flex items-center gap-1"
                              title="Approve User"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>

                            <button
                              onClick={() => updateStatus(user.id, "REJECTED")}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 inline-flex items-center gap-1"
                              title="Reject User"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 cursor-pointer hover:underline"
                            title="View Details"
                          >
                            View Details
                          </span>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-black inline-flex items-center gap-1 ml-3"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
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
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-96 max-w-full shadow-lg">
                <h3 className="text-lg font-bold mb-4">User Details</h3>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Submitted Date:</strong> {selectedUser.submittedDate}</p>
                <div className="mt-6 flex justify-end gap-3">
                  {selectedUser.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          updateStatus(selectedUser.id, "APPROVED");
                          setSelectedUser(null);
                        }}
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedUser.id, "REJECTED");
                          setSelectedUser(null);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Recent Activity Logs</h3>
            <div className="bg-white rounded-xl shadow max-h-64 overflow-auto p-4">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center">No activity logs yet.</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {logs.map((log) => (
                    <li key={log.id} className="border-b border-gray-200 pb-2">
                      <span className="font-medium">{log.user}</span> {log.action} <span className="text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs mt-10">
            © 2025 LegalMatch Pro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}