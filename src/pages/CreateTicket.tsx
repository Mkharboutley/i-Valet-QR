
import React from 'react';
import CreateTicketForm from '../components/CreateTicketForm';
import InlineExitButton from '@/components/InlineExitButton';

const CreateTicket: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start p-4 overflow-hidden mobile-safe-top mobile-safe-bottom">
      {/* Inline Exit Button - positioned with safe area */}
      <InlineExitButton className="fixed top-4 right-4 z-50" />
      
      {/* Animated gradient background */}
      <div className="animated-gradient" />
      
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Main Content - Centered with proper spacing accounting for logo header */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center flex-1 space-y-4 pt-24 pb-4" style={{ maxWidth: '90vw' }}>
        {/* GIF Display Space - 192px x 192px (30% smaller than 275px) */}
        <div className="w-[192px] h-[192px] flex items-center justify-center">
          <img 
            src="/lovable-uploads/output-onlinegiftools (1).gif" 
            alt="Scanner Animation"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Form Card */}
        <div className="glass-card w-full">
          <CreateTicketForm />
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
