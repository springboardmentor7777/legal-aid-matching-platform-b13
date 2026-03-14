import { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "../components/MatchCard";
import Filters from "../components/Filters";

const API_URL = "http://localhost:8080/api";

export default function MatchingResults() {

  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({
    role: "LAWYER",
    expertise: ""
  });

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {

    let url =
      filters.role === "LAWYER"
        ? `${API_URL}/directory/lawyers?expertise=${filters.expertise}`
        : `${API_URL}/directory/ngos`;

    const res = await axios.get(url);

    setProfiles(res.data.content || res.data);
  };

  return (
    <div className="flex gap-6">

      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-3 gap-6 flex-1">
        {profiles.map((p) => (
          <MatchCard key={p.id} profile={p} />
        ))}
      </div>

    </div>
  );
}