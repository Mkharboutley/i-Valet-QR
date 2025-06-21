
import { updateTicketStatus } from '../services/firestore';
import { TicketStatus } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicketActions = (reloadTickets: () => Promise<void>) => {
  const { toast } = useToast();

  const validateStatusTransition = (currentStatus: TicketStatus, newStatus: TicketStatus): boolean => {
    // No changes allowed from completed status
    if (currentStatus === 'completed') {
      return false;
    }

    // Valid transitions based on business logic
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      'running': ['requested', 'cancelled'],
      'requested': ['assigned', 'running', 'cancelled'], // running is admin override
      'assigned': ['completed', 'requested', 'cancelled'], // requested is rollback
      'completed': [], // No transitions from completed
      'cancelled': [] // No transitions from cancelled
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  };

  const handleStatusUpdate = async (
    ticketId: string, 
    newStatus: TicketStatus, 
    currentStatus?: TicketStatus,
    additionalData?: any
  ) => {
    // If current status is provided, validate the transition
    if (currentStatus && !validateStatusTransition(currentStatus, newStatus)) {
      toast({
        title: "Invalid Action",
        description: `Cannot change status from ${currentStatus} to ${newStatus}`,
        variant: "destructive"
      });
      return;
    }

    try {
      await updateTicketStatus(ticketId, newStatus, additionalData);
      await reloadTickets();
      
      // Different toast messages based on status
      const statusMessages: Record<TicketStatus, string> = {
        'running': 'Ticket is now running',
        'requested': 'Car retrieval requested',
        'assigned': 'Worker assigned to ticket',
        'completed': 'Ticket completed successfully',
        'cancelled': 'Ticket has been cancelled'
      };

      toast({
        title: "Status Updated",
        description: statusMessages[newStatus] || `Ticket status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  return {
    handleStatusUpdate,
    validateStatusTransition
  };
};
