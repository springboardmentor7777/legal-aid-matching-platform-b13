import { useState } from "react";
import API from "../api/axios";
import { Calendar, Clock, MapPin, FileText, X, CheckCircle } from "lucide-react";

export default function ScheduleModal({ matchId, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    appointmentDate: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/appointments", {
        matchId: parseInt(matchId),
        title: formData.title,
        description: formData.description,
        appointmentDate: formData.appointmentDate,
        location: formData.location,
      });
      setSuccess(true);
      setTimeout(() => {
        onCreated && onCreated();
        onClose && onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to create appointment", error);
      alert("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            <h2 className="font-bold text-lg">Schedule Appointment</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Appointment Scheduled!</h3>
            <p className="text-slate-500 text-sm mt-2">The other party has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input type="text" name="title" required value={formData.title}
                  onChange={handleChange} placeholder="e.g., Initial Consultation"
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date & Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input type="datetime-local" name="appointmentDate" required value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input type="text" name="location" value={formData.location}
                  onChange={handleChange} placeholder="Office / Court / Online"
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
              <textarea name="description" value={formData.description}
                onChange={handleChange} rows={3} placeholder="Any notes for the consultation..."
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm">
                {loading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
