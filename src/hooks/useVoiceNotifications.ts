
import { useState, useEffect, useRef } from 'react';
import { subscribeToVoiceMessages } from '../services/realtime';
import { VoiceMessage } from '../types/VoiceMessage';
import { useToast } from '@/hooks/use-toast';

interface VoiceNotificationOptions {
  ticketId: string;
  userRole: 'client' | 'admin';
  enableSound?: boolean;
  enableToast?: boolean;
}

export const useVoiceNotifications = ({
  ticketId,
  userRole,
  enableSound = true,
  enableToast = true
}: VoiceNotificationOptions) => {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const prevMessageCountRef = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToVoiceMessages(ticketId, (messages: VoiceMessage[]) => {
      const currentCount = messages.length;
      const prevCount = prevMessageCountRef.current;
      
      // Check for new messages from other users
      if (currentCount > prevCount && prevCount > 0) {
        const newMessages = messages.slice(0, currentCount - prevCount);
        const hasNewFromOthers = newMessages.some(msg => msg.sender !== userRole);
        
        if (hasNewFromOthers) {
          setHasNewMessages(true);
          
          // Show toast notification
          if (enableToast) {
            toast({
              title: "New Voice Message",
              description: `${newMessages.length} new voice message(s) received`,
            });
          }
          
          // Play notification sound
          if (enableSound) {
            playNotificationSound();
          }
        }
      }
      
      setMessageCount(currentCount);
      prevMessageCountRef.current = currentCount;
    });

    return unsubscribe;
  }, [ticketId, userRole, enableSound, enableToast, toast]);

  const playNotificationSound = () => {
    try {
      // Create a simple notification beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  const clearNotifications = () => {
    setHasNewMessages(false);
  };

  return {
    hasNewMessages,
    messageCount,
    clearNotifications
  };
};
