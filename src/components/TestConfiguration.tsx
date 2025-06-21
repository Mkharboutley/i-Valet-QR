
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TestConfigurationProps {
  pusherInstanceId: string;
  setPusherInstanceId: (id: string) => void;
  currentUserRole: 'client' | 'admin';
  setCurrentUserRole: (role: 'client' | 'admin') => void;
  voiceMessagesReceived: number;
  realtimeUpdatesReceived: number;
  permissionStatus: string | null;
  pusherInitialized: boolean;
}

const TestConfiguration: React.FC<TestConfigurationProps> = ({
  pusherInstanceId,
  setPusherInstanceId,
  currentUserRole,
  setCurrentUserRole,
  voiceMessagesReceived,
  realtimeUpdatesReceived,
  permissionStatus,
  pusherInitialized
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pusher-id">Pusher Beams Instance ID</Label>
              <Input
                id="pusher-id"
                value={pusherInstanceId}
                onChange={(e) => setPusherInstanceId(e.target.value)}
                placeholder="Enter your Pusher Beams instance ID"
              />
            </div>
            
            <div>
              <Label>Current Test Role</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={currentUserRole === 'client' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUserRole('client')}
                >
                  Client
                </Button>
                <Button
                  variant={currentUserRole === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUserRole('admin')}
                >
                  Admin
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Real-time Stats</h4>
              <div className="space-y-1 text-sm">
                <div>Voice Messages: {voiceMessagesReceived}</div>
                <div>Realtime Updates: {realtimeUpdatesReceived}</div>
                <div>Push Permission: {permissionStatus || 'Not requested'}</div>
                <div>Pusher Status: {pusherInitialized ? 'Connected' : 'Disconnected'}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestConfiguration;
