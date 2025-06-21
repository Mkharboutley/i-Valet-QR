import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  FieldValue,
  setDoc
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { Ticket, TicketStatus } from '../types/Ticket';
import { releaseSlotByTicketId } from '../utils/slotUtils'; // ✅ NEW

// Type for ticket updates with optional timestamp fields
type TicketUpdatePayload = {
  status: TicketStatus;
  updated_at: FieldValue;
  requested_at?: FieldValue;
  assigned_at?: FieldValue;
  completed_at?: FieldValue;
  cancelled_at?: FieldValue;
  [key: string]: any; // Allow additional fields
};

export const getLatestTicketNumber = async (): Promise<number> => {
  const firestore = getFirestoreInstance();
  const ticketsCollection = collection(firestore, 'tickets');
  const q = query(ticketsCollection, orderBy('ticket_number', 'desc'));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return 0;
  }

  const latestTicket = querySnapshot.docs[0].data();
  return latestTicket.ticket_number || 0;
};

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
  additionalData?: any
) => {
  const firestore = getFirestoreInstance();
  const ticketRef = doc(firestore, 'tickets', ticketId);

  const updateData: TicketUpdatePayload = {
    status,
    updated_at: serverTimestamp(),
    ...additionalData
  };

  if (status === 'requested') {
    updateData.requested_at = serverTimestamp();
  } else if (status === 'assigned') {
    updateData.assigned_at = serverTimestamp();
  } else if (status === 'completed') {
    updateData.completed_at = serverTimestamp();

    // ✅ Release parking slot when completed
    try {
      await releaseSlotByTicketId(ticketId);
      console.log(`✅ Released parking slot for ticket ${ticketId}`);
    } catch (e) {
      console.error(`❌ Failed to release parking slot:`, e);
    }
  } else if (status === 'cancelled') {
    updateData.cancelled_at = serverTimestamp();
  }

  await updateDoc(ticketRef, updateData);
  console.log('Ticket status updated successfully');
};

export const updatePublicTicketStatus = async (ticketId: string, status: TicketStatus) => {
  console.log('🔧 updatePublicTicketStatus: Starting update for PUBLIC access...');
  console.log('🔧 updatePublicTicketStatus: ticketId:', ticketId);
  console.log('🔧 updatePublicTicketStatus: status:', status);

  try {
    const firestore = getFirestoreInstance();
    const ticketRef = doc(firestore, 'tickets', ticketId);

    const updateData: TicketUpdatePayload = {
      status,
      updated_at: serverTimestamp()
    };

    if (status === 'requested') {
      updateData.requested_at = serverTimestamp();
    } else if (status === 'assigned') {
      updateData.assigned_at = serverTimestamp();
    } else if (status === 'completed') {
      updateData.completed_at = serverTimestamp();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = serverTimestamp();
    }

    console.log('🔧 updatePublicTicketStatus: Calling updateDoc with data:', updateData);
    await updateDoc(ticketRef, updateData);
    console.log('✅ updatePublicTicketStatus: SUCCESS - Document updated');

    return { success: true };
  } catch (error) {
    console.error('❌ updatePublicTicketStatus: ERROR during update:', error);
    console.error('❌ updatePublicTicketStatus: Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const getPublicTicketById = async (ticketId: string) => {
  console.log('🔧 getPublicTicketById: Starting fetch for PUBLIC access...');
  console.log('🔧 getPublicTicketById: ticketId:', ticketId);

  try {
    const firestore = getFirestoreInstance();
    const ticketRef = doc(firestore, 'tickets', ticketId);
    const docSnapshot = await getDoc(ticketRef);

    if (docSnapshot.exists()) {
      const ticketData = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as Ticket;

      console.log('✅ getPublicTicketById: SUCCESS - Ticket found');
      return ticketData;
    } else {
      console.log('❌ getPublicTicketById: Ticket not found');
      throw new Error('Ticket not found');
    }
  } catch (error) {
    console.error('❌ getPublicTicketById: ERROR during fetch:', error);
    throw error;
  }
};

export const createTicket = async (ticketData: Omit<Ticket, 'id'>) => {
  const firestore = getFirestoreInstance();
  const ticketsCollection = collection(firestore, 'tickets');

  const docRef = await addDoc(ticketsCollection, {
    ...ticketData,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });

  return docRef.id;
};

export const getTickets = async () => {
  const firestore = getFirestoreInstance();
  const ticketsCollection = collection(firestore, 'tickets');
  const q = query(ticketsCollection, orderBy('created_at', 'desc'));

  const querySnapshot = await getDocs(q);
  const tickets: Ticket[] = [];

  querySnapshot.forEach((doc) => {
    tickets.push({
      id: doc.id,
      ...doc.data()
    } as Ticket);
  });

  return tickets;
};

export const deleteTicket = async (ticketId: string) => {
  const firestore = getFirestoreInstance();
  const ticketRef = doc(firestore, 'tickets', ticketId);
  await deleteDoc(ticketRef);
};

export const subscribeToTickets = (callback: (tickets: Ticket[]) => void) => {
  const firestore = getFirestoreInstance();
  const ticketsCollection = collection(firestore, 'tickets');
  const q = query(ticketsCollection, orderBy('created_at', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const tickets: Ticket[] = [];
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      } as Ticket);
    });
    callback(tickets);
  });
};

// ✅ Set max slot capacity for admin settings
export const setAdminSlotCapacity = async (facilityId: string, maxSlots: number) => {
  const firestore = getFirestoreInstance();
  const docRef = doc(firestore, 'admin_config', facilityId);
  await setDoc(docRef, { max_slots: maxSlots }, { merge: true });
};

export const getAdminSlotCapacity = async (facilityId: string): Promise<number> => {
  const firestore = getFirestoreInstance();
  const docRef = doc(firestore, 'admin_config', facilityId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().max_slots || 0 : 0;
};
