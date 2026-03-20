import React, { useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../auth/AuthContext";

interface Props {
  selectedUser: any; 
}

const MessageInput: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim() || !user || !selectedUser) return;

    const token = localStorage.getItem("accessToken");
    const currentMatchId = selectedUser.matchId || selectedUser.id;

    if (!currentMatchId) return;

    
    console.log("🕵️ CURRENT USER OBJECT:", user);

    //  THE FIX: Catch the ID no matter what it's named in your AuthContext
    const actualSenderId = user.id || user.userId || user.sub; 

    if (!actualSenderId) {
      console.error("CRITICAL: Could not find the User ID!");
      alert("Error: Missing User ID. Check the console.");
      return;
    }

    const socket = new SockJS("http://localhost:8081/ws-chat");
    const client = Stomp.over(socket);
    client.debug = () => {}; 

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      const chatMessage = {
        matchId: currentMatchId, 
        senderId: actualSenderId, // <-- Using the safe ID here!
        content: inputText,
      };

      console.log("🚀 SENDING MESSAGE TO BACKEND:", chatMessage);

      client.send("/app/chat.send", {}, JSON.stringify(chatMessage));
      setInputText(""); 
      
      setTimeout(() => {
        if (client && client.connected) {
          client.disconnect(() => console.log("👋 Disconnected cleanly"));
        }
      }, 2000); 
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-white shadow-inner">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          onClick={handleSendMessage}
          className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-4 py-2 rounded-md font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;