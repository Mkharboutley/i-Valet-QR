
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TicketTabs from '../TicketTabs';
import DriverManagement from '../DriverManagement';
import ETAConfiguration from '../ETAConfiguration';
import DashboardTabs from './DashboardTabs';
import AnalyticsTab from './AnalyticsTab';
import NotificationsTab from './NotificationsTab';
import { Ticket, TicketStatus } from '../../types/Ticket';
import { Driver, ETAConfig } from '../../types/AdminConfig';

interface DashboardMainContentProps {
  tickets: Ticket[];
  messageCounts: Record<string, number>;
  unreadCounts: Record<string, number>;
  latestAudioUrls: Record<string, string>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  recentlyRequestedTickets: Set<string>;
  recentlyMessaggedTickets: Set<string>;
  drivers: Driver[];
  etaConfig: ETAConfig | null;
  onAddDriver: (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onToggleDriverAvailability: (driverId: string, isActive: boolean) => Promise<void>;
  onRemoveDriver: (driverId: string) => Promise<void>;
  onUpdateETAConfig: (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>) => Promise<void>;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  tickets,
  messageCounts,
  unreadCounts,
  latestAudioUrls,
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  recentlyRequestedTickets,
  recentlyMessaggedTickets,
  drivers,
  etaConfig,
  onAddDriver,
  onToggleDriverAvailability,
  onRemoveDriver,
  onUpdateETAConfig
}) => {
  return (
    <Tabs defaultValue="tickets" className="space-y-6">
      <DashboardTabs />

      <TabsContent value="tickets">
        <Card className="glass-morphism-strong rounded-2xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-light">Ticket Management</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketTabs 
              tickets={tickets}
              messageCounts={messageCounts}
              unreadCounts={unreadCounts}
              latestAudioUrls={latestAudioUrls}
              onTicketSelect={onTicketSelect}
              onStatusUpdate={onStatusUpdate}
              onAssignWorker={onAssignWorker}
              recentlyRequestedTickets={recentlyRequestedTickets}
              recentlyMessaggedTickets={recentlyMessaggedTickets}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="drivers">
        <DriverManagement
          drivers={drivers}
          onAddDriver={onAddDriver}
          onToggleAvailability={onToggleDriverAvailability}
          onRemoveDriver={onRemoveDriver}
        />
      </TabsContent>

      <TabsContent value="config">
        <ETAConfiguration
          etaConfig={etaConfig}
          onUpdateConfig={onUpdateETAConfig}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab tickets={tickets} />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardMainContent;
