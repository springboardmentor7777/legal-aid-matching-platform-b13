import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ profile, onAccept, onReject }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // FIX: Initialise status from the profile prop so the card always reflects
  // the latest status returned by the backend (PENDING, ACCEPTED, REJECTED).
  const [status, setStatus] = useState(profile.status || "PENDING");

  // FIX: Removed the stale `isRequested` and `isMatched` variables.
  // The backend MatchStatus enum only has: PENDING, ACCEPTED, REJECTED.
  // The "express interest" step has been removed from the flow, so citizens
  // can accept any PENDING match directly.
  const isPending  = status === "PENDING";
  const isAccepted = status === "ACCEPTED";  // FIX: was `isAccepted` undefined — now properly declared
  const isRejected = status === "REJECTED";

  // ─── Accept ─────────────────────────────────────────────────────────────────
  // Called by the Citizen to finalise the lawyer/NGO for their case.
  // Backend: PUT /matches/{matchId}/accept
  // On success: status moves to ACCEPTED and all other matches for that case
  // are automatically rejected by the backend (rejectOtherMatches).
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

      // FIX: Use the exact status string returned by the backend.
      // Previously this fell back to "REQUESTED" which is not a valid MatchStatus.
      setStatus(res.data.status || "ACCEPTED");
      onAccept && onAccept(profile.matchId);
    } catch (e) {
      console.error(e);
      alert("Accept failed: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // ─── Reject ──────────────────────────────────────────────────────────────────
  // Can be called by both the Citizen (to dismiss a match) or the
  // Lawyer/NGO (to decline the case). Backend: PUT /matches/{matchId}/reject
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

      // FIX: Use the exact status string returned by the backend ("REJECTED"),
      // not the old "REQUESTED" fallback which was never a valid status.
      setStatus(res.data.status || "REJECTED");
      onReject && onReject(profile.matchId);
    } catch (e) {
      console.error(e);
      alert("Reject failed: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // ─── Status badge colour helper ──────────────────────────────────────────────
  const statusStyle = () => {
    if (isAccepted) return "bg-green-100 text-green-700";
    if (isRejected) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600"; // PENDING
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition w-72">
      <h2 className="font-bold text-gray-400 text-xs uppercase tracking-wide mb-1">
        Match
      </h2>

      <h3 className="font-semibold text-lg">{profile.providerName}</h3>
      <p className="text-gray-500 text-sm">{profile.providerType}</p>

      {/* Match score badge */}
      <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
        Match Score: {profile.score}%
      </div>

      <p className="text-gray-400 mt-2 text-sm">Case ID: {profile.caseId}</p>

      {/* Status badge — FIX: now uses isPending / isAccepted / isRejected */}
      <div className="mt-2 text-xs font-medium">
        Status:{" "}
        <span className={`ml-1 px-2 py-1 rounded ${statusStyle()}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4">

        {/* Accept / Reject buttons ────────────────────────────────────────────
            FIX: Both buttons are now disabled unless status is PENDING.
            Previously "Accept" was disabled on `status !== "PENDING"` but
            the Schedule/Chat buttons used the undefined `isAccepted` variable,
            which caused a ReferenceError and broke the entire card render. */}
        <div className="flex justify-center gap-2">
          <button
            onClick={handleAccept}
            disabled={!isPending || loading}
            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Accept"}
          </button>

          <button
            onClick={handleReject}
            disabled={!isPending || loading}
            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Reject
          </button>
        </div>

        {/* Schedule Call — only available once the Citizen has accepted */}
        <button
          disabled={!isAccepted}
          className={`px-3 py-2 rounded w-full ${
            isAccepted
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            navigate(`/pages/AppointmentScheduler/${profile.matchId}`)
          }
        >
          Schedule Call
        </button>

        {/* Secure Chat — only available once the Citizen has accepted */}
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
