import React, { useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../auth/AuthContext";

interface Props {
  selectedUser: any; //  this holds the matchId
}

const MessageInput: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    // Prevent sending empty messages or sending if user data isn't loaded
    if (!inputText.trim() || !user || !selectedUser) return;

    const token = localStorage.getItem("accessToken");
    const socket = new SockJS("http://localhost:8081/ws-chat");
    const client = Stomp.over(socket);
    
    // Hide spammy console logs from STOMP
    client.debug = () => {}; 

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      
      
      const chatMessage = {
        matchId: selectedUser.id, 
        senderId: user.id, 
        content: inputText,
      };

      
      client.send("/app/chat.send", {}, JSON.stringify(chatMessage));
      
      setInputText(""); // Clear the input box immediately
      client.disconnect(); // Close this temporary sending connection
    });
  };

  // Allows hitting "Enter" to send the message
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