
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '../types/Ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: TicketStatus) => {
    switch (status) {
      case 'completed':
        return {
          className: 'bg-green-500 text-white border-green-400 animate-pulse shadow-lg shadow-green-500/50 px-4 py-2 text-base font-semibold',
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          className: 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/50 px-4 py-2 text-base font-semibold',
          label: 'Cancelled'
        };
      case 'assigned':
        return {
          className: 'bg-blue-500 text-white border-blue-400 animate-pulse shadow-lg shadow-blue-500/50 px-4 py-2 text-base font-semibold',
          label: 'Assigned'
        };
      case 'requested':
        return {
          className: 'bg-orange-500 text-white border-orange-400 animate-pulse shadow-lg shadow-orange-500/50 px-4 py-2 text-base font-semibold',
          label: 'Requested'
        };
      case 'running':
        return {
          className: 'bg-blue-600 text-white border-blue-500 animate-pulse shadow-lg shadow-blue-600/50 px-4 py-2 text-base font-semibold',
          label: 'Running'
        };
      default:
        return {
          className: 'bg-gray-500 text-white border-gray-400 px-4 py-2 text-base font-semibold',
          label: 'Unknown'
        };
    }
  };

  const { className, label } = getStatusStyles(status);

  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
