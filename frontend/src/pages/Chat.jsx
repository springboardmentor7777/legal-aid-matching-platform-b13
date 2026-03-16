import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {

  const { matchId } = useParams();

  const [messages, setMessages] = useState([
    { id: 1, sender: "lawyer", text: "Hello, how can I help you?" },
    { id: 2, sender: "citizen", text: "I need help with a legal case." }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {

    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "citizen",
      text: newMessage
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow">

      {/* Header */}
      <div className="border-b p-4 font-semibold">
        Chat with Lawyer (Match ID: {matchId})
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${
              msg.sender === "citizen"
                ? "bg-purple-600 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
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