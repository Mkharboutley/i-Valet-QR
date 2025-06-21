
import React from 'react';
import { Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketListItem from './TicketListItem';

interface TicketListProps {
  tickets: Ticket[];
  messageCounts?: Record<string, number>;
  unreadCounts?: Record<string, number>;
  latestAudioUrls?: Record<string, string>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  selectedTicketId?: string;
  recentlyRequestedTickets?: Set<string>;
  recentlyMessaggedTickets?: Set<string>;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  messageCounts = {},
  unreadCounts = {},
  latestAudioUrls = {},
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  selectedTicketId,
  recentlyRequestedTickets = new Set(),
  recentlyMessaggedTickets = new Set()
}) => {
  console.log('TicketList: Rendering with data:', {
    ticketsCount: tickets.length,
    messageCounts,
    unreadCounts,
    latestAudioUrls
  });

  return (
    <div className="ticket-list">
      <div className="space-y-2">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500 glass-morphism rounded-xl p-6">
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => {
            const messageCount = messageCounts[ticket.id] || 0;
            const hasUnread = (unreadCounts[ticket.id] || 0) > 0;
            
            console.log(`Ticket ${ticket.id}:`, {
              messageCount,
              hasUnread,
              unreadCount: unreadCounts[ticket.id]
            });
            
            return (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                messageCount={messageCount}
                onTicketSelect={onTicketSelect}
                onStatusUpdate={onStatusUpdate}
                onAssignWorker={onAssignWorker}
                isSelected={selectedTicketId === ticket.id}
                hasUnreadMessages={hasUnread}
                latestAudioUrl={latestAudioUrls[ticket.id]}
                isRecentlyRequested={recentlyRequestedTickets.has(ticket.id)}
                isRecentlyMessaggedTickets={recentlyMessaggedTickets.has(ticket.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketList;
