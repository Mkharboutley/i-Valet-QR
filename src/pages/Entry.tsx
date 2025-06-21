
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode } from 'lucide-react';
import InlineExitButton from '@/components/InlineExitButton';

const Entry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 mobile-safe-top mobile-safe-bottom">
      {/* Inline Exit Button */}
      <InlineExitButton className="fixed top-4 right-4 z-50" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      {/* Glowing orbs optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/20 rounded-full filter blur-[80px] sm:blur-[96px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/20 rounded-full filter blur-[80px] sm:blur-[96px] animate-pulse delay-1000" />
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="relative z-10 w-full max-w-sm space-y-6 pt-16" dir="rtl">
        {/* Action buttons with mobile-first design */}
        <Button
          onClick={() => navigate('/create-ticket')}
          className="w-full h-16 sm:h-14 bg-gradient-to-r from-blue-600/80 to-blue-400/80 hover:from-blue-500/90 hover:to-blue-300/90
            backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(59,130,246,0.3)]
            hover:shadow-[0_8px_48px_rgba(59,130,246,0.4)] transition-all duration-300
            text-white text-xl sm:text-lg rounded-2xl
            active:scale-[0.98] touch-action-manipulation select-none"
        >
          <CreditCard className="h-6 w-6 sm:h-5 sm:w-5 ml-3 sm:ml-2" />
          بطاقة جديدة
        </Button>

        <Button
          onClick={() => navigate('/scan-close')}
          className="w-full h-16 sm:h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl 
            border border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]
            hover:shadow-[0_8px_48px_rgba(0,0,0,0.3)] transition-all duration-300
            text-white text-xl sm:text-lg rounded-2xl
            active:scale-[0.98] touch-action-manipulation select-none"
        >
          <QrCode className="h-6 w-6 sm:h-5 sm:w-5 ml-3 sm:ml-2" />
          إغلاق بطاقة
        </Button>
      </div>
    </div>
  );
};

export default Entry;
