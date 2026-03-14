import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";
import type { Notification } from "../types/NotificationType";
import { fetchNotifications }  from "../api/Notification.api";

const NotificationBell = () => {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative">

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

      {open && (
        <NotificationPanel
          notifications={notifications}
          markAllRead={markAllRead}
          toggleRead={toggleRead}
        />
      )}

    </div>
  );
};

export default NotificationBell;