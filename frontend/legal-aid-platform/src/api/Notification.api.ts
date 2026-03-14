import type { Notification } from "../types/NotificationType";

const BASE_URL = "http://localhost:8081"; // Replace with your backend URL

// Fetch all notifications from backend
export const fetchNotifications = async (): Promise<Notification[]> => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Error fetching notifications: ${res.status}`);
    }

    // Assuming your backend returns a list of NotificationResponseDto
    const data: Notification[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Return empty array on failure
  }
};

// Mark a notification as read/unread
export const markNotificationAsRead = async (
  id: number,
  isRead: boolean,
  token: string
): Promise<{ [key: number]: boolean } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ isRead })
    });

    if (!res.ok) {
      throw new Error(`Error updating notification: ${res.status}`);
    }

    const result: { [key: number]: boolean } = await res.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};