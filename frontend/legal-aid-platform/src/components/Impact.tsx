import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";

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
interface CategoryCountDto   { category: string; count: number; }
interface RoleCountDto        { role: string;     count: number; }
interface MatchStatusCountDto { status: string;   count: number; }
interface LocationCountDto    { location: string; count: number; }

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

// ================= INDIA STATE CENTER COORDINATES =================
// Approximate centers on a 400×480 SVG viewport
const STATE_COORDS: Record<string, { x: number; y: number; abbr: string }> = {
  "Andhra Pradesh":    { x: 230, y: 330, abbr: "AP"  },
  "Arunachal Pradesh": { x: 365, y: 118, abbr: "AR"  },
  "Assam":             { x: 348, y: 155, abbr: "AS"  },
  "Bihar":             { x: 268, y: 193, abbr: "BR"  },
  "Chhattisgarh":      { x: 232, y: 255, abbr: "CG"  },
  "Goa":               { x: 155, y: 322, abbr: "GA"  },
  "Gujarat":           { x: 128, y: 230, abbr: "GJ"  },
  "Haryana":           { x: 183, y: 145, abbr: "HR"  },
  "Himachal Pradesh":  { x: 196, y: 112, abbr: "HP"  },
  "Jharkhand":         { x: 275, y: 228, abbr: "JH"  },
  "Karnataka":         { x: 183, y: 348, abbr: "KA"  },
  "Kerala":            { x: 183, y: 395, abbr: "KL"  },
  "Madhya Pradesh":    { x: 200, y: 225, abbr: "MP"  },
  "Maharashtra":       { x: 172, y: 280, abbr: "MH"  },
  "Manipur":           { x: 368, y: 183, abbr: "MN"  },
  "Meghalaya":         { x: 340, y: 168, abbr: "ML"  },
  "Mizoram":           { x: 360, y: 200, abbr: "MZ"  },
  "Nagaland":          { x: 378, y: 163, abbr: "NL"  },
  "Odisha":            { x: 268, y: 270, abbr: "OD"  },
  "Punjab":            { x: 172, y: 128, abbr: "PB"  },
  "Rajasthan":         { x: 153, y: 183, abbr: "RJ"  },
  "Sikkim":            { x: 305, y: 152, abbr: "SK"  },
  "Tamil Nadu":        { x: 210, y: 390, abbr: "TN"  },
  "Telangana":         { x: 220, y: 305, abbr: "TS"  },
  "Tripura":           { x: 355, y: 193, abbr: "TR"  },
  "Uttar Pradesh":     { x: 225, y: 173, abbr: "UP"  },
  "Uttarakhand":       { x: 210, y: 132, abbr: "UK"  },
  "West Bengal":       { x: 298, y: 215, abbr: "WB"  },
  "Delhi":             { x: 193, y: 157, abbr: "DL"  },
  // Common city aliases
  "Mumbai":            { x: 158, y: 288, abbr: "MUM" },
  "Bangalore":         { x: 190, y: 358, abbr: "BLR" },
  "Bengaluru":         { x: 190, y: 358, abbr: "BLR" },
  "Chennai":           { x: 218, y: 375, abbr: "CHN" },
  "Hyderabad":         { x: 218, y: 308, abbr: "HYD" },
  "Kolkata":           { x: 298, y: 225, abbr: "KOL" },
  "Pune":              { x: 168, y: 295, abbr: "PNE" },
  "Ahmedabad":         { x: 136, y: 223, abbr: "AMD" },
  "Jaipur":            { x: 166, y: 183, abbr: "JAI" },
  "Lucknow":           { x: 233, y: 173, abbr: "LKO" },
  "Patna":             { x: 263, y: 193, abbr: "PAT" },
  "Bhopal":            { x: 200, y: 228, abbr: "BPL" },
  "Bhubaneswar":       { x: 268, y: 270, abbr: "BBS" },
};

// Fuzzy-match a location string to a known key
function resolveCoords(location: string) {
  if (!location) return null;
  const lc = location.toLowerCase().trim();
  const key = Object.keys(STATE_COORDS).find(
    (k) =>
      k.toLowerCase() === lc ||
      k.toLowerCase().includes(lc) ||
      lc.includes(k.toLowerCase())
  );
  return key ? { ...STATE_COORDS[key], key } : null;
}

