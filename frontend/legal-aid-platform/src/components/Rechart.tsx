import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MatchesOverTime() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:8081/matches/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const matches = res.data;
      const monthly: any = {};

      matches.forEach((m: any) => {
        if (!m.createdAt) return;
        const date = new Date(m.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        monthly[month] = (monthly[month] || 0) + 1;
      });

      const chartData = Object.keys(monthly).map((m) => ({
        month: m,
        matches: monthly[m]
      }));

      setData(chartData);
    } catch (err) {
      console.error("Chart data fetch failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Matches Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="matches" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}