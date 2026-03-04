import { useState } from "react";
import api from "../api/axios";
import { Scale, Check } from "lucide-react";

export default function CaseSubmission() {
  const [summary, setSummary] = useState("");
  const [caseType, setCaseType] = useState("");
  const [tags, setTags] = useState([]);

  const tagOptions = [
    "Divorce",
    "Child Custody",
    "Real Estate",
    "Discrimination",
    "Fraud",
  ];

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/cases", {
      summary,
      caseType,
      expertiseTags: tags,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Scale className="text-white" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Submit Your Case
        </h2>
        <p className="text-gray-500 mb-6">
          Share your legal needs in plain language.
        </p>

        <ul className="space-y-3 text-sm text-gray-600 mb-6">
          <li className="flex items-center gap-2">
            <Check size={16} className="text-blue-900" />
            Guidance through each step
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-blue-900" />
            Secure and confidential process
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-blue-900" />
            Connect with verified professionals
          </li>
        </ul>

        <button className="w-full border py-2 rounded-lg">
          Learn More
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Case Details</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Case Summary (in plain language)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Briefly describe your situation..."
              className="w-full border rounded-lg p-2 mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Focus on clarity and key facts. Avoid legal jargon.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">
              Case Type
            </label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Select case type</option>
              <option value="Family">Family</option>
              <option value="Property">Property</option>
              <option value="Criminal">Criminal</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Expertise Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tags.includes(tag)
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-lg"
          >
            Submit Case
          </button>
        </form>
      </div>
    </div>
  );
}