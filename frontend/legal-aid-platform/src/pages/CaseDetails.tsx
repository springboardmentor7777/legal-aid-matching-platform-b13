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

  const selectedCase = cases.find((c) => c.id === numericId);

  useEffect(() => {
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
        setCases(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAssigned();
  }, []);

  // 🔹 Reusable Field Component
  const Info = ({
    label,
    value,
    full = false,
  }: {
    label: string;
    value: any;
    full?: boolean;
  }) => (
    <div className={`${full ? "md:col-span-2" : ""}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-blue-900 font-medium break-words">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <>
      <PageTitle title="Assigned Cases - Legal Aid Matching Platform" />

      <div className="flex min-h-screen bg-blue-50">
        <div className="hidden lg:block w-64">
          <Sidebar role={user?.role} isOpen={true} toggleSidebar={() => {}} />
        </div>

        <div className="flex-1 flex flex-col">
          <Navbar
            title="Assigned Cases"
            name={user?.username || ""}
            role={user?.role || ""}
            toggleSidebar={() => {}}
          />

          <main className="px-6 py-6 flex-1">
            {selectedCase ? (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

                {/* Title */}
                <div className="border-b pb-3">
                  <h1 className="text-2xl font-bold text-blue-900">
                    {selectedCase.title}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Case ID: {selectedCase.id}
                  </p>
                </div>

                {/* Basic Info */}
                <section>
                  <h2 className="text-lg font-semibold text-blue-800 mb-3">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Person Name" value={selectedCase.personName} />
                    <Info label="Submitted By" value={selectedCase.submittedBy} />
                    <Info label="Contact Info" value={selectedCase.contactInfo} />
                    <Info label="Category" value={selectedCase.category} />
                    <Info label="Subcategory" value={selectedCase.subcategory} />
                    <Info label="Custom Category" value={selectedCase.customCategory} />
                  </div>
                </section>

                {/* Case Details */}
                <section>
                  <h2 className="text-lg font-semibold text-blue-800 mb-3">
                    Case Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Description" value={selectedCase.description} full />
                    <Info label="Additional Notes" value={selectedCase.additionalNotes} full />
                    <Info label="Status" value={selectedCase.status} />
                    <Info label="Current Status" value={selectedCase.currentStatus} />
                  </div>
                </section>

                {/* Incident Info */}
                <section>
                  <h2 className="text-lg font-semibold text-blue-800 mb-3">
                    Incident Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Date" value={selectedCase.incidentDate} />
                    <Info label="Time" value={selectedCase.incidentTime} />
                    <Info label="Location" value={selectedCase.location} />
                    <Info label="Other Location" value={selectedCase.otherLocation} />
                  </div>
                </section>

                {/* Legal Info */}
                <section>
                  <h2 className="text-lg font-semibold text-blue-800 mb-3">
                    Legal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="FIR Number" value={selectedCase.firNumber} />
                    <Info label="FIR File" value={selectedCase.firFile} />
                    <Info label="Legal Documents" value={selectedCase.legalDocuments} />
                    <Info label="Representative" value={selectedCase.otherRepresentative} />
                  </div>
                </section>

                {/* Metadata */}
                <section>
                  <h2 className="text-lg font-semibold text-blue-800 mb-3">
                    Metadata
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Created At" value={selectedCase.createdAt} />
                    <Info label="Updated At" value={selectedCase.updatedAt} />
                  </div>
                </section>

              </div>
            ) : (
              <p className="text-gray-500">No cases assigned</p>
            )}
          </main>

          <footer className="text-gray-500 flex justify-center items-center p-10 bg-blue-50">
            Legal Aid Matching Platform © 2026
          </footer>
        </div>
      </div>
    </>
  );
};

export default CaseDetails;
