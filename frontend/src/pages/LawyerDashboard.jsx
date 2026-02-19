import DashboardLayout from "../components/DashboardLayout";
import { Briefcase, FileText, CheckCircle } from "lucide-react";

export default function LawyerDashboard() {
  const stats = [
    {
      title: "Active Cases",
      value: 5,
      icon: <Briefcase className="text-blue-600" size={28} />
    },
    {
      title: "Pending Requests",
      value: 3,
      icon: <FileText className="text-yellow-600" size={28} />
    },
    {
      title: "Completed Cases",
      value: 12,
      icon: <CheckCircle className="text-green-600" size={28} />
    }
  ];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Lawyer Dashboard</h2>

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

      {/* Case List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Cases</h3>

        <div className="space-y-4">
          <div className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">Tenant Eviction Dispute</p>
              <p className="text-sm text-gray-500">Citizen: Mark Spencer</p>
            </div>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm">
              Pending
            </span>
          </div>

          <div className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">Domestic Violence Case</p>
              <p className="text-sm text-gray-500">Citizen: Anna Lee</p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
              Active
            </span>
          </div>

          <div className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">Employment Termination</p>
              <p className="text-sm text-gray-500">Citizen: Robert King</p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
              Completed
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
