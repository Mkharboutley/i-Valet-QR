import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderButtonProps {
  isRecording: boolean;
  isUploading: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({
  isRecording,
  isUploading,
  onStartRecording,
  onStopRecording
}) => {
  const getButtonText = () => {
    if (isRecording) return 'جاري التسجيل...';
    if (isUploading) return 'جاري الرفع...';
    return 'اضغط للتسجيل';
  };

  const getButtonIcon = () => {
    if (isRecording) return <Square className="h-6 w-6" />;
    return <Mic className="h-6 w-6" />;
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xs">
        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isUploading}
          className={`
            w-full py-6 px-8 text-lg font-semibold rounded-2xl 
            transition-all duration-300 transform active:scale-95
            shadow-lg hover:shadow-xl
            ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse border-2 border-red-400/50' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-2 border-green-400/50'
            } 
            ${isUploading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}
            backdrop-blur-sm
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`
              p-2 rounded-full 
              ${isRecording ? 'bg-white/20' : 'bg-white/20'}
            `}>
              {getButtonIcon()}
            </div>
            <span className="font-medium tracking-wide">
              {getButtonText()}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default VoiceRecorderButton;