import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";

interface Case {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/cases/my", {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  //  Edit Case
  const handleEditCase = (caseId?: number) => {
    if (!caseId) return;

    navigate(`/pages/EditCase/${caseId}`);
  };

  // ✅ Delete Case
  const handleDeleteCase = async (caseId?: number) => {
    if (!caseId) return;

    if (!window.confirm("Delete this case?")) return;

    try {
      await axios.delete(`http://localhost:8081/cases/${caseId}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      });

      setData((prev) => prev.filter((c) => c.id !== caseId));
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <><PageTitle title="My Cases - Legal Aid Matching Platform" />
    <div className="min-h-screen bg-blue-50">
      <Navbar
        title="My Cases"
        name={user?.username || ""}
        role={user?.role || "guest"}
        toggleSidebar={() => {}}
      />

      <div className="flex justify-center pt-5 pb-5">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">

          <h2 className="text-2xl font-bold bg-blue-600 text-white p-3 rounded">
            My Cases
          </h2>

          {data.length === 0 && (
            <p className="text-center mt-5 text-gray-500">No cases found</p>
          )}

          {data.map((Case) => (
            <div key={Case.id} className="border p-4 my-4 rounded bg-blue-50">
              <h3 className="font-semibold text-lg">{Case.title}</h3>

              <p>Contact: {Case.contactInfo}</p>
              <p>Description: {Case.description || "N/A"}</p>
              <p>Location: {Case.location || "N/A"}</p>
              <p>Status: {Case.status || "N/A"}</p>

              <div className="flex gap-3 mt-3">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEditCase(Case.id)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteCase(Case.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div></>
  );
}
