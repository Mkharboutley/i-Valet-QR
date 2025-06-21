
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketList from './TicketList';

interface TicketTabsProps {
  tickets: Ticket[];
  messageCounts?: Record<string, number>;
  unreadCounts?: Record<string, number>;
  latestAudioUrls?: Record<string, string>;
  onTicketSelect?: (ticket: Ticket) => void;
  onStatusUpdate?: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker?: (ticket: Ticket) => void;
  selectedTicketId?: string;
  recentlyRequestedTickets?: Set<string>;
  recentlyMessaggedTickets?: Set<string>;
}

const TicketTabs: React.FC<TicketTabsProps> = ({
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
  const filterTicketsByStatus = (status: TicketStatus) => {
    const filtered = tickets.filter(ticket => ticket.status === status);
    console.log(`🎫 TicketTabs: Filtering by status "${status}":`, filtered.length, 'tickets found');
    if (status === 'requested') {
      console.log('🎫 TicketTabs: Requested tickets details:', filtered.map(t => ({ 
        id: t.id, 
        ticket_number: t.ticket_number, 
        status: t.status 
      })));
    }
    return filtered;
  };

  console.log('🎫 TicketTabs: Total tickets received:', tickets.length);
  console.log('🎫 TicketTabs: All ticket statuses:', tickets.map(t => ({ id: t.id, status: t.status, ticket_number: t.ticket_number })));

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5 glass-morphism-strong rounded-xl p-1 shadow-xl">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:glass-morphism data-[state=active]:rounded-lg text-gray-300 data-[state=active]:text-white font-light transition-all duration-300"
        >
          All ({tickets.length})
        </TabsTrigger>
        <TabsTrigger 
          value="running"
          className="data-[state=active]:glass-morphism data-[state=active]:rounded-lg text-gray-300 data-[state=active]:text-white font-light transition-all duration-300"
        >
          Running ({filterTicketsByStatus('running').length})
        </TabsTrigger>
        <TabsTrigger 
          value="requested"
          className="data-[state=active]:glass-morphism data-[state=active]:rounded-lg text-gray-300 data-[state=active]:text-white font-light transition-all duration-300"
        >
          Requested ({filterTicketsByStatus('requested').length})
        </TabsTrigger>
        <TabsTrigger 
          value="assigned"
          className="data-[state=active]:glass-morphism data-[state=active]:rounded-lg text-gray-300 data-[state=active]:text-white font-light transition-all duration-300"
        >
          Assigned ({filterTicketsByStatus('assigned').length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed"
          className="data-[state=active]:glass-morphism data-[state=active]:rounded-lg text-gray-300 data-[state=active]:text-white font-light transition-all duration-300"
        >
          Completed ({filterTicketsByStatus('completed').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TicketList 
          tickets={tickets} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
          recentlyRequestedTickets={recentlyRequestedTickets}
          recentlyMessaggedTickets={recentlyMessaggedTickets}
        />
      </TabsContent>

      <TabsContent value="running">
        <TicketList 
          tickets={filterTicketsByStatus('running')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
          recentlyRequestedTickets={recentlyRequestedTickets}
          recentlyMessaggedTickets={recentlyMessaggedTickets}
        />
      </TabsContent>

      <TabsContent value="requested">
        <TicketList 
          tickets={filterTicketsByStatus('requested')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
          recentlyRequestedTickets={recentlyRequestedTickets}
          recentlyMessaggedTickets={recentlyMessaggedTickets}
        />
      </TabsContent>

      <TabsContent value="assigned">
        <TicketList 
          tickets={filterTicketsByStatus('assigned')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
          recentlyRequestedTickets={recentlyRequestedTickets}
          recentlyMessaggedTickets={recentlyMessaggedTickets}
        />
      </TabsContent>

      <TabsContent value="completed">
        <TicketList 
          tickets={filterTicketsByStatus('completed')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
          recentlyRequestedTickets={recentlyRequestedTickets}
          recentlyMessaggedTickets={recentlyMessaggedTickets}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TicketTabs;
