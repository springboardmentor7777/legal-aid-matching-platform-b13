import DashboardLayout from "../components/DashboardLayout";

export default function LawyerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            Lawyer Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your assigned legal cases and review new requests.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Active Cases</p>
            <p className="text-2xl font-bold text-blue-900">5</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Completed Cases</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Recent Case Activity
          </h3>

          <div className="space-y-3">
            <div className="p-4 border rounded-md">
              Tenant Eviction Dispute – Mark Spencer
            </div>

            <div className="p-4 border rounded-md">
              Employment Termination – Robert King
            </div>

            <div className="p-4 border rounded-md">
              Child Custody Support – Anna Lee
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
