// src/pages/EditCase.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import { LuSquareArrowLeft } from "react-icons/lu";
import PageTitle from "../components/PageTitle";

interface CaseFormData {
  title: string;
  description: string;
  location: string;
  currentStatus: string;

  personName: string;
  contactInfo: string;

  firNumber: string;
  firFile?: any;
}

const EditCase: React.FC = () => {
  const { user } = useAuth();
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState<CaseFormData>({
    title: "",
    description: "",
    location: "",
    currentStatus: "",
    personName: "",
    contactInfo: "",
    firNumber: "",
    firFile: null,
  });

  const [errors, setErrors] = useState<any>({});

  if (!user) return <Navigate to="/login" replace />;

  // ✅ Fetch existing case
  useEffect(() => {
    axios
      .get(`http://localhost:8081/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((res) => {
        const d = res.data;

        setFormData({
          title: d.title || "",
          description: d.description || "",
          location: d.location || "",
          currentStatus: d.currentStatus || "", // ✅ FIXED
          personName: d.personName || "",
          contactInfo: d.contactInfo || "",
          firNumber: d.firNumber || "",
          firFile: d.firFile || null,
        });

        setPageLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load case");
      });
  }, [caseId]);

  // ✅ Handle input
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Validation
  const validateStep = () => {
    const err: any = {};

    if (step === 1) {
      if (!formData.title) err.title = "Required";
      if (!formData.description) err.description = "Required";
      if (!formData.location) err.location = "Required";
    }

    if (step === 2) {
      if (formData.contactInfo && !/^\d{10}$/.test(formData.contactInfo)) {
        err.contactInfo = "Must be 10 digits";
      }
    }

    if (step === 3) {
      if (!formData.firNumber) err.firNumber = "Required";
    }

    return err;
  };

  const handleNext = () => {
    const err = validateStep();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  // ✅ Update API (FIXED)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateStep();
    if (Object.keys(err).length) return setErrors(err);

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8081/cases/${caseId}/update`,
        {
          ...formData,
          currentStatus: formData.currentStatus, // ✅ FIXED
          firFile:
            typeof formData.firFile === "string"
              ? formData.firFile
              : formData.firFile?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      );

      alert("Case updated successfully!");
      navigate("/mycases");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed"); // ✅ better debug
    }

    setLoading(false);
  };

  if (pageLoading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <><PageTitle title="Edit Case - Legal Aid Matching Platform" />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar
        title="Edit Case"
        name={user.username}
        role={user.role}
        toggleSidebar={() => {}}
      />

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-700 mb-4"
          >
            <LuSquareArrowLeft /> Back
          </button>

          {/* STEP INDICATOR */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                    step >= s ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  {s}
                </div>
                {s !== 3 && (
                  <div
                    className={`flex-1 h-1 ${
                      step > s ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3 className="text-xl font-semibold">Case Details</h3>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Case Title"
                  className="w-full p-3 border rounded-lg"
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg"
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg"
                />
                {errors.location && (
                  <p className="text-red-500">{errors.location}</p>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h3 className="text-xl font-semibold">Other Party Info</h3>

                <input
                  name="personName"
                  value={formData.personName}
                  onChange={handleChange}
                  placeholder="Person Name"
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Contact Info"
                  className="w-full p-3 border rounded-lg"
                />
                {errors.contactInfo && (
                  <p className="text-red-500">{errors.contactInfo}</p>
                )}
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h3 className="text-xl font-semibold">Evidence</h3>

                <input
                  name="firNumber"
                  value={formData.firNumber}
                  onChange={handleChange}
                  placeholder="FIR Number"
                  className="w-full p-3 border rounded-lg"
                />
                {errors.firNumber && (
                  <p className="text-red-500">{errors.firNumber}</p>
                )}

                {/* FILE INPUT */}
                <div className="flex gap-2 items-center">
                  <div className="flex-1 border rounded px-3 py-2 bg-gray-100 text-gray-700">
                    {formData.firFile
                      ? typeof formData.firFile === "string"
                        ? formData.firFile
                        : formData.firFile.name
                      : "No file chosen"}
                  </div>

                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Choose File
                    <input
                      type="file"
                      name="firFile"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Previous
                </button>
              )}

              {step <= 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg ml-auto hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg ml-auto"
                >
                  {loading ? "Updating..." : "Update Case"}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div></>
  );
};

export default EditCase;
