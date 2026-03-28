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

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken"); 
      
      if (!token) return;

      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        // Ensure data is an array before setting state
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    //  INTEGRATION BOOST: Check for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleRead = async (id: number) => {
    // Optimistic UI update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

    try {
      const token = localStorage.getItem("accessToken"); 
      await fetch(`${BASE_URL}/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "isRead":true
        })
      });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // Add fetch call here if provides a /read-all endpoint
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-900 text-xl relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <NotificationPanel
            notifications={notifications}
            toggleRead={toggleRead}
            markAllRead={markAllRead}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;