// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";

/* ================= TYPES ================= */

export type Role = "CITIZEN" | "LAWYER" | "NGO" | "ADMIN";
export type CaseStatus = "SUBMITTED" | "IN_REVIEW" | "MATCHED";

interface CitizenCase {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: CaseStatus;
  lawyer?: {
    name: string;
    email: string;
  };
}

/* ================= STATUS BADGE ================= */

const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const styles: Record<CaseStatus, string> = {
    SUBMITTED: "bg-yellow-100 text-yellow-800",
    IN_REVIEW: "bg-blue-100 text-blue-800",
    MATCHED: "bg-green-100 text-green-800",
  };

  const labels: Record<CaseStatus, string> = {
    SUBMITTED: "Submitted",
    IN_REVIEW: "In Review",
    MATCHED: "Matched",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

/* ================= STAT CARD ================= */

const StatCard: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => (
  <div className="bg-white p-4 rounded-xl shadow border border-blue-100">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-blue-700 mt-1">{value}</p>
  </div>
);

/* ================= DASHBOARD ================= */

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* ================= FILTER & SEARCH STATES ================= */
  const [filter, setFilter] = useState<CaseStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 2; // adjust per page

  if (!user) return null;

  /* ================= MOCK CASES ================= */
  const mockCases: CitizenCase[] = [
    {
      id: "1",
      title: "Property Dispute",
      description: "Land ownership conflict with neighbor",
      createdAt: "2026-02-20",
      status: "SUBMITTED",
    },
    {
      id: "2",
      title: "Unpaid Salary Complaint",
      description: "Employer has not paid 2 months salary",
      createdAt: "2026-02-10",
      status: "IN_REVIEW",
    },
    {
      id: "3",
      title: "Domestic Violence Support",
      description: "Seeking legal protection",
      createdAt: "2026-01-25",
      status: "MATCHED",
      lawyer: {
        name: "Adv. Priya Sharma",
        email: "priya@lawhelp.com",
      },
    },
  ];

  /* ================= SUMMARY COUNTS ================= */
  const totalCases = mockCases.length;
  const submittedCount = mockCases.filter((c) => c.status === "SUBMITTED").length;
  const reviewCount = mockCases.filter((c) => c.status === "IN_REVIEW").length;
  const matchedCount = mockCases.filter((c) => c.status === "MATCHED").length;

  /* ================= FILTER + SEARCH + PAGINATION ================= */
  const filteredCases = mockCases
    .filter((c) => (filter === "ALL" ? true : c.status === filter))
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );

  /* ================= OTHER ROLE CARDS ================= */
  const cardsByRole: Record<Role, string[]> = {
    CITIZEN: [],
    LAWYER: [
      "Assigned Cases",
      "Pending Requests",
      "Closed Cases",
      "Upcoming Hearings",
      "Clients",
      "Messages",
    ],
    NGO: [
      "Pending Cases",
      "Ongoing Cases",
      "Resolved Cases",
      "Partner Lawyers",
      "Funding Requests",
      "Reports",
    ],
    ADMIN: [
      "Total Users",
      "Active Users",
      "Total Cases",
      "Active Lawyers",
      "Pending Approvals",
      "System Reports",
    ],
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar role={user.role} isOpen={true} toggleSidebar={() => {}} />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <Sidebar
            role={user.role}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar title="Dashboard" name={user.username} toggleSidebar={toggleSidebar} />

        {/* Header */}
        <div className="bg-white p-6 m-6 rounded-2xl shadow-md border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-900">
            Welcome, {user.username}!
          </h1>
        </div>

        {/* ================= CITIZEN DASHBOARD ================= */}
        {user.role === "CITIZEN" ? (
          <main className="px-6 pb-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Cases" value={totalCases} />
              <StatCard title="Submitted" value={submittedCount} />
              <StatCard title="In Review" value={reviewCount} />
              <StatCard title="Matched" value={matchedCount} />
            </div>

            {/* Case Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
                <h2 className="text-xl font-bold text-blue-900">
                  My Submitted Cases
                </h2>

                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-3 py-2"
                  />

                  {/* Status Filter */}
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value as CaseStatus | "ALL");
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="ALL">All</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="MATCHED">Matched</option>
                  </select>

                  {/* Create Case Button */}
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                    onClick={() => navigate("/submitcase")}
                  >
                    + Create Case
                  </button>
                </div>
              </div>

              {/* Case List */}
              {paginatedCases.length === 0 ? (
                <p className="text-gray-500">No cases found.</p>
              ) : (
                <div className="space-y-4">
                  {paginatedCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="p-4 border rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-blue-800">
                          {caseItem.title}
                        </h3>
                        <StatusBadge status={caseItem.status} />
                      </div>

                      <p className="text-gray-600 text-sm mt-2">
                        {caseItem.description}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        Submitted on{" "}
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>

                      {caseItem.status === "MATCHED" && caseItem.lawyer && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm">
                          <p>
                            <strong>Assigned Lawyer:</strong> {caseItem.lawyer.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {caseItem.lawyer.email}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 mt-6">
              <h3 className="font-bold text-blue-900 mb-4">Recent Activity</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📝 Case submitted successfully</li>
                <li>🔎 Case moved to review</li>
                <li>⚖ Lawyer assigned to your case</li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-6">
              <h3 className="font-bold text-blue-900 mb-2">Need Assistance?</h3>
              <p className="text-sm text-gray-600">
                If your case is urgent, please contact support or upload additional
                documents for faster processing.
              </p>
              <button className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-lg">
                Contact Support
              </button>
            </div>
          </main>
        ) : (
          /* ================= OTHER ROLES ================= */
          <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(cardsByRole[user.role] || []).map((title) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-blue-900 text-sm font-semibold tracking-wide">
                  {title}
                </h3>
                <p className="text-3xl font-bold text-blue-700 mt-3">0</p>
              </div>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;