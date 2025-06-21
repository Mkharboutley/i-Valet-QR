
import { useState, useEffect } from 'react';
import { subscribeToTickets } from '../services/firestore';
import { subscribeToVoiceMessages } from '../services/realtime';
import { Ticket } from '../types/Ticket';
import { VoiceMessage } from '../types/VoiceMessage';
import { useToast } from '@/hooks/use-toast';

export const useTicketData = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [latestAudioUrls, setLatestAudioUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use real-time subscription for immediate updates
  useEffect(() => {
    console.log('🎫 useTicketData: Setting up real-time ticket subscription...');
    
    const unsubscribe = subscribeToTickets((ticketData: Ticket[]) => {
      console.log('🎫 useTicketData: Real-time update received:', ticketData.length, 'tickets');
      console.log('🎫 useTicketData: Ticket statuses:', ticketData.map(t => ({ id: t.id, status: t.status, ticket_number: t.ticket_number })));
      
      // Specifically log requested tickets
      const requestedTickets = ticketData.filter(t => t.status === 'requested');
      console.log('🎫 useTicketData: Found requested tickets:', requestedTickets.length);
      if (requestedTickets.length > 0) {
        console.log('🎫 useTicketData: Requested tickets details:', requestedTickets.map(t => ({ 
          id: t.id, 
          ticket_number: t.ticket_number, 
          status: t.status,
          requested_at: t.requested_at 
        })));
      }
      
      setTickets(ticketData);
      setIsLoading(false);
    });

    return () => {
      console.log('🎫 useTicketData: Cleaning up real-time subscription');
      unsubscribe();
    };
  }, []);

  // Subscribe to voice messages for all tickets
  useEffect(() => {
    if (tickets.length === 0) return;

    const unsubscribeFunctions: (() => void)[] = [];

    tickets.forEach((ticket) => {
      const unsubscribe = subscribeToVoiceMessages(ticket.id, (messages: VoiceMessage[]) => {
        // Update message counts
        setMessageCounts(prev => ({
          ...prev,
          [ticket.id]: messages.length
        }));

        // Calculate unread messages (for demo, we'll consider recent messages as unread)
        const recentMessages = messages.filter(msg => 
          Date.now() - msg.timestamp < 5 * 60 * 1000 // Last 5 minutes
        );
        setUnreadCounts(prev => ({
          ...prev,
          [ticket.id]: recentMessages.length
        }));

        // Get latest audio URL if available
        if (messages.length > 0) {
          setLatestAudioUrls(prev => ({
            ...prev,
            [ticket.id]: messages[0].storage_path
          }));
        }
      });

      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [tickets]);

  // Manual reload function for error recovery
  const reloadTickets = async () => {
    console.log('🔄 useTicketData: Manual reload requested (will be handled by real-time subscription)');
    // No need to manually reload since we're using real-time subscriptions
    // This function is kept for compatibility with existing code
  };

  return {
    tickets,
    messageCounts,
    unreadCounts,
    latestAudioUrls,
    isLoading,
    reloadTickets
  };
};
