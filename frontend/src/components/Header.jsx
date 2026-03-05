import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Admin Panel
        </h1>
        <p className="text-sm text-gray-500">
          Manage platform users, data ingestion, system health, and application settings.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-semibold">
          {user?.fullName?.charAt(0) || "A"}
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}