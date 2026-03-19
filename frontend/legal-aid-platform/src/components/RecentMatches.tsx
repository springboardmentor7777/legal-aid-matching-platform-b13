import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecentMatches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:8081/matches/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    }
  };

  const handleAction = async (matchId: number, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem("accessToken"); // FIXED: Changed from "token"
      await axios.put(`http://localhost:8081/matches/${matchId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
    } catch (err) {
      console.error(`Error during ${action}`, err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
      <div className="space-y-4">
        {matches.length === 0 ? <p className="text-gray-400">No matches found yet.</p> : 
        matches.map((match: any) => (
          <div key={match.matchId} className="border p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-purple-900">{match.providerName}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold">{match.providerType}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Score: {match.score}%
              </span>
            </div>

            {/* Integration: Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {match.status === "PENDING" ? (
                <>
                  <button onClick={() => handleAction(match.matchId, 'accept')} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Accept</button>
                  <button onClick={() => handleAction(match.matchId, 'reject')} className="border border-gray-300 px-3 py-1 rounded text-sm">Reject</button>
                </>
              ) : match.status === "ACCEPTED" ? (
                <>
                  <button onClick={() => navigate(`/chatpage/${match.matchId}`)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Secure Chat</button>
                  <button onClick={() => navigate(`/pages/AppointmentScheduler/${match.matchId}`)} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Schedule Call</button>
                </>
              ) : (
                <span className="text-red-500 text-sm font-medium italic">Match Rejected</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}