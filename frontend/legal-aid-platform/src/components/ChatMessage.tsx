import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../auth/AuthContext";

interface Props {
  selectedUser: any; // , selectedUser.id acts as the matchId
}

const ChatMessages: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const token = localStorage.getItem("accessToken");
    const matchId = selectedUser.id;

    // 1. FETCH CHAT HISTORY
    axios.get(`http://localhost:8081/chats/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setMessages(res.data))
    .catch((err) => console.error("Failed to load history:", err));

    // 2. CONNECT TO WEBSOCKET 
    const socket = new SockJS("http://localhost:8081/ws-chat");
    const client = Stomp.over(socket);
    client.debug = () => {}; // Hides the spammy console logs

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      // 3. LISTEN FOR NEW MESSAGES
      client.subscribe(`/topic/match/${matchId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    });

    // Cleanup connection when switching chats or unmounting
    return () => {
      if (client) client.disconnect();
    };
  }, [selectedUser, user]);

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-4">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((msg, index) => {
          // Check if you sent the message, or if the other person did
          const isMe = msg.senderId === user.id; 

          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg shadow max-w-xs ${isMe ? "bg-purple-600 text-white" : "bg-white text-black"}`}>
                {msg.content}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatMessages;