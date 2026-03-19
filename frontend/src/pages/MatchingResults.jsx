import { useEffect, useState } from "react";
import API from "../api/axios";
import MatchCard from "../components/MatchCard";
import Filters from "../components/Filters";

export default function MatchingResults() {

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    role: "LAWYER",
    expertise: ""
  });

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {

    try {

      setLoading(true);

      let url =
        filters.role === "LAWYER"
          ? `/directory/lawyers?expertise=${filters.expertise}`
          : `/directory/ngos`;

      const res = await API.get(url);

setProfiles(res.data?.content || res.data?.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex gap-6">

      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-3 gap-6 flex-1">

        {loading && (
          <p className="text-gray-500">Loading profiles...</p>
        )}

        {!loading && profiles.length === 0 && (
          <p className="text-gray-500">No matching profiles found</p>
        )}

        {!loading && profiles.map((p) => (
          <MatchCard key={p.id} profile={p} />
        ))}

      </div>

    </div>
  );
}