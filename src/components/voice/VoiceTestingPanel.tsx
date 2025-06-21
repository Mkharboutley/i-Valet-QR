import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube } from 'lucide-react';
import { subscribeToVoiceMessages } from '../../services/realtime';
import { subscribeToTicketUpdates } from '../../services/ticketService';
import { usePusherBeams } from '../../hooks/usePusherBeams';
import { TestResult } from '../../types/TestResult';
import TestConfiguration from '../TestConfiguration';
import TestRunner from '../tests/TestRunner';
import VoiceMessagingTest from '../tests/VoiceMessagingTest';
import TestResultsPanel from '../tests/TestResultsPanel';

interface VoiceTestingPanelProps {
  ticketId: string;
  ticketNumber: number;
}

const VoiceTestingPanel: React.FC<VoiceTestingPanelProps> = ({
  ticketId,
  ticketNumber
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'admin'>('client');
  const [pusherInstanceId, setPusherInstanceId] = useState('');
  const [realtimeUpdatesReceived, setRealtimeUpdatesReceived] = useState(0);
  const [voiceMessagesReceived, setVoiceMessagesReceived] = useState(0);

  // Initialize Pusher Beams
  const {
    isInitialized: pusherInitialized,
    permissionStatus,
    subscribeToTicket,
    requestPermission: originalRequestPermission
  } = usePusherBeams({
    instanceId: pusherInstanceId,
    ticketId,
    enableAutoSubscribe: false
  });

  // Wrapper function to match the expected signature - Fixed to return void
  const requestPermission = async (): Promise<void> => {
    await originalRequestPermission();
  };

  const addTestResult = (test: string, status: 'pending' | 'success' | 'error', message: string) => {
    const result: TestResult = {
      id: Date.now().toString(),
      test,
      status,
      message,
      timestamp: Date.now()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // Subscribe to voice messages for testing
  useEffect(() => {
    const unsubscribe = subscribeToVoiceMessages(ticketId, (messages) => {
      setVoiceMessagesReceived(messages.length);
      if (messages.length > 0) {
        addTestResult(
          'Voice Message Received',
          'success',
          `Received ${messages.length} voice messages via Realtime DB`
        );
      }
    });

    return unsubscribe;
  }, [ticketId]);

  // Subscribe to ticket updates for testing
  useEffect(() => {
    const unsubscribe = subscribeToTicketUpdates(ticketId, (ticket) => {
      setRealtimeUpdatesReceived(prev => prev + 1);
      addTestResult(
        'Ticket Update Received',
        'success',
        `Ticket status: ${ticket.status}, updated_at: ${new Date(ticket.updatedAt).toLocaleTimeString()}`
      );
    });

    return unsubscribe;
  }, [ticketId]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Voice Messaging Test Suite
          <Badge variant="outline">Ticket #{ticketNumber}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="testing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testing">Run Tests</TabsTrigger>
            <TabsTrigger value="messaging">Test Messaging</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testing" className="space-y-4">
            <TestConfiguration
              pusherInstanceId={pusherInstanceId}
              setPusherInstanceId={setPusherInstanceId}
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
              voiceMessagesReceived={voiceMessagesReceived}
              realtimeUpdatesReceived={realtimeUpdatesReceived}
              permissionStatus={permissionStatus}
              pusherInitialized={pusherInitialized}
            />
            
            <TestRunner
              ticketId={ticketId}
              isRunningTests={isRunningTests}
              setIsRunningTests={setIsRunningTests}
              setTestResults={setTestResults}
              addTestResult={addTestResult}
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
              pusherInstanceId={pusherInstanceId}
              pusherInitialized={pusherInitialized}
              subscribeToTicket={subscribeToTicket}
              requestPermission={requestPermission}
            />
          </TabsContent>
          
          <TabsContent value="messaging" className="space-y-4">
            <VoiceMessagingTest
              ticketId={ticketId}
              ticketNumber={ticketNumber}
              currentUserRole={currentUserRole}
              addTestResult={addTestResult}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <TestResultsPanel testResults={testResults} />
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Voice Message Testing:</h4>
                <p className="text-gray-600">
                  1. Switch between Client and Admin roles to test both perspectives<br/>
                  2. Record voice messages and verify they appear in real-time<br/>
                  3. Check that notifications fire when messages are received
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Real-time Updates Testing:</h4>
                <p className="text-gray-600">
                  1. Update ticket status and verify updated_at field syncs<br/>
                  2. Check that status changes trigger real-time updates<br/>
                  3. Verify timestamp accuracy for all status transitions
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Push Notifications Testing:</h4>
                <p className="text-gray-600">
                  1. Enter your Pusher Beams instance ID<br/>
                  2. Grant notification permissions when prompted<br/>
                  3. Test notifications by sending messages from different roles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default VoiceTestingPanel;
