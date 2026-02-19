import DashboardLayout from "../components/DashboardLayout";
import { Users, FilePlus, BarChart3 } from "lucide-react";

export default function NgoDashboard() {
  const stats = [
    {
      title: "Total Beneficiaries",
      value: 42,
      icon: <Users className="text-purple-600" size={28} />
    },
    {
      title: "Open Requests",
      value: 7,
      icon: <FilePlus className="text-blue-600" size={28} />
    },
    {
      title: "Success Rate",
      value: "85%",
      icon: <BarChart3 className="text-green-600" size={28} />
    }
  ];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">NGO Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>

        <ul className="space-y-3 text-gray-700">
          <li className="border-b pb-2">
            ✔ Approved housing dispute request for Maria Gonzales
          </li>
          <li className="border-b pb-2">
            ✔ Assigned lawyer to child custody case
          </li>
          <li>
            ✔ Completed financial assistance documentation review
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
