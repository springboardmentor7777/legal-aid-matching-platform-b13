import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ScheduleModal from "../components/ScheduleModal";
import { Calendar, Clock, MapPin, User, Plus, CheckCircle, XCircle, CalendarDays } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("matchId");

  useEffect(() => {
    fetchAppointments();
    if (matchId) setShowModal(true);
  }, [matchId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments/my");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/appointments/${id}/update`, { status });
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment", error);
    }
  };

  const statusStyles = {
    SCHEDULED: "bg-blue-100 text-blue-800 border border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const upcoming = appointments.filter(a => a.status === 'SCHEDULED');
  const past = appointments.filter(a => a.status !== 'SCHEDULED');

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your scheduled consultations</p>
        </div>
        {matchId && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No appointments yet</p>
          <p className="text-slate-400 text-sm mt-1">Accept a match and schedule a consultation</p>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-4">
            {upcoming.map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg">{a.title || "Consultation"}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(a.appointmentDate)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {formatTime(a.appointmentDate)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {a.location || "TBD"}
                      </div>
                    </div>
                    {a.description && (
                      <p className="text-sm text-slate-500 mt-2">{a.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {a.citizenName}</span>
                      <span>↔</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {a.providerName}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => updateStatus(a.id, "COMPLETED")}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Mark Complete">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => updateStatus(a.id, "CANCELLED")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Cancel">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-400" /> Past ({past.length})
          </h2>
          <div className="space-y-3">
            {past.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-700">{a.title || "Consultation"}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusStyles[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(a.appointmentDate)} at {formatTime(a.appointmentDate)} — {a.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && matchId && (
        <ScheduleModal
          matchId={matchId}
          onClose={() => setShowModal(false)}
          onCreated={fetchAppointments}
        />
      )}
    </div>
  );
}
