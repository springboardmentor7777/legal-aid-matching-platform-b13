import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function MatchingResults() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔄 Fetch matches (NOT profiles)
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await API.get("/matches");

      // handle different response formats
      setMatches(res.data?.content || res.data || []);

    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-semibold mb-4">Your Matches</h2>

      {loading && (
        <p className="text-gray-500">Loading matches...</p>
      )}

      {!loading && matches.length === 0 && (
        <p className="text-gray-500">No matches found</p>
      )}

      <div className="grid grid-cols-3 gap-6">

        {matches.map((m) => (
          <div key={m.id} className="border p-4 rounded-lg shadow">

            <h3 className="font-semibold text-lg">
              {m.providerName}
            </h3>

            <p className="text-sm text-gray-600">
              Case: {m.caseType}
            </p>

            <p className="text-sm text-gray-600">
              Location: {m.caseLocation}
            </p>

            <p className="text-sm text-gray-600">
              Score: {m.matchScore}
            </p>

            <p className="text-sm mt-1">
              Status: <span className="font-semibold">{m.status}</span>
            </p>

            {/* 🔥 CHAT BUTTON */}
            {m.status === "ACCEPTED" && (
              <button
                onClick={() => navigate(`/chat/${m.id}`)}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
              >
                Open Chat
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}