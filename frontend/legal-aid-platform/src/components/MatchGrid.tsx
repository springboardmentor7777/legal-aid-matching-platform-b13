import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export default function MatchGrid({ refreshTrigger }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch matches whenever the parent triggers a refresh
  // (e.g. after the Citizen clicks "Generate Matches").
  useEffect(() => {
    fetchMatches();
  }, [refreshTrigger]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      // GET /matches/me — returns matches scoped to the current user:
      //   Citizens  → all matches across their cases
      //   Lawyers/NGOs → matches where they are the assigned provider
      const res = await axios.get("http://localhost:8081/matches/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Accept callback ─────────────────────────────────────────────────────────
  // FIX: Was setting status to "REQUESTED" which is not a valid MatchStatus.
  // Now sets status to "ACCEPTED" to match the backend MatchStatus enum.
  // We update the card in-place rather than removing it so the Citizen can
  // still see who they have accepted and access Schedule/Chat buttons.
  const handleAccept = (matchId) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.matchId === matchId ? { ...m, status: "ACCEPTED" } : m
      )
    );
  };

  // ─── Reject callback ─────────────────────────────────────────────────────────
  // FIX: Was removing the rejected card from the list entirely, which gave the
  // Citizen no visibility of what happened. Now we keep the card and set its
  // status to "REJECTED" so the state is visible (greyed out in MatchCard).
  const handleReject = (matchId) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.matchId === matchId ? { ...m, status: "REJECTED" } : m
      )
    );
  };

  if (loading) return <p className="text-gray-500">Loading matches...</p>;

  if (matches.length === 0)
    return <p className="text-gray-500">No matches found. Generate matches first.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {matches.map((profile) => (
        <MatchCard
          key={profile.matchId}
          profile={profile}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
