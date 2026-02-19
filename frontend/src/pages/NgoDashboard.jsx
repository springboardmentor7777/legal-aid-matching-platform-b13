import DashboardLayout from "../components/DashboardLayout";

export default function NgoDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            NGO Dashboard
          </h2>
          <p className="text-gray-600">
            Monitor beneficiaries and legal aid impact metrics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Total Beneficiaries</p>
            <p className="text-2xl font-bold text-blue-900">42</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Open Requests</p>
            <p className="text-2xl font-bold text-yellow-600">7</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <p className="text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3">
            <li className="border-b pb-2">
              Approved housing dispute case for Maria Gonzales
            </li>
            <li className="border-b pb-2">
              Assigned lawyer to custody case
            </li>
            <li>
              Completed financial aid documentation review
            </li>
          </ul>
        </div>

      </div>
    </DashboardLayout>
  );
}
