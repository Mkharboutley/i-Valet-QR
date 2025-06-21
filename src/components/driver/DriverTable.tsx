import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Mail, Trash2, UserCheck, UserX } from 'lucide-react';
import { Driver } from '../../types/AdminConfig';

interface DriverTableProps {
  drivers: Driver[];
  onToggleAvailability: (driverId: string, isActive: boolean) => Promise<void>;
  onRemoveDriver: (driverId: string) => Promise<void>;
}

const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onToggleAvailability,
  onRemoveDriver
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                No drivers found. Add your first driver to get started.
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow key={driver.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium text-white">{driver.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {driver.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={driver.isActive ? "default" : "secondary"}
                    className={driver.isActive ? "bg-green-500/80 text-white backdrop-blur-md" : "bg-gray-500/80 text-white backdrop-blur-md"}
                  >
                    {driver.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    {/* Toggle Status Button - Now with proper green styling */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleAvailability(driver.id, !driver.isActive)}
                      className={`
                        h-9 px-4 rounded-lg border transition-all duration-200 font-medium
                        ${driver.isActive 
                          ? 'bg-green-600 border-green-500 text-white hover:bg-green-700 hover:border-green-600 shadow-lg shadow-green-500/25' 
                          : 'bg-gray-600/50 border-gray-500/50 text-gray-300 hover:bg-gray-600/70 hover:border-gray-500/70'
                        }
                      `}
                    >
                      {driver.isActive ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Inactive
                        </>
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveDriver(driver.id)}
                      className="
                        h-9 w-9 p-0 rounded-lg border border-red-400/50 
                        bg-red-500/20 text-red-300 
                        hover:bg-red-500/30 hover:border-red-400/70 hover:text-red-200
                        transition-all duration-200
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriverTable;