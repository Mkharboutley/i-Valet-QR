import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, Mic, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceTestingPanel from '../components/voice/VoiceTestingPanel';

const TestVoiceSystem: React.FC = () => {
  const ticketId = 'test-ticket-123';
  const ticketNumber = 123;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Voice Messaging System Tests
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Mic className="h-4 w-4 mr-1" />
              Voice Enabled
            </Badge>
            <Badge variant="secondary">
              <MessageCircle className="h-4 w-4 mr-1" />
              Realtime Active
            </Badge>
            <Badge variant="secondary">
              <Bell className="h-4 w-4 mr-1" />
              Push Ready
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <VoiceTestingPanel ticketId={ticketId} ticketNumber={ticketNumber} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TestVoiceSystem;

