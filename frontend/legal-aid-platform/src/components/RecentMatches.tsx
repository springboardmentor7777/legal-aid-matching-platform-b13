import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("THE TOKEN IS: ", token);
      const res = await axios.get(
        "http://localhost:8081/matches/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    }
  };

  const acceptMatch = async (matchId: number) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8081/matches/${matchId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchMatches();
  };

  const rejectMatch = async (matchId: number) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8081/matches/${matchId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchMatches();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">
        Recent Matches
      </h2>

      <div className="space-y-4">
        {matches.map((match: any) => (
          <div
            key={match.matchId}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">
                {match.providerName}
              </p>

              <p className="text-sm text-gray-500">
                Type: {match.providerType}
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
