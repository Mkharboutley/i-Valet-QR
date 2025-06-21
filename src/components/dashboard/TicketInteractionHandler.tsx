
import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types/Ticket';
import { Driver, ETAConfig } from '../../types/AdminConfig';
import { useTicketActions } from '../../hooks/useTicketActions';
import AssignWorkerModal from '../AssignWorkerModal';

interface TicketInteractionHandlerProps {
  tickets: Ticket[];
  reloadTickets: () => Promise<void>;
  onRecentlyRequestedAdd: (ticketId: string) => void;
  drivers: Driver[];
  etaConfig: ETAConfig | null;
  children: (handlers: {
    handleStatusUpdate: (ticketId: string, status: TicketStatus) => Promise<void>;
    handleAssignWorker: (ticket: Ticket) => void;
  }) => React.ReactNode;
}

const TicketInteractionHandler: React.FC<TicketInteractionHandlerProps> = ({
  tickets,
  reloadTickets,
  onRecentlyRequestedAdd,
  drivers,
  etaConfig,
  children
}) => {
  const { handleStatusUpdate: updateTicketStatus } = useTicketActions(reloadTickets);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicketForAssignment, setSelectedTicketForAssignment] = useState<Ticket | null>(null);

  const handleStatusUpdate = async (ticketId: string, status: TicketStatus) => {
    console.log('Dashboard: Handling status update:', ticketId, status);
    
    // Find the current ticket to get its current status for validation
    const currentTicket = tickets.find(t => t.id === ticketId);
    
    try {
      // Call the proper status update function with validation
      await updateTicketStatus(ticketId, status, currentTicket?.status);
      
      // If status changed to 'requested', add to recently requested tickets for animation
      if (status === 'requested') {
        onRecentlyRequestedAdd(ticketId);
      }
    } catch (error) {
      console.error('Dashboard: Failed to update status:', error);
      // Error handling is already done in useTicketActions hook
    }
  };

  const handleAssignWorker = (ticket: Ticket) => {
    console.log('Opening assignment modal for ticket:', ticket);
    setSelectedTicketForAssignment(ticket);
    setAssignModalOpen(true);
  };

  const handleWorkerAssignment = async (ticketId: string, workerName: string, etaMinutes: number, notes?: string) => {
    try {
      console.log('Assigning worker:', { ticketId, workerName, etaMinutes, notes });
      
      // Prepare additional data, filtering out undefined values
      const additionalData: Record<string, any> = {
        assigned_worker: workerName,
        eta_minutes: etaMinutes
      };

      // Only add notes if it's defined and not empty
      if (notes !== undefined && notes !== null && notes.trim() !== '') {
        additionalData.notes = notes;
      }
      
      // Update ticket status to 'assigned' and include worker details
      await updateTicketStatus(ticketId, 'assigned', undefined, additionalData);
      
      console.log('Worker assigned successfully');
      setAssignModalOpen(false);
      setSelectedTicketForAssignment(null);
    } catch (error) {
      console.error('Failed to assign worker:', error);
    }
  };

  return (
    <>
      {children({
        handleStatusUpdate,
        handleAssignWorker
      })}
      
      <AssignWorkerModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedTicketForAssignment(null);
        }}
        ticket={selectedTicketForAssignment}
        onAssign={handleWorkerAssignment}
        drivers={drivers}
        etaConfig={etaConfig}
      />
    </>
  );
};

export default TicketInteractionHandler;
