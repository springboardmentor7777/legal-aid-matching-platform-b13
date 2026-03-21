import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ScheduleCallModal from "../../components/common/ScheduleCallModal";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalMatch, setModalMatch] = useState(null); // opens ScheduleCallModal

  // Read from sessionStorage first (tab-specific) then localStorage
  const currentUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
  const role = currentUser.role;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      let apptEndpoint = "/appointments/my";
      if (role === "LAWYER") apptEndpoint = "/appointments/lawyer";
      if (role === "NGO")    apptEndpoint = "/appointments/ngo";

      const apptRes = await API.get(apptEndpoint);
      setAppointments(apptRes.data || []);

      if (role === "USER") {
        const matchRes = await API.get("/matches/my");
        setAcceptedMatches((matchRes.data || []).filter(m => m.status === "ACCEPTED"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/appointments/${id}/update`, { status: "CANCELLED" });
      toast.success("Appointment cancelled");
      fetchData();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const statusConfig = {
    CONFIRMED: { bg: "#EFF6FF", color: "#1D4ED8", label: "Confirmed", icon: "📅" },
    COMPLETED: { bg: "#F0FDF4", color: "#166534", label: "Completed", icon: "✅" },
    CANCELLED: { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled", icon: "❌" },
    PENDING:   { bg: "#FFFBEB", color: "#92400E", label: "Pending",   icon: "⏳" },
  };

  const upcoming = appointments.filter(a =>
    ["CONFIRMED","PENDING"].includes(a.status) && new Date(a.scheduledTime) > new Date()
  );
  const past = appointments.filter(a =>
    a.status === "COMPLETED" || a.status === "CANCELLED" || new Date(a.scheduledTime) <= new Date()
  );

  return (
    <Layout>
      {/* Schedule Call Modal */}
      {modalMatch && (
        <ScheduleCallModal
          match={modalMatch}
          onClose={() => setModalMatch(null)}
          onSuccess={() => { setModalMatch(null); fetchData(); }}
        />
      )}

      {/* Header */}
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Appointments 📅</h1>
          <p style={st.subtitle}>
            {role === "LAWYER" ? "Your scheduled client meetings"
              : role === "NGO" ? "Your scheduled community meetings"
              : "Schedule and manage meetings with your legal advisors"}
          </p>
        </div>

        {/* USER: show Schedule button for each accepted match */}
        {role === "USER" && acceptedMatches.length > 0 && (
          <div style={st.scheduleArea}>
            <span style={st.scheduleLabel}>Schedule with:</span>
            <div style={st.scheduleButtons}>
              {acceptedMatches.map(m => (
                <button key={m.id} onClick={() => setModalMatch(m)} style={st.scheduleBtn}>
                  📅 {m.profileName || `Match #${m.id}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={st.center}>Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div style={st.empty}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📅</div>
          <h3 style={st.emptyTitle}>No appointments yet</h3>
          <p style={st.emptyText}>
            {role === "USER"
              ? acceptedMatches.length > 0
                ? "Click a name above to schedule a meeting."
                : "Accept a match first, then schedule an appointment."
              : "No appointments scheduled yet."}
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section style={st.section}>
              <h2 style={st.sectionTitle}>Upcoming ({upcoming.length})</h2>
              <div style={st.list}>
                {upcoming.map(a => (
                  <ApptCard key={a.id} appt={a} statusConfig={statusConfig}
                    onCancel={role === "USER" ? handleCancel : null} role={role} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section style={st.section}>
              <h2 style={st.sectionTitle}>Past Appointments</h2>
              <div style={st.list}>
                {past.map(a => (
                  <ApptCard key={a.id} appt={a} statusConfig={statusConfig} onCancel={null} role={role} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </Layout>
  );
};

const ApptCard = ({ appt, statusConfig, onCancel, role }) => {
  const sc = statusConfig[appt.status] || statusConfig.PENDING;
  const d  = appt.scheduledTime ? new Date(appt.scheduledTime) : null;
  const canCancel = onCancel && ["PENDING","CONFIRMED"].includes(appt.status);

  return (
    <div style={st.card}>
      <div style={st.cardLeft}>
        <div style={st.dateBlock}>
          {d ? (
            <>
              <div style={st.dateDay}>{d.toLocaleDateString("en-IN",{day:"2-digit"})}</div>
              <div style={st.dateMon}>{d.toLocaleDateString("en-IN",{month:"short"})}</div>
            </>
          ) : <div style={st.dateDay}>—</div>}
        </div>
        <div>
          <h3 style={st.with}>{role === "USER" ? (appt.profileName||"—") : (appt.userName||"—")}</h3>
          <div style={st.meta}>
            {d && <span style={st.metaItem}>🕐 {d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>}
            {appt.durationMinutes && <span style={st.metaItem}>⏱ {appt.durationMinutes} min</span>}
            {appt.profileType && role === "USER" && <span style={st.metaItem}>👤 {appt.profileType}</span>}
          </div>
          {appt.notes && <p style={st.notes}>{appt.notes}</p>}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px"}}>
        <span style={{...st.statusBadge, background:sc.bg, color:sc.color}}>{sc.icon} {sc.label}</span>
        {canCancel && <button onClick={()=>onCancel(appt.id)} style={st.cancelBtn}>Cancel</button>}
      </div>
    </div>
  );
};

const st = {
  header:       {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"28px",flexWrap:"wrap",gap:"16px"},
  title:        {fontSize:"24px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"4px"},
  subtitle:     {fontSize:"13px",color:"#64748B"},
  scheduleArea: {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"},
  scheduleLabel:{fontSize:"11px",color:"#94A3B8",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.5px"},
  scheduleButtons:{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"flex-end"},
  scheduleBtn:  {background:"#7C3AED",color:"white",padding:"9px 16px",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"},
  center:       {textAlign:"center",padding:"60px",color:"#94A3B8"},
  empty:        {textAlign:"center",padding:"80px",background:"white",borderRadius:"16px"},
  emptyTitle:   {fontSize:"18px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"8px"},
  emptyText:    {color:"#64748B",fontSize:"14px"},
  section:      {marginBottom:"28px"},
  sectionTitle: {fontSize:"16px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"14px"},
  list:         {display:"flex",flexDirection:"column",gap:"12px"},
  card:         {background:"white",borderRadius:"12px",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",border:"1px solid #F1F5F9"},
  cardLeft:     {display:"flex",alignItems:"center",gap:"18px"},
  dateBlock:    {width:"52px",textAlign:"center",background:"#EFF6FF",borderRadius:"10px",padding:"8px",flexShrink:0},
  dateDay:      {fontSize:"22px",fontWeight:"800",color:"#0F1F3D"},
  dateMon:      {fontSize:"11px",color:"#64748B",fontWeight:"600",textTransform:"uppercase"},
  with:         {fontSize:"15px",fontWeight:"700",color:"#0F1F3D",fontFamily:"'Georgia',serif",marginBottom:"6px"},
  meta:         {display:"flex",gap:"14px",flexWrap:"wrap",marginBottom:"4px"},
  metaItem:     {fontSize:"12px",color:"#64748B"},
  notes:        {fontSize:"12px",color:"#94A3B8",marginTop:"4px"},
  statusBadge:  {fontSize:"12px",fontWeight:"700",padding:"5px 12px",borderRadius:"20px"},
  cancelBtn:    {fontSize:"11px",color:"#DC2626",background:"white",border:"1px solid #FECACA",padding:"4px 12px",borderRadius:"6px",cursor:"pointer",fontFamily:"inherit"},
};

export default Appointments;