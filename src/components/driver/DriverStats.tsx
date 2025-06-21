
import React from 'react';
import { Driver } from '../../types/AdminConfig';

interface DriverStatsProps {
  drivers: Driver[];
}

const DriverStats: React.FC<DriverStatsProps> = ({ drivers }) => {
  const activeDrivers = drivers.filter(d => d.isActive);
  const inactiveDrivers = drivers.filter(d => !d.isActive);

  return (
    <div className="flex gap-4 text-sm text-gray-300">
      <span>Active: {activeDrivers.length}</span>
      <span>Inactive: {inactiveDrivers.length}</span>
      <span>Total: {drivers.length}</span>
    </div>
  );
};

export default DriverStats;
