
import { getDatabase, ref, set } from "firebase/database";
import { FIREBASE_PATHS } from "../constants/firebase";
import { VOICE_MESSAGE_FIELDS } from "../constants/messageFields";

export const saveVoiceMessage = async (
  ticketId: string,
  messageId: string,
  audioUrl: string,
  senderRole: string,
  duration: number
) => {
  const db = getDatabase();
  await set(ref(db, `${FIREBASE_PATHS.voiceMessages(ticketId)}/${messageId}`), {
    [VOICE_MESSAGE_FIELDS.audioUrl]: audioUrl,
    [VOICE_MESSAGE_FIELDS.senderRole]: senderRole,
    [VOICE_MESSAGE_FIELDS.duration]: duration,
    [VOICE_MESSAGE_FIELDS.createdAt]: Date.now(),
  });
};
