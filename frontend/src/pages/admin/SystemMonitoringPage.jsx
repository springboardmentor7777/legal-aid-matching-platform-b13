import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Activity, Shield, Server, Database, Clock, AlertTriangle,
  CheckCircle, Info, ChevronLeft, ChevronRight, Cpu, HardDrive
} from "lucide-react";

const LOGS_PER_PAGE = 15;

export default function SystemMonitoringPage() {
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [healthRes, logsRes] = await Promise.all([
        API.get("/actuator/health").catch(() => ({ data: null })),
        API.get("/api/admin/logs"),
      ]);
      setHealth(healthRes.data);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch {
      toast.error("Failed to load monitoring data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(logs.length / LOGS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * LOGS_PER_PAGE,
    currentPage * LOGS_PER_PAGE
  );

  const severityStyle = (severity) => {
    switch (severity) {
      case "ERROR":
        return "bg-red-100 text-red-700 border-red-200";
      case "WARN":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const severityIcon = (severity) => {
    switch (severity) {
      case "ERROR":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "WARN":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      default:
        return <Info className="w-3.5 h-3.5" />;
    }
  };

  const healthStatus = health?.status || "UNKNOWN";
  const dbStatus = health?.components?.db?.status || "UNKNOWN";
  const diskStatus = health?.components?.diskSpace?.status || "UNKNOWN";

  const statusCard = (label, status, icon) => {
    const isUp = status === "UP";
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            {icon}
            {label}
          </div>
          <div className={`w-3 h-3 rounded-full ${isUp ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></div>
        </div>
        <div className="flex items-center gap-2">
          {isUp ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-lg font-bold ${isUp ? "text-emerald-600" : "text-red-600"}`}>
            {status}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" /> System Monitoring
        </h1>
        <p className="text-slate-500 mt-1">System health metrics and audit event trail.</p>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statusCard("Application", healthStatus, <Server className="w-4 h-4" />)}
        {statusCard("Database", dbStatus, <Database className="w-4 h-4" />)}
        {statusCard("Disk Space", diskStatus, <HardDrive className="w-4 h-4" />)}
      </div>

      {/* System Info */}
      {health && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-blue-600" /> System Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {health.components?.db?.details?.database && (
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Database</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {health.components.db.details.database}
                </p>
              </div>
            )}
            {health.components?.diskSpace?.details && (
              <>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Free Disk Space</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {(health.components.diskSpace.details.free / (1024 * 1024 * 1024)).toFixed(1)} GB
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Disk Space</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {(health.components.diskSpace.details.total / (1024 * 1024 * 1024)).toFixed(1)} GB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Recent System Logs
          </h2>
          <span className="text-sm text-slate-400 font-medium">{logs.length} entries</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No audit logs found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap font-mono">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${severityStyle(log.severity)}`}>
                          {severityIcon(log.severity)}
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs font-mono text-slate-700">{log.eventType}</td>
                      <td className="px-6 py-3 text-xs text-slate-500">{log.source || "—"}</td>
                      <td className="px-6 py-3 text-sm text-slate-700 max-w-xs truncate">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * LOGS_PER_PAGE + 1}–{Math.min(currentPage * LOGS_PER_PAGE, logs.length)} of {logs.length}
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
          </>
        )}
      </div>
    </div>
  );
}
