import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, UserPlus, CheckCircle, XCircle, Truck, ArrowLeft } from 'lucide-react';
import { Ticket, TicketStatus } from '../types/Ticket';

interface StatusDropdownProps {
  ticket: Ticket;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  ticket,
  onStatusUpdate,
  onAssignWorker
}) => {
  const handleAction = (action: { status: TicketStatus, isAssign?: boolean }) => {
    if (action.isAssign) {
      onAssignWorker(ticket);
    } else {
      onStatusUpdate(ticket.id, action.status);
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    // Prevent any status changes if already completed or cancelled
    if (ticket.status === 'completed' || ticket.status === 'cancelled') {
      return [];
    }
    
    switch (ticket.status) {
      case 'running':
        actions.push({
          status: 'requested' as TicketStatus,
          label: 'طلب السيارة',
          icon: <UserPlus className="h-4 w-4" />,
          color: 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
        });
        break;
        
      case 'requested':
        actions.push(
          {
            status: 'assigned' as TicketStatus,
            label: 'تعيين سائق',
            icon: <Truck className="h-4 w-4" />,
            isAssign: true,
            color: 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
          },
          {
            status: 'running' as TicketStatus,
            label: 'إعادة للانتظار',
            icon: <ArrowLeft className="h-4 w-4" />,
            color: 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20'
          }
        );
        break;
        
      case 'assigned':
        actions.push(
          {
            status: 'completed' as TicketStatus,
            label: 'إكمال الطلب',
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
          },
          {
            status: 'requested' as TicketStatus,
            label: 'إعادة للطلب',
            icon: <ArrowLeft className="h-4 w-4" />,
            color: 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20'
          }
        );
        break;
    }
    
    // Add cancel option for all active statuses
    if (['running', 'requested', 'assigned'].includes(ticket.status)) {
      actions.push({
        status: 'cancelled' as TicketStatus,
        label: 'إلغاء الطلب',
        icon: <XCircle className="h-4 w-4" />,
        color: 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
      });
    }
    
    return actions;
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="glass-button h-8 px-2 py-1 text-xs"
        >
          <span className="sr-only">Actions</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end"
        className="glass-morphism-strong min-w-[140px] p-2"
      >
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleAction(action);
            }}
            className={`
              flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer
              transition-colors duration-200 ${action.color}
            `}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;