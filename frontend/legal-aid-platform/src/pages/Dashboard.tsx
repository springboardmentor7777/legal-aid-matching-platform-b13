import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";

// Types
export type Role = "CITIZEN" | "LAWYER" | "NGO" | "ADMIN";

// export interface User {
//   name: string;
//   role: Role;
//   token: string;
// }

// interface DashboardProps {
//   user: User;
// }

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-64">
        <Sidebar role={user?.role} isOpen={true} toggleSidebar={() => {}} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <Sidebar
            role={user?.role}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          {/* <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={toggleSidebar}
          /> */}
          <div
            className="fixed inset-0 backdrop-blur-sm pointer-events-none z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          title="Dashboard"
          name={user?.username || "Guest"}
          toggleSidebar={toggleSidebar}
        />

        {/* Header */}
        <div className="bg-white p-6 m-6 rounded-2xl shadow-md border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-900">
            Welcome, {user?.username}!
          </h1>
        </div>

        {/* Dashboard Cards */}
        <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {cardsByRole[user?.role as Role]?.map((title, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-blue-900 text-sm font-semibold tracking-wide">
                {title}
              </h3>
              {title === "Profile Status" ? (
                <p className="text-3xl font-bold text-blue-700 mt-3">
                  {user?.status ? "Verified" : "Not Verified"}
                </p>
              ) : (
                <p className="text-3xl font-bold text-blue-700 mt-3">0</p>
              )}
              {/* <p className="text-3xl font-bold text-blue-700 mt-3">0</p> */}
            </div>
          ))}
        </main>
        <div className="">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Available Services
            </h2>
            <hr className="border-t border-blue-200 my-4" />
            <div className="flex flex-row justify-center items-center gap-10">
              <a
                className="bg-blue-900 p-4 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                href="#fileacase"
              >
                file a case
              </a>
              <a
                className="bg-blue-900 p-4 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                href="#cases"
              >
                view cases
              </a>
              <a
                className="bg-blue-900 p-4 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                onClick={() => navigate("/directories/lawyers")}
              >
                find lawyers
              </a>
              <a
                className="bg-blue-900 p-4 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                onClick={() => navigate("/directories/ngos")}
              >
                find NGOs
              </a>
            </div>
          </div>
        </div>
        <div className="" id="fileacase">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              File a Case
            </h2>
          </div>
        </div>
        <div className="" id="cases">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              View Cases
            </h2>
          </div>
        </div>
        <div className="" id="lawyers">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Lawyers</h2>
          </div>
        </div>
        <div className="" id="ngos">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">NGOs</h2>
          </div>
        </div>
        <footer className="text-gray-500 justify-center items-center flex p-10 bg-blue-50 mt-10">
          Legal Aid Matching platform @2026
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
