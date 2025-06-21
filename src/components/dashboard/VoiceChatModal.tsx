
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import VoiceChatModule from '../voice/VoiceChatModule';
import { Ticket } from '../../types/Ticket';

interface VoiceChatModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const VoiceChatModal: React.FC<VoiceChatModalProps> = ({ isOpen, ticket, onClose }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="glass-morphism-strong rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-white font-medium font-light">Voice Chat</h3>
            <p className="text-gray-400 text-sm font-light">
              Ticket #{ticket.ticket_number} - {ticket.car_model}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:glass-morphism"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Voice Chat Content */}
        <div className="flex-1">
          <VoiceChatModule
            ticketId={ticket.id}
            ticketNumber={ticket.ticket_number}
            userRole="admin"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceChatModal;
