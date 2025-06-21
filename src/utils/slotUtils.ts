import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';

// ✅ Assign first available parking slot
export const assignFirstFreeSlot = async (ticketId: string): Promise<number | null> => {
  const db = getFirestoreInstance();
  const slotsRef = collection(db, 'parking_slots');

  const q = query(slotsRef, where('occupied', '==', false), orderBy('slot_number'), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const slotDoc = snapshot.docs[0];
  const slotNumber = slotDoc.data().slot_number;

  await updateDoc(slotDoc.ref, {
    occupied: true,
    current_ticket: ticketId,
    updated_at: Timestamp.now()
  });

  return slotNumber;
};

// ✅ Release the slot when ticket is completed
export const releaseSlotByTicketId = async (ticketId: string): Promise<boolean> => {
  const db = getFirestoreInstance();

  const ticketRef = doc(db, 'tickets', ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (!ticketSnap.exists()) return false;

  const slotNumber = ticketSnap.data()?.slot_number;
  if (slotNumber === undefined) return false;

  const q = query(
    collection(db, 'parking_slots'),
    where('slot_number', '==', slotNumber),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return false;

  const slotDoc = snap.docs[0];
  await updateDoc(slotDoc.ref, {
    occupied: false,
    current_ticket: '',
    updated_at: Timestamp.now()
  });

  return true;
};
