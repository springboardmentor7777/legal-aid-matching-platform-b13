import type { Notification } from "../types/NotificationType";

interface Props {
  notification: Notification;
  onToggleRead: (id: number) => void;
}

const NotificationItem: React.FC<Props> = ({ notification, onToggleRead }) => {
  return (
    <>
      {notification.isRead !== true && (
        <div
          onClick={() => onToggleRead(notification.id)}
          className={`p-3 border-b cursor-pointer hover:bg-gray-50
      ${notification.isRead ? "bg-white" : "bg-blue-50 font-medium"}`}
        >
          <p className="text-sm">{notification.message}</p>

          <span className="text-xs text-gray-500">{notification.type}</span>
        </div>
      )}
    </>
  );
};

export default NotificationItem;
