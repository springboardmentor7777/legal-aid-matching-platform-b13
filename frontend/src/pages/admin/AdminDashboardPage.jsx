import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Shield, Users, Briefcase, Scale, TrendingUp, Download,
  FileSpreadsheet, BarChart3, UserCheck, Clock, CheckCircle2,
  MessageSquare, MapPin
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Fallback growth data (6 months) — replace with real API data when available
const growthData = [
  { month: "Nov", newUsers: 12, newCases: 5 },
  { month: "Dec", newUsers: 19, newCases: 8 },
  { month: "Jan", newUsers: 27, newCases: 14 },
  { month: "Feb", newUsers: 35, newCases: 18 },
  { month: "Mar", newUsers: 42, newCases: 22 },
  { month: "Apr", newUsers: 51, newCases: 29 },
];

const PIE_COLORS = ["#3b82f6", "#6366f1", "#10b981"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/api/admin/stats");
      setStats(res.data);
    } catch {
      toast.error("Failed to load admin stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await API.get("/api/admin/export/cases", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cases_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV report downloaded successfully!");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  // Transform casesByCategory map --> recharts data
  const categoryData = stats?.casesByCategory
    ? Object.entries(stats.casesByCategory).map(([name, value]) => ({ name, cases: value }))
    : [];

  const roleDistribution = stats?.roleDistribution || [];

  const kpiCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200" },
        { label: "Total Cases", value: stats.totalCases, icon: Briefcase, gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200" },
        { label: "Total Matches", value: stats.totalMatches, icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-200" },
        { label: "Pending Verifications", value: stats.pendingVerifications, icon: Clock, gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-200" },
        { label: "Resolved Cases", value: stats.totalResolvedCases ?? 0, icon: CheckCircle2, gradient: "from-green-500 to-green-600", shadow: "shadow-green-200" },
        { label: "Chat Messages", value: stats.chatActivitySummary ?? 0, icon: MessageSquare, gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-200" },
        { label: "Lawyers", value: stats.lawyers, icon: Scale, gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-200" },
        { label: "NGOs", value: stats.ngos, icon: UserCheck, gradient: "from-teal-500 to-teal-600", shadow: "shadow-teal-200" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Platform analytics and impact metrics.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download Case Report (CSV)
            </>
          )}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500 font-medium">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Line Chart + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart — Growth Trends */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Growth Trends (6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="New Users" />
              <Line type="monotone" dataKey="newCases" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="New Cases" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Cases by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Cases by Category
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar dataKey="cases" fill="#6366f1" radius={[8, 8, 0, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-400">
              No case data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2: Pie Chart + Map Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart — Role Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-600" /> User Role Distribution
          </h2>
          {roleDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {roleDistribution.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-400">
              No user data available yet.
            </div>
          )}
        </div>

        {/* Map Placeholder — Geographic Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-rose-500" /> Geographic Distribution
          </h2>
          <div className="flex flex-col items-center justify-center h-[280px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <MapPin className="w-16 h-16 text-slate-300 mb-3" />
            <p className="text-lg font-semibold text-slate-500">Interactive Map</p>
            <p className="text-sm text-slate-400 mt-1">Coming soon — Geographic case distribution</p>
            <div className="flex items-center gap-4 mt-4">
              {["Mumbai", "Delhi", "Bangalore", "Chennai"].map((city) => (
                <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                  📍 {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/verifications"
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 hover:shadow-md transition-all group"
          >
            <UserCheck className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">Pending Verifications</p>
              <p className="text-xs text-slate-500">{stats?.pendingVerifications || 0} awaiting review</p>
            </div>
          </a>
          <a
            href="/admin/system"
            className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all group"
          >
            <BarChart3 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">System Health</p>
              <p className="text-xs text-slate-500">Monitor platform status</p>
            </div>
          </a>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-all group text-left"
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">Export Data</p>
              <p className="text-xs text-slate-500">Download case reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
