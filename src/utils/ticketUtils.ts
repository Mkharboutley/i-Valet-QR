
import { Timestamp } from 'firebase/firestore';

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createTicketData = (
  ticketNumber: number,
  plateNumber: string,
  carModel: string
) => {
  return {
    ticket_number: ticketNumber,
    visitor_id: generateUniqueId(),
    plate_number: plateNumber,
    car_model: carModel,
    vehicle_info: `${carModel} - ${plateNumber}`,
    status: 'running' as const,
    requested_at: null,
    assigned_at: null,
    assigned_worker: null,
    cancelled_at: null,
    completed_at: null,
    eta_minutes: null,
    ticket_url: '',
    pre_alert_sent: false,
    client_token: generateUniqueId(),
    created_at: Timestamp.fromDate(new Date()) // Use Firestore Timestamp instead of Date
  };
};
