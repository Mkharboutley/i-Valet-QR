
export interface VoiceFileMetadata {
  id: string;
  filename: string;
  size: number;
  duration: number;
  mimeType: string;
  uploadedAt: Date;
  storageUrl: string;
}
