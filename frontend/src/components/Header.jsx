import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-600"
        >
          ☰
        </button>

        <div>
          <h1 className="text-xl font-bold text-blue-900">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500">
            Manage users and system settings
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-semibold">
        {user?.name?.charAt(0)}
      </div>

    </header>
  );
}
