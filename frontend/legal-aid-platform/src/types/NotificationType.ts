export type NotificationType =
  | "MATCH"
  | "MESSAGE"
  | "APPOINTMENT"
  | "SYSTEM";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}