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
}

export default function LawyerDirectory() {
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("http://localhost:8081/directory/lawyers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const userData = data;
        setData(userData);
      });
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          title="Lawyers Directory"
          name={user?.username || "Guest"}
          toggleSidebar={() => {}}
        />
      </div>
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
              name="search"
              id="search"
              placeholder="Search by keywords"
              className="w-64 p-2 border border-gray-300 rounded-md mb-4 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Search
            </button>
          </div>
          {/* {data.map((lawyer: any) => (
            <div key={lawyer.id} className="border border-gray-300 rounded-md p-4 my-4">
              <h3 className="text-lg font-semibold">{lawyer.name}</h3>
              <p className="text-gray-700">Specialization: {lawyer.specialization}</p>
              <p className="text-gray-700">Experience: {lawyer.experience} years</p>
              <p className="text-gray-700">Location: {lawyer.location}</p>
            </div>
          ))} */}
          {data && data.map((lawyer: Lawyer) => (
            <div key={lawyer.id} className="border border-gray-300 rounded-md p-4 my-4 bg-blue-50">
              <h3 className="text-lg font-semibold">Name: {lawyer.name}</h3>
              <p className="text-gray-700">Email: {lawyer.email}</p>
              <p className="text-gray-700">Specialization: {lawyer.specialization || "N/A"}</p>
              <p className="text-gray-700">Experience: {lawyer.experience ? `${lawyer.experience} years` : "N/A"}</p>
              <p className="text-gray-700">Location: {lawyer.location || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-gray-500 justify-center items-center flex p-10 bg-blue-50">
        Legal Aid Matching platform @2026
      </footer>
    </div>
  );
}
