export interface Screen {
  id: number;
  name: string;
  isActive: boolean;
  startTime: number | null; // Timestamp
}

export interface SessionRecord {
  id: string;
  screenName: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  cost: number;
}

export interface Stats {
  totalSessions: number;
  totalRevenue: number;
}