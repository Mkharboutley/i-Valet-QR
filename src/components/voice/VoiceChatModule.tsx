import React, { useEffect, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Volume2, AlertCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoiceMessage } from '../../types/VoiceMessage';
import { subscribeToVoiceMessages } from '../../services/realtime';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessageItem from './VoiceMessageItem';
import { initializeFirebase } from '../../services/firebase';

interface VoiceChatModuleProps {
  ticketId: string;
  ticketNumber: number;
  userRole: 'client' | 'admin';
}

const VoiceChatModule: React.FC<VoiceChatModuleProps> = ({
  ticketId,
  ticketNumber,
  userRole
}) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize Firebase when component mounts
  useEffect(() => {
    try {
      console.log('🔥 VoiceChatModule: Initializing Firebase for PUBLIC access');
      initializeFirebase();
      console.log('✅ VoiceChatModule: Firebase initialized successfully for PUBLIC access');
    } catch (error) {
      console.log('⚠️ VoiceChatModule: Firebase already initialized or error:', error);
    }
  }, []);

  // Subscribe to voice messages
  useEffect(() => {
    if (!ticketId) {
      console.error('❌ VoiceChatModule: No ticket ID provided');
      setError('No ticket ID provided');
      setIsLoading(false);
      return;
    }

    console.log('🎤 VoiceChatModule: Setting up PUBLIC voice message subscription for ticket:', ticketId);
    console.log('🎤 VoiceChatModule: User role:', userRole);
    console.log('🎤 VoiceChatModule: This is PUBLIC access - NO AUTHENTICATION REQUIRED');
    
    try {
      const unsubscribe = subscribeToVoiceMessages(ticketId, (newMessages) => {
        console.log('📨 VoiceChatModule: Received voice messages update:', {
          messageCount: newMessages.length,
          previousCount: prevMessageCountRef.current
        });
        
        // Check for new messages from other users
        if (newMessages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
          const recentMessages = newMessages.slice(0, newMessages.length - prevMessageCountRef.current);
          const hasNewFromOthers = recentMessages.some(msg => msg.sender !== userRole);
          
          if (hasNewFromOthers) {
            console.log('🔔 VoiceChatModule: New messages from other users detected');
            setHasNewMessages(true);
            // Auto-scroll to new messages from others
            setTimeout(() => scrollToBottom(true), 100);
          }
        }
        
        // Sort messages by timestamp (oldest first for bottom-up display)
        const sortedMessages = [...newMessages].sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
        prevMessageCountRef.current = newMessages.length;
        setIsLoading(false);
        setError(null);
        setHasPermissionError(false);
      });

      // Set a timeout to stop loading even if no messages come
      const loadingTimeout = setTimeout(() => {
        console.log('⏰ VoiceChatModule: Loading timeout reached - showing interface');
        setIsLoading(false);
      }, 3000);

      return () => {
        console.log('🔄 VoiceChatModule: Cleaning up voice message subscription');
        clearTimeout(loadingTimeout);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ VoiceChatModule: Error setting up voice message subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to voice messages';
      
      // Check for permission errors
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('Permission denied')) {
        console.error('🔒 VoiceChatModule: Permission error detected');
        setHasPermissionError(true);
        setError('خطأ في الصلاحيات - يمكنك المحاولة مرة أخرى');
      } else {
        console.error('🌐 VoiceChatModule: Connection error detected');
        setError('فشل في الاتصال بالرسائل الصوتية');
      }
      setIsLoading(false);
    }
  }, [ticketId, userRole]);

  // Auto-scroll functionality
  const scrollToBottom = (force = false) => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        if (force || !isUserScrollingRef.current) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    }
  }, [messages]);

  // Handle scroll detection
  const handleScroll = () => {
    isUserScrollingRef.current = true;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 1000);
  };

  const handleMessageSent = () => {
    console.log('✅ VoiceChatModule: Voice message sent successfully');
    setHasNewMessages(false);
    setTimeout(() => scrollToBottom(true), 200);
  };

  const handleViewMessages = () => {
    setHasNewMessages(false);
    scrollToBottom(true);
  };

  const retryConnection = () => {
    console.log('🔄 VoiceChatModule: Retrying connection...');
    setError(null);
    setHasPermissionError(false);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with message count */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
              {messages.length}
            </Badge>
          )}
        </div>
        {hasNewMessages && (
          <Badge variant="default" className="animate-pulse flex items-center gap-1 bg-green-500 text-xs">
            <Volume2 className="h-3 w-3" />
            جديد
          </Badge>
        )}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 min-h-0" onClick={handleViewMessages}>
        <ScrollArea 
          ref={scrollAreaRef} 
          className="h-full px-2 py-2"
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-20 text-white/70">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                <div className="text-xs">جاري التحميل...</div>
              </div>
            </div>
          ) : hasPermissionError ? (
            <div className="flex flex-col items-center justify-center h-20 text-white/70">
              <Shield className="h-6 w-6 mb-1 text-yellow-400" />
              <div className="text-center mb-1 text-yellow-300 text-xs">
                خطأ في الاتصال
              </div>
              <div className="text-xs text-white/50 text-center mb-2">
                يمكنك المحاولة مرة أخرى
              </div>
              <Button 
                onClick={retryConnection}
                size="sm"
                variant="outline"
                className="text-xs text-white border-white/30 hover:bg-white/10 h-6"
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-20 text-white/70">
              <AlertCircle className="h-6 w-6 mb-1 text-red-400" />
              <div className="text-center mb-2 text-xs">{error}</div>
              <Button 
                onClick={retryConnection}
                size="sm"
                variant="outline"
                className="text-xs text-white border-white/30 hover:bg-white/10 h-6"
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-white/70 text-xs">
              لا توجد رسائل صوتية بعد
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <VoiceMessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender === userRole}
                  currentUserRole={userRole}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Recording Area */}
      <div className="px-2 py-3 border-t border-white/20 bg-white/5">
        <div className="flex items-center justify-center">
          <VoiceRecorder
            ticketId={ticketId}
            ticketNumber={ticketNumber}
            sender={userRole}
            onMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceChatModule;