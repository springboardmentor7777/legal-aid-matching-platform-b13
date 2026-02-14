import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// Types
export type Role = "CITIZEN" | "LAWYER" | "NGO" | "ADMIN";

export interface User {
  name: string;
  role: Role;
  token: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const cardsByRole: Record<Role, string[]> = {
    CITIZEN: [
      "Total Applications",
      "Active Cases",
      "Resolved Cases",
      "Pending Approvals",
      "Messages",
      "Profile Status",
    ],
    LAWYER: [
      "Assigned Cases",
      "Pending Requests",
      "Closed Cases",
      "Upcoming Hearings",
      "Clients",
      "Messages",
    ],
    NGO: [
      "Pending Cases",
      "Ongoing Cases",
      "Resolved Cases",
      "Partner Lawyers",
      "Funding Requests",
      "Reports",
    ],
    ADMIN: [
      "Total Users",
      "Active Users",
      "Total Cases",
      "Active Lawyers",
      "Pending Approvals",
      "System Reports",
    ],
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-64">
        <Sidebar role={user.role} isOpen={true} toggleSidebar={() => {}} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <Sidebar role={user.role} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar name={user.name} role={user.role} toggleSidebar={toggleSidebar} />

        {/* Header */}
        <div className="bg-white p-6 m-6 rounded-2xl shadow-md border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-900">
            Welcome, {user.name}!
          </h1>
          
        </div>

        {/* Dashboard Cards */}
        <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {cardsByRole[user.role].map((title, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-blue-900 text-sm font-semibold tracking-wide">
                {title}
              </h3>
              <p className="text-3xl font-bold text-blue-700 mt-3">0</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
