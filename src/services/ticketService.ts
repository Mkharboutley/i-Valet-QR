import { getDatabase, ref, set, update, onValue } from "firebase/database";
import { FIREBASE_PATHS } from "../constants/firebase";
import { TICKET_FIELDS } from "../constants/fieldNames";

export const createTicket = async (ticketId: string, data: any) => {
  const db = getDatabase();
  await set(ref(db, `${FIREBASE_PATHS.tickets}/${ticketId}`), {
    ...data,
    [TICKET_FIELDS.created_at]: Date.now(),
    [TICKET_FIELDS.updatedAt]: Date.now(),
  });
};

export const updateTicketStatus = async (ticketId: string, status: string, additionalData?: any) => {
  const db = getDatabase();
  const updateData = {
    [TICKET_FIELDS.status]: status,
    [TICKET_FIELDS.updatedAt]: Date.now(),
    ...additionalData,
  };

  // Add timestamp fields based on status
  if (status === 'requested') {
    updateData[TICKET_FIELDS.requestedAt] = Date.now();
  } else if (status === 'assigned') {
    updateData[TICKET_FIELDS.assignedAt] = Date.now();
    // Keep worker info if provided
    if (additionalData?.assigned_worker) {
      updateData[TICKET_FIELDS.assignedWorker] = additionalData.assigned_worker;
    }
    if (additionalData?.eta_minutes) {
      updateData[TICKET_FIELDS.etaMinutes] = additionalData.eta_minutes;
    }
  } else if (status === 'completed') {
    updateData[TICKET_FIELDS.completedAt] = Date.now();
  } else if (status === 'cancelled') {
    updateData[TICKET_FIELDS.cancelledAt] = Date.now();
  }

  await update(ref(db, `${FIREBASE_PATHS.tickets}/${ticketId}`), updateData);
  console.log('Ticket status updated to:', status, 'with data:', updateData);
};

export const subscribeToTicketUpdates = (ticketId: string, callback: (ticket: any) => void) => {
  const db = getDatabase();
  const ticketRef = ref(db, `${FIREBASE_PATHS.tickets}/${ticketId}`);
  
  const unsubscribe = onValue(ticketRef, (snapshot) => {
    if (snapshot.exists()) {
      const ticketData = snapshot.val();
      callback({
        id: ticketId,
        ...ticketData,
      });
    }
  });

  return unsubscribe;
};
