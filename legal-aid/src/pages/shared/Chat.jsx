import { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ScheduleCallModal from "../../components/common/ScheduleCallModal";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [newMessage, setNewMessage]       = useState("");
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [showSchedule, setShowSchedule]   = useState(false); // ScheduleCallModal
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  // Read from sessionStorage first (tab-specific) then localStorage
  const currentUser   = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
  const currentUserId = parseInt(currentUser.userId);
  const role          = currentUser.role;

  useEffect(() => {
    fetchConversations();
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      clearInterval(pollRef.current);
      pollRef.current = setInterval(() => fetchMessages(activeConv.id), 4000);
    }
    return () => clearInterval(pollRef.current);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const endpoint = (role === "LAWYER" || role === "NGO")
        ? "/matches/assigned"
        : "/matches/my";
      const res = await API.get(endpoint);
      const accepted = (res.data || []).filter(m => m.status === "ACCEPTED");
      setConversations(accepted);
      if (accepted.length > 0) setActiveConv(accepted[0]);
    } catch (err) {
      console.error("fetchConversations:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId) => {
    try {
      const res = await API.get(`/chats/${matchId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("fetchMessages:", err.response?.status);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return;
    setSending(true);
    try {
      await API.post("/chats/send", {
        matchId:  activeConv.id,
        senderId: currentUserId,
        content:  newMessage.trim(),
      });
      setNewMessage("");
      await fetchMessages(activeConv.id);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Display helpers ───────────────────────────────────────────────────────
  const getName = (conv) =>
    role === "USER" ? (conv.profileName || "Legal Advisor") : (conv.caseTitle || `Case #${conv.caseId}`);

  const getSub = (conv) =>
    role === "USER"
      ? `${conv.profileType || ""}${conv.profileExpertise ? " · " + conv.profileExpertise : ""}`
      : [conv.caseCategory, conv.caseLocation].filter(Boolean).join(" · ");

  const getAvatar = (conv) =>
    role === "USER" ? (conv.profileType === "LAWYER" ? "⚖️" : "🤝") : "👤";

  const getAvatarBg = (conv) =>
    role === "USER" ? (conv.profileType === "LAWYER" ? "#EFF6FF" : "#FFF7ED") : "#F0FDF4";

  const fmt = (ts) =>
    ts ? new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

  const fmtDate = (ts) =>
    ts ? new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

  const grouped = messages.reduce((acc, msg) => {
    const k = msg.timestamp ? new Date(msg.timestamp).toDateString() : "Unknown";
    if (!acc[k]) acc[k] = [];
    acc[k].push(msg);
    return acc;
  }, {});

  const emptyText = role === "USER"
    ? "Once a lawyer or NGO accepts your case request, conversations appear here."
    : "When a citizen's case is accepted, conversations appear here.";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* Schedule Call Modal — only USER can book */}
      {showSchedule && activeConv && (
        <ScheduleCallModal
          match={activeConv}
          onClose={() => setShowSchedule(false)}
          onSuccess={() => {
            setShowSchedule(false);
            toast.success("Appointment booked successfully!");
          }}
        />
      )}

      {loading ? (
        <div style={s.center}>Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>💬</div>
          <h3 style={s.emptyTitle}>No conversations yet</h3>
          <p style={s.emptyText}>{emptyText}</p>
        </div>
      ) : (
        <div style={s.layout}>

          {/* ── Sidebar ── */}
          <div style={s.sidebar}>
            <div style={s.sidebarHdr}>
              <span style={s.sidebarLbl}>Conversations</span>
              <span style={s.badge}>{conversations.length}</span>
            </div>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => { setActiveConv(conv); setShowSchedule(false); }}
                style={{ ...s.convRow, ...(activeConv?.id === conv.id ? s.convActive : {}) }}
              >
                {activeConv?.id === conv.id && <div style={s.activeLine} />}
                <div style={{ ...s.convAvatar, background: getAvatarBg(conv) }}>
                  {getAvatar(conv)}
                </div>
                <div style={s.convInfo}>
                  <div style={s.convName}>{getName(conv)}</div>
                  <div style={s.convSub}>📁 {conv.caseTitle || `Case #${conv.caseId}`}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Chat area ── */}
          <div style={s.chatArea}>
            {activeConv ? (
              <>
                {/* Chat header with action buttons */}
                <div style={s.chatHdr}>
                  <div style={{ ...s.hdrAvatar, background: getAvatarBg(activeConv) }}>
                    {getAvatar(activeConv)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.hdrName}>{getName(activeConv)}</div>
                    <div style={s.hdrSub}>{getSub(activeConv)}</div>
                  </div>

                  {/* ── Action buttons — only shown to USER ── */}
                  {role === "USER" && (
                    <div style={s.headerActions}>
                      {/* Book Appointment */}
                      <button
                        onClick={() => setShowSchedule(true)}
                        style={s.scheduleBtn}
                        title="Schedule a call"
                      >
                        📅 Schedule Call
                      </button>

                      {/* View Appointments for this match */}
                      <button
                        onClick={() => window.location.href = "/appointments"}
                        style={s.appointmentsBtn}
                        title="View appointments"
                      >
                        🗓 Appointments
                      </button>
                    </div>
                  )}

                  {/* Case pill — always shown */}
                  <div style={s.casePill}>
                    📁 {activeConv.caseTitle || `Case #${activeConv.caseId}`}
                  </div>
                </div>

                {/* Messages */}
                <div style={s.msgs}>
                  {messages.length === 0 ? (
                    <div style={s.noMsg}>
                      <div style={{ fontSize: "36px", marginBottom: "10px" }}>👋</div>
                      <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                        Start the conversation
                      </p>
                    </div>
                  ) : (
                    Object.entries(grouped).map(([dk, msgs]) => (
                      <div key={dk}>
                        <div style={s.dateDivider}>
                          <span style={s.datePill}>{fmtDate(msgs[0]?.timestamp)}</span>
                        </div>
                        {msgs.map((msg, i) => {
                          const mine = parseInt(msg.senderId) === currentUserId;
                          return (
                            <div key={i} style={{ ...s.msgRow, justifyContent: mine ? "flex-end" : "flex-start" }}>
                              {!mine && <div style={s.msgAvatar}>{getAvatar(activeConv)}</div>}
                              <div style={{ ...s.bubble, ...(mine ? s.bubbleMine : s.bubbleOther) }}>
                                <p style={{ ...s.bubbleText, color: mine ? "white" : "#1E293B" }}>
                                  {msg.content}
                                </p>
                                <span style={{ ...s.bubbleTime, color: mine ? "rgba(255,255,255,0.55)" : "#94A3B8" }}>
                                  {fmt(msg.timestamp)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div style={s.inputBar}>
                  <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message… Enter to send"
                    style={s.input}
                    rows={2}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    style={{ ...s.sendBtn, opacity: !newMessage.trim() || sending ? 0.4 : 1 }}
                  >
                    {sending ? "…" : "↑"}
                  </button>
                </div>
              </>
            ) : (
              <div style={s.center}>Select a conversation</div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  center:    { display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#94A3B8", fontSize: "14px" },
  empty:     { textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "16px", border: "1px solid #F1F5F9" },
  emptyTitle:{ fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  emptyText: { color: "#94A3B8", fontSize: "13px", maxWidth: "340px", margin: "0 auto", lineHeight: "1.6" },

  layout:    { display: "flex", height: "calc(100vh - 130px)", background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },

  // Sidebar
  sidebar:   { width: "260px", borderRight: "1px solid #F1F5F9", display: "flex", flexDirection: "column", flexShrink: 0, background: "#FAFAFA" },
  sidebarHdr:{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px 12px", borderBottom: "1px solid #F1F5F9" },
  sidebarLbl:{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" },
  badge:     { fontSize: "11px", fontWeight: "700", color: "#64748B", background: "#E2E8F0", padding: "1px 8px", borderRadius: "10px" },
  convRow:   { display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", cursor: "pointer", position: "relative", borderBottom: "1px solid #F1F5F9" },
  convActive:{ background: "#EFF6FF" },
  activeLine:{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "3px", background: "#0F1F3D", borderRadius: "0 2px 2px 0" },
  convAvatar:{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
  convInfo:  { flex: 1, minWidth: 0 },
  convName:  { fontSize: "13px", fontWeight: "700", color: "#0F1F3D", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  convSub:   { fontSize: "11px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  // Chat area
  chatArea:  { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },

  // Chat header — has action buttons on the right
  chatHdr:   { padding: "12px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "10px", background: "white", flexShrink: 0, flexWrap: "wrap" },
  hdrAvatar: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 },
  hdrName:   { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hdrSub:    { fontSize: "11px", color: "#94A3B8", marginTop: "1px" },

  // Action buttons in header
  headerActions: { display: "flex", gap: "8px", flexShrink: 0 },
  scheduleBtn:   { padding: "7px 14px", background: "#7C3AED", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  appointmentsBtn:{ padding: "7px 14px", background: "white", color: "#0F1F3D", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },

  casePill:  { flexShrink: 0, fontSize: "11px", color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: "8px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  // Messages
  msgs:      { flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "2px" },
  noMsg:     { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" },
  dateDivider:{ textAlign: "center", margin: "14px 0 10px" },
  datePill:  { fontSize: "11px", color: "#94A3B8", background: "#F1F5F9", padding: "3px 12px", borderRadius: "10px" },
  msgRow:    { display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "6px" },
  msgAvatar: { width: "26px", height: "26px", background: "#F1F5F9", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 },
  bubble:    { maxWidth: "60%", padding: "10px 14px", borderRadius: "14px" },
  bubbleMine:{ background: "#0F1F3D", borderBottomRightRadius: "4px" },
  bubbleOther:{ background: "#F1F5F9", borderBottomLeftRadius: "4px" },
  bubbleText:{ fontSize: "13px", lineHeight: "1.5", margin: 0 },
  bubbleTime:{ fontSize: "10px", marginTop: "4px", display: "block", textAlign: "right" },

  // Input
  inputBar:  { padding: "14px 22px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "10px", alignItems: "flex-end", background: "white", flexShrink: 0 },
  input:     { flex: 1, padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: "1.5" },
  sendBtn:   { width: "42px", height: "42px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "700" },
};

export default Chat;