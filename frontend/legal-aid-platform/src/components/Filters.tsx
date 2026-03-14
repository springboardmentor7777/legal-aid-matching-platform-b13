import { useState } from "react";

export default function Filters() {

  const [role, setRole] = useState("ALL");
  const [languages, setLanguages] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);

  const languageOptions = ["English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi"];

  const practiceOptions = [
    "Family Law",
    "Property Law",
    "Criminal Law",
    "Cyber Crime",
    "Labour Law",
    "Intelactual Property",
    "Consumer Protection",
    "Human Rights",
    "Environmental Law",
    "Taxation",
    "Corporate Law",
  ];

  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const clearFilters = () => {
  setRole("ALL");
  setLanguages([]);
  setPracticeAreas([]);
  setAvailability("ANY");
  setVerifiedOnly(false);
};
const applyFilters = () => {
  const filters = {
    role,
    languages,
    practiceAreas,
    availability,
    verifiedOnly
  };

  console.log("Filters Applied:", filters);

};

  return (
    <div className="bg-white p-6 rounded-xl shadow w-72">

      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      {/* Role Toggle */}
      <div className="mb-6">
        <p className="font-medium mb-3">Role</p>

        <div className="flex bg-gray-200 rounded-lg p-1">

          <button
            onClick={() => setRole("ALL")}
            className={`flex-1 py-1 rounded-md ${role === "ALL" ? "bg-purple-600 text-white" : ""}`}
          >
            All
          </button>

          <button
            onClick={() => setRole("LAWYER")}
            className={`flex-1 py-1 rounded-md ${role === "LAWYER" ? "bg-purple-600 text-white" : ""}`}
          >
            Lawyer
          </button>

          <button
            onClick={() => setRole("NGO")}
            className={`flex-1 py-1 rounded-md ${role === "NGO" ? "bg-purple-600 text-white" : ""}`}
          >
            NGO
          </button>

        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <p className="font-medium mb-2">Languages</p>

        <div className="flex flex-wrap gap-2">
          {languageOptions.map((lang) => (
            <button
              key={lang}
              onClick={() => toggleSelection(lang, languages, setLanguages)}
              className={`px-3 py-1 rounded-full border text-sm ${
                languages.includes(lang)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Practice Area */}
      <div className="mb-6">
        <p className="font-medium mb-2">Practice Area</p>

        <div className="flex flex-wrap gap-2">
          {practiceOptions.map((area) => (
            <button
              key={area}
              onClick={() =>
                toggleSelection(area, practiceAreas, setPracticeAreas)
              }
              className={`px-3 py-1 rounded-full border text-sm ${
                practiceAreas.includes(area)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
      {/* Verified Status */}
<div className="mb-6">
  <p className="font-medium mb-2">Verified Status</p>

  <div className="flex items-center gap-3">
    
    <span /*className="text-sm"*/>Show only verified professionals</span>

    <button
      onClick={() => setVerifiedOnly(!verifiedOnly)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        verifiedOnly ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
          verifiedOnly ? "translate-x-6" : ""
        }`}
      ></div>
    </button>
  </div>
</div>

      {/* Distance */}
      <div className="mb-4">
        <p className="font-medium mb-2">Distance <br/> (Maximum Distance: 50 km)</p>
        <input type="range" min="1" max="50" className="w-full"/>
      </div>

    {/* Availability */}
<div className="mb-4">
  <p className="font-medium mb-2">Availability</p>

  <select
    /*value={availability}
    onChange={(e) => setAvailability(e.target.value)}
    className="w-full border p-2 rounded"*/
  >
    <option value="ANY">Any</option>
    <option value="AVAILABLE_NOW">Available Now</option>
    <option value="TODAY">Available Today</option>
    <option value="THIS_WEEK">Available This Week</option>
    <option value="BUSY">Busy</option>
  </select>
</div>
      {/* Experience */}
      <div className="mb-4">
        <p className="font-medium mb-2">Experience</p>
        <select className="w-full border p-2 rounded">
          <option>Any</option>
          <option>0-2 years</option>
          <option>3-5 years</option>
          <option>5+ years</option>
        </select>
      </div>

      <div className="flex gap-3 mt-6">

  <button
    onClick={applyFilters}
    className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
    disabled={!role && languages.length === 0}
  >
    Apply Filters
  </button>

  <button
    onClick={clearFilters}
    className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
  >
    Clear
  </button>

</div>

    </div>
  );
}