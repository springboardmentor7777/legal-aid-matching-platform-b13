import Filters from "../components/Filters";
import MatchGrid from "../components/MatchGrid";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import PageTitle from "../components/PageTitle";

export default function MatchingResults() {
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // 🔹 Fetch Cases
  const fetchCases = async () => {
    try {
      console.log("📡 Calling /cases/my API...");

      const res = await axios.get("http://localhost:8081/cases/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("✅ Cases received:", res.data);
      setCases(res.data);
    } catch (err: any) {
      console.error("❌ Error fetching cases:", err.response?.data || err);
    }
  };

  // 🔹 Trigger when user loads
  useEffect(() => {
    if (!user) {
      console.log("⏳ Waiting for user...");
      return;
    }

    console.log("👤 User loaded:", user);
    fetchCases();
  }, [user]);

  // 🔹 Generate Matches
  const generateMatches = async (caseId: number | null) => {
    if (!caseId) {
      alert("Please select a case first");
      return;
    }

    console.log("🚀 Generating matches for caseId:", caseId);

    try {
      const res = await axios.post(
        `http://localhost:8081/matches/generate/${caseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Matches generated:", res.data);

      // trigger refresh of MatchGrid
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error(
        "❌ Error generating matches:",
        error.response?.data || error.message
      );
    }
  };

  // 🔹 Loading state
  if (loading) return <p className="p-6">Loading user...</p>;
  if (!user) return <p className="p-6">User not logged in</p>;

  return (
    <><PageTitle title="Matching Results - Legal Aid Matching Platform" />
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar role={user.role} isOpen={true} toggleSidebar={() => {}} />
      </div>

      {/* Mobile Sidebar */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <Navbar
          title="Matching Results"
          name={user.username}
          role={user.role}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-6">
          <div className="flex gap-6">

            {/*<Filters onApply={(filters) => setActiveFilters(filters)} />*/}
            <div className="flex-1">

              <h1 className="text-2xl font-bold mb-4 text-blue-900">
                Matching Profiles
              </h1>

              {/* 🔽 Dropdown */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Select Case:
                </label>

                <select
                  value={selectedCase ?? ""}
                  onChange={(e) =>
                    setSelectedCase(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full p-3 border rounded-md bg-white shadow-sm"
                >
                  <option value="">-- Select Case --</option>

                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empty state */}
              {cases.length === 0 && (
                <p className="text-gray-500 mb-4">
                  ⚠ No cases found OR API not working
                </p>
              )}

              {/* 🔘 Button */}
              <button
                onClick={() => generateMatches(selectedCase)}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate Matches
              </button>

              {/* Matches — FIX: pass selectedCase so MatchGrid only shows
                  matches for the chosen case, not all cases at once */}
              <MatchGrid
                refreshTrigger={refreshTrigger}
                selectedCaseId={selectedCase}
              />

            </div>
          </div>
        </main>
      </div>
    </div></>
  );
}
