
import { updatePublicTicketStatus, getPublicTicketById } from '../../services/firestore';
import { TicketStatus } from '../../types/Ticket';

// Public ticket operations (no auth required)
export const updatePublicTicket = async (ticketId: string, status: TicketStatus) => {
  console.log('🔧 updatePublicTicket: Starting PUBLIC ticket update...');
  console.log('🔧 updatePublicTicket: ticketId:', ticketId);
  console.log('🔧 updatePublicTicket: status:', status);
  
  try {
    const result = await updatePublicTicketStatus(ticketId, status);
    console.log('✅ updatePublicTicket: SUCCESS - Public ticket updated');
    return result;
  } catch (error) {
    console.error('❌ updatePublicTicket: ERROR during public update:', error);
    throw error;
  }
};

export const getPublicTicket = async (ticketId: string) => {
  console.log('🔧 getPublicTicket: Starting PUBLIC ticket fetch...');
  console.log('🔧 getPublicTicket: ticketId:', ticketId);
  
  try {
    const result = await getPublicTicketById(ticketId);
    console.log('✅ getPublicTicket: SUCCESS - Public ticket fetched');
    return result;
  } catch (error) {
    console.error('❌ getPublicTicket: ERROR during public fetch:', error);
    throw error;
  }
};
