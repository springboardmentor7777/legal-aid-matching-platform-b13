import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

// ── Types matching backend DTOs ──────────────────────────────────────────────

interface SystemLogDto {
  timestamp: string;   // log.getTimestamp().toString()
  level: string;       // "ERROR" | "WARN" | "INFO" | "DEBUG"
  message: string;
}

interface SystemHealthDto {
  status: string;      // "UP" | "DOWN"
  dbStatus: string;    // "CONNECTED" | "DISCONNECTED"
  serviceStatus: string; // "RUNNING" | "STOPPED"
}

// ── Static chart data (no backend endpoint for charts) ───────────────────────

const lineData = [
  { day: "Mon", cpu: 30, memory: 45 },
  { day: "Tue", cpu: 50, memory: 60 },
  { day: "Wed", cpu: 65, memory: 70 },
  { day: "Thu", cpu: 80, memory: 75 },
  { day: "Fri", cpu: 55, memory: 60 },
  { day: "Sat", cpu: 35, memory: 50 },
  { day: "Sun", cpu: 45, memory: 55 },
];

const barData = [
  { name: "API Gateway",  requests: 1200, errors: 100 },
  { name: "Auth Service", requests: 800,  errors: 50  },
  { name: "Case Mgmt",    requests: 1500, errors: 200 },
  { name: "User Profile", requests: 700,  errors: 80  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const levelColors: Record<string, string> = {
  ERROR: "bg-red-100 text-red-600",
  WARN:  "bg-yellow-100 text-yellow-600",
  INFO:  "bg-blue-100 text-blue-600",
  DEBUG: "bg-gray-200 text-gray-600",
};

const statusColor = (value: string, okValue: string) =>
  value === okValue ? "text-green-500" : "text-red-500";

// ── Sub-components ───────────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-5">{children}</div>
);

const StatCard = ({
  title, value, subtitle, color,
}: {
  title: string; value: string; subtitle: string; color: string;
}) => (
  <Card>
    <CardContent>
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </CardContent>
  </Card>
);

// ── Main component ───────────────────────────────────────────────────────────

export default function MonitoringDashboard() {
  const [logs, setLogs]     = useState<SystemLogDto[]>([]);
  const [health, setHealth] = useState<SystemHealthDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const BASE = "http://localhost:8081";

    Promise.all([
      axios.get<SystemLogDto[]>(`${BASE}/system/logs`),
      axios.get<SystemHealthDto>(`${BASE}/health`),
    ])
      .then(([logsRes, healthRes]) => {
        setLogs(logsRes.data);
        setHealth(healthRes.data);
      })
      .catch(() => setError("Failed to load monitoring data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Derive stat-card values from health (fallback to "—" while loading)
  const appStatus  = health?.status        ?? "—";
  const dbStatus   = health?.dbStatus      ?? "—";
  const svcStatus  = health?.serviceStatus ?? "—";

  const errorCount = logs.filter((l) => l.level === "ERROR").length;
  const warnCount  = logs.filter((l) => l.level === "WARN").length;
  const infoCount  = logs.filter((l) => l.level === "INFO").length;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">System Monitoring Dashboard</h1>

      {/* ── Health status row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="App Status"
          value={loading ? "…" : appStatus}
          subtitle="System health"
          color={statusColor(appStatus, "UP")}
        />
        <StatCard
          title="Database"
          value={loading ? "…" : dbStatus}
          subtitle="Connection status"
          color={statusColor(dbStatus, "CONNECTED")}
        />
        <StatCard
          title="Service"
          value={loading ? "…" : svcStatus}
          subtitle="Background jobs"
          color={statusColor(svcStatus, "RUNNING")}
        />
      </div>

      {/* ── Log counts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Critical Errors"
          value={loading ? "…" : String(errorCount)}
          subtitle="From live logs"
          color="text-red-600"
        />
        <StatCard
          title="Warnings"
          value={loading ? "…" : String(warnCount)}
          subtitle="From live logs"
          color="text-yellow-600"
        />
        <StatCard
          title="Info Messages"
          value={loading ? "…" : String(infoCount)}
          subtitle="From live logs"
          color="text-blue-600"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold text-gray-700">System Load Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu"    stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold text-gray-700">Service Activity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="errors"   fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Live logs table ── */}
      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold text-gray-700">Recent System Logs</h2>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading logs…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="p-3">Time</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-6 text-gray-400">
                      No logs available.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      {/* Backend returns timestamp as toString() of LocalDateTime */}
                      <td className="p-3 text-gray-600">{log.timestamp}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            levelColors[log.level] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      {/* Backend DTO field is "message", not "msg" */}
                      <td className="p-3 text-gray-700">{log.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
