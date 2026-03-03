import DashboardLayout from "../components/DashboardLayout";

const users = [
  {
    name: "John Lawyer",
    role: "LAWYER",
    email: "lawyer@test.com",
    date: "Jan 10, 2026",
    status: "Pending"
  },
  {
    name: "Sarah NGO",
    role: "NGO",
    email: "ngo@test.com",
    date: "Jan 8, 2026",
    status: "Approved"
  },
  {
    name: "Mark Citizen",
    role: "CITIZEN",
    email: "citizen@test.com",
    date: "Jan 5, 2026",
    status: "Rejected"
  }
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>

      {/* Tabs */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex gap-4">
        <button className="bg-white shadow-sm px-4 py-2 rounded-md">
          User Verification
        </button>
        <button>Directory Ingestion</button>
        <button>System Logs</button>
        <button>App Settings</button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">

        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold">
            User Verification Queue
          </h2>

          <input
            placeholder="Search users..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-gray-500">
                <th className="py-3">Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-b">
                  <td className="py-4">{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.date}</td>

                  <td>
                    {user.status === "Pending" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
                        Pending
                      </span>
                    )}
                    {user.status === "Approved" && (
                      <span className="px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-600">
                        Approved
                      </span>
                    )}
                    {user.status === "Rejected" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                        Rejected
                      </span>
                    )}
                  </td>

                  <td>
                    {user.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button className="bg-blue-900 text-white px-3 py-1 rounded text-xs">
                          Approve
                        </button>
                        <button className="bg-red-400 text-white px-3 py-1 rounded text-xs">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs cursor-pointer">
                        View Details
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          {users.map((user, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <h3 className="font-semibold">{user.name}</h3>
                <span className="text-xs">
                  {user.status}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>

              <p className="text-sm text-gray-400">
                {user.date}
              </p>

              {user.status === "Pending" && (
                <div className="flex flex-col gap-2 pt-2">
                  <button className="bg-blue-900 text-white py-2 rounded">
                    Approve
                  </button>
                  <button className="bg-red-400 text-white py-2 rounded">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </DashboardLayout>
  );
}
