import { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentScheduler() {
  const [date, setDate] = useState("2025-12-28");
  const [timezone, setTimezone] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [reminders, setReminders] = useState({
    fifteen: false,
    hour: false,
  });

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    matchScore: "",
    image: "",
  });

  const times = ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  useEffect(() => {
    axios
      .get("http://localhost:8081/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const toggleReminder = (key: "fifteen" | "hour") => {
    setReminders({ ...reminders, [key]: !reminders[key] });
  };

  const handleSubmit = async () => {
    const appointment = {
      date,
      timezone,
      selectedTime,
      duration,
      reminders,
    };

    try {
      await axios.post(
        "http://localhost:8081/appointments/create",
        appointment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      );

      alert("Appointment successfully scheduled!");
      handleCancel();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("There was a problem scheduling the appointment.");
    }
  };

  const handleCancel = () => {
    setDate("2025-12-28");
    setTimezone("");
    setSelectedTime(null);
    setDuration("");
    setReminders({
      fifteen: false,
      hour: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[500px]">
        <h2 className="text-2xl font-semibold mb-1">Schedule a Call</h2>
        <p className="text-gray-500 mb-6">
          Propose a time to connect with {profile.name}, {profile.role}.
        </p>

        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg mb-6">
          <div>
            <p className="font-medium">{profile.name || "Loading..."}</p>
            <p className="text-sm text-gray-500">
              {profile.role ? `${profile.role} | ` : ""}
              Match Score: {profile.matchScore || "0"}%
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Time Zone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select a time zone</option>
              <option>IST</option>
              <option>UTC</option>
              <option>PST</option>
              <option>EST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Proposed Time Slots
            </label>
            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-1 rounded-lg border ${
                    selectedTime === time
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Call Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select duration</option>
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>1 hour</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Reminders</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reminders.fifteen}
                onChange={() => toggleReminder("fifteen")}
              />
              15 minutes before the call
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reminders.hour}
                onChange={() => toggleReminder("hour")}
              />
              1 hour before the call
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="text-gray-500" onClick={handleCancel}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Confirm Call
          </button>
        </div>
      </div>
    </div>
  );
}