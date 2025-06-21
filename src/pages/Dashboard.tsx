import React from 'react';
import { useTicketData } from '../hooks/useTicketData';
import { useAdminConfig } from '../hooks/useAdminConfig';
import { useDashboardState } from '../hooks/useDashboardState';
import { useDashboardTicketSorting } from '../hooks/useDashboardTicketSorting';
import DashboardStats from '../components/DashboardStats';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PermissionWarning from '../components/dashboard/PermissionWarning';
import VoiceChatModal from '../components/dashboard/VoiceChatModal';
import DashboardMainContent from '../components/dashboard/DashboardMainContent';
import TicketInteractionHandler from '../components/dashboard/TicketInteractionHandler';

const Dashboard: React.FC = () => {
  const { 
    tickets, 
    messageCounts, 
    unreadCounts, 
    latestAudioUrls, 
    isLoading,
    reloadTickets 
  } = useTicketData();

  const { 
    drivers, 
    etaConfig, 
    isLoading: isConfigLoading,
    hasPermissionError,
    handleAddDriver,
    handleToggleDriverAvailability,
    handleRemoveDriver,
    handleUpdateETAConfig
  } = useAdminConfig();

  const {
    selectedTicket,
    showVoiceChat,
    recentlyRequestedTickets,
    recentlyMessaggedTickets,
    handleTicketSelect,
    handleCloseVoiceChat,
    addRecentlyRequestedTicket
  } = useDashboardState(tickets, unreadCounts);

  const { sortedTickets } = useDashboardTicketSorting(tickets, unreadCounts, recentlyRequestedTickets);

  if (isLoading || isConfigLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center glass-morphism-strong rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black"
      style={{
        position: 'relative',
        overflow: 'auto',
        height: '100vh',
        maxHeight: '100vh'
      }}
    >
      <DashboardHeader hasPermissionError={hasPermissionError} />

      <div 
        className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6"
        style={{
          overflow: 'visible',
          height: 'auto'
        }}
      >
        {/* Stats Section */}
        <DashboardStats tickets={tickets} />

        {/* Permission Warning */}
        {hasPermissionError && <PermissionWarning />}

        {/* Voice Chat Modal */}
        <VoiceChatModal
          isOpen={showVoiceChat}
          ticket={selectedTicket}
          onClose={handleCloseVoiceChat}
        />

        {/* Main Content */}
        <TicketInteractionHandler
          tickets={tickets}
          reloadTickets={reloadTickets}
          onRecentlyRequestedAdd={addRecentlyRequestedTicket}
          drivers={drivers}
          etaConfig={etaConfig}
        >
          {({ handleStatusUpdate, handleAssignWorker }) => (
            <DashboardMainContent
              tickets={sortedTickets}
              messageCounts={messageCounts}
              unreadCounts={unreadCounts}
              latestAudioUrls={latestAudioUrls}
              onTicketSelect={handleTicketSelect}
              onStatusUpdate={handleStatusUpdate}
              onAssignWorker={handleAssignWorker}
              recentlyRequestedTickets={recentlyRequestedTickets}
              recentlyMessaggedTickets={recentlyMessaggedTickets}
              drivers={drivers}
              etaConfig={etaConfig}
              onAddDriver={handleAddDriver}
              onToggleDriverAvailability={handleToggleDriverAvailability}
              onRemoveDriver={handleRemoveDriver}
              onUpdateETAConfig={handleUpdateETAConfig}
            />
          )}
        </TicketInteractionHandler>
      </div>
    </div>
  );
};

export default Dashboard;