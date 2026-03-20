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
  
  //  ADDED: State to track matches for Citizens
  const [citizenMatchCount, setCitizenMatchCount] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) return null;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 1. Fetch for Citizens (Raw Cases + Match Count)
    const fetchCitizenCases = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCases(Array.isArray(data) ? data : []);
        } else {
          setCases([]);
        }

        // THE FIX: Fetch matches to count how many cases successfully generated matches
        const matchRes = await fetch("http://localhost:8081/matches/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (matchRes.ok) {
          const matchData = await matchRes.json();
          const matchList = Array.isArray(matchData) ? matchData : [];
          
          // Use a Set to count unique cases that have at least one match!
          const uniqueMatchedCases = new Set(matchList.map((m: any) => m.caseId)).size;
          setCitizenMatchCount(uniqueMatchedCases);
        }

      } catch {
        setCases([]);
      }
    };

    // 2. Fetch for Lawyers & NGOs (Matches)
    const fetchLawyerNgoMatches = async () => {
      try {
        const res = await fetch("http://localhost:8081/matches/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setAssignedCases([]);
          setPendingCases([]);
          setResolvedCases([]);
          return;
        }

        const data = await res.json();
        const matchList = Array.isArray(data) ? data : [];

        const mappedMatches: Case[] = matchList.map((m: any) => ({
          id: m.id, 
          title: m.caseEntity?.title || `Legal Aid Request #${m.id}`,
          description: m.caseEntity?.description || "Review the details of this legal request.",
          status: m.status
        }));

        setAssignedCases(mappedMatches.filter((c) => c.status === "ASSIGNED" || c.status === "ACCEPTED"));
        setPendingCases(mappedMatches.filter((c) => c.status === "PENDING" || c.status === "SUBMITTED"));
        setResolvedCases(mappedMatches.filter((c) => c.status === "RESOLVED" || c.status === "COMPLETED"));
      } catch {
        setAssignedCases([]);
        setPendingCases([]);
        setResolvedCases([]);
      }
    };

    // 3. Fetch Appointments
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
      fetchLawyerNgoMatches();
      fetchAppointments();
    }
  }, [user.role]);

  const handleAccept = async (matchId: number) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:8081/matches/${matchId}/accept`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Match accepted successfully!");
        
        const acceptedMatch = pendingCases.find((c) => c.id === matchId);
        if (acceptedMatch) {
          setPendingCases((prev) => prev.filter((c) => c.id !== matchId));
          setAssignedCases((prev) => [...prev, { ...acceptedMatch, status: "ACCEPTED" }]);
        }
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
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Match rejected.");
        setPendingCases((prev) => prev.filter((c) => c.id !== matchId));
      } else {
        alert("Failed to reject match.");
      }
    } catch (error) {
      console.error("Error rejecting match:", error);
    }
  };

  const totalCases = cases.length;
  // This counts everything not marked as completely resolved/closed yet
  const submittedCases = cases.filter((c) => c.status === "SUBMITTED" || c.status === "PENDING" || !c.status).length;

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
                  {citizenMatchCount} {/*  Now it displays the real number! */}
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
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer hover:bg-blue-50 transition"
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
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer hover:bg-blue-50 transition"
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
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer hover:bg-blue-50 transition"
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
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 cursor-pointer hover:bg-blue-50 transition"
                >
                  <h3 className="text-sm font-semibold text-blue-900">
                    Scheduled Appointments
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">
                    {appointments.length}
                  </p>
                </div>
              </div>

              {/* EXPANDABLE SECTIONS */}
              {activeSection === "ASSIGNED" &&
                assignedCases.map((c) => (
                  <div key={c.id} className="bg-white p-4 mb-3 rounded-xl shadow border border-blue-50">
                    <h3 className="font-semibold text-blue-900">{c.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                    <button
                      onClick={() => navigate(`/chatpage/${c.id}`)}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition"
                    >
                      Secure Chat
                    </button>
                  </div>
                ))}

              {activeSection === "PENDING" &&
                pendingCases.map((c) => (
                  <div key={c.id} className="bg-white p-4 mb-3 rounded-xl shadow border border-blue-50">
                    <h3 className="font-semibold text-blue-900">{c.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleAccept(c.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
               {/* Citizens doesn't need to track the matches. Lawyers and NGOs need to track the matches as to track there progress */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <RecentMatches />
            </div>
            <div>
              <MatchesOverTime />
            </div>
          </div>
            </>
          )}

         
        </main>

        <footer className="text-gray-500 flex justify-center items-center p-10 bg-blue-50">
          Legal Aid Matching Platform © 2026
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
