import SockJS from "sockjs-client";
import { Stomp } from "stompjs";
import API from "./axios";

let stompClient = null;

export const connectWebSocket = (matchId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws-chat");
  stompClient = Stomp.over(socket);
  stompClient.debug = null; // disable debug logs

  stompClient.connect({}, () => {
    console.log("WebSocket Connected");

    stompClient.subscribe(`/topic/chat/${matchId}`, (message) => {
      const data = JSON.parse(message.body);
      onMessageReceived(data);
    });
  }, (error) => {
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
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("WebSocket Disconnected");
    });
  }
};