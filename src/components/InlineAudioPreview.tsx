
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface InlineAudioPreviewProps {
  messageCount: number;
  hasUnread?: boolean;
  onOpenVoiceChat: () => void;
  latestAudioUrl?: string;
}

const InlineAudioPreview: React.FC<InlineAudioPreviewProps> = ({
  messageCount,
  hasUnread = false,
  onOpenVoiceChat,
  latestAudioUrl
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, isLoading, play, pause, load } = useAudioPlayer();

  const handlePlayPreview = async () => {
    if (!latestAudioUrl) return;
    
    if (!isPlaying) {
      await load(latestAudioUrl);
      play();
    } else {
      pause();
    }
  };

  if (messageCount === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MessageCircle className="h-3 w-3" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Badge 
        variant={hasUnread ? "default" : "outline"} 
        className={`flex items-center gap-1 text-xs px-2 py-0.5 ${hasUnread ? 'animate-pulse bg-green-500/80 backdrop-blur-md border border-green-400/30' : ''}`}
      >
        {hasUnread ? (
          <Volume2 className="h-3 w-3" />
        ) : (
          <MessageCircle className="h-3 w-3" />
        )}
        {messageCount}
      </Badge>
    </div>
  );
};

export default InlineAudioPreview;
