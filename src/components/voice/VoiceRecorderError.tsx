
import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

interface VoiceRecorderErrorProps {
  error: string | null;
  hasPermissionError: boolean;
  onClearError: () => void;
}

const VoiceRecorderError: React.FC<VoiceRecorderErrorProps> = ({
  error,
  hasPermissionError,
  onClearError
}) => {
  if (!error) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      hasPermissionError 
        ? 'bg-yellow-500/20 border-yellow-500/30' 
        : 'bg-red-500/20 border-red-500/30'
    }`}>
      {hasPermissionError ? (
        <Shield className="h-4 w-4 text-yellow-400" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-400" />
      )}
      <span className={`text-sm ${
        hasPermissionError ? 'text-yellow-300' : 'text-red-300'
      }`}>
        {error}
      </span>
      <button 
        onClick={onClearError}
        className={`ml-2 ${
          hasPermissionError ? 'text-yellow-300 hover:text-yellow-200' : 'text-red-300 hover:text-red-200'
        }`}
      >
        ✕
      </button>
    </div>
  );
};

export default VoiceRecorderError;
