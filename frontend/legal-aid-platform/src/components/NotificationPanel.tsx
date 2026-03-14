import NotificationItem from "./NotificationItem";
import type { Notification } from "../types/NotificationType";

interface Props {
  notifications: Notification[];
  markAllRead: () => void;
  toggleRead: (id: number) => void;
}

const NotificationPanel: React.FC<Props> = ({
  notifications,
  markAllRead,
  toggleRead
}) => {

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50 max-h-96 overflow-y-auto">

      <div className="flex justify-between items-center p-3 border-b">

        <h3 className="font-semibold">Notifications</h3>

        <button
          onClick={markAllRead}
          className="text-xs text-blue-600 hover:underline"
        >
          Mark all as read
        </button>

      </div>

      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No notifications</p>
      ) : (
        notifications.map(n => (
          <NotificationItem
            key={n.id}
            notification={n}
            onToggleRead={toggleRead}
          />
        ))
      )}

    </div>
  );
};

export default NotificationPanel;