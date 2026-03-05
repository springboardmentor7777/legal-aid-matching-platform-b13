import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export default function CaseSubmission() {
  const [summary, setSummary] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const payload = {
      summary,
      caseType: type,
      expertiseTags: tags,
    };

    await axios.post(`${API_URL}/cases`, payload);

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow max-w-2xl"
    >
      <h2 className="text-xl font-semibold mb-4">
        Case Details
      </h2>

      <textarea
        required
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Briefly describe your situation..."
        className="w-full border rounded-lg p-3 mb-4"
      />

      <select
        required
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      >
        <option value="">Select Case Type</option>
        <option value="Family">Family</option>
        <option value="Criminal">Criminal</option>
      </select>

      <div className="flex flex-wrap gap-2 mb-4">
        {tagOptions.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              tags.includes(tag)
                ? "bg-blue-50 text-blue-900"
                : "bg-gray-100"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-900 text-white px-6 py-2 rounded-lg"
      >
        {isLoading ? "Submitting..." : "Submit Case"}
      </button>
    </form>
  );
}