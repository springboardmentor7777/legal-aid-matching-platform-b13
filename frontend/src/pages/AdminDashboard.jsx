import { useEffect, useState } from "react";
import api from "../api/axios";
import { Check, X } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    const res = await api.get("/admin/users/pending");
    setUsers(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/admin/users/${id}/status`, { status });
    fetchPendingUsers();
  };

  return (
    <div>
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              User Verification Queue
            </h2>
            <p className="text-sm text-gray-500">
              Review and approve new registrations.
            </p>
          </div>
          <input
            placeholder="Search users..."
            className="border rounded-lg px-3 py-1 text-sm"
          />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.createdAt}</td>
                <td className="px-6 py-4">
                  {user.status === "PENDING" && (
                    <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
                      Pending
                    </span>
                  )}
                  {user.status === "APPROVED" && (
                    <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-600">
                      Approved
                    </span>
                  )}
                  {user.status === "REJECTED" && (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {user.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(user.id, "APPROVED")}
                        className="bg-blue-900 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(user.id, "REJECTED")}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden space-y-4">
        {[
          "Manage User Verifications",
          "Control Directory Listings",
          "Access System Logs & Metrics",
          "Configure Application Settings",
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              {item}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Access and manage this section from here.
            </p>
            <button className="w-full border border-blue-900 text-blue-900 py-2 rounded-lg text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}