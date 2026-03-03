import React, { useEffect, useState } from "react";
import axios from "axios";

interface ImpactData {
  totalUsers: number;
  totalNGO: number;
  totalLawyers: number;
  totalCitizens: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  totalCases: number;
  totalMatches: number;
}

const api = axios.create({
  baseURL: "http://localhost:8081/api/admin",
});

export default function ImpactDashboard() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      const res = await api.get<ImpactData>("/impact");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching impact data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactData();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (!data) {
    return <p className="text-gray-500">No impact data available.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Impact Dashboard
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={data.totalUsers} />
        <StatCard title="Total Cases" value={data.totalCases} />
        <StatCard title="Total Matches" value={data.totalMatches} />
      </div>

      {/* Role Distribution */}
      <h3 className="text-xl font-semibold text-blue-900 mb-4">
        User Role Distribution
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="NGOs" value={data.totalNGO} />
        <StatCard title="Lawyers" value={data.totalLawyers} />
        <StatCard title="Citizens" value={data.totalCitizens} />
      </div>

      {/* Approval Status */}
      <h3 className="text-xl font-semibold text-blue-900 mb-4">
        User Approval Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending" value={data.pendingUsers} color="yellow" />
        <StatCard title="Approved" value={data.approvedUsers} color="green" />
        <StatCard title="Rejected" value={data.rejectedUsers} color="red" />
      </div>
    </div>
  );
}

/* ---------- Reusable Stat Card ---------- */
interface StatProps {
  title: string;
  value: number;
  color?: "blue" | "green" | "red" | "yellow";
}

const StatCard: React.FC<StatProps> = ({ title, value, color = "blue" }) => {
  const colorMap: Record<string, string> = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
  };

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 border-l-4 ${colorMap[color]}`}
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <h4 className="text-3xl font-bold text-blue-900 mt-2">{value}</h4>
    </div>
  );
};