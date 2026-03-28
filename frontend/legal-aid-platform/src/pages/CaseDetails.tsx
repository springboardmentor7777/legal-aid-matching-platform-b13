import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

interface Case {
  additionalNotes: string;
  attachment: any;
  category: string;
  contactInfo: string;
  createdAt: string;
  currentStatus: string;
  customCategory: string;
  description: string;
  firFile: any;
  firNumber: string;
  id: number;
  incidentDate: string;
  incidentTime: string;
  legalDocuments: any;
  location: string;
  otherLocation: string;
  otherRepresentative: string;
  personName: string;
  status: string;
  subcategory: string;
  submittedBy: string;
  title: string;
  updatedAt: string;
}
const CaseDetails = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);

  // const selectItem = cases.find(cases => cases.id === numericId);
  const selectedCase = cases.find((c) => c.id === numericId);

  console.log(selectedCase);

  // console.log(selectItem, numericId);

  useEffect(() => {
    //
    const fetchAssigned = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/assigned", {
          headers: { Authorization: `Bearer ${localStorage.accessToken}` },
        });
        if (!res.ok) {
          setCases([]);
          return;
        }
        const data = await res.json();
        // console.log(data);
        setCases(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAssigned();
  }, []);
  return (
    <>
      <PageTitle title="Assigned Cases - Legal Aid Matching Platform" />
      <div className="flex min-h-screen bg-blue-50">
        {/* UNCHANGED: Sidebar */}
        <div className="hidden lg:block w-64">
          <Sidebar role={user?.role} isOpen={true} toggleSidebar={() => {}} />
        </div>

        <div className="flex-1 flex flex-col">
          {/* UNCHANGED: Navbar */}
          <Navbar
            title="Assigned Cases"
            name={user?.username || ""}
            role={user?.role || ""}
            toggleSidebar={() => {}}
          />

          <main className="px-6 py-6 flex-1">
            {/* UNCHANGED: Welcome banner */}
            {selectedCase ? (
              <div className="bg-white rounded-md shadow-lg p-5">
                <h1 className="text-blue-900 text-xl font-bold mb-2">
                  {selectedCase?.title}
                </h1>
                <p className="text-md text-gray-500">
                  personName:{" "}
                  <span className="text-blue-900">
                    {selectedCase.personName}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  submittedBy:{" "}
                  <span className="text-blue-900">
                    {selectedCase.submittedBy}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  additionalNotes:{" "}
                  <span className="text-blue-900">
                    {selectedCase.additionalNotes}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  attachment:{" "}
                  <span className="text-blue-900">
                    {selectedCase.attachment}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  {" "}
                  category:{" "}
                  <span className="text-blue-900">
                    {selectedCase.category}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  contactInfo:{" "}
                  <span className="text-blue-900">
                    {selectedCase.contactInfo}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  createdAt:{" "}
                  <span className="text-blue-900">
                    {selectedCase.createdAt}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  currentStatus:{" "}
                  <span className="text-blue-900">
                    {selectedCase.currentStatus}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  customCategory:{" "}
                  <span className="text-blue-900">
                    {selectedCase.customCategory}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  description:{" "}
                  <span className="text-blue-900">
                    {selectedCase.description}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  firFile:{" "}
                  <span className="text-blue-900">
                    {selectedCase.firFile}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  firNumber:{" "}
                  <span className="text-blue-900">
                    {selectedCase.firNumber}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  incidentDate:{" "}
                  <span className="text-blue-900">
                    {selectedCase.incidentDate}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  incidentTime:{" "}
                  <span className="text-blue-900">
                    {selectedCase.incidentTime}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  legalDocuments:{" "}
                  <span className="text-blue-900">
                    {selectedCase.legalDocuments}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  location:{" "}
                  <span className="text-blue-900">
                    {selectedCase.location}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  otherLocation:{" "}
                  <span className="text-blue-900">
                    {selectedCase.otherLocation}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  otherRepresentative:{" "}
                  <span className="text-blue-900">
                    {selectedCase.otherRepresentative}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  status:{" "}
                  <span className="text-blue-900">
                    {selectedCase.status}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  subcategory:{" "}
                  <span className="text-blue-900">
                    {selectedCase.subcategory}
                  </span>
                </p>
                <p className="text-md text-gray-500">
                  updatedAt:{" "}
                  <span className="text-blue-900">
                    {selectedCase.updatedAt}
                  </span>
                </p>
              </div>
            ) : (
              <p>no cases assigned</p>
            )}
          </main>

          {/* UNCHANGED: Footer */}
          <footer className="text-gray-500 flex justify-center items-center p-10 bg-blue-50">
            Legal Aid Matching Platform © 2026
          </footer>
        </div>
      </div>
    </>
  );
};

export default CaseDetails;
