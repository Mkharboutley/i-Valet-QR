
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceChatModule from '../components/voice/VoiceChatModule';
import TicketTabs from '../components/TicketTabs';
import { useTickets } from '../hooks/useTickets';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateTicketStatus } from '../services/firestore';
import { useToast } from '@/hooks/use-toast';

const AdminTicketsPage: React.FC = () => {
  const { tickets, isLoading, error, reloadTickets } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleStatusUpdate = async (ticketId: string, status: any) => {
    try {
      await updateTicketStatus(ticketId, status);
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${status}`
      });
      reloadTickets();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const handleAssignWorker = (ticket: any) => {
    console.log('Assign worker to ticket:', ticket);
    // Implement worker assignment logic
    toast({
      title: "Worker Assignment",
      description: "Worker assignment feature coming soon"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tickets</h3>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={reloadTickets}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeTickets = tickets.filter(t => ['running', 'requested', 'assigned'].includes(t.status));
  const completedTickets = tickets.filter(t => t.status === 'completed');
  const pendingTickets = tickets.filter(t => t.status === 'requested');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all valet service tickets</p>
          </div>
          <Button onClick={() => navigate('/create-ticket')}>
            <PlusCircle className="h-4 w-4 mr-2"/>
            Create New Ticket
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets && tickets.length > 0 ? (
                  <TicketTabs 
                    tickets={tickets}
                    onTicketSelect={handleTicketSelect}
                    onStatusUpdate={handleStatusUpdate}
                    onAssignWorker={handleAssignWorker}
                    selectedTicketId={selectedTicket?.id}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No tickets found</p>
                    <p className="text-sm">Create your first ticket to get started</p>
                    <Button 
                      onClick={() => navigate('/create-ticket')}
                      className="mt-4"
                    >
                      Create First Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Voice Chat Module */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Voice Communication</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTicket ? (
                  <VoiceChatModule 
                    ticketId={selectedTicket.id} 
                    ticketNumber={selectedTicket.ticket_number} 
                    userRole="admin" 
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select a ticket to start voice communication</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
