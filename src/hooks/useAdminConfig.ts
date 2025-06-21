
import { useState, useEffect } from 'react';
import { 
  getDrivers, 
  getETAConfig, 
  subscribeToDrivers, 
  subscribeToETAConfig,
  updateDriverAvailability,
  removeDriver,
  addDriver,
  updateETAConfig
} from '../services/adminConfigService';
import { Driver, ETAConfig } from '../types/AdminConfig';
import { useToast } from '@/hooks/use-toast';

export const useAdminConfig = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [etaConfig, setETaConfig] = useState<ETAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeDrivers = subscribeToDrivers((updatedDrivers) => {
      setDrivers(updatedDrivers);
    });

    const unsubscribeETAConfig = subscribeToETAConfig((updatedConfig) => {
      setETaConfig(updatedConfig);
    });

    // Initial load
    const loadInitialData = async () => {
      try {
        const [driversData, etaConfigData] = await Promise.all([
          getDrivers(),
          getETAConfig()
        ]);
        
        setDrivers(driversData);
        setETaConfig(etaConfigData);
        setHasPermissionError(false);
      } catch (error: any) {
        console.error('Error loading admin config:', error);
        
        // Check if it's a permission error
        if (error.message && error.message.includes('permission')) {
          setHasPermissionError(true);
          toast({
            title: "Limited Access",
            description: "You have limited access to admin features. Some functionality may not be available.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load admin configuration",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    return () => {
      unsubscribeDrivers();
      unsubscribeETAConfig();
    };
  }, [toast]);

  const handleAddDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDriver(driverData);
      toast({
        title: "Success",
        description: "Driver added successfully"
      });
    } catch (error: any) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add driver",
        variant: "destructive"
      });
    }
  };

  const handleToggleDriverAvailability = async (driverId: string, isActive: boolean) => {
    try {
      await updateDriverAvailability(driverId, isActive);
      toast({
        title: "Success",
        description: `Driver ${isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error: any) {
      console.error('Error updating driver availability:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update driver availability",
        variant: "destructive"
      });
    }
  };

  const handleRemoveDriver = async (driverId: string) => {
    try {
      await removeDriver(driverId);
      toast({
        title: "Success",
        description: "Driver removed successfully"
      });
    } catch (error: any) {
      console.error('Error removing driver:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove driver",
        variant: "destructive"
      });
    }
  };

  const handleUpdateETAConfig = async (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>) => {
    try {
      await updateETAConfig(config);
      toast({
        title: "Success",
        description: "ETA configuration updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating ETA config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ETA configuration",
        variant: "destructive"
      });
    }
  };

  return {
    drivers,
    etaConfig,
    isLoading,
    hasPermissionError,
    handleAddDriver,
    handleToggleDriverAvailability,
    handleRemoveDriver,
    handleUpdateETAConfig
  };
};
