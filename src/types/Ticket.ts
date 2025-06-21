import { Timestamp } from 'firebase/firestore';

export type TicketStatus = 'running' | 'requested' | 'assigned' | 'completed' | 'cancelled';

export interface Ticket {
  id: string;
  ticket_number: number;
  car_model: string;
  plate_number: string;
  status: TicketStatus;
  created_at: Timestamp;
  updated_at?: Timestamp;
  requested_at?: Timestamp;
  assigned_at?: Timestamp;
  completed_at?: Timestamp;
  cancelled_at?: Timestamp;
  assigned_worker?: string;
  eta_minutes?: number;
  client_token?: string;
  notification_sent?: boolean;
  notification_failed?: boolean;
  notification_error?: string;
  notification_sent_at?: string;
  notification_attempted_at?: string;
}
