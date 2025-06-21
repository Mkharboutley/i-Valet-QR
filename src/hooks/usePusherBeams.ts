
import { useState, useEffect } from 'react';
import { pusherBeamsService, NotificationPayload } from '../services/pusher-beams';

export interface PusherBeamsOptions {
  instanceId: string;
  userId?: string;
  ticketId?: string;
  enableAutoSubscribe?: boolean;
}

export const usePusherBeams = ({
  instanceId,
  userId,
  ticketId,
  enableAutoSubscribe = true
}: PusherBeamsOptions) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [subscribedTickets, setSubscribedTickets] = useState<string[]>([]);

  useEffect(() => {
    initializeBeams();

    return () => {
      pusherBeamsService.stop();
    };
  }, [instanceId]);

  // Auto-subscribe to ticket if provided
  useEffect(() => {
    if (isInitialized && ticketId && enableAutoSubscribe) {
      subscribeToTicket(ticketId);
    }
  }, [isInitialized, ticketId, enableAutoSubscribe]);

  const initializeBeams = async () => {
    try {
      setError(null);
      
      await pusherBeamsService.initialize({ instanceId, userId });
      setIsInitialized(true);
      
      if (userId) {
        await pusherBeamsService.setUser(userId);
      }
      
      await requestPermission();
    } catch (err) {
      console.error('Error initializing Pusher Beams:', err);
      setError(err as Error);
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await pusherBeamsService.requestPermission();
      setPermissionStatus(permission);
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return null;
    }
  };

  const subscribeToTicket = async (id: string) => {
    try {
      await pusherBeamsService.subscribeToTicket(id);
      setSubscribedTickets(prev => [...new Set([...prev, id])]);
    } catch (err) {
      console.error(`Error subscribing to ticket ${id}:`, err);
      setError(err as Error);
    }
  };

  const unsubscribeFromTicket = async (id: string) => {
    try {
      await pusherBeamsService.unsubscribeFromTicket(id);
      setSubscribedTickets(prev => prev.filter(ticketId => ticketId !== id));
    } catch (err) {
      console.error(`Error unsubscribing from ticket ${id}:`, err);
    }
  };

  // Mock function to simulate sending a notification
  // In a real app, this would be sent from the server
  const sendNotification = async (
    interest: string,
    payload: NotificationPayload
  ) => {
    if (!isInitialized) {
      throw new Error('Pusher Beams not initialized');
    }
    
    await pusherBeamsService.sendNotification(interest, payload);
  };

  return {
    isInitialized,
    permissionStatus,
    error,
    subscribedTickets,
    requestPermission,
    subscribeToTicket,
    unsubscribeFromTicket,
    sendNotification
  };
};
