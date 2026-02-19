import DashboardLayout from "../components/DashboardLayout";
import { useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      role: "Lawyer",
      email: "alice@example.com",
      date: "2024-03-10",
      status: "Pending"
    },
    {
      id: 2,
      name: "LegalAid Corps",
      role: "NGO",
      email: "info@legalaid.org",
      date: "2024-03-12",
      status: "Pending"
    }
  ]);

  const updateStatus = (id, status) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">User Verification Queue</h2>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.date}</td>
                <td>{user.status}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => updateStatus(user.id, "Approved")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(user.id, "Rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{user.name}</h3>
            <p>{user.role}</p>
            <p>{user.email}</p>
            <p>{user.date}</p>
            <p className="mb-2">{user.status}</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(user.id, "Approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(user.id, "Rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
