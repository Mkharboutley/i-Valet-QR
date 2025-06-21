import React, { useState, useRef } from 'react';
import { uploadVoiceFile } from '../../services/storage';
import { createVoiceMessage } from '../../services/realtime';
import { useToast } from '@/hooks/use-toast';
import VoiceRecorderError from './VoiceRecorderError';
import VoiceRecorderButton from './VoiceRecorderButton';
import VoiceRecorderPermissionInfo from './VoiceRecorderPermissionInfo';

interface VoiceRecorderProps {
  ticketId: string;
  ticketNumber: number;
  sender: 'client' | 'admin';
  onMessageSent?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  ticketId,
  ticketNumber,
  sender,
  onMessageSent
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const getSupportedMimeType = (): string => {
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
      'audio/mp4'
    ];
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  };

  const startRecording = async () => {
    try {
      setError(null);
      setHasPermissionError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 22050,
          channelCount: 1
        }
      });

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      if (mimeType?.includes('opus')) options.audioBitsPerSecond = 32000;
      else if (mimeType?.includes('webm')) options.audioBitsPerSecond = 48000;
      else options.audioBitsPerSecond = 64000;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = handleRecordingStop;
      mediaRecorder.start(100);
      setIsRecording(true);
      toast({ title: 'بدأ التسجيل', description: 'جاري تسجيل رسالتك الصوتية...' });
    } catch {
      setError('فشل في الوصول للميكروفون');
      toast({
        title: 'خطأ في التسجيل',
        description: 'لا يمكن الوصول إلى الميكروفون.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordingStop = async () => {
    setIsUploading(true);
    try {
      if (chunksRef.current.length === 0) throw new Error('لا توجد بيانات صوتية');

      const mime = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(chunksRef.current, { type: mime });

      if (audioBlob.size === 0) throw new Error('التسجيل فارغ');

      const [uploadResult] = await Promise.all([
        uploadVoiceFile(audioBlob, ticketNumber.toString(), sender)
      ]);

      await createVoiceMessage(ticketId, {
        sender,
        storage_path: uploadResult.storagePath
      });

      toast({ title: 'تم الإرسال', description: 'تم إرسال رسالتك الصوتية بنجاح.' });
      onMessageSent?.();
      setError(null);
      setHasPermissionError(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطأ غير معروف';
      if (message.includes('PERMISSION_DENIED')) {
        setHasPermissionError(true);
        setError('خطأ في صلاحيات قاعدة البيانات');
        toast({
          title: 'خطأ في الصلاحيات',
          description: 'لا توجد صلاحيات للوصول.',
          variant: 'destructive'
        });
      } else if (message.includes('storage')) {
        setError('فشل في رفع الملف الصوتي');
        toast({
          title: 'خطأ في التخزين',
          description: 'فشل في رفع الملف الصوتي.',
          variant: 'destructive'
        });
      } else if (message.includes('network')) {
        setError('خطأ في الشبكة');
        toast({
          title: 'خطأ في الشبكة',
          description: 'تحقق من اتصالك بالإنترنت.',
          variant: 'destructive'
        });
      } else {
        setError('فشل في إرسال الرسالة');
        toast({
          title: 'خطأ في الرفع',
          description: `فشل في إرسال الرسالة: ${message}`,
          variant: 'destructive'
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setHasPermissionError(false);
  };

  return (
    <div className="w-full space-y-3">
      <VoiceRecorderError
        error={error}
        hasPermissionError={hasPermissionError}
        onClearError={clearError}
      />
      <VoiceRecorderButton
        isRecording={isRecording}
        isUploading={isUploading}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
      />
      <VoiceRecorderPermissionInfo
        hasPermissionError={hasPermissionError}
        isRecording={isRecording}
        isUploading={isUploading}
      />
    </div>
  );
};

export default VoiceRecorder;
