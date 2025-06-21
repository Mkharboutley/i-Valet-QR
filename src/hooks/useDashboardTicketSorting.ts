
import { useMemo } from 'react';
import { Ticket } from '../types/Ticket';

export const useDashboardTicketSorting = (
  tickets: Ticket[],
  unreadCounts: Record<string, number>,
  recentlyRequestedTickets: Set<string>
) => {
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      // First priority: Recently requested tickets (orange flicker)
      const aIsRecentlyRequested = recentlyRequestedTickets.has(a.id);
      const bIsRecentlyRequested = recentlyRequestedTickets.has(b.id);
      
      if (aIsRecentlyRequested && !bIsRecentlyRequested) return -1;
      if (bIsRecentlyRequested && !aIsRecentlyRequested) return 1;
      
      // Second priority: New voice messages
      const aHasNewMessages = unreadCounts[a.id] > 0;
      const bHasNewMessages = unreadCounts[b.id] > 0;
      
      if (aHasNewMessages && !bHasNewMessages) return -1;
      if (bHasNewMessages && !aHasNewMessages) return 1;
      
      // Third priority: Requested status
      if (a.status === 'requested' && b.status !== 'requested') return -1;
      if (b.status === 'requested' && a.status !== 'requested') return 1;
      
      // Finally: Creation time (newest first)
      return b.created_at.toMillis() - a.created_at.toMillis();
    });
  }, [tickets, unreadCounts, recentlyRequestedTickets]);

  return { sortedTickets };
};
