
import { 
  createVoiceMessage, 
  getVoiceMessages, 
  updateVoiceMessage,
  deleteVoiceMessage,
  deleteAllVoiceMessages
} from '../../services/voice-messages';
import { VoiceMessage } from '../../types/VoiceMessage';

export const createVoice = async (ticketId: string, messageData: Omit<VoiceMessage, 'id' | 'timestamp'>) => {
  return createVoiceMessage(ticketId, messageData);
};

export const getVoiceMessagesForTicket = async (ticketId: string) => {
  return getVoiceMessages(ticketId);
};

export const updateVoice = async (ticketId: string, messageId: string, updates: Partial<VoiceMessage>) => {
  return updateVoiceMessage(ticketId, messageId, updates);
};

export const deleteVoice = async (ticketId: string, messageId: string) => {
  return deleteVoiceMessage(ticketId, messageId);
};

export const deleteAllVoices = async (ticketId: string) => {
  return deleteAllVoiceMessages(ticketId);
};
