import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MatchesOverTime({ providerId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, [providerId]);

  const fetchMatches = async () => {
    const res = await axios.get(
      `http://localhost:8080/matches/provider/${providerId}`
    );

    const matches = res.data;

    const monthly = {};

    matches.forEach((m) => {
      const date = new Date(m.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!monthly[month]) {
        monthly[month] = 0;
      }

      monthly[month]++;
    });

    const chartData = Object.keys(monthly).map((m) => ({
      month: m,
      matches: monthly[m]
    }));

    setData(chartData);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">
        Matches Over Time
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="matches"
            stroke="#7C3AED"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}