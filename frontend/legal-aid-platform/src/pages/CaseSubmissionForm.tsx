// src/pages/CaseSubmissionForm.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // make sure this is correctly imported

interface CaseFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  incidentDate?: string;
  incidentTime?: string;
  attachment?: File | null;
  contactInfo?: string;
  additionalNotes?: string;
}

// 🔹 Temporary mock API call
const submitCase = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock submitted:", data);
      resolve({ message: "Case submitted successfully!" });
    }, 1500);
  });
};

const CaseSubmissionForm: React.FC = () => {
  const { user } = useAuth(); // get logged-in user

  const [formData, setFormData] = useState<CaseFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    incidentDate: "",
    incidentTime: "",
    attachment: null,
    contactInfo: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Partial<CaseFormData>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["civil", "criminal", "family", "property"];

  // 🔹 Redirect if user is not logged in or not a citizen
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "citizen") return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const newErrors: Partial<CaseFormData> = {};
    if (!formData.title.trim()) newErrors.title = "Case title is required.";
    if (!formData.description.trim())
      newErrors.description = "Case description is required.";
    else if (formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "attachment") {
      setFormData((prev) => ({ ...prev, attachment: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const dataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dataToSubmit.append(key, value as any);
        }
      });

      await submitCase(dataToSubmit);

      setSuccessMessage("Case submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        incidentDate: "",
        incidentTime: "",
        attachment: null,
        contactInfo: "",
        additionalNotes: "",
      });
    } catch (error) {
      setServerError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border-t-4 border-blue-900">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Submit Your Case</h2>

        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {serverError && <p className="text-red-600 mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Case Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Case Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Date of Incident</label>
            <input
              type="date"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block text-blue-900 font-semibold mb-1">Time of Incident</label>
            <input
              type="time"
              name="incidentTime"
              value={formData.incidentTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* File input with dynamic button */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Attachment</label>
            <div className="flex gap-2">
              <div
                className={`flex-1 border rounded px-3 py-2 ${
                  formData.attachment ? "bg-gray-200" : "bg-white"
                }`}
              >
                {formData.attachment ? formData.attachment.name : "No file chosen"}
              </div>
              <label className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                {formData.attachment ? "Choose Another File" : "Choose File"}
                <input
                  type="file"
                  name="attachment"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-blue-900 font-semibold mb-1">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Email or phone"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block text-blue-900 font-semibold mb-1">Additional Notes</label>
            <textarea
              name="additionalNotes"
              rows={3}
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Case"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaseSubmissionForm;