
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  UserCog, 
  Settings, 
  BarChart3, 
  Bell 
} from 'lucide-react';

const DashboardTabs: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-5 glass-morphism-strong rounded-xl p-1 shadow-2xl">
      <TabsTrigger 
        value="tickets" 
        className="flex items-center gap-2 data-[state=active]:glass-morphism data-[state=active]:rounded-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300 font-light"
      >
        <Car className="h-4 w-4" />
        <span className="hidden sm:inline">Tickets</span>
      </TabsTrigger>
      <TabsTrigger 
        value="drivers" 
        className="flex items-center gap-2 data-[state=active]:glass-morphism data-[state=active]:rounded-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300 font-light"
      >
        <UserCog className="h-4 w-4" />
        <span className="hidden sm:inline">Drivers</span>
      </TabsTrigger>
      <TabsTrigger 
        value="config" 
        className="flex items-center gap-2 data-[state=active]:glass-morphism data-[state=active]:rounded-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300 font-light"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Config</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        className="flex items-center gap-2 data-[state=active]:glass-morphism data-[state=active]:rounded-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300 font-light"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger 
        value="notifications" 
        className="flex items-center gap-2 data-[state=active]:glass-morphism data-[state=active]:rounded-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300 font-light"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabs;
