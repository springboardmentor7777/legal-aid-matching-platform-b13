import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../auth/AuthContext";

interface Props {
  selectedUser: any; 
}

const ChatMessages: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    let isActive = true; 
    let stompClient: any = null;

    const token = localStorage.getItem("accessToken");
    const matchId = selectedUser.matchId || selectedUser.id;

    if (!matchId) return;

    
    axios.get(`http://localhost:8081/chats/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (isActive) setMessages(res.data); 
    })
    .catch((err) => console.error("Failed to load history:", err));

    // 2. CONNECT TO WEBSOCKET
    const socket = new SockJS("http://localhost:8081/ws-chat");
    stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      // If the user clicked away while it was connecting, disconnect immediately!
      if (!isActive) {
        stompClient.disconnect();
        return;
      }

      stompClient.subscribe(`/topic/match/${matchId}`, (message: any) => {
        if (isActive) {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        }
      });
    });

    // 3. CLEANUP: When you click another user, this runs instantly to kill the old chat
    return () => {
      isActive = false; 
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [selectedUser, user]);

  return (
    <div className="p-6 h-full flex flex-col gap-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-4">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((msg, index) => {
          const textContent = msg.content || msg.message || "[Empty Message]";
          const msgSenderId = msg.senderId || (msg.sender && msg.sender.id);
          
          // Using String() ensures it matches perfectly even if one is a number
          const isMe = String(msgSenderId) === String(user.id); 

          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg shadow max-w-xs ${isMe ? "bg-purple-600 text-white" : "bg-white text-black border border-gray-200"}`}>
                {textContent}
              </div>
            </div>
          );
        })
      )}
      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;