import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell = () => {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const BASE_URL = "http://localhost:8081/notifications";

  // 🔥 Fetch notifications from backend
  const loadNotifications = async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setNotifications(data);

    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 🔥 Mark single notification as read
  const toggleRead = async (id: number) => {

    // Optimistic UI update
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );

    try {
      await fetch(`${BASE_URL}/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ isRead: true })
      });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // 🔥 (Optional) Mark all as read
  const markAllRead = async () => {

    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

    // Only works if backend provides this API
    // await fetch(`${BASE_URL}/read-all`, { method: "PUT" });
  };

  return (
    <div className="relative">

      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-900 text-xl relative"
      >
        <FaBell />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <NotificationPanel
          notifications={notifications}
          toggleRead={toggleRead}
          markAllRead={markAllRead}
        />
      )}

    </div>
  );
};

export default NotificationBell;
