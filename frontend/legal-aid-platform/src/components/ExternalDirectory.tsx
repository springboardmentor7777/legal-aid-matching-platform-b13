import { useEffect, useState } from "react";

// Example interfaces (replace with your actual data structures)
// interface InternalLawyer { id: number; name: string; internalId: string; }
interface Lawyer {
  id: number;
  name: string;
  email: string;
  expertise: string;
  experience: number;
  location: string;
  isVerified: string;
}
interface Ngos {
  id: number;
  name: string;
  email: string;
  organizationName: string;
  location: string;
  serviceLocation: string;
  isVerified: string;
}

export default function ExternalDirectory() {
  const [lawyers, setlawyer] = useState<Lawyer[]>([]);
  const [ngos, setNgo] = useState<Ngos[]>([]);

  async function fetchLawyers() {
    const res = await fetch(
      "http://localhost:8081/directory/external/lawyers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      },
    );
    const data = await res.json();
    setlawyer(data);
  }

  async function fetchNgos() {
    const res = await fetch("http://localhost:8081/directory/external/ngos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    const data = await res.json();
    setNgo(data);
  }

  useEffect(() => {
    fetchLawyers();
    fetchNgos();
  }, []);
  // 2. THE NEW STATE: Tracks which button is currently clicked
  // We use a union type string here to enforce it can only be one of these two values
  const [activeTab, setActiveTab] = useState<"Lawyers" | "Ngos">("Lawyers");
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 3. THE TOGGLE BUTTONS */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("Lawyers")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "Lawyers"
                ? "bg-white text-blue-600 shadow-sm" // Active styling
                : "text-gray-600 hover:text-gray-900" // Inactive styling
            }`}
          >
            Lawyers
          </button>

          <button
            onClick={() => setActiveTab("Ngos")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "Ngos"
                ? "bg-white text-blue-600 shadow-sm" // Active styling
                : "text-gray-600 hover:text-gray-900" // Inactive styling
            }`}
          >
            Ngos
          </button>
        </div>
      </div>

      {/* 4. CONDITIONAL RENDERING: Show data based on the activeTab */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {activeTab === "Lawyers" ? (
          // --- RENDER INTERNAL DATA HERE ---
          <div>
            <h2 className="text-lg font-bold mb-4 text-white bg-blue-400 p-2 rounded-md">
              External Lawyers
            </h2>
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="p-2 shadow-lg m-2 rounded-md">
                <p>Name: {lawyer.name}</p>
                <p>Email: {lawyer.email}</p>
                <p>Expertise: {lawyer.expertise}</p>
                <p>Experience: {lawyer.experience} years</p>
                <p>Location: {lawyer.location}</p>
                <p>Verified: {lawyer.isVerified}</p>
              </div>
            ))}
          </div>
        ) : (
          // --- RENDER EXTERNAL DATA HERE ---
          <div>
            <h2 className="text-lg font-bold mb-4 text-white bg-blue-400 p-2 rounded-md">
              External Ngos
            </h2>
            {ngos.map((ngo) => (
              <div key={ngo.id} className="p-2 shadow-lg m-2 rounded-md">
                <p>Name: {ngo.name}</p>
                <p>Email: {ngo.email}</p>
                <p>Expertise: {ngo.organizationName}</p>
                <p>Experience: {ngo.serviceLocation}</p>
                <p>Location: {ngo.location}</p>
                <p>Verified: {ngo.isVerified}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
