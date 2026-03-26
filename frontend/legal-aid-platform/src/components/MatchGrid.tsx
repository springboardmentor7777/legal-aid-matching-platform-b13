import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export function MatchGrid({ refreshTrigger }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [refreshTrigger]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

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

  const handleAccept = (id) => {
    setMatches((prev) => prev.filter((m) => m.matchId !== id));
  };

  const handleReject = (id) => {
    setMatches((prev) => prev.filter((m) => m.matchId !== id));
  };

  if (loading) return <p>Loading matches...</p>;

  if (matches.length === 0)
    return <p>No matches found. Generate matches first.</p>;

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
