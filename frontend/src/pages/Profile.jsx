import { useAuth } from "../AuthContext";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user.name);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      <div className="bg-white p-6 rounded shadow max-w-md">
        <label className="block mb-2">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
