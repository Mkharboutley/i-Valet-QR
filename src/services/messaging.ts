
import { ref, push, set, onValue, off } from 'firebase/database';
import { getRealtimeDbInstance } from './firebase';

// Get Realtime Database instance
const getRealtimeDb = () => getRealtimeDbInstance();

// Send a general message (for compatibility with existing code)
export const sendMessage = async (ticketId: string, message: any): Promise<void> => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, `messages/${ticketId}`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      ...message,
      timestamp: Date.now(),
    });
    
    console.log('General message sent for ticket:', ticketId);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Subscribe to general messages (for compatibility with existing code)
export const subscribeToMessages = (ticketId: string, callback: (message: any) => void): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, `messages/${ticketId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback(data);
      }
    });
    
    console.log('Subscribed to general messages for ticket:', ticketId);
    
    return () => {
      off(messagesRef, 'value', unsubscribe);
      console.log('Unsubscribed from general messages for ticket:', ticketId);
    };
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    throw error;
  }
};

// Initialize realtime messaging (for compatibility with existing code)
export const initializeRealtimeMessaging = (): void => {
  console.log('Realtime messaging initialized');
  // Additional initialization logic can be added here if needed
};
