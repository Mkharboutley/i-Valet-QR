
import React from 'react';

interface VoiceRecorderPermissionInfoProps {
  hasPermissionError: boolean;
  isRecording: boolean;
  isUploading: boolean;
}

const VoiceRecorderPermissionInfo: React.FC<VoiceRecorderPermissionInfoProps> = ({
  hasPermissionError,
  isRecording,
  isUploading
}) => {
  if (!hasPermissionError || isRecording || isUploading) {
    return null;
  }

  return (
    <div className="text-center">
      <span className="text-xs text-yellow-300/80">
        يمكنك التسجيل رغم مشكلة قاعدة البيانات
      </span>
    </div>
  );
};

export default VoiceRecorderPermissionInfo;
