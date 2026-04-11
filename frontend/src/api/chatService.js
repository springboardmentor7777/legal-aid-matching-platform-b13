import SockJS from "sockjs-client";
import { over } from "stompjs";
import API from "./axios";

let stompClient = null;
let isConnecting = false;

export const connectWebSocket = (matchId, onMessageReceived) => {
  // Prevent duplicate connections
  if (stompClient && stompClient.connected) {
    return;
  }
  if (isConnecting) {
    return;
  }

  isConnecting = true;
  const socket = new SockJS("http://localhost:8080/ws-chat");
  stompClient = over(socket);
  stompClient.debug = null; // disable debug logs

  stompClient.connect({}, () => {
    isConnecting = false;
    console.log("WebSocket Connected");

    stompClient.subscribe(`/topic/chat/${matchId}`, (message) => {
      const data = JSON.parse(message.body);
      onMessageReceived(data);
    });
  }, (error) => {
    isConnecting = false;
    console.error("WebSocket Error:", error);
  });
};

export const sendMessage = (matchId, senderEmail, content) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket not connected");
    return;
  }

  stompClient.send(
    "/app/chat.sendMessage",
    {},
    JSON.stringify({
      matchId,
      senderEmail,
      content
    })
  );
};

export const getChatHistory = async (matchId) => {
  try {
    const response = await API.get(`/api/chats/${matchId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const disconnectWebSocket = () => {
  isConnecting = false;
  if (stompClient && stompClient.connected) {
    try {
      stompClient.disconnect(() => {
        console.log("WebSocket Disconnected");
      });
    } catch (e) {
      // Ignore disconnect errors (connection may already be closed)
    }
  }
  stompClient = null;
};