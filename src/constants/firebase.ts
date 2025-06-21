
export const FIREBASE_PATHS = {
  tickets: "tickets",
  voiceMessages: (ticketId: string) => `voice_messages/${ticketId}`,
  storagePath: (ticketNumber: number, timestamp: number) => 
    `tickets/${ticketNumber}/${timestamp}.webm`,
};
