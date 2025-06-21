
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Volume2 } from 'lucide-react';

interface VoiceMessageBadgeProps {
  messageCount: number;
  hasUnread?: boolean;
  size?: 'sm' | 'default';
}

const VoiceMessageBadge: React.FC<VoiceMessageBadgeProps> = ({ 
  messageCount, 
  hasUnread = false,
  size = 'default' 
}) => {
  if (messageCount === 0) return null;

  return (
    <Badge 
      variant={hasUnread ? "default" : "outline"} 
      className={`${size === 'sm' ? 'text-xs px-1 py-0' : ''} flex items-center gap-1 ${
        hasUnread ? 'animate-pulse' : ''
      }`}
    >
      {hasUnread ? (
        <Volume2 className="h-3 w-3" />
      ) : (
        <MessageCircle className="h-3 w-3" />
      )}
      {messageCount}
    </Badge>
  );
};

export default VoiceMessageBadge;
