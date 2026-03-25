import { useFetcher, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);

  //  Availability state
  // const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:8081/profile/me", {
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

        //  Sync from backend
        // setIsAvailable(userData?.isAvailable || false);
      });
  }, []);

  console.log(data);
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <nav className="bg-white p-5 shadow-lg flex items-center justify-between border-blue-100 border-b fixed top-0 left-0 right-0 z-50">
          <div className="text-blue-900 font-bold text-2xl">
            Profile | <span>Legal Aid Matching Platform</span>
          </div>
          <div className="flex gap-5">
            <a
              href={user?.role !== "ADMIN" ? "/dashboard" : "/admin"}
              className="p-2 text-blue-900 rounded-lg border border-blue-900 hover:bg-blue-900 hover:text-white transition"
            >
              Dashboard
            </a>
            <a
              href="/"
              className="bg-red-500 p-2 text-white rounded-lg"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </a>
          </div>
        </nav>
      </div>

      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="flex justify-center items-start gap-1">
          <section className="flex-1">
            <div className="ml-[5rem]">
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
                <h1 className="text-[50px] font-bold text-blue-900 mb-4">
                  Welcome, <br />
                  <span>{data?.name}!</span>
                </h1>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    Personal Information
                  </h3>
                  <p className="text-gray-700">
                    Name: {data?.name} (<span>{user?.role?.toLowerCase()}</span>
                    )
                  </p>
                  <p className="text-gray-700">
                    Email: {user?.email || "Not available"}
                  </p>
                  <p className="text-gray-700">
                    Profile Status:{" "}
                    {data?.is_verified ? "Verified" : "Not Verified"}
                  </p>
                </div>

                <div>
                  {data?.role === "LAWYER" && (
                    <h1 className="text-2xl text-blue-900 pt-10">
                      Professional Information
                    </h1>
                  )}
                  {data?.role === "NGO" && (
                    <h1 className="text-2xl text-blue-900 pt-10">
                      NGO Information
                    </h1>
                  )}

                  <hr className="border-t border-blue-200 my-4" />

                  <div>
                    {data?.role === "LAWYER" && (
                      <div className="text-blue-900">
                        profession: {data?.role}
                        <br />
                        specialization: {data?.specialization || "N/A"}
                        <br />
                        experience:{" "}
                        {data?.experience ? `${data.experience} years` : "N/A"}
                        <br />
                        location: {data?.location || "N/A"}
                        {/*Availability Toggle  */}
                        <div className="mt-4">
                          {/* <button
                            onClick={() => {}}
                            className={`px-4 py-2 rounded-lg text-white ${
                              data?.isAvailable
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          >
                            {data?.isAvailable ? "Available" : "Not Available"}
                          </button> */}
                          <div
                            className={`px-4 py-2 items-center justify-center rounded-lg text-white ${
                              data?.isAvailable ? "bg-green-500" : "bg-gray-500"
                            }`}
                          >
                            {data?.isAvailable ? (
                              <span>Available</span>
                            ) : (
                              <span>Not Available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {data?.role === "NGO" && (
                      <div className="text-blue-900">
                        role: {data?.role}
                        <br />
                        organization name: {data?.organizationName || "N/A"}
                        <br />
                        service area: {data?.serviceArea || "N/A"}
                        <br />
                        location: {data?.location || "N/A"}
                        {/* Availability Toggle  */}
                        <div className="mt-4">
                          <div
                            className={`px-4 py-2 items-center justify-center rounded-lg text-white ${
                              data?.isAvailable ? "bg-green-500" : "bg-gray-500"
                            }`}
                          >
                            {data?.isAvailable ? (
                              <span>Available</span>
                            ) : (
                              <span>Not Available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* side panel */}
          <div className="ml-3">
            <aside className="bg-white w-64 p-5 mt-10 text-white rounded-lg shadow-lg mr-[7rem]">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Quick Actions
              </h3>
              <hr className="border-t border-blue-200 my-4" />
              <ul className="space-y-3">
                <li>
                  <a
                    href="/profile/edit"
                    className="block hover:bg-gray-200 text-blue-900 p-2 rounded-lg"
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block hover:bg-gray-200 text-blue-900 p-2 rounded-lg"
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </aside>

            <aside className="bg-white w-64 p-5 mt-10 text-white rounded-lg shadow-lg mr-[7rem]">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Need Support?
              </h3>
              <hr className="border-t border-blue-200 my-4" />
              <ul className="space-y-3">
                <li>
                  <a
                    href="/support"
                    className="block hover:bg-gray-200 text-blue-900 p-2 rounded-lg"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="block hover:bg-gray-200 text-blue-900 p-2 rounded-lg"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/help-center"
                    className="block hover:bg-gray-200 text-blue-900 p-2 rounded-lg"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
              <a href="" className="text-blue-900 cursor-pointer mt-10">
                support@legalaid.com
              </a>
              <p className="text-gray-500 text-sm">24x7 Support Available</p>
            </aside>
          </div>
        </div>
      </div>

      <footer className="text-gray-500 justify-center items-center flex p-10 bg-gray-100">
        Legal Aid Matching platform @2026
      </footer>
    </div>
  );
}
