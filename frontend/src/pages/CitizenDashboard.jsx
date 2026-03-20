import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api";

export default function CitizenDashboard() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await API.get("/cases/my");
      setCases(res.data);
    } catch (err) {
      setError("Failed to load cases.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading cases...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">My Cases</h2>
        <Link
          to="/case-submission"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          Submit New Case
        </Link>
      </div>

      <div className="grid gap-4">
        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold">{c.summary}</h3>
            <p className="text-sm text-gray-500">
              Status: {c.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}