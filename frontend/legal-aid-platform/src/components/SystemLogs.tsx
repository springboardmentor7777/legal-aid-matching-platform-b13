import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
  { name: "API Gateway", requests: 1200, errors: 100 },
  { name: "Auth Service", requests: 800, errors: 50 },
  { name: "Case Mgmt", requests: 1500, errors: 200 },
  { name: "User Profile", requests: 700, errors: 80 },
];

const logs = [
  { time: "2023-10-27 14:30", level: "ERROR", msg: "Failed login" },
  { time: "2023-10-27 14:29", level: "WARN", msg: "Incomplete data" },
  { time: "2023-10-27 14:28", level: "INFO", msg: "CPU spike detected" },
  { time: "2023-10-27 14:27", level: "DEBUG", msg: "DB query executed" },
];

const levelColors = {
  ERROR: "bg-red-100 text-red-600",
  WARN: "bg-yellow-100 text-yellow-600",
  INFO: "bg-blue-100 text-blue-600",
  DEBUG: "bg-gray-200 text-gray-600",
};

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-5">{children}</div>
);

const StatCard = ({ title, value, subtitle, color }) => (
  <Card>
    <CardContent>
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </CardContent>
  </Card>
);

export default function MonitoringDashboard() {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">System Monitoring Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="CPU Usage" value="78%" subtitle="High usage" color="text-red-500" />
        <StatCard title="Memory Usage" value="65%" subtitle="Approaching limit" color="text-yellow-500" />
        <StatCard title="Uptime" value="123 days" subtitle="Stable" color="text-green-500" />
        <StatCard title="Disk Usage" value="88%" subtitle="Low space" color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Critical Errors" value="15" subtitle="Incidents" color="text-red-600" />
        <StatCard title="Warnings" value="42" subtitle="Alerts" color="text-yellow-600" />
        <StatCard title="Info Messages" value="189" subtitle="Logs" color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold text-gray-700">System Load Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} dot={false} />
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
                <Bar dataKey="errors" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold text-gray-700">Recent System Logs</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="p-3">Time</th>
                <th className="p-3">Level</th>
                <th className="p-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{log.time}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[log.level]}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{log.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
