import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/profile/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <>
      <PageTitle title="Profile - Legal Aid Matching Platform" />

      {/* Navbar */}
      <nav className="bg-white px-8 py-4 shadow-md flex items-center justify-between fixed w-full top-0 z-50">
        <h1 className="text-xl md:text-2xl font-bold text-blue-900">
          Profile | Legal Aid Matching Platform
        </h1>

        <div className="flex gap-3">
          <a
            href={user?.role !== "ADMIN" ? "/dashboard" : "/admin"}
            className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-900 hover:text-white transition"
          >
            Dashboard
          </a>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 pt-24 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Welcome, {data?.name} !
            </h1>

            {/* Personal Info */}
            <div className="bg-blue-50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Personal Information
              </h2>
              <p className="text-gray-700 text-lg">
                <strong>Name:</strong> {data?.name}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Role:</strong> {user?.role || "Not available"}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>

              {(data?.role === "LAWYER" || data?.role === "NGO") && (
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      data?.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data?.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </p>
              )}
            </div>

            {/* Professional / NGO Info */}
            
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                {data?.role === "LAWYER"
                  ? "Professional Information"
                  : data?.role === "NGO"
                  ? "NGO Information"
                  : ""}
              </h2>

              <div className="space-y-2 text-gray-700">
                {data?.role === "LAWYER" && (
                  <><div className="bg-blue-50 rounded-xl p-5 mb-6">
                    <p className="text-gray-700 text-lg"><strong>Profession:</strong> {data?.role}</p>
                    <p className="text-gray-700 text-lg"><strong>Specialization:</strong> {data?.specialization || "N/A"}</p>
                    <p className="text-gray-700 text-lg">
                      <strong>Experience:</strong>{" "}
                      {data?.experience ? `${data.experience} years` : "N/A"}
                    </p>
                    <p className="text-gray-700 text-lg"><strong>Location:</strong> {data?.location || "N/A"}</p>
                  </div></>
                )}

                {data?.role === "NGO" && (
                  <><div className="bg-blue-50 rounded-xl p-5 mb-6">
                    <p className="text-gray-700 text-lg"><strong>Role:</strong> {data?.role}</p>
                    <p className="text-gray-700 text-lg"><strong>Organization:</strong> {data?.organizationName || "N/A"}</p>
                    <p className="text-gray-700 text-lg"><strong>Service Area:</strong> {data?.serviceArea || "N/A"}</p>
                    <p className="text-gray-700 text-lg"><strong>Location:</strong> {data?.location || "N/A"}</p>
                  </div></>
                )}
              

              {/* Availability Badge (Professionals Only) */}
              {(data?.role === "LAWYER" || data?.role === "NGO") && (
                <div className="mt-6">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium ${
                      data?.isAvailable ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {data?.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Quick Actions
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/profile/edit"
                    className="block p-2 rounded-lg hover:bg-blue-50 text-blue-900"
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block p-2 rounded-lg hover:bg-blue-50 text-blue-900"
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Need Support?
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/support" className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="/faq" className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/help-center" className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900">
                    Help Center
                  </a>
                </li>
              </ul>

              <div className="mt-4 text-sm text-gray-500">
                support@legalaid.com
                <br />
                24x7 Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 bg-gray-100 mt-10">
        Legal Aid Matching Platform © 2026
      </footer>
    </>
  );
}
