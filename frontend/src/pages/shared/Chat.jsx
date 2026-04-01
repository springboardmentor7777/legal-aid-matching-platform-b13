import { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ScheduleCallModal from "../../components/common/ScheduleCallModal";

const Chat = () => {
  const [conversations, setConversations]   = useState([]);
  const [activeConv, setActiveConv]         = useState(null);
  const [messages, setMessages]             = useState([]);
  const [newMessage, setNewMessage]         = useState("");
  const [loading, setLoading]               = useState(true);
  const [sending, setSending]               = useState(false);
  const [showSchedule, setShowSchedule]     = useState(false);
  const [attachedFile, setAttachedFile]     = useState(null); // { name, type, data (base64) }
  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);
  const fileRef    = useRef(null);

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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchConversations = async () => {
    try {
      const endpoint = (role === "LAWYER" || role === "NGO") ? "/matches/assigned" : "/matches/my";
      const res = await API.get(endpoint);
      const accepted = (res.data || []).filter(m => m.status === "ACCEPTED");
      setConversations(accepted);
      if (accepted.length > 0) setActiveConv(accepted[0]);
    } catch (err) {
      console.error("fetchConversations:", err.response?.status);
    } finally { setLoading(false); }
  };

  const fetchMessages = async (matchId) => {
    try {
      const res = await API.get(`/chats/${matchId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("fetchMessages:", err.response?.status);
    }
  };

  // ── File attachment ───────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({ name: file.name, type: file.type, data: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;
    if (!activeConv) return;
    setSending(true);
    try {
      await API.post("/chats/send", {
        matchId:  activeConv.id,
        senderId: currentUserId,
        content:  newMessage.trim() || (attachedFile ? `📎 ${attachedFile.name}` : ""),
        fileData: attachedFile?.data  || null,
        fileName: attachedFile?.name  || null,
        fileType: attachedFile?.type  || null,
      });
      setNewMessage("");
      removeAttachment();
      await fetchMessages(activeConv.id);
    } catch {
      toast.error("Failed to send message");
    } finally { setSending(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Download file from message ────────────────────────────────────────────
  const downloadFile = (msg) => {
    if (!msg.fileData) return;
    const link = document.createElement("a");
    link.href = msg.fileData;
    link.download = msg.fileName || "attachment";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Display helpers ───────────────────────────────────────────────────────
  // LAWYER/NGO sees: "ClientName — Case Title"
  // USER sees: lawyer/NGO name
  const getName = (conv) => {
    if (role === "USER") return conv.profileName || "Legal Advisor";
    // LAWYER/NGO: show client name + case title
    const client = conv.clientName ? `${conv.clientName} — ` : "";
    return client + (conv.caseTitle || `Case #${conv.caseId}`);
  };

  const getSub = (conv) => {
    if (role === "USER")
      return `${conv.profileType || ""}${conv.profileExpertise ? " · " + conv.profileExpertise : ""}`;
    return [conv.caseCategory, conv.caseLocation].filter(Boolean).join(" · ");
  };

  const getAvatar    = (conv) => role === "USER" ? (conv.profileType === "LAWYER" ? "⚖️" : "🤝") : "👤";
  const getAvatarBg  = (conv) => role === "USER" ? (conv.profileType === "LAWYER" ? "#EFF6FF" : "#FFF7ED") : "#F0FDF4";

  const fmt     = (ts) => ts ? new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";
  const fmtDate = (ts) => ts ? new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

  const isImage = (type, name) => {
    if (type?.startsWith("image/")) return true;
    const ext = (name || "").split(".").pop().toLowerCase();
    return ["jpg","jpeg","png","gif","webp"].includes(ext);
  };
  const isPdf = (type, name) => type === "application/pdf" || (name || "").toLowerCase().endsWith(".pdf");

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
      {showSchedule && activeConv && (
        <ScheduleCallModal
          match={activeConv}
          onClose={() => setShowSchedule(false)}
          onSuccess={() => { setShowSchedule(false); toast.success("Appointment booked!"); }}
        />
      )}

      {loading ? <div style={s.center}>Loading conversations...</div>
      : conversations.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>💬</div>
          <h3 style={s.emptyTitle}>No conversations yet</h3>
          <p style={s.emptyText}>{emptyText}</p>
        </div>
      ) : (
        <div style={s.layout}>

          {/* Sidebar */}
          <div style={s.sidebar}>
            <div style={s.sidebarHdr}>
              <span style={s.sidebarLbl}>Conversations</span>
              <span style={s.badge}>{conversations.length}</span>
            </div>
            {conversations.map(conv => (
              <div key={conv.id} onClick={() => { setActiveConv(conv); setShowSchedule(false); setAttachedFile(null); }}
                style={{ ...s.convRow, ...(activeConv?.id === conv.id ? s.convActive : {}) }}>
                {activeConv?.id === conv.id && <div style={s.activeLine}/>}
                <div style={{ ...s.convAvatar, background: getAvatarBg(conv) }}>{getAvatar(conv)}</div>
                <div style={s.convInfo}>
                  <div style={s.convName}>{getName(conv)}</div>
                  <div style={s.convSub}>📁 {conv.caseTitle || `Case #${conv.caseId}`}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div style={s.chatArea}>
            {activeConv ? (
              <>
                {/* Header */}
                <div style={s.chatHdr}>
                  <div style={{ ...s.hdrAvatar, background: getAvatarBg(activeConv) }}>{getAvatar(activeConv)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.hdrName}>{getName(activeConv)}</div>
                    <div style={s.hdrSub}>{getSub(activeConv)}</div>
                  </div>
                  {/* Schedule buttons — USER only */}
                  {role === "USER" && (
                    <div style={s.hdrActions}>
                      <button onClick={() => setShowSchedule(true)} style={s.scheduleBtn}>📅 Schedule Call</button>
                      <button onClick={() => window.location.href = "/appointments"} style={s.apptBtn}>🗓 Appointments</button>
                    </div>
                  )}
                  <div style={s.casePill}>📁 {activeConv.caseTitle || `Case #${activeConv.caseId}`}</div>
                </div>

                {/* Messages */}
                <div style={s.msgs}>
                  {messages.length === 0 ? (
                    <div style={s.noMsg}>
                      <div style={{ fontSize: "36px", marginBottom: "10px" }}>👋</div>
                      <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>Start the conversation</p>
                    </div>
                  ) : Object.entries(grouped).map(([dk, msgs]) => (
                    <div key={dk}>
                      <div style={s.dateDivider}><span style={s.datePill}>{fmtDate(msgs[0]?.timestamp)}</span></div>
                      {msgs.map((msg, i) => {
                        const mine = parseInt(msg.senderId) === currentUserId;
                        const hasFile = !!msg.fileData;
                        const hasText = msg.content && msg.content !== `📎 ${msg.fileName}`;
                        return (
                          <div key={i} style={{ ...s.msgRow, justifyContent: mine ? "flex-end" : "flex-start" }}>
                            {!mine && <div style={s.msgAvatar}>{getAvatar(activeConv)}</div>}
                            <div style={{ maxWidth: "65%" }}>
                              {/* Text bubble */}
                              {hasText && (
                                <div style={{ ...s.bubble, ...(mine ? s.bubbleMine : s.bubbleOther) }}>
                                  <p style={{ ...s.bubbleText, color: mine ? "white" : "#1E293B" }}>{msg.content}</p>
                                  <span style={{ ...s.bubbleTime, color: mine ? "rgba(255,255,255,0.55)" : "#94A3B8" }}>{fmt(msg.timestamp)}</span>
                                </div>
                              )}
                              {/* File attachment bubble */}
                              {hasFile && (
                                <div style={{ ...s.fileBubble, ...(mine ? s.fileBubbleMine : s.fileBubbleOther), marginTop: hasText ? "4px" : 0 }}>
                                  {isImage(msg.fileType, msg.fileName) ? (
                                    <div>
                                      <img src={msg.fileData} alt={msg.fileName}
                                        style={{ maxWidth: "220px", maxHeight: "200px", borderRadius: "8px", display: "block", marginBottom: "6px" }}/>
                                      <div style={s.fileNameRow}>
                                        <span style={{ ...s.fileNameText, color: mine ? "rgba(255,255,255,0.8)" : "#64748B" }}>🖼️ {msg.fileName}</span>
                                        <button onClick={() => downloadFile(msg)} style={{ ...s.dlBtn, color: mine ? "rgba(255,255,255,0.8)" : "#1D4ED8" }}>⬇</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={s.fileRow}>
                                      <span style={{ fontSize: "22px" }}>{isPdf(msg.fileType, msg.fileName) ? "📕" : "📄"}</span>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ ...s.fileNameText, color: mine ? "white" : "#0F1F3D" }}>{msg.fileName}</div>
                                        <div style={{ fontSize: "10px", color: mine ? "rgba(255,255,255,0.55)" : "#94A3B8" }}>{fmt(msg.timestamp)}</div>
                                      </div>
                                      <button onClick={() => downloadFile(msg)} style={{ ...s.dlBtn, color: mine ? "rgba(255,255,255,0.8)" : "#1D4ED8" }}>⬇</button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* Time for text-only messages is inside bubble; for file-only show here */}
                              {!hasText && hasFile && isImage(msg.fileType, msg.fileName) && (
                                <div style={{ textAlign: mine ? "right" : "left" }}>
                                  <span style={{ fontSize: "10px", color: "#94A3B8" }}>{fmt(msg.timestamp)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={bottomRef}/>
                </div>

                {/* Attachment preview bar */}
                {attachedFile && (
                  <div style={s.attachPreview}>
                    <span style={{ fontSize: "14px" }}>
                      {isImage(attachedFile.type, attachedFile.name) ? "🖼️" : isPdf(attachedFile.type, attachedFile.name) ? "📕" : "📄"}
                    </span>
                    <span style={s.attachName}>{attachedFile.name}</span>
                    <button onClick={removeAttachment} style={s.attachRemove}>✕</button>
                  </div>
                )}

                {/* Input bar */}
                <div style={s.inputBar}>
                  {/* Hidden file input */}
                  <input ref={fileRef} type="file" style={{ display: "none" }}
                    accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                    onChange={handleFileSelect}/>
                  {/* Attach button */}
                  <button onClick={() => fileRef.current?.click()} style={s.attachBtn} title="Attach file">📎</button>
                  <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKey} placeholder="Type a message… Enter to send"
                    style={s.input} rows={2}/>
                  <button onClick={sendMessage}
                    disabled={(!newMessage.trim() && !attachedFile) || sending}
                    style={{ ...s.sendBtn, opacity: (!newMessage.trim() && !attachedFile) || sending ? 0.4 : 1 }}>
                    {sending ? "…" : "↑"}
                  </button>
                </div>
              </>
            ) : <div style={s.center}>Select a conversation</div>}
          </div>
        </div>
      )}
    </Layout>
  );
};

const s = {
  center:     { display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#94A3B8", fontSize: "14px" },
  empty:      { textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "16px", border: "1px solid #F1F5F9" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "8px" },
  emptyText:  { color: "#94A3B8", fontSize: "13px", maxWidth: "340px", margin: "0 auto", lineHeight: "1.6" },
  layout:     { display: "flex", height: "calc(100vh - 130px)", background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  sidebar:    { width: "260px", borderRight: "1px solid #F1F5F9", display: "flex", flexDirection: "column", flexShrink: 0, background: "#FAFAFA" },
  sidebarHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px 12px", borderBottom: "1px solid #F1F5F9" },
  sidebarLbl: { fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" },
  badge:      { fontSize: "11px", fontWeight: "700", color: "#64748B", background: "#E2E8F0", padding: "1px 8px", borderRadius: "10px" },
  convRow:    { display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", cursor: "pointer", position: "relative", borderBottom: "1px solid #F1F5F9" },
  convActive: { background: "#EFF6FF" },
  activeLine: { position: "absolute", left: 0, top: "20%", bottom: "20%", width: "3px", background: "#0F1F3D", borderRadius: "0 2px 2px 0" },
  convAvatar: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
  convInfo:   { flex: 1, minWidth: 0 },
  convName:   { fontSize: "13px", fontWeight: "700", color: "#0F1F3D", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  convSub:    { fontSize: "11px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  chatArea:   { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  chatHdr:    { padding: "12px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "10px", background: "white", flexShrink: 0, flexWrap: "wrap" },
  hdrAvatar:  { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 },
  hdrName:    { fontSize: "14px", fontWeight: "700", color: "#0F1F3D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hdrSub:     { fontSize: "11px", color: "#94A3B8", marginTop: "1px" },
  hdrActions: { display: "flex", gap: "8px", flexShrink: 0 },
  scheduleBtn:{ padding: "7px 14px", background: "#7C3AED", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  apptBtn:    { padding: "7px 14px", background: "white", color: "#0F1F3D", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  casePill:   { flexShrink: 0, fontSize: "11px", color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: "8px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  msgs:       { flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "2px" },
  noMsg:      { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" },
  dateDivider:{ textAlign: "center", margin: "14px 0 10px" },
  datePill:   { fontSize: "11px", color: "#94A3B8", background: "#F1F5F9", padding: "3px 12px", borderRadius: "10px" },
  msgRow:     { display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "8px" },
  msgAvatar:  { width: "26px", height: "26px", background: "#F1F5F9", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 },
  bubble:     { maxWidth: "100%", padding: "10px 14px", borderRadius: "14px" },
  bubbleMine: { background: "#0F1F3D", borderBottomRightRadius: "4px" },
  bubbleOther:{ background: "#F1F5F9", borderBottomLeftRadius: "4px" },
  bubbleText: { fontSize: "13px", lineHeight: "1.5", margin: 0 },
  bubbleTime: { fontSize: "10px", marginTop: "4px", display: "block", textAlign: "right" },
  fileBubble:      { borderRadius: "12px", padding: "10px 12px" },
  fileBubbleMine:  { background: "#1a2d4a", borderBottomRightRadius: "4px" },
  fileBubbleOther: { background: "#F1F5F9", borderBottomLeftRadius: "4px" },
  fileRow:     { display: "flex", alignItems: "center", gap: "10px", minWidth: "180px" },
  fileNameRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" },
  fileNameText:{ fontSize: "12px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dlBtn:       { background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "2px", flexShrink: 0 },
  attachPreview:{ padding: "8px 22px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
  attachName:  { fontSize: "12px", color: "#374151", fontWeight: "600", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  attachRemove:{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: "14px", padding: "2px 4px" },
  inputBar:   { padding: "12px 18px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "8px", alignItems: "flex-end", background: "white", flexShrink: 0 },
  attachBtn:  { width: "38px", height: "38px", background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  input:      { flex: 1, padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: "1.5" },
  sendBtn:    { width: "42px", height: "42px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "700" },
};

export default Chat;