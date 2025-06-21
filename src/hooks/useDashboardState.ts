
import { useState, useEffect } from 'react';
import { Ticket } from '../types/Ticket';

export const useDashboardState = (tickets: Ticket[], unreadCounts: Record<string, number>) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [recentlyRequestedTickets, setRecentlyRequestedTickets] = useState<Set<string>>(new Set());
  const [recentlyMessaggedTickets, setRecentlyMessaggedTickets] = useState<Set<string>>(new Set());

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowVoiceChat(true);
    
    // Clear the recent message indicator for this ticket when opened
    setRecentlyMessaggedTickets(prev => {
      const newSet = new Set(prev);
      newSet.delete(ticket.id);
      return newSet;
    });
  };

  const handleCloseVoiceChat = () => {
    setShowVoiceChat(false);
    setSelectedTicket(null);
  };

  const addRecentlyRequestedTicket = (ticketId: string) => {
    setRecentlyRequestedTickets(prev => new Set(prev).add(ticketId));
    
    // Clear the indicator after 10 seconds
    setTimeout(() => {
      setRecentlyRequestedTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }, 10000);
  };

  // Track new messages and add to recently messaged tickets
  useEffect(() => {
    tickets.forEach(ticket => {
      const hasUnreadMessages = unreadCounts[ticket.id] > 0;
      
      if (hasUnreadMessages && !recentlyMessaggedTickets.has(ticket.id)) {
        setRecentlyMessaggedTickets(prev => new Set(prev).add(ticket.id));
        
        // Clear the indicator after 8 seconds
        setTimeout(() => {
          setRecentlyMessaggedTickets(prev => {
            const newSet = new Set(prev);
            newSet.delete(ticket.id);
            return newSet;
          });
        }, 8000);
      }
    });
  }, [unreadCounts, tickets]);

  return {
    selectedTicket,
    showVoiceChat,
    recentlyRequestedTickets,
    recentlyMessaggedTickets,
    handleTicketSelect,
    handleCloseVoiceChat,
    addRecentlyRequestedTicket
  };
};
