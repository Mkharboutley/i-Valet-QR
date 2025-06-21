
import React from 'react';
import { VoiceMessage } from '../../types/VoiceMessage';
import AudioPlayerWithVisualizer from './AudioPlayerWithVisualizer';

interface VoiceMessageItemProps {
  message: VoiceMessage;
  isOwnMessage: boolean;
  currentUserRole?: 'client' | 'admin';
}

const VoiceMessageItem: React.FC<VoiceMessageItemProps> = ({ 
  message, 
  isOwnMessage,
  currentUserRole = 'admin'
}) => {
  return (
    <div className="mb-2">
      <AudioPlayerWithVisualizer
        storagePath={message.storage_path}
        timestamp={message.timestamp}
        isOwnMessage={isOwnMessage}
        sender={message.sender}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default VoiceMessageItem;
