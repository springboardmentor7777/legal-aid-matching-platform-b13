import DashboardLayout from "../components/DashboardLayout";

export default function CitizenDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            Citizen Dashboard
          </h2>
          <p className="text-gray-600">
            Submit and track your legal aid requests.
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            My Requests
          </h3>

          <div className="space-y-4">
            <div className="border rounded-md p-4">
              Housing Dispute – <span className="text-yellow-600">Pending</span>
            </div>

            <div className="border rounded-md p-4">
              Workplace Harassment – <span className="text-green-600">Approved</span>
            </div>

            <div className="border rounded-md p-4">
              Child Support Case – <span className="text-red-600">Rejected</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
