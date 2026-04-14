export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  room: string; // "2f" | "3f" | "4f"
  check_in: string; // YYYY-MM-DD
  check_out: string;
  guests: number;
  message: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export type ReservationInput = Omit<
  Reservation,
  "id" | "status" | "created_at" | "updated_at"
>;

export const ROOM_LABELS: Record<string, string> = {
  "2f": "2F | 2BED (최대 6명)",
  "3f": "3F | 1BED (최대 4명)",
  "4f": "4F | 1BED (최대 3명)",
};

export const ROOM_CAPACITY: Record<string, number> = {
  "2f": 6,
  "3f": 4,
  "4f": 3,
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "대기",
  confirmed: "확정",
  cancelled: "취소",
  completed: "완료",
};
