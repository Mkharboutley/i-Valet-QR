
export interface VoiceMessage {
  id: string;
  sender: 'client' | 'admin';
  storage_path: string; // e.g., "tickets/11/1682199812639.webm"
  timestamp: number; // Use `number`, not `Date`
  isPlaying?: boolean;
}
