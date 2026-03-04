import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export default function FilterableDirectory() {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [filter]);

  const fetchProfiles = async () => {
    const res = await axios.get(
      `${API_URL}/directory?expertise=${filter}`
    );
    setProfiles(res.data);
    setIsLoading(false);
  };

  if (isLoading) return <p>Loading directory...</p>;

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Filters</h3>
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border p-2 rounded-lg"
        >
          <option value="">All</option>
          <option value="Family">Family</option>
          <option value="Criminal">Criminal</option>
        </select>
      </div>

      <div className="md:col-span-3 grid gap-4">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-lg shadow flex gap-4"
          >
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{p.fullName}</h3>
              <p className="text-sm text-gray-500">
                {p.specialization}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}