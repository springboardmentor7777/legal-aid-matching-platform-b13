// src/pages/CaseSubmissionForm.tsx

import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import { LuSquareArrowLeft } from "react-icons/lu";
import PageTitle from "../components/PageTitle";

const Label = ({ children, required }: { children: string; required?: boolean }) => (
  <label className="block font-medium">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

interface CaseFormData {
  // STEP 1 - CASE DETAILS
  title: string;
  description: string;
  category: string;
  customCategory: string;
  subcategory: string;
  location: string;
  incidentDate?: string;
  incidentTime?: string;
  currentStatus: string;

  // STEP 2 - OTHER PARTY INFO
  personName: string;
  contactInfo: string;
  otherRepresentative: string;
  otherLocation: string;

  // STEP 3 - EVIDENCE
  firNumber: string;
  firFile?: File | null | any;
  legalDocuments?: File | null;
  attachment?: File | null;
  additionalNotes?: string;
}

const CaseSubmissionForm: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const caseCategories: Record<string, string[]> = {
    civil: ["Contract Dispute", "Property Dispute", "Consumer Complaint", "Defamation"],
    criminal: ["Theft", "Fraud", "Assault", "Robbery"],
    family: ["Divorce", "Child Custody", "Domestic Violence"],
    property: ["Illegal Possession", "Boundary Dispute"],
    cyber: ["Online Fraud", "Identity Theft", "Phishing"],
    employment: ["Wrongful Termination", "Workplace Harassment"],
    financial: ["Bank Fraud", "Loan Dispute"],
  };

  const [formData, setFormData] = useState<CaseFormData>({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    subcategory: "",
    location: "",
    incidentDate: "",
    incidentTime: "",
    currentStatus: "",

    personName: "",
    contactInfo: "",
    otherRepresentative: "",
    otherLocation: "",

    firNumber: "",
    firFile: null,
    legalDocuments: null,
    attachment: null,
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Partial<CaseFormData>>({});
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "CITIZEN") return <Navigate to="/dashboard" replace />;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
        customCategory: "",
      }));
    } else if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep = () => {
    const newErrors: Partial<CaseFormData> = {};
    const now = new Date();

    // STEP 1: Case Details
    if (step === 1) {
      if (!formData.title) newErrors.title = "Title required";
      if (!formData.description) newErrors.description = "Description required";
      if (!formData.category) newErrors.category = "Category required";
      if (formData.category === "other" && !formData.customCategory)
        newErrors.customCategory = "Write category";
      if (formData.category !== "other" && !formData.subcategory)
        newErrors.subcategory = "Subcategory required";
      if (!formData.location) newErrors.location = "Location required";
      if (!formData.incidentDate) newErrors.incidentDate = "Incident date required";
      else if (new Date(formData.incidentDate) > now)
        newErrors.incidentDate = "Incident date cannot be in the future";
      if (!formData.incidentTime) newErrors.incidentTime = "Incident time required";
      if (!formData.currentStatus) newErrors.currentStatus = "Select current status";
    }

    // STEP 2: Other Party Info
    if (step === 2) {
      if (!formData.personName) newErrors.personName = "Other party name required";
      if (formData.contactInfo && !/^\d{10}$/.test(formData.contactInfo))
        newErrors.contactInfo = "Mobile number must be 10 digits";
      if (!formData.otherRepresentative)
        newErrors.otherRepresentative = "Representative required";
      if (!formData.otherLocation) newErrors.otherLocation = "Representative location required";
    }

    // STEP 3: Evidence
    if (step === 3) {
      if (!formData.firNumber) newErrors.firNumber = "FIR number required";
      if (!formData.firFile) newErrors.firFile = "FIR document is mandatory";
    }

    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);

    const jsonData = {
      ...formData,
      firFile: formData.firFile?.name,
      legalDocuments: formData.legalDocuments?.name,
      attachment: formData.attachment?.name,
    };

    console.log("Submitting:", jsonData);

    await fetch("http://localhost:8081/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(jsonData),
    });

    setLoading(false);
    alert("Case submitted successfully!");
    window.location.href = '/dashboard';
  };

  return (
    <><PageTitle title="Case Submission Form - Legal Aid Matching Platform" />
    <div className="min-h-screen bg-blue-50">
      <Navbar title="Submit Case" name={user.username} role={user.role} toggleSidebar={() => { }} />

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 border-t-4 border-blue-900">
          <a href="/dashboard" className="flex items-center gap-1 text-blue-900 mb-4">
            <LuSquareArrowLeft /> Back to Dashboard
          </a>

          {/* STEP PROGRESS */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= s ? "bg-blue-900" : "bg-gray-300"
                    }`}
                >
                  {s}
                </div>
                {s !== 3 && <div className={`flex-1 h-1 ${step > s ? "bg-blue-900" : "bg-gray-300"}`}></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* STEP 1 - CASE DETAILS */}
            {step === 1 && (
              <>
                <h3 className="font-semibold text-lg">Case Details</h3>

                <Label className="block font-medium" required>Case Title</Label>
                <input
                  name="title"
                  placeholder="Case Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                <Label className="block font-medium" required>Case Description</Label>
                <textarea
                  name="description"
                  placeholder="Case Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                <Label className="block font-medium" required>Category</Label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(caseCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                  <option value="other">OTHER</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

                {formData.category === "other" && (
                  <>
                    <label className="block font-medium">Custom Category</label>
                    <input
                      name="customCategory"
                      placeholder="Write your category"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.customCategory && <p className="text-red-500 text-sm">{errors.customCategory}</p>}
                  </>
                )}

                {formData.category && formData.category !== "other" && (
                  <>
                    <Label className="block font-medium" required>Subcategory</Label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {caseCategories[formData.category].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}
                  </>
                )}

                <Label className="block font-medium" required>Location</Label>
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <label className="block font-medium">Incident Date</label>
                    <input
                      type="date"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                    {errors.incidentDate && <p className="text-red-500 text-sm">{errors.incidentDate}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">Incident Time</label>
                    <input
                      type="time"
                      name="incidentTime"
                      value={formData.incidentTime}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                    {errors.incidentTime && <p className="text-red-500 text-sm">{errors.incidentTime}</p>}
                  </div>
                </div>

                <Label className="block font-medium" required>Current Status</Label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="to_be_initiated">To be Initiated</option>
                </select>
                {errors.currentStatus && <p className="text-red-500 text-sm">{errors.currentStatus}</p>}
              </>
            )}

            {/* STEP 2 - OTHER PARTY INFO */}
            {step === 2 && (
              <>
                <h3 className="font-semibold text-lg">Other Party Information</h3>

                <Label className="block font-medium" required>Other Party Name</Label>
                <input
                  name="personName"
                  placeholder="Other Party Name"
                  value={formData.personName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.personName && <p className="text-red-500 text-sm">{errors.personName}</p>}

                <label className="block font-medium">Contact Number (Optional)</label>
                <input
                  name="contactInfo"
                  placeholder="10-digit mobile number"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.contactInfo && <p className="text-red-500 text-sm">{errors.contactInfo}</p>}

                <label className="block font-medium">Representative</label>
                <input
                  name="otherRepresentative"
                  placeholder="Representative Name"
                  value={formData.otherRepresentative}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.otherRepresentative && (
                  <p className="text-red-500 text-sm">{errors.otherRepresentative}</p>
                )}

                <label className="block font-medium">Representative Location</label>
                <input
                  name="otherLocation"
                  placeholder="Representative Location"
                  value={formData.otherLocation}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.otherLocation && <p className="text-red-500 text-sm">{errors.otherLocation}</p>}
              </>
            )}

            {/* STEP 3 - EVIDENCE */}
            {step === 3 && (
              <>
                <h3 className="font-semibold text-lg">Evidence & Documents</h3>

                <Label className="block font-medium" required>FIR Number</Label>
                <input
                  name="firNumber"
                  placeholder="FIR Number"
                  value={formData.firNumber}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.firNumber && <p className="text-red-500 text-sm">{errors.firNumber}</p>}

                <Label className="block font-medium" required>FIR Document</Label>
                <div className="flex gap-2">
                  <div className="flex-1 border rounded px-3 py-2 bg-gray-50">
                    {formData.firFile ? formData.firFile.name : "No file chosen"}
                  </div>
                  <label className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded">
                    Choose File
                    <input type="file" name="firFile" onChange={handleChange} className="hidden" required/>
                  </label>
                </div>
                {errors.firFile && <p className="text-red-500 text-sm">{errors.firFile}</p>}

                <label className="block font-medium mt-2">Legal Documents</label>
                <div className="flex gap-2">
                  <div className="flex-1 border rounded px-3 py-2 bg-gray-50">
                    {formData.legalDocuments ? formData.legalDocuments.name : "No file chosen"}
                  </div>
                  <label className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded">
                    Choose File
                    <input type="file" name="legalDocuments" onChange={handleChange} className="hidden" />
                  </label>
                </div>

                <label className="block font-medium mt-2">Other Evidence</label>
                <div className="flex gap-2">
                  <div className="flex-1 border rounded px-3 py-2 bg-gray-50">
                    {formData.attachment ? formData.attachment.name : "No file chosen"}
                  </div>
                  <label className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded">
                    Choose File
                    <input type="file" name="attachment" onChange={handleChange} className="hidden" />
                  </label>
                </div>

                <label className="block font-medium mt-2">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  placeholder="Additional Notes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-900 text-white px-4 py-2 rounded ml-auto"
                >
                  Next
                </button>
              )}

              {step === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-900 text-white px-4 py-2 rounded ml-auto"
                >
                  {loading ? "Submitting..." : "Submit Case"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div></>
  );
};

export default CaseSubmissionForm;
