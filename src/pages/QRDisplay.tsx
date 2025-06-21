import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QRDisplay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { qrCodeUrl, ticketData } = location.state || {};

  useEffect(() => {
    if (!qrCodeUrl || !ticketData) {
      navigate('/create-ticket');
    }
  }, [qrCodeUrl, ticketData, navigate]);

  const handleClose = () => {
    navigate('/create-ticket');
  };

  if (!qrCodeUrl || !ticketData) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden mobile-safe-top mobile-safe-bottom">
      {/* Animated gradient background */}
      <div className="animated-gradient" />

      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full filter blur-[80px] sm:blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* QR Display content - centered with 40px downward offset to account for logo */}
      <div className="relative z-20 w-full" style={{ maxWidth: '90vw', transform: 'translateY(40px)' }}>
        <div className="bg-gray-600/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full">
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

          {/* Ticket Information - Correct RTL + LTR layout */}
          <div className="text-white space-y-2 mb-8 text-right" dir="rtl">
            <div className="flex justify-between items-center">
              <span className="text-white/80"> رقم التذكرة</span>
              <span className="font-bold text-lg" dir="ltr">{String(ticketData.ticket_number).padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80"> رقم اللوحة</span>
              <span className="font-bold text-lg" dir="ltr">{ticketData.plate_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80"> موديل السيارة</span>
              <span className="font-bold text-lg" dir="ltr">{ticketData.car_model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80"> وقت الدخول</span>
              <span className="font-bold text-sm" dir="ltr">
                {
                  (() => {
                    try {
                      let date;

                      if (ticketData.created_at?.toDate) {
                        date = ticketData.created_at.toDate(); // Firestore Timestamp
                      } else if (ticketData.created_at?.seconds) {
                        date = new Date(ticketData.created_at.seconds * 1000);
                      } else if (typeof ticketData.created_at === 'string' || typeof ticketData.created_at === 'number') {
                        date = new Date(ticketData.created_at);
                      } else if (ticketData.created_at instanceof Date) {
                        date = ticketData.created_at;
                      }

                      if (!date || isNaN(date.getTime())) return 'N/A';

                      return date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    } catch (e) {
                      return 'N/A';
                    }
                  })()
                }
              </span>
            </div>
          </div>

          {/* Close button */}
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
  );
};

export default QRDisplay;
