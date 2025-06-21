
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Ticket } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadTicket = async () => {
    if (!ticketId) {
      console.log('No ticket ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Loading ticket with ID:', ticketId);
      setIsLoading(true);
      setError(null);
      
      const firestore = getFirestoreInstance();
      const ticketRef = doc(firestore, 'tickets', ticketId);
      const docSnapshot = await getDoc(ticketRef);
      
      if (docSnapshot.exists()) {
        const ticketData = {
          id: docSnapshot.id,
          ...docSnapshot.data()
        } as Ticket;
        
        console.log('Ticket loaded successfully:', ticketData);
        setTicket(ticketData);
      } else {
        console.log('Ticket not found with ID:', ticketId);
        const notFoundError = new Error('Ticket not found');
        setError(notFoundError);
        setTicket(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load ticket');
      console.error('Error loading ticket:', error);
      setError(error);
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  return {
    ticket,
    isLoading,
    error,
    reloadTicket: loadTicket
  };
};
