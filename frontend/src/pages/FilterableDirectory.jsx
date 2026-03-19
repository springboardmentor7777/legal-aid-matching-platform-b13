import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export default function FilterableDirectory() {
  const [profiles, setProfiles] = useState([]);
  const [expertise, setExpertise] = useState("");
  const [location, setLocation] = useState("");
  const [verified, setVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [expertise, location, verified]);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/directory/lawyers?expertise=${expertise}&location=${location}&verified=${verified}`
      );

      setProfiles(res.data.content);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading directory:", error);
    }
  };

  if (isLoading) return <p>Loading directory...</p>;

  return (
    <div className="grid md:grid-cols-4 gap-6">

      {/* FILTER PANEL */}
      <div className="bg-white p-4 rounded-lg shadow h-fit">
        <h3 className="font-semibold mb-4 text-lg">Filters</h3>

        <label className="text-sm">Expertise</label>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        >
          <option value="">All</option>
          <option value="Family">Family</option>
          <option value="Criminal">Criminal</option>
          <option value="Property">Property</option>
        </select>

        <label className="text-sm">Location</label>
        <input
          type="text"
          placeholder="Enter city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
          />
          Verified Lawyers Only
        </label>
      </div>

      {/* LAWYER LIST */}
      <div className="md:col-span-3 grid gap-4">
        {profiles.length === 0 && (
          <p className="text-gray-500">No lawyers found.</p>
        )}

        {profiles.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-lg shadow flex gap-4 items-center"
          >
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80"
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg">{p.name}</h3>

              <p className="text-sm text-gray-500">
                {p.expertise}
              </p>

              <p className="text-sm text-gray-400">
                {p.location}
              </p>

              {p.verified && (
                <span className="text-green-600 text-xs font-semibold">
                  ✔ Verified
                </span>
              )}
            </div>

            <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}