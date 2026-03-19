import { useState } from "react";

export default function Filters({ filters, setFilters }) {

  const [localExpertise, setLocalExpertise] = useState(filters.expertise);

  const applyFilters = () => {
    setFilters({
      ...filters,
      expertise: localExpertise
    });
  };

  return (
    <div className="w-64 bg-white p-4 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Filters
      </h3>

      <label className="block text-sm mb-2">
        Role
      </label>

      <select
        className="w-full border p-2 rounded-lg"
        value={filters.role}
        onChange={(e) =>
          setFilters({ ...filters, role: e.target.value })
        }
      >
        <option value="LAWYER">Lawyer</option>
        <option value="NGO">NGO</option>
      </select>

      <label className="block text-sm mt-4 mb-2">
        Expertise
      </label>

      <select
        className="w-full border p-2 rounded-lg"
        value={localExpertise}
        onChange={(e) => setLocalExpertise(e.target.value)}
      >
        <option value="">Select Expertise</option>
        <option value="Family Law">Family Law</option>
        <option value="Criminal Law">Criminal Law</option>
        <option value="Corporate Law">Corporate Law</option>
      </select>

      <button
        onClick={applyFilters}
        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
      >
        Apply Filters
      </button>

    </div>
  );
}