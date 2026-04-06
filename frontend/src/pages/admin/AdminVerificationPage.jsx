import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Shield, UserCheck, UserX, CheckCircle, XCircle, Search,
  ChevronLeft, ChevronRight, Ban, RotateCcw, AlertTriangle
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState("verifications");
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, usersRes] = await Promise.all([
        API.get("/api/admin/pending-verifications"),
        API.get("/api/admin/users"),
      ]);
      setPending(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userId, approve) => {
    try {
      await API.put(`/api/admin/verify/${userId}?approve=${approve}`);
      toast.success(approve ? "Provider approved!" : "Provider rejected.");
      loadData();
    } catch {
      toast.error("Verification action failed");
    }
  };

  const handleSuspend = async (userId) => {
    try {
      const res = await API.put(`/api/admin/users/${userId}/suspend`);
      toast.success(`User ${res.data.status?.toLowerCase() || "updated"}`);
      loadData();
    } catch {
      toast.error("Suspension action failed");
    }
  };

  // Filtered + Paginated users
  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading verification data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" /> Provider Verification & User Management
        </h1>
        <p className="text-slate-500 mt-1">Review pending verifications and manage user accounts.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "verifications", label: "Pending Verifications", icon: UserCheck, count: pending.length },
          { key: "users", label: "User Management", icon: Shield, count: users.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* VERIFICATIONS TAB */}
      {activeTab === "verifications" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" /> Pending Provider Verifications
            </h2>
          </div>

          {pending.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-700">All caught up!</p>
              <p className="text-slate-400 mt-1">No pending verifications at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expertise</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">License / ID</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pending.map((item) => (
                    <tr key={`${item.type}-${item.profileId}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            item.type === "LAWYER" ? "bg-gradient-to-br from-indigo-500 to-indigo-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                          }`}>
                            {(item.name || "P").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.type === "LAWYER" ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.expertise || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.location || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.barCouncilLicense || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(item.userId, true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleVerify(item.userId, false)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> User Management
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(u.username || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{u.username || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">{roleBadge(u.role)}</td>
                    <td className="px-6 py-4">
                      {u.suspended ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                          <Ban className="w-3.5 h-3.5" /> Suspended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handleSuspend(u.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto ${
                            u.suspended
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {u.suspended ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" /> Reinstate
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
