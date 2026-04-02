import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../auth/AuthContext";

interface MatchDTO {
  matchId: number;
  displayName: string;
  providerName?: string;
  clientName?: string;
  providerEmail?: string;
  clientEmail?: string;
  providerPhone?: string;
  clientPhone?: string;
  providerType?: string;
}

interface ChatMessageData {
  id: number;
  matchId: number;
  senderId: number;
  content: string;
  timestamp: string;
}

interface Props {
  selectedUser: MatchDTO;
}

const ChatMessages: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    let isActive = true;
    let stompClient: any = null;

    const token = localStorage.getItem("accessToken");
    const matchId = selectedUser.matchId;

    if (!matchId) return;

    // 1. LOAD HISTORY
    axios
      .get(`http://localhost:8081/chats/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (isActive) setMessages(res.data);
      })
      .catch((err) => console.error("Failed to load history:", err));

    // 2. CONNECT TO WEBSOCKET
    // Keep a reference to the raw socket so we can always close it,
    // even if STOMP hasn't finished connecting yet (fixes the memory leak).
    const socket = new SockJS("http://localhost:8081/ws-chat");
    stompClient = Stomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      if (!isActive) {
        stompClient.disconnect();
        return;
      }

      stompClient.subscribe(`/topic/match/${matchId}`, (message: any) => {
        if (isActive) {
          const received: ChatMessageData = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
        }
      });
    });

    // 3. CLEANUP — close the raw socket regardless of STOMP connection state
    return () => {
      isActive = false;
      socket.close();
      if (stompClient?.connected) {
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
        messages.map((msg) => {
          const isMe = String(msg.senderId) === String(user?.id);

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg shadow max-w-xs ${
                  isMe
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black border border-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
