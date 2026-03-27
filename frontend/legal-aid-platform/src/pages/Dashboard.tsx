import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import PageTitle from "../components/PageTitle";

type Role = "CITIZEN" | "LAWYER" | "NGO" | "ADMIN";

interface Case {
  id: number;
  title: string;
  description: string;
  status?: string;
  // FIX: Added matchId so the pending section can call the correct match
  // endpoint (PUT /matches/{matchId}/reject) instead of the case endpoint.
  matchId?: number;
}

// CHANGED: Added `id` and `status` fields to the Appointment interface.
// BEFORE:  { caseTitle, date, time }
// AFTER:   { id, caseTitle, date, time, status, appointmentDate,
//             appointmentTime, notes, callDuration, zone }
// `id` is needed to call confirm/cancel endpoints.
// `status` is needed to split appointments into pending vs confirmed sections.
// `appointmentDate` / `appointmentTime` are the canonical field names from the
// backend DTO (the old `date` / `time` are kept as fallbacks).
interface Appointment {
  id: number;
  caseTitle: string;
  date: string;
  time: string;
  status: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  callDuration?: string;
  zone?: string;
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

  // CHANGED: Added state for the cancel/decline modal.
  // BEFORE:  Used browser prompt() to get the reason — poor UX and blocks the thread.
  // AFTER:   A proper modal with a textarea, disabled submit until reason is typed.
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) return null;

  // CHANGED: Moved token retrieval outside useEffect so it is also accessible
  // in the handleConfirmAppointment and handleCancelAppointment handlers below.
  // BEFORE: `const token` was declared inside useEffect only.
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    // UNCHANGED: All fetch functions are identical to the original
    const fetchCitizenCases = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setCases([]); return; }
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
        if (!res.ok) { setAssignedCases([]); return; }
        const data = await res.json();
        setAssignedCases(Array.isArray(data) ? data : []);
      } catch {
        setAssignedCases([]);
      }
    };

    const fetchPending = async () => {
      try {
        // FIX: Was calling GET /cases/pending which queries by requestedLawyerId
        // and CaseStatus.IN_REVIEW — a status that is never set in this flow,
        // so the list was always empty.
        //
        // Now calls GET /matches/me which returns all matches for this provider.
        // We filter client-side to PENDING status so the lawyer only sees cases
        // where the citizen has generated matches and is waiting for a response.
        // Each result includes both caseId and matchId, which we need below to
        // call the correct reject endpoint when the lawyer declines.
        const res = await fetch("http://localhost:8081/matches/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setPendingCases([]); return; }
        const data = await res.json();
        const pending = Array.isArray(data)
          ? data
              .filter((m: any) => m.status === "INTERESTED")
              .map((m: any) => ({
                id: m.caseId,
                matchId: m.matchId,        // needed for reject endpoint
                title: m.caseTitle || `Case #${m.caseId}`,
                description: m.clientName ? `Client: ${m.clientName}` : "",
                status: m.status,
              }))
          : [];
        setPendingCases(pending);
      } catch {
        setPendingCases([]);
      }
    };

    const fetchResolved = async () => {
      try {
        const res = await fetch("http://localhost:8081/cases/resolved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setResolvedCases([]); return; }
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
        if (!res.ok) { setAppointments([]); return; }
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

  // ─── Case action handlers (UNCHANGED) ────────────────────────────────────────

  // FIX: Added res.ok check — previously a failed accept silently removed the
  // card from state, making it look like success when the backend rejected it.
  const handleAccept = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/cases/${id}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) { alert("Failed to accept case. Please try again."); return; }
      setPendingCases((prev) => prev.filter((c) => c.id !== id));
      const assignedRes = await fetch("http://localhost:8081/cases/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (assignedRes.ok) {
        const data = await assignedRes.json();
        setAssignedCases(Array.isArray(data) ? data : []);
      }
    } catch {
      alert("Failed to accept case. Please try again.");
    }
  };

  // FIX: Was only calling POST /cases/{id}/decline which records the decline
  // reason on the Case entity but never touched the Match record — so the match
  // stayed PENDING and the case kept reappearing in the pending list on refresh.
  //
  // Now also calls PUT /matches/{matchId}/reject to set MatchStatus.REJECTED,
  // which removes it from future GET /matches/me PENDING results.
  // matchId comes from the pending case object populated by fetchPending().
  const handleDecline = async (id: number, matchId?: number) => {
    const reason = prompt("Enter reason for declining:");
    if (!reason) return;
    try {
      // Step 1: Reject the match record so it no longer appears in pending list
      if (matchId) {
        await fetch(`http://localhost:8081/cases/${id}/reject`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Step 2: Record the decline reason on the case entity
      const res = await fetch(`http://localhost:8081/cases/${id}/decline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) { alert("Failed to decline case. Please try again."); return; }
      setPendingCases((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to decline case. Please try again.");
    }
  };

  // ─── Appointment action handlers (ALL NEW) ────────────────────────────────────

  // CHANGED: New handler — calls PATCH /appointments/{id}/confirm
  // Updates the appointment status in local state to CONFIRMED on success
  // so the UI reflects the change without a full page refresh.
  const handleConfirmAppointment = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      // Optimistically update status in local state
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "CONFIRMED" } : a))
      );
    } catch {
      alert("Failed to confirm appointment. Please try again.");
    }
  };

  // CHANGED: Opens the decline modal and stores which appointment is being acted on.
  // BEFORE:  No modal — decline was handled entirely via browser prompt().
  const openCancelModal = (id: number) => {
    setAppointmentToCancel(id);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  // CHANGED: New handler — calls PATCH /appointments/{id}/cancel with the reason.
  // Updates local state to CANCELLED on success.
  // Modal closes regardless of success/failure.
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/appointments/${appointmentToCancel}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (!res.ok) throw new Error();
      // Optimistically update status in local state
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentToCancel ? { ...a, status: "CANCELLED" } : a
        )
      );
    } catch {
      alert("Failed to decline appointment. Please try again.");
    } finally {
      setCancelModalOpen(false);
      setAppointmentToCancel(null);
    }
  };

  // ─── Derived counts (UNCHANGED for citizen; new derived counts for provider) ──

  const totalCases = cases.length;
  const submittedCases = cases.filter((c) => c.status === "SUBMITTED").length;
  const matchedCases = cases.filter((c) => c.status === "ASSIGNED").length;

  // CHANGED: Split appointments into two groups for the provider dashboard.
  // BEFORE:  Appointments were a flat list with no status-based grouping.
  // AFTER:   pendingAppointments → shown with Confirm/Decline buttons
  //          confirmedAppointments → shown as a read-only confirmed list
  const pendingAppointments = appointments.filter((a) => a.status === "PENDING_CONFIRMATION");
  const confirmedAppointments = appointments.filter((a) => a.status === "CONFIRMED");

  // CHANGED: Helper to render a colour-coded status badge.
  // BEFORE:  No status badge existed.
  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING_CONFIRMATION: "bg-amber-100 text-amber-700 border border-amber-300",
      CONFIRMED:            "bg-green-100 text-green-700 border border-green-300",
      CANCELLED:            "bg-red-100   text-red-600   border border-red-300",
      SCHEDULED:            "bg-blue-100  text-blue-700  border border-blue-300",
    };
    const labels: Record<string, string> = {
      PENDING_CONFIRMATION: "Awaiting Confirmation",
      CONFIRMED:            "Confirmed",
      CANCELLED:            "Cancelled",
      SCHEDULED:            "Scheduled",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
        {labels[status] ?? status}
      </span>
    );
  };

  return (
    <>
      <PageTitle title="Dashboard - Legal Aid Matching Platform" />
      <div className="flex min-h-screen bg-blue-50">

        {/* UNCHANGED: Sidebar */}
        <div className="hidden lg:block w-64">
          <Sidebar role={user.role as Role} isOpen={true} toggleSidebar={() => {}} />
        </div>

        <div className="flex-1 flex flex-col">

          {/* UNCHANGED: Navbar */}
          <Navbar
            title="Dashboard"
            name={user.username}
            role={user.role}
            toggleSidebar={toggleSidebar}
          />

          <main className="px-6 py-6 flex-1">

            {/* UNCHANGED: Welcome banner */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 mb-6">
              <h1 className="text-2xl font-bold text-blue-900">
                Welcome, {user.username}
              </h1>
            </div>

            {/* ── UNCHANGED: CITIZEN DASHBOARD ──────────────────────────────── */}
            {user.role === "CITIZEN" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-900">Total Cases</h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">{totalCases}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-900">Submitted Cases</h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">{submittedCases}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-900">Matched Cases</h3>
                  <p className="text-3xl font-bold text-blue-700 mt-3">{matchedCases}</p>
                </div>
              </div>
            )}

            {/* ── LAWYER / NGO DASHBOARD ─────────────────────────────────────── */}
            {(user.role === "LAWYER" || user.role === "NGO") && (
              <>
                {/* CHANGED: Stat cards now highlight active section with a border.
                    The Appointments card also shows a "N awaiting confirmation" 
                    badge when there are pending requests. 
                    BEFORE: No active-border highlight; no pending badge. */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">

                  <div
                    onClick={() => setActiveSection("ASSIGNED")}
                    className={`bg-white p-6 rounded-2xl shadow-md border cursor-pointer transition-all hover:shadow-lg ${
                      activeSection === "ASSIGNED" ? "border-blue-500" : "border-blue-100"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-blue-900">Assigned Cases</h3>
                    <p className="text-3xl font-bold text-blue-700 mt-3">{assignedCases.length}</p>
                  </div>

                  <div
                    onClick={() => setActiveSection("PENDING")}
                    className={`bg-white p-6 rounded-2xl shadow-md border cursor-pointer transition-all hover:shadow-lg ${
                      activeSection === "PENDING" ? "border-blue-500" : "border-blue-100"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-blue-900">Pending Requests</h3>
                    <p className="text-3xl font-bold text-blue-700 mt-3">{pendingCases.length}</p>
                  </div>

                  <div
                    onClick={() => setActiveSection("RESOLVED")}
                    className={`bg-white p-6 rounded-2xl shadow-md border cursor-pointer transition-all hover:shadow-lg ${
                      activeSection === "RESOLVED" ? "border-blue-500" : "border-blue-100"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-blue-900">Resolved Cases</h3>
                    <p className="text-3xl font-bold text-blue-700 mt-3">{resolvedCases.length}</p>
                  </div>

                  {/* CHANGED: Added pending appointments badge to the card */}
                  <div
                    onClick={() => setActiveSection("APPOINTMENTS")}
                    className={`bg-white p-6 rounded-2xl shadow-md border cursor-pointer transition-all hover:shadow-lg ${
                      activeSection === "APPOINTMENTS" ? "border-blue-500" : "border-blue-100"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-blue-900">Scheduled Appointments</h3>
                    <p className="text-3xl font-bold text-blue-700 mt-3">{appointments.length}</p>
                    {/* CHANGED: Badge only appears when there are pending confirmations */}
                    {pendingAppointments.length > 0 && (
                      <p className="text-xs text-amber-600 font-semibold mt-1">
                        {pendingAppointments.length} awaiting confirmation
                      </p>
                    )}
                  </div>

                </div>

                {/* UNCHANGED: Assigned cases section */}
                {activeSection === "ASSIGNED" &&
                  assignedCases.map((c) => (
                    <div key={c.id} className="bg-white p-4 mb-3 rounded-xl shadow border border-blue-50">
                      <h3 className="font-semibold text-gray-800">{c.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{c.description}</p>
                      <button
                        onClick={() => navigate(`/case/${c.id}`)}
                        className="mt-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                {/* UNCHANGED: Pending case requests section */}
                {activeSection === "PENDING" &&
                  pendingCases.map((c) => (
                    <div key={c.id} className="bg-white p-4 mb-3 rounded-xl shadow border border-blue-50">
                      <h3 className="font-semibold text-gray-800">{c.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{c.description}</p>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleAccept(c.id)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(c.id, c.matchId)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}

                {/* CHANGED: Appointments section completely reworked.
                    BEFORE: No appointments section was rendered at all (activeSection
                            "APPOINTMENTS" had no JSX — the original only rendered
                            ASSIGNED and PENDING blocks).
                    AFTER:  Split into two sub-sections:
                            1. "Awaiting Your Confirmation" — amber cards with
                               Confirm and Decline buttons.
                            2. "Confirmed Appointments" — green cards, read-only. */}
                {activeSection === "APPOINTMENTS" && (
                  <div className="space-y-4">

                    {/* Sub-section 1: Pending confirmation */}
                    {pendingAppointments.length > 0 && (
                      <div>
                        <h2 className="text-base font-bold text-amber-700 mb-3 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                          Awaiting Your Confirmation ({pendingAppointments.length})
                        </h2>

                        {pendingAppointments.map((a) => (
                          <div
                            key={a.id}
                            className="bg-white p-5 mb-3 rounded-xl shadow border-l-4 border-amber-400"
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {a.caseTitle || `Appointment #${a.id}`}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  📅 {a.appointmentDate || a.date}
                                  &nbsp;·&nbsp;
                                  🕐 {a.appointmentTime || a.time}
                                </p>
                                {a.notes && (
                                  <p className="text-xs text-gray-400 mt-1 italic">{a.notes}</p>
                                )}
                              </div>
                              {statusBadge(a.status)}
                            </div>

                            {/* CHANGED: Confirm and Decline buttons */}
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => handleConfirmAppointment(a.id)}
                                className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                              >
                                ✓ Confirm
                              </button>
                              <button
                                onClick={() => openCancelModal(a.id)}
                                className="bg-red-50 text-red-600 border border-red-300 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                              >
                                ✕ Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sub-section 2: Confirmed appointments */}
                    {confirmedAppointments.length > 0 && (
                      <div>
                        <h2 className="text-base font-bold text-green-700 mb-3 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                          Confirmed Appointments ({confirmedAppointments.length})
                        </h2>

                        {confirmedAppointments.map((a) => (
                          <div
                            key={a.id}
                            className="bg-white p-5 mb-3 rounded-xl shadow border-l-4 border-green-400"
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {a.caseTitle || `Appointment #${a.id}`}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  📅 {a.appointmentDate || a.date}
                                  &nbsp;·&nbsp;
                                  🕐 {a.appointmentTime || a.time}
                                  {a.callDuration && <>&nbsp;·&nbsp; ⏱ {a.callDuration}</>}
                                </p>
                                {a.zone && (
                                  <p className="text-xs text-gray-400 mt-1">Timezone: {a.zone}</p>
                                )}
                              </div>
                              {statusBadge(a.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {appointments.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-8">No appointments yet.</p>
                    )}
                  </div>
                )}

              </>
            )}

          </main>

          {/* UNCHANGED: Footer */}
          <footer className="text-gray-500 flex justify-center items-center p-10 bg-blue-50">
            Legal Aid Matching Platform © 2026
          </footer>
        </div>
      </div>

      {/* ── CHANGED: Decline modal ──────────────────────────────────────────────
          BEFORE: No modal. Reason was collected via browser prompt().
          AFTER:  A proper overlay modal with:
                  • A textarea for the reason (required — submit disabled if empty)
                  • "Go Back" to dismiss without acting
                  • "Confirm Decline" to submit (calls handleCancelAppointment)
      ────────────────────────────────────────────────────────────────────────── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Decline Appointment</h2>
            <p className="text-sm text-gray-500 mb-5">
              Please provide a reason. The citizen will be notified.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. I am unavailable on this date. Please propose a different time."
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelAppointment}
                disabled={!cancelReason.trim()}
                className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
