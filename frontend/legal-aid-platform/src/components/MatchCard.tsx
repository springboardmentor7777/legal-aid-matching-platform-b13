import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ profile, onAccept, onReject }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(profile.status || "PENDING");

  const isAccepted = status === "ACCEPTED";

  const handleAccept = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `http://localhost:8081/matches/${profile.matchId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setStatus(res.data.status);
      onAccept && onAccept(profile.matchId);
    } catch (e) {
      console.error(e);
      alert("Accept failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `http://localhost:8081/matches/${profile.matchId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setStatus(res.data.status);
      onReject && onReject(profile.matchId);
    } catch (e) {
      console.error(e);
      alert("Reject failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition w-72">
      <h2 className="font-bold">Match</h2>

      <h3 className="font-semibold text-lg">{profile.providerName}</h3>
      <p className="text-gray-500">{profile.providerType}</p>

      <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
        Match Score: {profile.score}%
      </div>

      <p className="text-gray-400 mt-2 text-sm">Case ID: {profile.caseId}</p>

      <div className="mt-2 text-xs font-medium">
        Status:
        <span className="ml-1 px-2 py-1 rounded bg-gray-100">
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-center gap-2">
          <button
            onClick={handleAccept}
            disabled={isAccepted || loading}
            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Accept"}
          </button>

          <button
            onClick={handleReject}
            disabled={isAccepted || loading}
            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Reject
          </button>
        </div>

        <button
          disabled={!isAccepted}
          className={`px-3 py-2 rounded w-full ${
            isAccepted
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => navigate(`/pages/AppointmentScheduler/${profile.matchId}`)}
        >
          Schedule Call
        </button>

        <button
          disabled={!isAccepted}
          className={`px-3 py-2 rounded w-full ${
            isAccepted
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => navigate(`/chatpage/${profile.matchId}`)}
        >
          Secure Chat
        </button>
      </div>
    </div>
  );
}
