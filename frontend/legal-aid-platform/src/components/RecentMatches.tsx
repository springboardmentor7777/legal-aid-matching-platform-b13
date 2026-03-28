import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RecentMatches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:8081/matches/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    }
  };

  const handleAction = async (matchId: number, action: 'accept' | 'reject') => {
    if (!matchId) {
      console.error("Match ID is missing! Cannot perform action.");
      alert("Error: Missing Match ID. Please check the console.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); 
      await axios.put(`http://localhost:8081/matches/${matchId}/${action}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches(); // Refresh the list after success
    } catch (err) {
      console.error(`Error during ${action}`, err);
      alert(`Failed to ${action} match.`);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
      <div className="space-y-4">
        {matches.length === 0 ? <p className="text-gray-400">No matches found yet.</p> : 
        matches.map((match: any, index: number) => {
          
          const currentMatchId = match.matchId || match.id;
          
          // Smart Display Logic: Flip names based on who is logged in!
          const isCitizen = user?.role === "CITIZEN";
          const displayName = isCitizen ? match.providerName : match.clientName;
          const displayRole = isCitizen ? match.providerType : "CITIZEN (CLIENT)";

          return (
            <div key={currentMatchId || index} className="border p-4 rounded-lg bg-slate-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-purple-900">{displayName || "Unknown User"}</p>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{displayRole}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                  Score: {match.score || 0}%
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {match.status === "INTERESTED" ? (
                  //  FIX: If Citizen, show waiting text. If Provider, show Accept/Reject.
                  isCitizen ? (
                    <span className="text-gray-500 text-sm font-medium italic">
                      Waiting for provider to respond...
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleAction(currentMatchId, 'accept')} 
                        className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-purple-700 transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleAction(currentMatchId, 'reject')} 
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Reject
                      </button>
                    </>
                  )
                ) : match.status === "ACCEPTED" ? (
                  <>
                    <button onClick={() => navigate(`/chatpage/${currentMatchId}`)} className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                      Secure Chat
                    </button>
                    <button onClick={() => navigate(`/pages/AppointmentScheduler/${currentMatchId}`)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition">
                      Schedule Call
                    </button>
                  </>
                ) : (
                  <span className="text-red-500 text-sm font-medium italic">
                    Match {match.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}