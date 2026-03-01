// src/pages/CaseSubmissionForm.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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

const CaseSubmissionForm: React.FC = () => {
  const { user } = useAuth();

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

  // Login required
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "CITIZEN") return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const newErrors: Partial<CaseFormData> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    else if (formData.description.length < 10)
      newErrors.description = "Minimum 10 characters required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.location.trim())
      newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "attachment") {
      setFormData((prev) => ({
        ...prev,
        attachment: files ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      // Prepare JSON data for backend
      const jsonData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        incidentDate: formData.incidentDate,
        incidentTime: formData.incidentTime,
        attachment: formData.attachment ? formData.attachment.name : null,
        contactInfo: formData.contactInfo,
        additionalNotes: formData.additionalNotes,
        submittedBy: user.email,
      };

      console.log("Data that will go to backend (JSON):", jsonData);

      /*
      🔹 LATER WHEN CONNECTING BACKEND:
      await fetch("YOUR_BACKEND_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jsonData),
      });
      */

      setSuccessMessage("Case submitted successfully.");
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
            <label htmlFor="title" className="block font-medium text-gray-700 mb-1">
              Case Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter case title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Case Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter case description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Date & Time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="incidentDate" className="block font-medium text-gray-700 mb-1">
                Incident Date
              </label>
              <input
                id="incidentDate"
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="incidentTime" className="block font-medium text-gray-700 mb-1">
                Incident Time
              </label>
              <input
                id="incidentTime"
                type="time"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Attachment</label>
            <div className="flex gap-2">
              <div
                className={`flex-1 border rounded px-3 py-2 ${
                  formData.attachment ? "bg-gray-200" : "bg-white"
                }`}
              >
                {formData.attachment ? formData.attachment.name : "No file chosen"}
              </div>
              <label className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded">
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

          {/* Contact */}
          <div>
            <label htmlFor="contactInfo" className="block font-medium text-gray-700 mb-1">
              Contact Info
            </label>
            <input
              id="contactInfo"
              type="text"
              name="contactInfo"
              placeholder="Enter contact info"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Enter any additional notes"
              rows={3}
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Case"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaseSubmissionForm;