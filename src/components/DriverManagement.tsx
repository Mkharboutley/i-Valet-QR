
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Driver } from '../types/AdminConfig';
import AddDriverDialog from './driver/AddDriverDialog';
import DriverTable from './driver/DriverTable';
import DriverStats from './driver/DriverStats';

interface DriverManagementProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onToggleAvailability: (driverId: string, isActive: boolean) => Promise<void>;
  onRemoveDriver: (driverId: string) => Promise<void>;
}

const DriverManagement: React.FC<DriverManagementProps> = ({
  drivers,
  onAddDriver,
  onToggleAvailability,
  onRemoveDriver
}) => {
  return (
    <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Management
          </CardTitle>
          <AddDriverDialog onAddDriver={onAddDriver} />
        </div>
        <DriverStats drivers={drivers} />
      </CardHeader>
      <CardContent>
        <DriverTable
          drivers={drivers}
          onToggleAvailability={onToggleAvailability}
          onRemoveDriver={onRemoveDriver}
        />
      </CardContent>
    </Card>
  );
};

export default DriverManagement;
