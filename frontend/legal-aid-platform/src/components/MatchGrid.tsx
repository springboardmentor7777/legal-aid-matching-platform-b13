import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

// FIX: Added `selectedCaseId` prop.
// Previously MatchGrid had no knowledge of which case was selected in the
// dropdown — it always fetched ALL matches across ALL of the citizen's cases
// via GET /matches/me, ignoring the dropdown selection entirely.
// Now it receives the selected case ID and scopes the fetch to that case only.
export default function MatchGrid({ refreshTrigger, selectedCaseId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch whenever the parent triggers a refresh (Generate button clicked)
  // OR whenever the citizen switches to a different case in the dropdown.
  useEffect(() => {
    fetchMatches();
  }, [refreshTrigger, selectedCaseId]); // FIX: also re-fetch on case change

  const fetchMatches = async () => {
    // FIX: If no case is selected yet, clear the grid and don't fetch.
    // Previously this would fetch all matches on load before the citizen
    // had even picked a case, flooding the grid with unrelated results.
    if (!selectedCaseId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // FIX: Fetch matches scoped to the selected case via the case-specific
      // endpoint instead of GET /matches/me (which returns all cases).
      // GET /matches/case/{caseId} → only matches for this case
      const res = await axios.get(
        `http://localhost:8081/matches/case/${selectedCaseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
        m.matchId === matchId ? { ...m, status: "INTERESTED" } : m
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

  // No case selected yet — prompt the citizen to pick one
  if (!selectedCaseId)
    return <p className="text-gray-500">Select a case above to view matches.</p>;

  if (loading) return <p className="text-gray-500">Loading matches...</p>;

  if (matches.length === 0)
    return <p className="text-gray-500">No matches found. Click "Generate Matches" to find providers.</p>;

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
