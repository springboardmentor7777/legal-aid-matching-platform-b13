import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ profile, caseId, onAccept, onReject }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(profile.status);

  const isMatched = status === "MATCHED";

  // ✅ ACCEPT MATCH (updated endpoint)
  const handleAccept = async (matchId) => {
    if (loading) return;

    const token = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8081/matches/${matchId}/accept`,
        {
          method: "PUT", // ✅ IMPORTANT
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Accept failed");
      }

      // ✅ Backend will mark as MATCHED
      setStatus("MATCHED");

      onAccept && onAccept(matchId);

    } catch (error) {
      console.error("Accept failed", error);
      alert("Failed to accept match");
    } finally {
      setLoading(false);
    }
  };

  // ✅ REJECT MATCH (updated endpoint)
  const handleReject = async (matchId) => {
    if (loading) return;

    const token = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8081/matches/${matchId}/reject`,
        {
          method: "PUT", // ✅ IMPORTANT
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Reject failed");
      }

      setStatus("REJECTED");

      onReject && onReject(matchId);

    } catch (error) {
      console.error("Reject failed", error);
      alert("Failed to reject match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">

      {/*<img
        src="https://i.pravatar.cc/100"
        className="w-20 h-20 rounded-full mx-auto mb-3"
        alt="profile"
      />*/}
      <h2> Match </h2>
      <h3 className="font-semibold text-lg">{profile.name}</h3>
      <p className="text-gray-500">{profile.role}</p>

      <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
        Match Score: {profile.score}%
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {profile.expertise?.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-gray-400 mt-2 text-sm">📍 {profile.distance}</p>

      {/* Status */}
      <div className="mt-2 text-xs font-medium">
        Status:
        <span className="ml-1 px-2 py-1 rounded bg-gray-100">
          {status}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">

        {/* ✅ Accept */}
        <button
          onClick={() => handleAccept(profile.id)} // 🔥 matchId used
          disabled={isMatched || loading}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Accept"}
        </button>

        {/* ✅ Reject */}
        <button
          onClick={() => handleReject(profile.id)}
          disabled={isMatched || loading}
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Reject
        </button>

        {/* Schedule */}
        <button
          disabled={!isMatched}
          className={`px-3 py-1 rounded ${
            isMatched
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            isMatched && navigate(`/pages/AppointmentScheduler/${profile.id}`)
          }
        >
          Schedule Call
        </button>

        {/* Chat */}
        <button
          disabled={!isMatched}
          className={`px-3 py-1 rounded ${
            isMatched
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            isMatched && navigate(`/chatpage/${profile.id}`)
          }
        >
          Secure Chat
        </button>

      </div>
    </div>
  );
}
