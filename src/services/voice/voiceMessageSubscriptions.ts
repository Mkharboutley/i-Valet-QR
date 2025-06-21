
import { ref, onValue, off } from 'firebase/database';
import { getRealtimeDbInstance } from '../firebase';
import { VoiceMessage } from '../../types/VoiceMessage';

// Get Realtime Database instance
const getRealtimeDb = () => getRealtimeDbInstance();

// Voice message paths
const getVoiceMessagesPath = (ticketId: string) => `voice_messages/${ticketId}`;
const getVoiceMessagePath = (ticketId: string, messageId: string) => `voice_messages/${ticketId}/${messageId}`;

// Subscribe to voice messages for real-time updates
export const subscribeToVoiceMessages = (
  ticketId: string,
  callback: (messages: VoiceMessage[]) => void
): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, getVoiceMessagesPath(ticketId));
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages: VoiceMessage[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((messageId) => {
          const messageData = data[messageId];
          messages.push({
            ...messageData,
            id: messageId,
            timestamp: messageData.timestamp,
          });
        });
        
        // Sort by timestamp (newest first)
        messages.sort((a, b) => b.timestamp - a.timestamp);
      }
      
      callback(messages);
    });
    
    console.log('Subscribed to voice messages for ticket:', ticketId);
    
    // Return unsubscribe function
    return () => {
      off(messagesRef, 'value', unsubscribe);
      console.log('Unsubscribed from voice messages for ticket:', ticketId);
    };
  } catch (error) {
    console.error('Error subscribing to voice messages:', error);
    throw error;
  }
};

// Subscribe to a specific voice message
export const subscribeToVoiceMessage = (
  ticketId: string,
  messageId: string,
  callback: (message: VoiceMessage | null) => void
): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messageRef = ref(db, getVoiceMessagePath(ticketId, messageId));
    
    const unsubscribe = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback({
          ...data,
          id: messageId,
          timestamp: data.timestamp,
        });
      } else {
        callback(null);
      }
    });
    
    console.log('Subscribed to voice message:', messageId);
    
    // Return unsubscribe function
    return () => {
      off(messageRef, 'value', unsubscribe);
      console.log('Unsubscribed from voice message:', messageId);
    };
  } catch (error) {
    console.error('Error subscribing to voice message:', error);
    throw error;
  }
};
