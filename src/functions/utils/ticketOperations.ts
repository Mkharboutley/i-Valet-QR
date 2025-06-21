
import { generateUniqueId, createTicketData } from '../../utils/ticketUtils';

export const generateTicketId = () => {
  return generateUniqueId();
};

export const createNewTicketData = (ticketNumber: number, plateNumber: string, carModel: string) => {
  return createTicketData(ticketNumber, plateNumber, carModel);
};
