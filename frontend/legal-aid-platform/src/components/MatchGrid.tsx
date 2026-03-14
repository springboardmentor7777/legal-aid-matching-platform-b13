import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export default function MatchGrid() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/matches");
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches", error);
    }
  };

  const acceptMatch = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/match/accept/${id}`);

      setMatches(matches.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const rejectMatch = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/match/reject/${id}`);

      setMatches(matches.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading matches...</p>;

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