// ================= BUBBLE MAP =================
function BubbleMap({ data, loading }: { data: LocationCountDto[]; loading: boolean }) {
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; location: string; count: number;
  } | null>(null);

  if (loading) return <SkeletonBlock className="h-full w-full rounded-xl" />;

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <span className="text-3xl">🗺️</span>
        <p className="text-xs">No location data yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const mapped = data.flatMap((d) => {
    const coords = resolveCoords(d.location);
    if (!coords) return [];
    return [{ ...coords, count: d.count, location: d.location }];
  });

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 400 480" className="w-full h-full" style={{ maxHeight: "240px" }}>
        {/* Simplified India outline */}
        <path
          d="M175,65 L188,55 L212,52 L242,55 L262,60 L292,58 L322,70 L347,85
             L372,102 L382,122 L377,147 L387,167 L380,187 L372,202 L367,222
             L357,237 L342,252 L327,267 L312,282 L297,297 L287,317 L277,337
             L262,357 L250,377 L237,397 L225,417 L215,432 L205,417 L195,400
             L188,382 L178,362 L165,347 L152,330 L145,312 L138,292 L130,272
             L125,250 L118,230 L115,207 L112,184 L118,164 L125,144 L132,124
             L140,107 L150,90 L162,77 Z"
          fill="#EFF6FF"
          stroke="#BFDBFE"
          strokeWidth="1.5"
        />

        {/* Unmapped locations hint */}
        {data.length > mapped.length && (
          <text x="8" y="472" fontSize="7" fill="#9ca3af">
            +{data.length - mapped.length} location(s) not mapped
          </text>
        )}

        {/* Bubbles */}
        {mapped.map((pt, i) => {
          const r = 5 + (pt.count / maxCount) * 20;
          const opacity = 0.3 + (pt.count / maxCount) * 0.6;
          return (
            <g key={i}>
              {/* Outer pulse ring */}
              <circle
                cx={pt.x} cy={pt.y} r={r + 4}
                fill="#2563eb" fillOpacity={opacity * 0.2}
                stroke="none"
              />
              {/* Main bubble */}
              <circle
                cx={pt.x} cy={pt.y} r={r}
                fill="#2563eb" fillOpacity={opacity}
                stroke="#1d4ed8" strokeWidth="0.8"
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({ x: pt.x, y: pt.y, location: pt.location, count: pt.count })}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* Abbreviation label (only if bubble is large enough) */}
              {r > 11 && (
                <text
                  x={pt.x} y={pt.y + 0.5}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="6.5" fontWeight="700" fill="white"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {pt.abbr}
                </text>
              )}
            </g>
          );
        })}

        {/* SVG tooltip */}
        {tooltip && (() => {
          const tw = 86; const th = 30;
          const tx = Math.min(tooltip.x + 10, 400 - tw - 4);
          const ty = Math.max(tooltip.y - th - 4, 2);
          return (
            <g style={{ pointerEvents: "none" }}>
              <rect x={tx} y={ty} width={tw} height={th} rx="4" fill="#1e3a8a" fillOpacity="0.93" />
              <text x={tx + 6} y={ty + 11} fontSize="7.5" fill="white" fontWeight="600">{tooltip.location}</text>
              <text x={tx + 6} y={ty + 23} fontSize="7" fill="#93c5fd">
                {tooltip.count} {tooltip.count === 1 ? "user" : "users"}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ================= RANKED LOCATION BARS =================
function LocationList({ data, loading }: { data: LocationCountDto[]; loading: boolean }) {
  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <SkeletonBlock key={i} className="h-4 w-full" />)}
    </div>
  );

  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const max    = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <div className="space-y-1.5">
      {sorted.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-20 truncate text-gray-600 shrink-0" title={d.location}>{d.location}</span>
          <div className="flex-1 bg-blue-50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${(d.count / max) * 100}%`, transition: "width 0.6s ease" }}
            />
          </div>
          <span className="w-5 text-right font-semibold text-blue-900 shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ================= MAIN =================
export default function ImpactDashboard() {
  const [overview,  setOverview]  = useState<OverviewMetrics | null>(null);
  const [caseData,  setCaseData]  = useState<{ category: string; cases: number }[]>([]);
  const [userData,  setUserData]  = useState<{ name: string; value: number }[]>([]);
  const [matchData, setMatchData] = useState<{ status: string; count: number }[]>([]);
  const [locData,   setLocData]   = useState<LocationCountDto[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, casesRes, usersRes, matchesRes, activityRes] = await Promise.all([
          fetch(`${BASE}/analytics/overview`, { headers }),
          fetch(`${BASE}/analytics/cases`,    { headers }),
          fetch(`${BASE}/analytics/users`,    { headers }),
          fetch(`${BASE}/analytics/matches`,  { headers }),
          fetch(`${BASE}/analytics/activity`, { headers }),  // ← geographic data
        ]);

        if (!overviewRes.ok || !casesRes.ok || !usersRes.ok || !matchesRes.ok || !activityRes.ok) {
          throw new Error("One or more analytics endpoints returned an error.");
        }

        const [overviewData, casesData, usersData, matchesData, activityData]: [
          OverviewMetrics, CategoryCountDto[], RoleCountDto[], MatchStatusCountDto[], LocationCountDto[]
        ] = await Promise.all([
          overviewRes.json(), casesRes.json(), usersRes.json(),
          matchesRes.json(), activityRes.json(),
        ]);

        setOverview(overviewData);
        setCaseData(casesData.map((d) => ({ category: d.category, cases: d.count })));
        setUserData(usersData.map((d) => ({ name: d.role,         value: d.count })));
        setMatchData(matchesData.map((d) => ({ status: d.status,  count: d.count })));
        setLocData(activityData);
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
      <h1 className="text-2xl font-bold text-blue-900">Impact Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}><CardContent>
                  <SkeletonBlock className="h-3 w-3/4 mb-2" />
                  <SkeletonBlock className="h-6 w-1/2" />
                </CardContent></Card>
              ))
            : KPI_KEYS.map(({ title, key }) => (
                <Card key={key}><CardContent>
                  <p className="text-xs text-gray-500">{title}</p>
                  <p className="text-xl font-semibold">
                    {overview?.[key]?.toLocaleString() ?? "—"}
                  </p>
                </CardContent></Card>
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
                      <XAxis dataKey="status" /><YAxis />
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
        {/* Cases by Category */}
        <Card className="col-span-2">
          <CardContent>
            <h3 className="text-sm font-medium mb-2">Cases by Category</h3>
            <div className="h-[300px]">
              {loading ? <SkeletonBlock className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" /><YAxis />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution — replaces the placeholder */}
        <Card>
          <CardContent className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Geographic Distribution</h3>
              {!loading && locData.length > 0 && (
                <span className="text-xs text-gray-400">{locData.length} regions</span>
              )}
            </div>

            {/* India bubble map */}
            <div className="h-[240px]">
              <BubbleMap data={locData} loading={loading} />
            </div>

            {/* Ranked list */}
            <div className="border-t pt-2">
              <p className="text-xs text-gray-400 mb-2">Top locations</p>
              <LocationList data={locData} loading={loading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
