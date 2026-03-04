import { useState } from "react";
import { Menu, X, LogOut, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <Scale className="text-blue-900" />
          <span className="font-bold text-gray-900">LegalMatch Pro</span>
        </div>

        <nav className="flex flex-col p-4 space-y-3 text-sm">
          <Link to="/dashboard/admin" className="hover:text-blue-900">
            Admin Dashboard
          </Link>
          <Link to="/dashboard/citizen" className="hover:text-blue-900">
            Citizen Dashboard
          </Link>
          <Link to="/case-submission" className="hover:text-blue-900">
            Submit Case
          </Link>
          <Link to="/directory" className="hover:text-blue-900">
            Directory
          </Link>
          <Link to="/directory-ingestion" className="hover:text-blue-900">
            Directory Ingestion
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 mt-6"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}