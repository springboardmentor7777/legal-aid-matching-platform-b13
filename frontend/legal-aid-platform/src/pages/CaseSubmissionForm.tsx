// src/pages/CaseSubmissionForm.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

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

  // 🔐 Login required
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
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      // ✅ Prepare JSON data for backend
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
      };

      // 🔹 FOR NOW: just log it
      console.log("Data that will go to backend (JSON):", jsonData);
      await fetch(
        "http://localhost:8081/cases/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(jsonData),
        }
      ).finally(() => {
        setLoading(false);
        console.log("Case submission API call completed.");
      });


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
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          title="case submission"
          name={user?.username || "Guest"}
          toggleSidebar={() => {}}
        />
      </div>
      <div className="flex justify-center mt-10 w-full">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border-t-4 border-blue-900 pt-20">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Submit Your Case
          </h2>

          {successMessage && (
            <p className="text-green-600 mb-4">{successMessage}</p>
          )}
          {serverError && <p className="text-red-600 mb-4">{serverError}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              name="title"
              placeholder="Case Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Case Description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            {/* Category */}
            <select
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

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            {/* Date & Time */}
            <input
              type="date"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="time"
              name="incidentTime"
              value={formData.incidentTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            {/* File Upload */}
            <div className="flex gap-2">
              <div
                className={`flex-1 border rounded px-3 py-2 ${
                  formData.attachment ? "bg-gray-200" : "bg-white"
                }`}
              >
                {formData.attachment
                  ? formData.attachment.name
                  : "No file chosen"}
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

            {/* Contact */}
            <input
              type="text"
              name="contactInfo"
              placeholder="Contact Info"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            {/* Notes */}
            <textarea
              name="additionalNotes"
              placeholder="Additional Notes"
              rows={3}
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

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
    </div>
  );
};

export default CaseSubmissionForm;
