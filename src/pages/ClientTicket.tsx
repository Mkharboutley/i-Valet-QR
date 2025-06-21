import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTicketStatus } from '../hooks/useTicketStatus';
import { updatePublicTicket } from '../functions/ticket/ticketOperations';
import { useToast } from '@/hooks/use-toast';
import { initializeClientNotifications, notifyStatusChange, testPushNotificationSetup } from '../services/notifications';
import { usePusherBeams } from '../hooks/usePusherBeams';
import VoiceChatModule from '../components/voice/VoiceChatModule';
import CountdownTimer from '../components/CountdownTimer';
import Logo from '@/components/Logo';

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

  // Use the existing Pusher Beams hook instead of manual initialization
  usePusherBeams(ticket?.client_token || '');

  // Initialize notifications when component mounts
  useEffect(() => {
    console.log('🔔 ClientTicket: Initializing notifications for public access...');
    initializeClientNotifications()
      .then(permission => {
        console.log('🔔 ClientTicket: Notification permission:', permission);
        
        // Test push notification setup if we have a ticket
        if (ticketId && permission === 'granted') {
          testPushNotificationSetup(ticketId);
        }
      })
      .catch(err => {
        console.log('🔔 ClientTicket: Error initializing notifications:', err);
      });
  }, [ticketId]);

  const handleRequestCar = async () => {
    if (!ticket) {
      console.error('❌ ClientTicket: No ticket available for car request');
      return;
    }

    console.log('🚗 ClientTicket: Starting car request process...');
    console.log('🚗 ClientTicket: Ticket ID:', ticket.id);
    console.log('🚗 ClientTicket: Current status:', ticket.status);
    console.log('🚗 ClientTicket: About to call updatePublicTicket with status: requested');

    try {
      console.log('📤 ClientTicket: Sending PUBLIC status update request...');
      console.log('📤 ClientTicket: Update params - ticketId:', ticket.id, 'newStatus: requested');
      
      const result = await updatePublicTicket(ticket.id, 'requested');
      
      console.log('✅ ClientTicket: PUBLIC status update successful');
      console.log('✅ ClientTicket: Status should now be "requested" in database');
      console.log('✅ ClientTicket: Update result:', result);
      
      // Send notification
      notifyStatusChange('requested', ticket.ticket_number);
      
      toast({
        title: "طلب مقبول",
        description: "تم طلب سيارتك بنجاح. سيتم إحضارها قريباً",
      });
    } catch (error) {
      console.error('❌ ClientTicket: Error in handleRequestCar:', error);
      console.error('❌ ClientTicket: Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        ticketId: ticket.id
      });
      
      // More specific error handling
      let errorMessage = 'فشل في طلب السيارة';
      
      if (error?.code === 'permission-denied') {
        errorMessage = 'خطأ في الصلاحيات - يرجى المحاولة مرة أخرى';
      } else if (error?.message?.includes('network')) {
        errorMessage = 'خطأ في الشبكة - تحقق من الاتصال';
      } else if (error?.message) {
        errorMessage = `خطأ: ${error.message}`;
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCountdownComplete = () => {
    console.log('🕐 Countdown completed for ticket:', ticket?.ticket_number);
    toast({
      title: "سيارتك جاهزة!",
      description: "وصل السائق مع سيارتك",
    });
  };

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

  // Helper function to get button text based on status
  const getButtonText = (status: string) => {
    switch (status) {
      case 'running':
        return 'اطلب سيارتك';
      case 'requested':
        return 'بإنتظار تعيين سائق';
      case 'assigned':
        return 'جاري الإحضار';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'بإنتظار تعيين سائق';
    }
  };

  const canRequestCar = ticket?.status === 'running';
  const isAssigned = ticket?.status === 'assigned' && ticket?.assigned_at && ticket?.eta_minutes;

  console.log('🎫 ClientTicket: Rendering with ticket status:', ticket?.status);
  console.log('🎫 ClientTicket: Can request car:', canRequestCar);
  console.log('🎫 ClientTicket: Is assigned:', isAssigned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 relative" dir="rtl">
      {/* Animated Glass Morphism Waves */}
      <div className="glass-waves"></div>
      <div className="glass-waves-layer-2"></div>
      
      {/* Header with centered logo */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex justify-center">
          <Logo className="w-32 h-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 pt-12 pb-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
            
            {/* Ticket Information Section */}
            <div className="p-6 pb-4">
              {/* Ticket Information */}
              <div className="space-y-4 text-right text-white">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">   رقم البطاقة  ⁚ </span>
                  <span className="font-bold text-lg">{String(ticket.ticket_number).padStart(2, '0')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">  رقم اللوحة  ⁚</span>
                  <span className="font-bold text-lg">{ticket.plate_number}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80"> موديل السيارة  ⁚</span>
                  <span className="font-bold text-lg">{ticket.car_model}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80"> وقت الدخول  ⁚</span>
                  <span className="font-bold text-sm">{formatEnglishDate(ticket.created_at.toDate())}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/80"> الحالة  ⁚</span>
                  <span className={`font-bold ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>

                {/* Show assigned worker info if available */}
                {ticket.assigned_worker && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/80"> السائق المكلف  ⁚</span>
                    <span className="font-bold text-blue-300">{ticket.assigned_worker}</span>
                  </div>
                )}
              </div>

              {/* Action Button or Countdown Timer */}
              <div className="mt-8">
                {isAssigned ? (
                  <CountdownTimer
                    etaMinutes={ticket.eta_minutes}
                    assignedAt={ticket.assigned_at.toDate()}
                    ticketNumber={ticket.ticket_number}
                    onComplete={handleCountdownComplete}
                    className="w-full"
                  />
                ) : (
                  <div className="flex justify-center">
                    <div className="w-full">
                      <Button 
                        onClick={handleRequestCar}
                        disabled={!canRequestCar}
                        className={`w-full py-4 text-lg rounded-xl border border-white/20 ${
                          canRequestCar 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-500 cursor-not-allowed text-gray-300'
                        }`}
                      >
                        {getButtonText(ticket.status)}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Messages Section - Reduced height by 10px */}
            <div className="border-t border-white/20 bg-black/10">
              <div className="p-1">
                {/* Voice Chat - Reduced height from 215px to 205px (10px reduction) */}
                <div className="h-[205px] bg-white/3 backdrop-blur-lg rounded-2xl border border-white/20">
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