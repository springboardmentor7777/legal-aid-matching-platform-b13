import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

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
        const casedata = data;
        setData(casedata);
        // console.log(casedata);
      });
  }, []);

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
                    location:{" "}
                    {Case.location || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    status: {Case.status || "N/A"}
                  </p>
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
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
