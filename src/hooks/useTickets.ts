
import { useState, useEffect } from 'react';
import { getTickets } from '../services/firestore';
import { Ticket } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ticketData = await getTickets();
      setTickets(ticketData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load tickets');
      setError(error);
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return {
    tickets,
    isLoading,
    error,
    reloadTickets: loadTickets
  };
};
