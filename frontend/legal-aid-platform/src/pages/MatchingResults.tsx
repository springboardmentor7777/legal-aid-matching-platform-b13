import Filters from "../components/Filters";
import MatchGrid from "../components/MatchGrid";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function MatchingResults() {

  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar
          role={user.role}
          isOpen={true}
          toggleSidebar={() => {}}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <Sidebar
            role={user.role}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar
          title="Matching Results"
          name={user.username}
          role={user.role}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-6">

          <div className="flex gap-6">

            {/* Filters */}
            <Filters />

            {/* Results */}
            <div className="flex-1">

              <h1 className="text-2xl font-bold mb-6 text-blue-900">
                Matching Profiles
              </h1>

              <MatchGrid />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}