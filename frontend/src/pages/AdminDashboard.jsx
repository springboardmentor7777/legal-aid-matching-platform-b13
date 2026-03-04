import { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

const API_URL = "http://localhost:8080/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/users/${id}/status`, { status });
      fetchUsers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:table w-full bg-white rounded-lg shadow overflow-hidden">
        <div className="table-header-group bg-gray-50 text-gray-600 text-sm">
          <div className="table-row">
            <div className="table-cell px-6 py-3">Name</div>
            <div className="table-cell px-6 py-3">Role</div>
            <div className="table-cell px-6 py-3">Email</div>
            <div className="table-cell px-6 py-3">Status</div>
            <div className="table-cell px-6 py-3">Actions</div>
          </div>
        </div>

        <div className="table-row-group text-sm">
          {users.map((user) => (
            <div key={user.id} className="table-row border-t">
              <div className="table-cell px-6 py-4">
                {user.fullName}
              </div>
              <div className="table-cell px-6 py-4">
                {user.role}
              </div>
              <div className="table-cell px-6 py-4">
                {user.email}
              </div>
              <div className="table-cell px-6 py-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    user.status === "PENDING"
                      ? "bg-orange-100 text-orange-600"
                      : user.status === "APPROVED"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div className="table-cell px-6 py-4 flex gap-2">
                <button
                  onClick={() =>
                    updateStatus(user.id, "APPROVED")
                  }
                  className="bg-blue-900 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() =>
                    updateStatus(user.id, "REJECTED")
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid md:hidden gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">
                  {user.fullName}
                </h3>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm">{user.role}</span>
              <span className="text-xs">{user.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}