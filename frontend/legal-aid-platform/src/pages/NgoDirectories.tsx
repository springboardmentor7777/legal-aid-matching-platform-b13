import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";

interface Ngo {
  id?: number;
  name?: string;
  email?: string;
  location?: string;
  organizationName?: string;
  serviceArea?: string;
  // allow any other fields your backend may send
  // [key: string]: any;
}

type locationStatus = "NONE";

export default function NgoDirectories() {
  const {user} = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<locationStatus | "select location">(
    "select location",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [profiles, setProfiles] = useState<Ngo[]>([]);
  const [data, setData] = useState<any>(null);

  const profilesPerPage = 5;

  // === NORMALIZE FILTER (trim + lowercase) ===
  const normalizedFilter = (filter ?? "")
    .toString()
    .trim()
    .toLowerCase();

  // === FILTER + SEARCH (NULL-SAFE, TRIMMED, CASE-INSENSITIVE) ===
  const filteredCases = profiles
    .filter((n) => {
      // if no meaningful filter selected, include all
      if (!normalizedFilter || normalizedFilter === "select location") return true;

      // prefer location, fallback to serviceArea
      const rawLocation = (n.location ?? n.serviceArea ?? "") as string;
      const ngoLocation = rawLocation.toString().trim().toLowerCase();

      // exact match OR partial match to handle "new delhi" vs "delhi"
      return (
        ngoLocation === normalizedFilter || ngoLocation.includes(normalizedFilter)
      );
    })
    .filter((n) => {
      const q = (search ?? "").toString().trim().toLowerCase();
      if (!q) return true;

      const name = (n.name ?? "").toString().toLowerCase();
      const location = (n.location ?? n.serviceArea ?? "").toString().toLowerCase();
      const email = (n.email ?? "").toString().toLowerCase();
      const org = (n.organizationName ?? "").toString().toLowerCase();
      const serviceArea = (n.serviceArea ?? "").toString().toLowerCase();

      return (
        name.includes(q) ||
        location.includes(q) ||
        email.includes(q) ||
        org.includes(q) ||
        serviceArea.includes(q)
      );
    });

  // === PAGINATION ===
  const totalPages = Math.ceil(filteredCases.length / profilesPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage,
  );

  // === FETCH ===
  useEffect(() => {
    // Replace this with your actual API endpoint
    fetch("http://localhost:8081/api/v1/directory/ngos",{
      headers:{
        Authorization:`Bearer ${localStorage.accessToken}`
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setProfiles(resData || []); // populate profiles so filters & pagination work
      })
      .catch(() => {
        setData([]);
        setProfiles([]);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar title="ngo directory" name={user?.username || ""} toggleSidebar={()=>{}} />

      <div className="min-h-screen bg-blue-50 flex pt-20 justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col">
          <div className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-md p-3">
            <h2 className="text-2xl font-bold text-white">NGOs Directory</h2>
          </div>

          {/* SEARCH + FILTER (UI preserved) */}
          <div className="mt-6 flex items-center gap-4 justify-center">
            <input
              type="text"
              placeholder="Search by keywords"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
            <button
              onClick={() => setCurrentPage(1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as locationStatus | "select location");
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-2 ml-4"
            >
              <option value="select location">select location</option>
              <option value="MUMBAI">Mumbai</option>
              <option value="DELHI">Delhi</option>
              <option value="HYDERABAD">Hyderabad</option>
              <option value="NOIDA">Noida</option>
            </select>
          </div>

          {/* NGO CARD LIST (PAGINATED) */}
          {paginatedCases &&
            paginatedCases.map((ngo, idx) => (
              <div
                key={ngo.id ?? idx}
                className="border border-gray-300 rounded-md p-4 my-4 bg-blue-50"
              >
                <h3 className="text-lg font-semibold">Name: {ngo.name ?? "N/A"}</h3>
                <p className="text-gray-700">Email: {ngo.email ?? "N/A"}</p>
                <p className="text-gray-700">
                  Service area: {ngo.serviceArea ?? "N/A"}
                </p>
                <p className="text-gray-700">
                  Organization: {ngo.organizationName ?? "N/A"}
                </p>
                <p className="text-gray-700">Location: {ngo.serviceArea ?? "N/A"}</p>
              </div>
            ))}

          {/* Empty state */}
          {paginatedCases.length === 0 && (
            <div className="border border-gray-200 rounded-md p-6 my-4 bg-white text-center text-gray-600">
              No NGOs found.
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-gray-500 justify-center items-center flex p-10 bg-blue-50">
        Legal Aid Matching platform @2026
      </footer>
    </div>
  );
}