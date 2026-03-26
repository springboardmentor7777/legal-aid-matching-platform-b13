import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export default function MatchGrid({ refreshTrigger }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [refreshTrigger]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8081/matches/me",
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

  const acceptMatch = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/matches/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectMatch = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/matches/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading matches...</p>;

  if (matches.length === 0)
    return <p>No matches found. Generate matches first.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {matches.map((profile) => (
        <MatchCard
          key={profile.id}
          profile={profile}
          onAccept={acceptMatch}
          onReject={rejectMatch}
        />
      ))}
    </div>
  );
}
