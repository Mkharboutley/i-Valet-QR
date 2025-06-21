
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface QRDisplayModalProps {
  isVisible: boolean;
  qrCodeUrl: string;
  ticketData: {
    ticket_number: number;
    plate_number: string;
    car_model: string;
    created_at: Date;
  };
  onClose: () => void;
}

const QRDisplayModal: React.FC<QRDisplayModalProps> = ({
  isVisible,
  qrCodeUrl,
  ticketData,
  onClose
}) => {
  const navigate = useNavigate();

  console.log('QRDisplayModal render - isVisible:', isVisible, 'qrCodeUrl:', !!qrCodeUrl, 'ticketData:', !!ticketData);

  if (!isVisible || !qrCodeUrl || !ticketData) {
    console.log('QRDisplayModal not showing - conditions not met');
    return null;
  }

  const handleClose = () => {
    onClose();
    navigate('/create-ticket');
  };

  console.log('QRDisplayModal showing with complete background blocking');

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Solid background to completely block underlying page */}
      <div className="absolute inset-0 bg-gray-900" />
      
      {/* Animated gradient background - same as CreateTicket page */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Glowing orbs - same as CreateTicket page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse delay-1000" />
      </div>
      
      {/* Modal content container with 90px upward offset */}
      <div className="absolute inset-0 flex items-center justify-center p-2" style={{ transform: 'translateY(-90px)' }}>        
        {/* Main container - using 90% of viewport width */}
        <div className="w-full relative z-10" style={{ maxWidth: '90vw' }}>
          <div className="bg-gray-600/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            {/* QR Code section */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            {/* Information section - exactly as shown in screenshot */}
            <div className="text-center text-white space-y-2 mb-8">
              <p className="text-lg">رقم التذكرة: {String(ticketData.ticket_number).padStart(4, '0')}</p>
              <p className="text-lg">رقم اللوحة: {ticketData.plate_number}</p>
              <p className="text-lg">موديل السيارة: {ticketData.car_model}</p>
              <p className="text-lg">وقت الدخول: {ticketData.created_at.toLocaleString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
            </div>
            
            {/* Close button - glowing gradient red accent */}
            <Button
              onClick={handleClose}
              className="w-full h-14 text-xl font-medium
                bg-gradient-to-r from-red-600 via-red-500 to-red-400 
                hover:from-red-700 hover:via-red-600 hover:to-red-500
                text-white rounded-2xl 
                shadow-[0_0_25px_rgba(239,68,68,0.6)]
                hover:shadow-[0_0_35px_rgba(239,68,68,0.8)]
                transition-all duration-300
                border-0"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRDisplayModal;
