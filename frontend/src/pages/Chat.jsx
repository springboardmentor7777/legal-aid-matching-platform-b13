import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  connectWebSocket,
  sendMessage as sendWSMessage,
  getChatHistory,
  disconnectWebSocket
} from "../api/chatService";

export default function Chat() {

  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // 🔄 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔗 CONNECT + LOAD HISTORY
  useEffect(() => {

    if (!matchId) return;

    // ✅ Load old messages
    getChatHistory(matchId).then((data) => {
      setMessages(data);
    });

    // ✅ Connect WebSocket
    connectWebSocket(matchId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => disconnectWebSocket();

  }, [matchId]);

  // 📤 SEND MESSAGE
  const sendMessage = () => {

    if (!newMessage.trim()) return;

    const senderEmail = JSON.parse(localStorage.getItem("user"))?.email;

    sendWSMessage(matchId, senderEmail, newMessage);

    setNewMessage("");
  };

  // ⌨️ ENTER KEY
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow">

      {/* Header */}
      <div className="border-b p-4 font-semibold">
        Chat (Match ID: {matchId})
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg ${
              msg.senderName === JSON.parse(localStorage.getItem("user"))?.username
                ? "bg-purple-600 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            <div className="text-sm font-semibold">
              {msg.senderName}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}

        <div ref={messagesEndRef}></div>

      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>

      </div>

    </div>
  );
}