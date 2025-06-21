
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { Driver } from '../../types/AdminConfig';

interface AddDriverDialogProps {
  onAddDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({ onAddDriver }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name.trim() || !newDriver.email.trim()) return;

    await onAddDriver({
      name: newDriver.name.trim(),
      email: newDriver.email.trim(),
      isActive: newDriver.isActive
    });

    setNewDriver({ name: '', email: '', isActive: true });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Name *</Label>
            <Input
              id="name"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              placeholder="Driver's full name"
              required
              className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newDriver.email}
              onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
              placeholder="driver@email.com"
              required
              className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={newDriver.isActive}
              onCheckedChange={(checked) => setNewDriver({ ...newDriver, isActive: checked })}
            />
            <Label htmlFor="active" className="text-gray-300">Active by default</Label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600/70 hover:bg-blue-600/90">Add Driver</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
