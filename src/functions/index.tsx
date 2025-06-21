import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTicketStatus } from '../hooks/useTicketStatus';
import { updateTicketStatus } from '../services/ticketService';
import { useToast } from '@/hooks/use-toast';
import { initializeClientNotifications, notifyStatusChange } from '../services/notifications';
import VoiceChatModule from '../components/voice/VoiceChatModule';

const ClientTicket: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { ticket, isLoading, error } = useTicketStatus(ticketId || '');
  const { toast } = useToast();

  console.log('🎫 ClientTicket - PUBLIC ACCESS MODE');
  console.log('🎫 ClientTicket - ticketId:', ticketId);
  console.log('🎫 ClientTicket - ticket:', ticket);
  console.log('🎫 ClientTicket - ticket status:', ticket?.status);
  console.log('🎫 ClientTicket - isLoading:', isLoading);
  console.log('🎫 ClientTicket - error:', error);

  // Initialize notifications when component mounts
  useEffect(() => {
    console.log('🔔 ClientTicket: Initializing notifications for public access...');
    initializeClientNotifications()
      .then(permission => {
        console.log('🔔 ClientTicket: Notification permission:', permission);
      })
      .catch(err => {
        console.log('🔔 ClientTicket: Error initializing notifications:', err);
      });
  }, []);

  // Monitor status changes for notifications
  useEffect(() => {
    if (ticket) {
      console.log('🔔 ClientTicket: Monitoring status changes for ticket:', ticket.ticket_number);
      // Note: Status change notifications are handled in useTicketStatus hook
    }
  }, [ticket]);

  const handleRequestCar = async () => {
    if (!ticket) {
      console.error('❌ ClientTicket: No ticket available for car request');
      return;
    }

    console.log('🚗 ClientTicket: Starting car request process...');
    console.log('🚗 ClientTicket: Ticket ID:', ticket.id);
    console.log('🚗 ClientTicket: Current status:', ticket.status);
    console.log('🚗 ClientTicket: About to call updateTicketStatus with status: requested');

    try {
      console.log('📤 ClientTicket: Sending status update request...');
      console.log('📤 ClientTicket: Update params - ticketId:', ticket.id, 'newStatus: requested');
      
      await updateTicketStatus(ticket.id, 'requested');
      
      console.log('✅ ClientTicket: Status update successful');
      console.log('✅ ClientTicket: Status should now be "requested" in database');
      
      // Send notification
      notifyStatusChange('requested', ticket.ticket_number);
      
      toast({
        title: "طلب مقبول",
        description: "تم طلب سيارتك بنجاح. سيتم إحضارها قريباً",
      });
    } catch (error) {
      console.error('❌ ClientTicket: Error in handleRequestCar:', error);
      console.error('❌ ClientTicket: Error details:', {
        message: error.message,
        stack: error.stack,
        ticketId: ticket.id
      });
      
      toast({
        title: "خطأ",
        description: `فشل في طلب السيارة: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // ... keep existing code (loading state, error state, helper functions)

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center" dir="rtl">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div>جاري تحميل بيانات البطاقة...</div>
          <div className="text-sm text-white/50 mt-2">
            وضع الوصول العام - لا يتطلب تسجيل دخول
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center" dir="rtl">
        <div className="text-white text-center">
          <div className="text-red-200 mb-4">
            {error?.message === 'Access restricted' ? 'محدود الوصول مؤقتاً' : 'خطأ في تحميل البطاقة'}
          </div>
          <div className="text-sm text-white/70 mb-4">
            {error?.message === 'Access restricted' 
              ? 'يرجى المحاولة مرة أخرى بعد قليل'
              : 'تأكد من صحة الرابط أو اتصالك بالإنترنت'
            }
          </div>
          <div className="text-xs text-white/50 mb-4">
            الوصول العام - لا يتطلب تسجيل دخول
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatEnglishDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'مركونة';
      case 'requested':
        return 'تم الطلب';
      case 'assigned':
        return 'جاري الإحضار';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'مركونة';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'requested':
        return 'text-yellow-400';
      case 'assigned':
        return 'text-blue-400';
      case 'completed':
        return 'text-gray-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  const canRequestCar = ticket.status === 'running';

  console.log('🎫 ClientTicket: Rendering with ticket status:', ticket.status);
  console.log('🎫 ClientTicket: Can request car:', canRequestCar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" dir="rtl">
      {/* Header with public access indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs text-white/50 bg-black/20 px-2 py-1 rounded">
          وضع عام - بدون تسجيل دخول
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 pt-12 pb-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
            
            {/* Ticket Information Section */}
            <div className="p-6 pb-4">
              {/* Ticket Information */}
              <div className="space-y-4 text-right text-white">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">: رقم البطاقة</span>
                  <span className="font-bold text-lg">{String(ticket.ticket_number).padStart(2, '0')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">: رقم اللوحة</span>
                  <span className="font-bold text-lg">{ticket.plate_number}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">: موديل السيارة</span>
                  <span className="font-bold text-lg">{ticket.car_model}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">: وقت الدخول</span>
                  <span className="font-bold text-sm">{formatEnglishDate(ticket.created_at.toDate())}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/80">: الحالة</span>
                  <span className={`font-bold ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <div className="w-3/4">
                  <Button 
                    onClick={handleRequestCar}
                    disabled={!canRequestCar}
                    className={`w-full py-4 text-lg rounded-xl border border-white/20 ${
                      canRequestCar 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-500 cursor-not-allowed text-gray-300'
                    }`}
                  >
                    <Car className="h-5 w-5 mr-2" />
                    {canRequestCar ? 'اطلب سيارتك' : 'تم الطلب بالفعل'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Voice Messages Section */}
            <div className="border-t border-white/30 bg-black/10">
              <div className="p-4">
                {/* Voice Chat */}
                <div className="h-[280px] bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                  <VoiceChatModule
                    ticketId={ticket.id}
                    ticketNumber={ticket.ticket_number}
                    userRole="client"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTicket;
