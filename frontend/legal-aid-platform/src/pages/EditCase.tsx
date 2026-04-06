import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { LuSquareArrowLeft } from "react-icons/lu";
import PageTitle from "../components/PageTitle";
import axios from "axios";

export default function EditCase() {
  const { user } = useAuth();
  const { caseId } = useParams(); // Gets the '56' from the URL
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Match this to the fields your CaseRequest DTO expects
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contactInfo: "",
  });

  // 1. Fetch the existing case data when the page loads
  useEffect(() => {
    axios
      .get(`http://localhost:8081/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${localStorage.accessToken}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          contactInfo: data.contactInfo || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load case details.");
      });
  }, [caseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Submit the updated data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/cases/${caseId}/update`, formData, {
        headers: { Authorization: `Bearer ${localStorage.accessToken}` },
      });
      // Send them back to their cases list when successful
      navigate("/mycases"); 
    } catch (err) {
      console.error(err);
      setError("Failed to update case.");
    }
  };

  return (
    <>
      <PageTitle title="Edit Case - Legal Aid Matching Platform" />
      <div>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            title="Edit Case"
            name={user?.username || "guest"}
            role={user?.role || ""}
            toggleSidebar={() => {}}
          />
        </div>
        <div className="min-h-screen bg-blue-50 flex pt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col m-auto">
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center font-mono mt-5">
                {error}
              </div>
            )}

            <button onClick={() => navigate("/mycases")} className="text-blue-900 mb-2 text-left flex items-center gap-1 hover:underline">
              <LuSquareArrowLeft /> Back to My Cases
            </button>
            
            <div className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-md p-3">
              <h2 className="text-2xl font-bold text-white">Edit Case #{caseId}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Case Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Contact Info</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}