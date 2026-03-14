export default function Filters({ filters, setFilters }) {

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

      <input
        type="text"
        placeholder="Family, Criminal..."
        className="w-full border p-2 rounded-lg"
        onChange={(e) =>
          setFilters({
            ...filters,
            expertise: e.target.value
          })
        }
      />

    </div>
  );
}