import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import RecentMatches from "../components/RecentMatches";
import MatchesOverTime from "../components/Rechart";

type Role = "CITIZEN" | "LAWYER" | "NGO" | "ADMIN";

interface Case {
  id: number;
  title: string;
  description: string;
  status?: string;
}

interface Appointment {
  caseTitle: string;
  date: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "ASSIGNED" | "PENDING" | "RESOLVED" | "APPOINTMENTS" | null
  >(null);

  const [cases, setCases] = useState<Case[]>([]);
  const [assignedCases, setAssignedCases] = useState<Case[]>([]);
  const [pendingCases, setPendingCases] = useState<Case[]>([]);
  const [resolvedCases, setResolvedCases] = useState<Case[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) return null;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchCitizenCases = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setCases([]);
          return;
        }

        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      } catch {
        setCases([]);
      }
    };

    const fetchAssigned = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setAssignedCases([]);
          return;
        }

        const data = await res.json();
        setAssignedCases(Array.isArray(data) ? data : []);
      } catch {
        setAssignedCases([]);
      }
    };

    const fetchPending = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setPendingCases([]);
          return;
        }

        const data = await res.json();
        setPendingCases(Array.isArray(data) ? data : []);
      } catch {
        setPendingCases([]);
      }
    };

    const fetchResolved = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/resolved", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setResolvedCases([]);
          return;
        }

        const data = await res.json();
        setResolvedCases(Array.isArray(data) ? data : []);
      } catch {
        setResolvedCases([]);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:8081/appointments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setAppointments([]);
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch {
        setAppointments([]);
      }
    };

    if (user.role === "CITIZEN") {
      fetchCitizenCases();
    }

    if (user.role === "LAWYER" || user.role === "NGO") {
      fetchAssigned();
      fetchPending();
      fetchResolved();
      fetchAppointments();
    }
  }, [user.role]);

  
  const handleAccept = async (matchId: number) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:8081/matches/${matchId}/accept`, {
        method: "PUT", // Changed from POST
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Match accepted successfully!");
        // Remove from pending list
        setPendingCases((prev) => prev.filter((c) => c.id !== matchId)); 
      } else {
        alert("Failed to accept match.");
      }
    } catch (error) {
      console.error("Error accepting match:", error);
    }
  };

  
  const handleDecline = async (matchId: number) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:8081/matches/${matchId}/reject`, {
        method: "PUT", // Changed from POST
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Match rejected.");
        // Remove from pending list
        setPendingCases((prev) => prev.filter((c) => c.id !== matchId));
      } else {
        alert("Failed to reject match.");
      }
    } catch (error) {
      console.error("Error rejecting match:", error);
    }
  };

  const totalCases = cases.length;
  const submittedCases = cases.filter((c) => c.status === "SUBMITTED").length;
  const matchedCases = cases.filter((c) => c.status === "MATCHED").length;

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="hidden lg:block w-64">
        <Sidebar role={user.role as Role} isOpen={true} toggleSidebar={() => {}} />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          title="Dashboard"
          name={user.username}
          role={user.role}
          toggleSidebar={toggleSidebar}
        />

        <main className="px-6 py-6 flex-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 mb-6">
            <h1 className="text-2xl font-bold text-blue-900">
              Welcome, {user.username}
            </h1>
          </div>

          {/* CITIZEN DASHBOARD */}
          {user.role === "CITIZEN" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900">
                  Total Cases
                </h3>
                <p className="text-3xl font-bold text-blue-700 mt-3">
                  {totalCases}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900">
                  Submitted Cases
                </h3>
                <p className="text-3xl font-bold text-blue-700 mt-3">
                  {submittedCases}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900">
                  Matched Cases
                </h3>
                <p className="text-3xl font-bold text-blue-700 mt-3">
                  {matchedCases}
                </p>
              </div>
            </div>
          )}

          {/* LAWYER / NGO DASHBOARD */}
          {(user.role === "LAWYER" || user.role === "NGO") && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div
                  onClick={() => setActiveSection("ASSIGNED")}
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer"
                >
                  <h3 className="text-sm font-semibold text-blue-900">
                    Assigned Cases
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">
                    {assignedCases.length}
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("PENDING")}
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer"
                >
                  <h3 className="text-sm font-semibold text-blue-900">
                    Pending Requests
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">
                    {pendingCases.length}
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("RESOLVED")}
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer"
                >
                  <h3 className="text-sm font-semibold text-blue-900">
                    Resolved Cases
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">
                    {resolvedCases.length}
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("APPOINTMENTS")}
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer"
                >
                  <h3 className="text-sm font-semibold text-blue-900">
                    Scheduled Appointments
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">
                    {appointments.length}
                  </p>
                </div>
              </div>

              {activeSection === "ASSIGNED" &&
                assignedCases.map((c) => (
                  <div key={c.id} className="bg-white p-4 mb-3 rounded shadow">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p>{c.description}</p>
                    <button
                      onClick={() => navigate(`/case/${c.id}`)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View Details
                    </button>
                  </div>
                ))}

              {activeSection === "PENDING" &&
                pendingCases.map((c) => (
                  <div key={c.id} className="bg-white p-4 mb-3 rounded shadow">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p>{c.description}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleAccept(c.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(c.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              <div className="grid grid-cols-3 gap-6">

              <div className="col-span-2">
                <RecentMatches />
              </div>

              <div>
                <MatchesOverTime />
              </div>

    </div>
        </>
          )}
           
            </>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <RecentMatches />
            </div>
            <div>
              <MatchesOverTime />
            </div>
          </div>
        </main>

        <footer className="text-gray-500 flex justify-center items-center p-10 bg-blue-50">
          Legal Aid Matching Platform © 2026
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;