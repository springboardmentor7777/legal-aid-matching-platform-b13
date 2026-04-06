import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Users, Shield, Briefcase, Building2, UserCheck, UserX,
  Search, CheckCircle, XCircle, Scale, TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Fallback: if no admin API exists, show placeholder
      setError("Admin API not configured yet. Showing platform overview.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    lawyers: users.filter(u => u.role === "LAWYER").length,
    ngos: users.filter(u => u.role === "NGO").length,
    citizens: users.filter(u => u.role === "CITIZEN").length,
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { label: "Lawyers", value: stats.lawyers, icon: Briefcase, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50" },
    { label: "NGOs", value: stats.ngos, icon: Building2, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
    { label: "Citizens", value: stats.citizens, icon: UserCheck, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
  ];

  const roleBadge = (role) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-700 border-red-200",
      LAWYER: "bg-indigo-100 text-indigo-700 border-indigo-200",
      NGO: "bg-emerald-100 text-emerald-700 border-emerald-200",
      CITIZEN: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[role] || "bg-slate-100 text-slate-600"}`}>
        {role}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome, {user?.username || "Admin"}. Platform management overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
          <Scale className="w-4 h-4" /> LegalMatch Pro
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "CITIZEN", "LAWYER", "NGO", "ADMIN"].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === role
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Platform Users
          </h2>
          <span className="text-sm text-slate-400 font-medium">{filteredUsers.length} users</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error && users.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">Admin Panel</p>
            <p className="text-slate-400 text-sm mt-1">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UserX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No users match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id || u.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(u.username || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{u.username || u.fullName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">{roleBadge(u.role)}</td>
                    <td className="px-6 py-4">
                      {u.onboardingComplete ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}