import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageTitle from "../components/PageTitle";

interface AppointmentProps {
  initialScore?: number;
  providerName?: string;
}

export default function AppointmentScheduler({ initialScore, providerName }: AppointmentProps) {
  const { matchId } = useParams<{ matchId: string }>();
  const numericMatchId = Number(matchId);

  const [date, setDate] = useState("2026-03-20");
  const [timezone, setTimezone] = useState("IST");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState("30 mins");
  const [reminders, setReminders] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: providerName || "",
    role: "Lawyer",
    matchScore: initialScore?.toString() || "0",
  });

  const times = ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  // UNCHANGED: Fetch match details on mount to get latest provider name and score
  useEffect(() => {
    if (numericMatchId) {
      axios
        .get(`http://localhost:8081/matches/${numericMatchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          setProfile({
            name: res.data.providerName || providerName || "Legal Provider",
            role: "Lawyer",
            matchScore: res.data.score?.toString() || initialScore?.toString() || "0",
          });
        })
        .catch((err) => console.error("Error fetching match details:", err));
    }
  }, [numericMatchId, initialScore, providerName]);

  const handleSubmit = async () => {
    if (!selectedTime) {
      alert("Please select a time slot first.");
      return;
    }

    setLoading(true);

    const formattedSelectedTime = selectedTime.split(" ")[0];

    // UNCHANGED: Payload structure stays the same — backend handles status logic
    const appointmentPayload = {
      matchId: numericMatchId,
      appointmentDate: date,
      appointmentTime: selectedTime,
      notes: `Consultation regarding Case #${numericMatchId}`,
      callDuration: duration,
      reminder: reminders,
      zone: timezone,
      selectedTime: formattedSelectedTime,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/appointments",
        appointmentPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Success:", response.data);

      // CHANGED: Alert message now depends on the status returned by the backend.
      // BEFORE: Always showed "Appointment successfully scheduled! Check your dashboard."
      // AFTER:  • PENDING_CONFIRMATION → tells citizen the request is awaiting confirmation
      //         • CONFIRMED (provider-booked) → shows original confirmation message
      const status = response.data?.status;
      if (status === "PENDING_CONFIRMATION") {
        alert(
          "Appointment request sent! The lawyer/NGO will confirm or decline your request. You will be notified once they respond."
        );
      } else {
        alert("Appointment successfully scheduled! Check your dashboard.");
      }

      handleCancel();
    } catch (error: any) {
      console.error("Error scheduling appointment:", error);
      const errorMsg =
        error.response?.data?.message || "There was a problem scheduling the appointment.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // UNCHANGED: Reset form to defaults
  const handleCancel = () => {
    setDate("2026-03-20");
    setTimezone("IST");
    setSelectedTime(null);
    setDuration("30 mins");
    setReminders(false);
  };

  return (
    <>
      <PageTitle title="Appointment Scheduler - Legal Aid Matching Platform" />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-[500px]">
          <h2 className="text-2xl font-semibold mb-1">Schedule a Call</h2>
          <p className="text-gray-500 mb-2">
            Propose a time to connect with {profile.name || "your match"}.
          </p>

          {/* CHANGED: Added info banner so the citizen knows their request
              goes to the provider for approval before it is confirmed.
              BEFORE: No such banner existed. */}
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
            📋 Your request will be sent to the lawyer/NGO for confirmation. You will be notified once they respond.
          </p>

          {/* UNCHANGED: Provider profile card */}
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg mb-6 border-l-4 border-purple-600">
            <div>
              <p className="font-bold text-gray-800">{profile.name || "Loading..."}</p>
              <p className="text-sm text-gray-600">
                {profile.role} |{" "}
                <span className="text-purple-700 font-semibold">
                  Match Score: {profile.matchScore}%
                </span>
              </p>
            </div>
          </div>

          {/* UNCHANGED: Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                >
                  <option value="IST">IST</option>
                  <option value="UTC">UTC</option>
                  <option value="PST">PST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Time</label>
                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-2 py-1 text-xs rounded-md border transition-all ${
                        selectedTime === time
                          ? "bg-purple-600 text-white border-purple-600 shadow-md"
                          : "bg-white text-gray-600 hover:border-purple-400"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Call Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none"
              >
                <option value="15 mins">15 minutes</option>
                <option value="30 mins">30 minutes</option>
                <option value="60 mins">1 hour</option>
              </select>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="reminders"
                checked={reminders}
                onChange={() => setReminders(!reminders)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="reminders" className="text-sm text-gray-600 cursor-pointer">
                Send me a reminder before the call
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <button
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>

            {/* CHANGED: Button label updated from "Confirm Call" → "Send Request"
                to correctly reflect that the citizen is submitting a request,
                not directly confirming an appointment. Loading state text also updated. */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              }`}
            >
              {loading ? "Sending Request..." : "Send Request"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
