import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Bell, Check, CheckCheck, Star, MessageCircle, Calendar, X, ExternalLink } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_MATCH':
      case 'MATCH':
      case 'MATCH_ACCEPTED':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'NEW_MESSAGE':
      case 'MESSAGE':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'APPOINTMENT':
      case 'APPOINTMENT_UPDATED':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
              <button onClick={() => { setIsOpen(false); navigate("/notifications"); }}
                className="text-slate-400 hover:text-blue-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No notifications yet</p>
              </div>
            )}

            {notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 cursor-pointer transition-colors ${
                  !n.read ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="border-t border-slate-100 px-5 py-2.5">
              <button onClick={() => { setIsOpen(false); navigate("/notifications"); }}
                className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
