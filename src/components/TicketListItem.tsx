import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, Car, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Ticket, TicketStatus } from '../types/Ticket';
import StatusBadge from './StatusBadge';
import PriorityBadge, { Priority } from './PriorityBadge';
import StatusDropdown from './StatusDropdown';
import InlineAudioPreview from './InlineAudioPreview';

interface TicketListItemProps {
  ticket: Ticket;
  messageCount: number;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  isSelected: boolean;
  hasUnreadMessages?: boolean;
  latestAudioUrl?: string;
  isRecentlyRequested?: boolean;
  isRecentlyMessaggedTickets?: boolean;
}

const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  messageCount,
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  isSelected,
  hasUnreadMessages = false,
  latestAudioUrl,
  isRecentlyRequested = false,
  isRecentlyMessaggedTickets = false
}) => {
  const calculatePriority = (ticket: Ticket): Priority => {
    const now = new Date();
    const createdAt = ticket.created_at.toDate();
    const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    if (ticket.status === 'requested' && ageInHours > 2) return 'urgent';
    if (ticket.status === 'assigned' && ageInHours > 4) return 'high';
    if (ticket.status === 'running' && ageInHours > 1) return 'medium';
    return 'low';
  };

  const handleOpenVoiceChat = () => {
    onTicketSelect(ticket);
  };

  const getCardStyling = () => {
    let baseClasses = "ticket-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] touch-action-manipulation relative";
    
    if (isSelected) {
      baseClasses += " ring-2 ring-blue-500 shadow-2xl bg-white/[0.15]";
    }
    
    if (isRecentlyRequested) {
      baseClasses += " animate-pulse bg-orange-500/20 border border-orange-400/50 shadow-lg shadow-orange-500/30";
    }
    
    if (isRecentlyMessaggedTickets && !isRecentlyRequested) {
      baseClasses += " animate-pulse bg-green-500/10 border border-green-400/30 shadow-lg shadow-green-500/20";
    }
    
    return baseClasses;
  };

  return (
    <Card 
      className={getCardStyling()}
      onClick={() => onTicketSelect(ticket)}
    >
      <CardContent className="p-3 h-full flex flex-col justify-between">
        {hasUnreadMessages && (
          <div className="absolute -top-2 -right-2 z-20">
            <Badge className="animate-pulse bg-green-500 text-white border-2 border-green-400 shadow-lg text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              {messageCount}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">#{ticket.ticket_number}</span>
            <PriorityBadge priority={calculatePriority(ticket)} size="sm" />
            {isRecentlyRequested && (
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full animate-pulse font-bold">
                NEW REQUEST
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <div onClick={(e) => e.stopPropagation()}>
              <StatusDropdown
                ticket={ticket}
                onStatusUpdate={onStatusUpdate}
                onAssignWorker={onAssignWorker}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Car className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-200 truncate">{ticket.car_model} ({ticket.plate_number})</span>
        </div>

        {/* Parking Slot Row */}
        {ticket.slot_number && (
          <div className="flex items-center gap-2 mb-2 text-xs text-indigo-300">
            <span className="font-semibold">🅿️ Slot:</span>
            <span>{ticket.slot_number}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{ticket.created_at.toDate().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>

          {messageCount > 0 && (
            <div className="flex items-center gap-2">
              <InlineAudioPreview
                messageCount={messageCount}
                hasUnread={hasUnreadMessages}
                onOpenVoiceChat={handleOpenVoiceChat}
                latestAudioUrl={latestAudioUrl}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketListItem;
