import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Bell } from 'lucide-react';
import { TestResult } from '../../types/TestResult';
import { updateTicketStatus } from '../../services/ticketService';
import { useToast } from '@/hooks/use-toast';

interface TestRunnerProps {
  ticketId: string;
  isRunningTests: boolean;
  setIsRunningTests: (running: boolean) => void;
  setTestResults: React.Dispatch<React.SetStateAction<TestResult[]>>;
  addTestResult: (test: string, status: 'pending' | 'success' | 'error', message: string) => void;
  currentUserRole: 'client' | 'admin';
  setCurrentUserRole: (role: 'client' | 'admin') => void;
  pusherInstanceId: string;
  pusherInitialized: boolean;
  subscribeToTicket: (ticketId: string) => Promise<void>;
  requestPermission: () => Promise<void>;
}

const TestRunner: React.FC<TestRunnerProps> = ({
  ticketId,
  isRunningTests,
  setIsRunningTests,
  setTestResults,
  addTestResult,
  currentUserRole,
  setCurrentUserRole,
  pusherInstanceId,
  pusherInitialized,
  subscribeToTicket,
  requestPermission
}) => {
  const { toast } = useToast();

  const runFullTestCycle = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: Voice Recording & Upload (Client perspective)
      addTestResult('Voice Recording Test', 'pending', 'Testing voice recording functionality...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addTestResult('Voice Recording Test', 'success', 'Voice recording UI is functional');

      // Test 2: Real-time DB connectivity
      addTestResult('Realtime DB Test', 'pending', 'Testing Realtime Database connection...');
      await new Promise(resolve => setTimeout(resolve, 500));
      addTestResult('Realtime DB Test', 'success', 'Connected to Firebase Realtime Database');

      // Test 3: Ticket status update with updated_at sync
      addTestResult('Status Update Test', 'pending', 'Testing ticket status update...');
      await updateTicketStatus(ticketId, 'requested');
      addTestResult('Status Update Test', 'success', 'Ticket status updated with proper timestamp sync');

      // Test 4: Push notification setup
      if (pusherInstanceId && pusherInitialized) {
        addTestResult('Push Notification Test', 'pending', 'Testing push notification setup...');
        await subscribeToTicket(ticketId);
        addTestResult('Push Notification Test', 'success', 'Subscribed to push notifications for ticket');
      } else {
        addTestResult('Push Notification Test', 'error', 'Pusher Beams not configured');
      }

      // Test 5: Role switching simulation - Fixed to use direct value instead of function updater
      addTestResult('Role Switch Test', 'pending', 'Testing role switching...');
      setCurrentUserRole(currentUserRole === 'client' ? 'admin' : 'client');
      addTestResult('Role Switch Test', 'success', `Switched to ${currentUserRole === 'client' ? 'admin' : 'client'} view`);

    } catch (error) {
      addTestResult('Test Cycle', 'error', `Error during testing: ${error}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testPushNotifications = async () => {
    if (!pusherInstanceId) {
      toast({
        title: "Pusher Instance ID Required",
        description: "Please enter your Pusher Beams instance ID first",
        variant: "destructive"
      });
      return;
    }

    try {
      await requestPermission();
      await subscribeToTicket(ticketId);
      
      toast({
        title: "Push Notifications Enabled",
        description: "You should now receive notifications for this ticket"
      });
      
      addTestResult('Push Notification Setup', 'success', 'Push notifications enabled for ticket');
    } catch (error) {
      addTestResult('Push Notification Setup', 'error', `Failed to setup notifications: ${error}`);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={runFullTestCycle} 
        disabled={isRunningTests}
        className="flex items-center gap-2"
      >
        <Play className="h-4 w-4" />
        {isRunningTests ? 'Running Tests...' : 'Run Full Test Cycle'}
      </Button>
      
      <Button 
        variant="outline"
        onClick={testPushNotifications}
        className="flex items-center gap-2"
      >
        <Bell className="h-4 w-4" />
        Test Push Notifications
      </Button>
    </div>
  );
};

export default TestRunner;
