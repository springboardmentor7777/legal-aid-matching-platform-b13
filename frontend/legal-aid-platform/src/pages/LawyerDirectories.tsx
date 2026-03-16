
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

interface Lawyer {
  id: number;
  email: string;
  name: string;
  specialization: string;
  experience: number;
  location: string;
  isVerified: boolean;
  isAvailable: boolean;
}

type locationStatus = "NONE";

export default function LawyerDirectories() {
  const { user } = useAuth();
  const [search, setsearch] = useState("");
  const [filter, setFilter] = useState<locationStatus | "select location">(
    "select location",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [profiles, setProfiles] = useState<Lawyer[]>([]);

  const profilesperpage = 5;
  // const totalprofiles = profiles.length;

  const filteredCases = profiles
    .filter((c) =>
      filter === "select location"
        ? true
        : (c.location ?? "").toLowerCase() === filter.toLowerCase()
    )
    .filter(
      (c) =>
        (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.experience ?? "").toString().includes(search.toLowerCase()) ||
        (c.specialization ?? "").toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.ceil(filteredCases.length / profilesperpage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * profilesperpage,
    currentPage * profilesperpage,
  );

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/v1/directory/lawyers",{
      headers:{
        Authorization:`Bearer ${localStorage.accessToken}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const userData = data;
        setData(userData);
        setProfiles(userData); // <-- populate profiles for filtering/pagination
      });
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar title="lawyer directory" name={user?.username || ""} role={user?.role || "guest"} toggleSidebar={()=>{}} />
      <div className="min-h-screen bg-blue-50 flex pt-20 justify-center">
        {/* search bar */}
        {/* filters */}
        {/* Lawyer directory */}
        {/* pagenations */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col">
          <div className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-md p-3">
            <h2 className="text-2xl font-bold text-white">Lawyers Directory</h2>
            {/* <hr /> */}
          </div>
          <div className="mt-6 flex items-center gap-4 justify-center">
            <input
              type="text"
              placeholder="Search by keywords"
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as locationStatus | "select location");
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="select location">select location</option>
                <option value="MUMBAI">Mumbai</option>
                <option value="DELHI">Delhi</option>
                <option value="HYDERABAD">Hyderabad</option>
                <option value="NOIDA">Noida</option>
              </select>
            </div>
          </div>
          {/* {data.map((lawyer: any) => (
            <div key={lawyer.id} className="border border-gray-300 rounded-md p-4 my-4">
              <h3 className="text-lg font-semibold">{lawyer.name}</h3>
              <p className="text-gray-700">Specialization: {lawyer.specialization}</p>
              <p className="text-gray-700">Experience: {lawyer.experience} years</p>
              <p clas */}
          {!paginatedCases && (<p className="text-gray-400 text-md justify-center items-center">
            No data found
          </p>)}
          {paginatedCases &&
            paginatedCases.map((lawyer: Lawyer) => (
              <div
                key={lawyer.id}
                className="border border-gray-300 rounded-md p-4 my-4 bg-blue-50"
              >
                <h3 className="text-lg font-semibold">Name: {lawyer.name}</h3>
                <p className="text-gray-700">Email: {lawyer.email}</p>
                <p className="text-gray-700">
                  Specialization: {lawyer.specialization || "N/A"}
                </p>
                <p className="text-gray-700">
                  Experience:{" "}
                  {lawyer.experience ? `${lawyer.experience} years` : "N/A"}
                </p>
                <p className="text-gray-700">
                  Location: {lawyer.location || "N/A"}
                </p>
                <p className="text-gray-700">
                  Availability: {lawyer.isAvailable? "available":"unavailable"}
                </p>
              </div>
            ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
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