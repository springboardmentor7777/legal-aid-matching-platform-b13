import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

interface Case {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  incidentDate?: string;
  incidentTime?: string;
  additionalNotes?: string;
  contactInfo?: string;
  attachment?: any;
}

export default function Mycase() {
  const { user } = useAuth();
  const [data, setData] = useState<Case[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/cases/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  // --- NEW: Generate Matches Handler ---
  const handleGenerateMatches = async (caseId?: number) => {
    if (!caseId) return;

    try {
      await axios.post(
        `http://localhost:8081/matches/generate/${caseId}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      );
      alert("AI generation triggered successfully!");
    } catch (error) {
      console.error("Error generating matches:", error);
      alert("Failed to trigger match generation.");
    }
  };

  // --- NEW: Delete Case Handler ---
  const handleDeleteCase = async (caseId?: number) => {
    if (!caseId) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this case?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8081/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      });
      
      alert("Case deleted successfully!");
      
      // Remove the deleted case from the UI instantly
      setData((prevData) => prevData.filter((c) => c.id !== caseId));
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("There was a problem deleting the case. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar
        title="my cases"
        name={user?.username || ""}
        role={user?.role || "guest"}
        toggleSidebar={() => {}}
      />
      <div className="min-h-screen bg-blue-50 flex pt-5 pb-5 justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col">
          <div className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-md p-3">
            <h2 className="text-2xl font-bold text-white">My cases</h2>
          </div>
          <div className="">
            {data &&
              data.map((Case: Case) => (
                <div
                  key={Case.id}
                  className="border border-gray-300 rounded-md p-4 my-4 bg-blue-50"
                >
                  <h3 className="text-lg font-semibold">{Case.title}</h3>
                  <p className="text-gray-700">contact: {Case.contactInfo}</p>
                  <p className="text-gray-700">
                    description: {Case.description || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    location: {Case.location || "N/A"}
                  </p>
                  <p className="text-gray-700">status: {Case.status || "N/A"}</p>
                  <p className="text-gray-700">
                    additional note: {Case.additionalNotes || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    category: {Case.category || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    attachments: {Case.attachment || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    incident time: {Case.incidentTime || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    incident date: {Case.incidentDate || "N/A"}
                  </p>
                  <div className="flex gap-3 mt-3">
                    {/* --- NEW: onClick Handlers --- */}
                    <button 
                      className="rounded-md bg-blue-500 hover:bg-blue-600 text-white p-2 transition-colors"
                      onClick={() => handleGenerateMatches(Case.id)}
                    >
                      generate
                    </button>
                    <button 
                      className="rounded-md bg-red-500 hover:bg-red-600 text-white p-2 transition-colors"
                      onClick={() => handleDeleteCase(Case.id)}
                    >
                      delete case
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}