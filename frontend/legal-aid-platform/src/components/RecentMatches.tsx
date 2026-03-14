import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentMatches({ providerId }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, [providerId]);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/matches/provider/${providerId}`
      );
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    }
  };

  const acceptMatch = async (matchId) => {
    await axios.put(`http://localhost:8080/matches/${matchId}/accept`);
    fetchMatches();
  };

  const rejectMatch = async (matchId) => {
    await axios.put(`http://localhost:8080/matches/${matchId}/reject`);
    fetchMatches();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.matchId}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">
                {match.providerName}
                <span className="text-gray-500 text-sm ml-1">
                  ({match.providerType})
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Score: {match.score}
              </p>

              <p className="text-xs text-gray-400">
                Status: {match.status}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => acceptMatch(match.matchId)}
                className="border px-3 py-1 rounded-md text-sm"
              >
                Accept
              </button>

              <button
                onClick={() => rejectMatch(match.matchId)}
                className="border px-3 py-1 rounded-md text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}