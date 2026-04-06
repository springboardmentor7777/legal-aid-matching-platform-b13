import { useState, useEffect } from "react";
import API from "../api/axios";
import { Bell, Star, MessageCircle, Calendar, CheckCheck, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/notifications");
      setNotifications(res.data?.notifications || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    for (const n of notifications.filter(n => !n.read)) {
      await markAsRead(n.id);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_MATCH': case 'MATCH': case 'MATCH_ACCEPTED': case 'MATCH_REJECTED':
        return <Star className="w-5 h-5 text-amber-500" />;
      case 'NEW_MESSAGE': case 'MESSAGE':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'APPOINTMENT': case 'APPOINTMENT_UPDATED':
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all border border-blue-200">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">All caught up!</p>
          <p className="text-slate-400 text-sm mt-1">No notifications to show</p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.read && markAsRead(n.id)}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
              !n.read
                ? "bg-blue-50/70 border-blue-200 hover:bg-blue-50 shadow-sm"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm flex-shrink-0">
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                  {n.title}
                </h3>
                {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>}
              </div>
              <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              <p className="text-xs text-slate-400 mt-2">{formatTime(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
