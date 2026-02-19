import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-2xl bg-white border border-gray-200 shadow-sm rounded-lg p-6">

        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Profile
        </h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-500">Name</label>
            <div className="mt-1 border border-gray-300 rounded-md px-3 py-2">
              {user?.name}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <div className="mt-1 border border-gray-300 rounded-md px-3 py-2">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Role</label>
            <div className="mt-1 border border-gray-300 rounded-md px-3 py-2">
              {user?.role}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
