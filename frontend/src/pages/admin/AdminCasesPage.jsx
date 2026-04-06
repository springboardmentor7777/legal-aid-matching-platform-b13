import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Briefcase, Search, ChevronLeft, ChevronRight, Filter,
  Clock, CheckCircle, AlertTriangle, Link2
} from "lucide-react";

const ITEMS_PER_PAGE = 12;
const STATUS_OPTIONS = ["ALL", "SUBMITTED", "PENDING", "IN_REVIEW", "ACTIVE", "IN_PROGRESS", "MATCHED", "RESOLVED", "CLOSED"];

export default function AdminCasesPage() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/admin/cases");
      setCases(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load cases");
    } finally {
      setIsLoading(false);
    }
  };

  // Filters
  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesSearch =
      (c.caseType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.citizenName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.citizenEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const statusBadge = (status) => {
    const styles = {
      SUBMITTED: "bg-blue-100 text-blue-700 border-blue-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      IN_REVIEW: "bg-purple-100 text-purple-700 border-purple-200",
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      IN_PROGRESS: "bg-cyan-100 text-cyan-700 border-cyan-200",
      MATCHED: "bg-indigo-100 text-indigo-700 border-indigo-200",
      RESOLVED: "bg-green-100 text-green-700 border-green-200",
      CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
        {status}
      </span>
    );
  };

  const matchBadge = (matchStatus) => {
    switch (matchStatus) {
      case "MATCHED":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" /> Matched
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <Link2 className="w-3.5 h-3.5" /> Unmatched
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" /> Case Monitoring
        </h1>
        <p className="text-slate-500 mt-1">View and monitor all cases across the platform.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by case type or citizen name..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" /> All Cases
          </h2>
          <span className="text-sm text-slate-400 font-medium">{filteredCases.length} cases</span>
        </div>

        {paginatedCases.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No cases found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Citizen</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgency</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">#{c.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{c.caseType || "—"}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{c.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          {(c.citizenName || "C").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{c.citizenName || "—"}</p>
                          <p className="text-[11px] text-slate-400">{c.citizenEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(c.status)}</td>
                    <td className="px-6 py-4">{matchBadge(c.matchStatus)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                        c.urgency === "HIGH" || c.urgency === "URGENT"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : c.urgency === "MEDIUM"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {c.urgency || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)} of {filteredCases.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
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
                );
              })}
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
    </div>
  );
}
