import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_SLOTS = ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

const TIMEZONES = [
  "Asia/Kolkata (IST +5:30)",
  "America/New_York (EST -5:00)",
  "America/Los_Angeles (PST -8:00)",
  "Europe/London (GMT +0:00)",
  "Asia/Dubai (GST +4:00)",
  "Australia/Sydney (AEDT +11:00)",
];

const DURATIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
];

// ─── Helper: convert "9:00 AM" → "09:00:00" ───────────────────────────────────
const parseSlotToTime = (slot) => {
  const [timePart, meridiem] = slot.split(" ");
  let [h, m] = timePart.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
};

// ─── Helper: format date string for display ────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Component ────────────────────────────────────────────────────────────────
const ScheduleCallModal = ({ match, onClose, onSuccess }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: "",
    timezone: "",
    selectedSlot: "",
    duration: "",
    reminder15: false,
    reminder60: false,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!match) return null;

  const handleConfirm = async () => {
    if (!form.date) {
      toast.error("Please select a date");
      return;
    }
    if (!form.selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (!form.duration) {
      toast.error("Please select call duration");
      return;
    }

    setSubmitting(true);
    try {
      const timeStr = parseSlotToTime(form.selectedSlot);
      const scheduledTime = `${form.date}T${timeStr}`;

      await API.post("/appointments", {
        matchId: match.id,
        scheduledTime,
        durationMinutes: parseInt(form.duration),
        notes: form.notes || null,
      });

      toast.success("Call scheduled successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to schedule call";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={s.overlay} onClick={handleOverlayClick}>
      <div style={s.modal}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div>
            <h2 style={s.title}>Schedule a Call</h2>
            <p style={s.subtitle}>
              Propose a time to connect with{" "}
              <span style={{ color: "#6B7280" }}>
                {match.profileName || "your legal advisor"}
              </span>
            </p>
          </div>
          <button onClick={onClose} style={s.closeBtn} aria-label="Close">
            ×
          </button>
        </div>

        {/* ── Profile card ── */}
        <div style={s.profileCard}>
          <div style={s.avatarCircle}>
            {match.profileType === "LAWYER" ? "⚖️" : "🤝"}
          </div>
          <div style={s.profileInfo}>
            <div style={s.profileRow}>
              <span style={s.profileName}>
                {match.profileName || "Legal Advisor"}
              </span>
              <span style={s.roleBadge}>
                {match.profileType === "LAWYER" ? "Lawyer" : "NGO"}
              </span>
            </div>
            <div style={s.matchRow}>
              <span style={s.matchLabel}>Match Score:</span>
              <span style={s.matchScore}>{match.matchScore || "--"}%</span>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={s.body}>

          {/* Date */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Date</label>
            <div style={s.dateInputWrapper}>
              <span style={s.calendarIcon}>📅</span>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={s.dateInput}
              />
              {form.date && (
                <span style={s.dateDisplay}>{formatDate(form.date)}</span>
              )}
            </div>
          </div>

          {/* Time Zone + Proposed Time Slots (side by side) */}
          <div style={s.twoCol}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Time Zone</label>
              <div style={s.selectWrapper}>
                <select
                  value={form.timezone}
                  onChange={(e) =>
                    setForm({ ...form, timezone: e.target.value })
                  }
                  style={s.select}
                >
                  <option value="">Select a time zone</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <span style={s.selectArrow}>▾</span>
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Proposed Time Slots</label>
              <div style={s.slotsGrid}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setForm({ ...form, selectedSlot: slot })}
                    style={{
                      ...s.slotBtn,
                      ...(form.selectedSlot === slot ? s.slotBtnActive : {}),
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Call Duration */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Call Duration</label>
            <div style={s.selectWrapper}>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                style={s.select}
              >
                <option value="">Select duration</option>
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <span style={s.selectArrow}>▾</span>
            </div>
          </div>

          {/* Reminders */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Reminders</label>
            <div style={s.checkboxGroup}>
              <label style={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.reminder15}
                  onChange={(e) =>
                    setForm({ ...form, reminder15: e.target.checked })
                  }
                  style={s.checkbox}
                />
                15 minutes before the call
              </label>
              <label style={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.reminder60}
                  onChange={(e) =>
                    setForm({ ...form, reminder60: e.target.checked })
                  }
                  style={s.checkbox}
                />
                1 hour before the call
              </label>
            </div>
          </div>

          {/* Notes (optional) */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any agenda items or topics to discuss..."
              style={s.textarea}
              rows={2}
            />
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div style={s.footer}>
          <button onClick={onClose} style={s.cancelBtn} disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{ ...s.confirmBtn, opacity: submitting ? 0.7 : 1 }}
            disabled={submitting}
          >
            {submitting ? "Scheduling..." : "Confirm Call"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  // Overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },

  // Modal container
  modal: {
    background: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 24px 16px",
    borderBottom: "1px solid #F1F5F9",
    flexShrink: 0,
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    fontFamily: "'Georgia', serif",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#9CA3AF",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: "#9CA3AF",
    lineHeight: 1,
    padding: "0 4px",
    flexShrink: 0,
  },

  // Profile card
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "16px 24px",
    padding: "12px 16px",
    background: "#F8FAFC",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    flexShrink: 0,
  },
  avatarCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  profileName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
  },
  roleBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6B7280",
    background: "#F3F4F6",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  matchRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  matchLabel: {
    fontSize: "12px",
    color: "#6B7280",
  },
  matchScore: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#7C3AED",
    background: "#EDE9FE",
    padding: "1px 8px",
    borderRadius: "10px",
  },

  // Scrollable body
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  // Field group
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },

  // Date input
  dateInputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    padding: "10px 14px",
    background: "white",
  },
  calendarIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  dateInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#374151",
    fontFamily: "inherit",
    background: "transparent",
    cursor: "pointer",
    flex: 1,
  },
  dateDisplay: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
  },

  // Two column layout for timezone + slots
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    alignItems: "start",
  },

  // Select
  selectWrapper: {
    position: "relative",
  },
  select: {
    width: "100%",
    padding: "10px 36px 10px 14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
    fontFamily: "inherit",
    background: "white",
    appearance: "none",
    cursor: "pointer",
    outline: "none",
  },
  selectArrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "12px",
    color: "#9CA3AF",
    pointerEvents: "none",
  },

  // Time slots grid
  slotsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  slotBtn: {
    padding: "8px 10px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    background: "white",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center",
    transition: "all 0.15s ease",
  },
  slotBtnActive: {
    background: "#7C3AED",
    borderColor: "#7C3AED",
    color: "white",
  },

  // Checkboxes
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#7C3AED",
    flexShrink: 0,
  },

  // Textarea
  textarea: {
    padding: "10px 14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    color: "#374151",
    lineHeight: "1.5",
  },

  // Footer
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #F1F5F9",
    flexShrink: 0,
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "white",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmBtn: {
    padding: "10px 24px",
    background: "#7C3AED",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "white",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.15s ease",
  },
};

export default ScheduleCallModal;