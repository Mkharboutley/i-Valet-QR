
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Clock } from 'lucide-react';
import { Ticket } from '../types/Ticket';
import { Driver, ETAConfig } from '../types/AdminConfig';

interface AssignWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onAssign: (ticketId: string, workerName: string, etaMinutes: number, notes?: string) => void;
  drivers?: Driver[];
  etaConfig?: ETAConfig | null;
}

const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onAssign,
  drivers = [],
  etaConfig
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [notes, setNotes] = useState('');

  // Get available (active) drivers
  const availableDrivers = drivers.filter(driver => driver.isActive);

  // Get default ETA from admin configuration
  const defaultETA = etaConfig?.defaultETA || 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !selectedDriverId) return;

    // Find the selected driver
    const selectedDriver = availableDrivers.find(driver => driver.id === selectedDriverId);
    if (!selectedDriver) return;

    // Use the admin-configured default ETA
    onAssign(ticket.id, selectedDriver.name, defaultETA, notes || undefined);
    
    // Reset form
    setSelectedDriverId('');
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setSelectedDriverId('');
    setNotes('');
    onClose();
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-morphism-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Assign Worker to Ticket #{ticket.ticket_number}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worker" className="text-gray-300">Select Available Driver</Label>
            {availableDrivers.length > 0 ? (
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId} required>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="Choose an available driver..." />
                </SelectTrigger>
                <SelectContent className="glass-morphism-strong">
                  {availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <span>{driver.name}</span>
                        <span className="text-xs text-gray-400">({driver.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                No active drivers available. Please activate drivers in the Drivers tab.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-gray-300">
              <Clock className="h-4 w-4" />
              Estimated Delivery Time
            </Label>
            <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm">
              Default: {defaultETA} minutes (configured by admin)
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="glass-button text-white placeholder-gray-400"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="glass-button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedDriverId || availableDrivers.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Assign Driver
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignWorkerModal;
