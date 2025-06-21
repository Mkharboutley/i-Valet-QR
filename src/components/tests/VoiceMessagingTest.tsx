import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Zap } from 'lucide-react';
import { updateTicketStatus } from '../../services/ticketService';
import VoiceRecorder from '../voice/VoiceRecorder';
import { TestResult } from '../../types/TestResult';

interface VoiceMessagingTestProps {
  ticketId: string;
  ticketNumber: number;
  currentUserRole: 'client' | 'admin';
  addTestResult: (test: string, status: 'pending' | 'success' | 'error', message: string) => void;
}

const VoiceMessagingTest: React.FC<VoiceMessagingTestProps> = ({
  ticketId,
  ticketNumber,
  currentUserRole,
  addTestResult
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Test Voice Messaging as {currentUserRole}</h4>
        <p className="text-sm text-gray-600 mb-4">
          Record a voice message to test the complete flow: recording → upload → realtime sync → notification
        </p>
        
        <VoiceRecorder
          ticketId={ticketId}
          ticketNumber={ticketNumber}
          sender={currentUserRole}
          onMessageSent={() => {
            addTestResult(
              'Voice Message Sent',
              'success',
              `Voice message sent as ${currentUserRole}`
            );
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => updateTicketStatus(ticketId, 'requested')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Update to Requested
        </Button>
        
        <Button
          variant="outline"
          onClick={() => updateTicketStatus(ticketId, 'assigned', { assigned_worker: 'Test Worker', eta_minutes: 15 })}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Update to Assigned
        </Button>
      </div>
    </div>
  );
};

export default VoiceMessagingTest;
