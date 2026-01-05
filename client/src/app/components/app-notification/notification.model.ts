export interface AppNotification {
  id: number;
  user_id: number | null;
  project_id: number | null;
  board_id: number | null;
  card_id: number | null;
  type: string;
  message: string;
  created_at: string; // ISO string from backend
}

export interface CreateNotificationPayload {
  user_id: number;
  type: string;
  message: string;
  project_id?: number | null;
  board_id?: number | null;
  card_id?: number | null;
}
