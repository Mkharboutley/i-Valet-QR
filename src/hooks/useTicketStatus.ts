
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Ticket } from '../types/Ticket';
import { logClientTokenRegistration, notifyStatusChange } from '../services/notifications';

export const useTicketStatus = (ticketId: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) {
      console.log('🎫 useTicketStatus: No ticket ID provided');
      setIsLoading(false);
      return;
    }

    console.log('🎫 useTicketStatus: Setting up real-time listener for ticket:', ticketId);
    
    const firestore = getFirestoreInstance();
    const ticketRef = doc(firestore, 'tickets', ticketId);

    const unsubscribe = onSnapshot(
      ticketRef,
      (docSnapshot) => {
        console.log('🎫 useTicketStatus: Document snapshot received');
        
        if (docSnapshot.exists()) {
          const ticketData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as Ticket;
          
          console.log('🎫 useTicketStatus: Ticket data updated:', ticketData);
          console.log('🎫 useTicketStatus: Previous status:', previousStatus);
          console.log('🎫 useTicketStatus: New status:', ticketData.status);
          
          // Log client token for debugging
          if (ticketData.client_token) {
            logClientTokenRegistration(ticketId, ticketData.client_token);
          } else {
            console.warn('🔔 No client_token found in ticket data');
          }
          
          // Check for status changes and trigger local notifications
          if (previousStatus && previousStatus !== ticketData.status) {
            console.log('🔔 Status change detected:', {
              from: previousStatus,
              to: ticketData.status,
              ticketNumber: ticketData.ticket_number
            });
            
            // Trigger local notification for important status changes
            if (['assigned', 'completed'].includes(ticketData.status)) {
              notifyStatusChange(ticketData.status, ticketData.ticket_number);
            }
          }
          
          setTicket(ticketData);
          setPreviousStatus(ticketData.status);
          setError(null);
        } else {
          console.log('🎫 useTicketStatus: Ticket not found:', ticketId);
          setError(new Error('Ticket not found'));
          setTicket(null);
        }
        
        setIsLoading(false);
      },
      (err) => {
        console.error('🎫 useTicketStatus: Error listening to ticket:', err);
        setError(err instanceof Error ? err : new Error('Failed to load ticket'));
        setIsLoading(false);
      }
    );

    return () => {
      console.log('🎫 useTicketStatus: Cleaning up listener for ticket:', ticketId);
      unsubscribe();
    };
  }, [ticketId, previousStatus]);

  return {
    ticket,
    isLoading,
    error
  };
};
