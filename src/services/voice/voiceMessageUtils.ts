
import { updateVoiceMessage, getVoiceMessages } from './voiceMessageOperations';
import { requireAuth } from '../authUtils';

// Mark voice message as played
export const markVoiceMessageAsPlayed = async (ticketId: string, messageId: string): Promise<void> => {
  // Verify authentication before proceeding
  requireAuth();
  return updateVoiceMessage(ticketId, messageId, { isPlaying: false });
};

// Set voice message playing status
export const setVoiceMessagePlayingStatus = async (
  ticketId: string,
  messageId: string,
  isPlaying: boolean
): Promise<void> => {
  // Verify authentication before proceeding
  requireAuth();
  return updateVoiceMessage(ticketId, messageId, { isPlaying });
};

// Get voice message count for a ticket
export const getVoiceMessageCount = async (ticketId: string): Promise<number> => {
  try {
    // Verify authentication before proceeding
    requireAuth();
    const messages = await getVoiceMessages(ticketId);
    return messages.length;
  } catch (error) {
    console.error('Error getting voice message count:', error);
    return 0;
  }
};
