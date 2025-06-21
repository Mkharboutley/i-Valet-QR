
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'default';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'default' }) => {
  const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          variant: 'destructive' as const,
          icon: <Zap className="h-3 w-3" />,
          label: 'Urgent'
        };
      case 'high':
        return {
          variant: 'destructive' as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'High'
        };
      case 'medium':
        return {
          variant: 'secondary' as const,
          icon: <Clock className="h-3 w-3" />,
          label: 'Medium'
        };
      case 'low':
        return {
          variant: 'outline' as const,
          icon: <Clock className="h-3 w-3" />,
          label: 'Low'
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} className={`${size === 'sm' ? 'text-xs px-1 py-0' : ''} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
