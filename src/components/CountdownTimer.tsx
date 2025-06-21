import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { ETAConfig } from '../types/AdminConfig';
import { notifyStatusChange } from '../services/notifications';

interface CountdownTimerProps {
  etaMinutes: number;
  assignedAt: Date;
  ticketNumber: number;
  onComplete?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  etaMinutes,
  assignedAt,
  ticketNumber,
  onComplete,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
    isComplete: boolean;
  }>({ minutes: 0, seconds: 0, isComplete: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = new Date(assignedAt.getTime() + (etaMinutes * 60 * 1000));
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        return { minutes: 0, seconds: 0, isComplete: true };
      }

      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { minutes, seconds, isComplete: false };
    };

    // Initial calculation
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // If already complete, trigger completion immediately
    if (initialTime.isComplete) {
      notifyStatusChange('completed', ticketNumber);
      onComplete?.();
      return;
    }

    // Set up interval for countdown
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown just completed
      if (newTimeLeft.isComplete && !timeLeft.isComplete) {
        console.log('🕐 Countdown completed for ticket:', ticketNumber);
        notifyStatusChange('completed', ticketNumber);
        onComplete?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [etaMinutes, assignedAt, ticketNumber, onComplete, timeLeft.isComplete]);

  if (timeLeft.isComplete) {
    return (
      <div className={`flex items-center justify-center gap-1 p-2 bg-green-500/20 border border-green-400/50 rounded-lg ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-400" />
        <span className="text-green-300 font-bold text-sm">سيارتك جاهزة!</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 p-2 bg-blue-500/20 border border-blue-400/50 rounded-lg ${className}`}>
      <div className="flex items-center gap-1 text-blue-300">
        <Clock className="h-3 w-3" />
        <span className="text-xs">الوقت المتبقي لوصول سيارتك</span>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Seconds on the left */}
        <div className="bg-blue-600/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-blue-400/30">
          <span className="text-sm font-bold text-white">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-blue-200 block text-center leading-none">ثانية</span>
        </div>
        
        <span className="text-blue-300 text-sm">:</span>
        
        {/* Minutes on the right */}
        <div className="bg-blue-600/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-blue-400/30">
          <span className="text-sm font-bold text-white">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs text-blue-200 block text-center leading-none">دقيقة</span>
        </div>
      </div>
      
      <div className="text-xs text-blue-200 text-center">
        جاري إحضار سيارتك الآن...
      </div>
    </div>
  );
};

export default CountdownTimer;