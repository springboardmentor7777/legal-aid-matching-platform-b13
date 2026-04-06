import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  connectWebSocket,
  sendMessage as sendWSMessage,
  getChatHistory,
  disconnectWebSocket
} from "../api/chatService";
import { Send, ArrowLeft, Circle, Calendar } from "lucide-react";

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!matchId) return;

    getChatHistory(matchId).then((data) => {
      setMessages(data);
    });

    connectWebSocket(matchId, (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(m => m.id === msg.id);
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });
    setConnected(true);

    return () => {
      disconnectWebSocket();
      setConnected(false);
    };
  }, [matchId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    sendWSMessage(matchId, currentUser?.email, newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  let lastDate = "";

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/matches")}
              className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-bold">Match #{matchId}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Circle className={`w-2.5 h-2.5 fill-current ${connected ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="text-white/70 text-xs">{connected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate(`/appointments?matchId=${matchId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-white text-xs font-semibold hover:bg-white/30 transition-all">
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1 bg-slate-50">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Send className="w-10 h-10 text-slate-300 mx-auto mb-3 rotate-[-30deg]" />
                <p className="text-slate-500 font-medium">No messages yet</p>
                <p className="text-slate-400 text-sm mt-1">Start the conversation below</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isMine = msg.senderName === currentUser?.username ||
                           msg.senderName === currentUser?.email;
            const msgDate = formatDate(msg.createdAt);
            let showDate = false;
            if (msgDate !== lastDate) {
              showDate = true;
              lastDate = msgDate;
            }

            return (
              <div key={msg.id || index}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 font-medium border border-slate-200 shadow-sm">
                      {msgDate}
                    </div>
                  </div>
                )}
                <div className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${isMine ? "order-last" : ""}`}>
                    {!isMine && (
                      <p className="text-xs font-semibold text-slate-500 mb-1 ml-1">
                        {msg.senderName}
                      </p>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-right text-slate-400 mr-1' : 'text-slate-400 ml-1'}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}