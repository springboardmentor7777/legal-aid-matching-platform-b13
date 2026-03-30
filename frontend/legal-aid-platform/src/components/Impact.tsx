import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// FIX: Removed the AdminSidebar import and the wrapping flex-layout shell.
// Impact.tsx is rendered inside AdminPanel's <main>, so adding AdminSidebar here
// caused a duplicate sidebar and broken layout.
//
// FIX: Replaced bare relative fetch("/analytics/...") calls with absolute URLs
// so they resolve correctly in development (Vite proxy or direct).
// If you use a Vite proxy, set target to http://localhost:8081 and keep paths as-is.

const BASE = "http://localhost:8081";

// ================= TYPES =================
interface OverviewMetrics {
  totalUsers: number;
  totalLawyers: number;
  totalNgos: number;
  totalCases: number;
  totalMatches: number;
  resolvedCases: number;
}

interface CategoryCountDto { category: string; count: number; }
interface RoleCountDto      { role: string;     count: number; }
interface MatchStatusCountDto { status: string; count: number; }

// ================= UI COMPONENTS =================
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border rounded-2xl shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ================= CONSTANTS =================
const COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const KPI_KEYS: { title: string; key: keyof OverviewMetrics }[] = [
  { title: "Total Users",    key: "totalUsers"    },
  { title: "Total Lawyers",  key: "totalLawyers"  },
  { title: "Total NGOs",     key: "totalNgos"     },
  { title: "Total Cases",    key: "totalCases"    },
  { title: "Total Matches",  key: "totalMatches"  },
  { title: "Resolved Cases", key: "resolvedCases" },
];

// ================= MAIN =================
export default function ImpactDashboard() {
  const [overview, setOverview]   = useState<OverviewMetrics | null>(null);
  const [caseData, setCaseData]   = useState<{ category: string; cases: number }[]>([]);
  const [userData, setUserData]   = useState<{ name: string; value: number }[]>([]);
  const [matchData, setMatchData] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, casesRes, usersRes, matchesRes] = await Promise.all([
          fetch(`${BASE}/analytics/overview`, { headers }),
          fetch(`${BASE}/analytics/cases`,    { headers }),
          fetch(`${BASE}/analytics/users`,    { headers }),
          fetch(`${BASE}/analytics/matches`,  { headers }),
        ]);

        if (!overviewRes.ok || !casesRes.ok || !usersRes.ok || !matchesRes.ok) {
          throw new Error("One or more analytics endpoints returned an error.");
        }

        const [overviewData, casesData, usersData, matchesData]: [
          OverviewMetrics,
          CategoryCountDto[],
          RoleCountDto[],
          MatchStatusCountDto[],
        ] = await Promise.all([
          overviewRes.json(),
          casesRes.json(),
          usersRes.json(),
          matchesRes.json(),
        ]);

        setOverview(overviewData);
        setCaseData(casesData.map((d) => ({ category: d.category, cases: d.count })));
        setUserData(usersData.map((d) => ({ name: d.role,     value: d.count })));
        setMatchData(matchesData.map((d) => ({ status: d.status, count: d.count })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-900">Impact Dashboard</h1>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent>
                    <SkeletonBlock className="h-3 w-3/4 mb-2" />
                    <SkeletonBlock className="h-6 w-1/2" />
                  </CardContent>
                </Card>
              ))
            : KPI_KEYS.map(({ title, key }) => (
                <Card key={key}>
                  <CardContent>
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-semibold">
                      {overview?.[key]?.toLocaleString() ?? "—"}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Platform Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Platform Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardContent>
              <h3 className="text-sm font-medium mb-2">Match Status Breakdown</h3>
              <div className="h-[300px]">
                {loading ? <SkeletonBlock className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={matchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-sm font-medium mb-2">User Role Distribution</h3>
              <div className="h-[300px]">
                {loading ? <SkeletonBlock className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(value: number) => value.toLocaleString()} />
                      <Legend />
                      <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={85}>
                        {userData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardContent>
            <h3 className="text-sm font-medium mb-2">Cases by Category</h3>
            <div className="h-[300px]">
              {loading ? <SkeletonBlock className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <div className="text-4xl">🌍</div>
            <p className="mt-2 text-sm">Geographic distribution coming soon</p>
            <p className="mt-1 text-xs text-gray-400">
              Backed by <code className="bg-gray-100 px-1 rounded">/analytics/activity</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}