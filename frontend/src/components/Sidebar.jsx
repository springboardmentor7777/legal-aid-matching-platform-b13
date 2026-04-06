import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "./Notifications";
import {
  LayoutDashboard, FileText, Search, Star, MessageCircle, Calendar,
  Bell, User, LogOut, Scale, Shield, UserCheck, Activity, Briefcase
} from "lucide-react";

// Navigation items for non-admin roles
const standardNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["CITIZEN", "LAWYER", "NGO"] },
  { path: "/case-submission", label: "Submit Case", icon: FileText, roles: ["CITIZEN"] },
  { path: "/directory", label: "Directory", icon: Search, roles: ["CITIZEN", "LAWYER", "NGO"] },
  { path: "/matches", label: "Matches", icon: Star, roles: ["CITIZEN", "LAWYER", "NGO"] },
  { path: "/appointments", label: "Appointments", icon: Calendar, roles: ["CITIZEN", "LAWYER", "NGO"] },
  { path: "/notifications", label: "Notifications", icon: Bell, roles: ["CITIZEN", "LAWYER", "NGO"] },
];

// Navigation items for ADMIN role only
const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/cases", label: "Cases", icon: Briefcase },
  { path: "/admin/verifications", label: "Verifications", icon: UserCheck },
  { path: "/admin/system", label: "System Health", icon: Activity },
];

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userRole = user?.role || "";
  const isAdmin = userRole === "ADMIN";

  const navItems = isAdmin
    ? adminNavItems
    : standardNavItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">

        {/* Brand */}
        <div className="p-5 border-b border-slate-100">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">LegalMatch</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {isAdmin ? "Admin Console" : "Pro Platform"}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {isAdmin && (
            <p className="px-4 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Administration
            </p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.username || user?.email || "User"}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> {userRole}
              </p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-end gap-3 shadow-sm">
          <Notifications />
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}