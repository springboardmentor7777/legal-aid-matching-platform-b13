import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "./Navbar";

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

const PAGE_SIZE = 6;

export default function ExternalDirectory() {
  const [lawyers, setLawyer] = useState<Lawyer[]>([]);
  const [ngos, setNgo] = useState<Ngos[]>([]);
  const [activeTab, setActiveTab] = useState<"Lawyers" | "Ngos">("Lawyers");
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  async function fetchLawyers() {
    const res = await fetch("http://localhost:8081/directory/external/lawyers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    const data = await res.json();
    setLawyer(data);
  }

  async function fetchNgos() {
    const res = await fetch("http://localhost:8081/directory/external/ngos", {
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

  useEffect(() => {
    setPage(1); // reset page on tab change
  }, [activeTab]);

  const data = activeTab === "Lawyers" ? lawyers : ngos;

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100">
      {children}
    </div>
  );

  const Badge = ({ text }: { text: string }) => (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        text === "true"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {text === "true" ? "Verified" : "Not Verified"}
    </span>
  );

  const LocationTag = ({ location }: { location: string }) => (
    <div className="mt-3 flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
      📍 <span>{location}</span>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar
        title="External Directory"
        name={user?.username || ""}
        role={user?.role || ""}
        toggleSidebar={() => {}}
      />

      <div className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 rounded-xl p-1">
            {["Lawyers", "Ngos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {activeTab === "Lawyers"
            ? paginatedData.map((lawyer: any) => (
                <Card key={lawyer.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {lawyer.name}
                    </h3>
                    <Badge text={lawyer.isVerified} />
                  </div>

                  <p className="text-sm text-gray-500 mb-1">
                    📧 {lawyer.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Expertise:</span>{" "}
                    {lawyer.expertise}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Experience:</span>{" "}
                    {lawyer.experience} years
                  </p>

                  <LocationTag location={lawyer.location} />
                </Card>
              ))
            : paginatedData.map((ngo: any) => (
                <Card key={ngo.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {ngo.name}
                    </h3>
                    <Badge text={ngo.isVerified} />
                  </div>

                  <p className="text-sm text-gray-500 mb-1">
                    📧 {ngo.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Organization:</span>{" "}
                    {ngo.organizationName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Service Area:</span>{" "}
                    {ngo.serviceLocation}
                  </p>

                  <LocationTag location={ngo.location} />
                </Card>
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No data available.
          </div>
        )}
      </div>
    </div>
  );
}
