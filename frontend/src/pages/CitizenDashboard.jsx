import DashboardLayout from "../components/DashboardLayout";

export default function CitizenDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Citizen Dashboard</h2>
      <div className="bg-white p-6 rounded shadow">
        Submit and track your legal aid requests.
      </div>
    </DashboardLayout>
  );
}
