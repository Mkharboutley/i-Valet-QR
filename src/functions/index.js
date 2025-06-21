"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const button_1 = require("@/components/ui/button");
const useTicketStatus_1 = require("../hooks/useTicketStatus");
const ticketService_1 = require("../services/ticketService");
const use_toast_1 = require("@/hooks/use-toast");
const notifications_1 = require("../services/notifications");
const ClientTicket = () => {
    const { ticketId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { ticket, isLoading, error } = (0, useTicketStatus_1.useTicketStatus)(ticketId || '');
    const { toast } = (0, use_toast_1.useToast)();
    console.log('🎫 ClientTicket - PUBLIC ACCESS MODE');
    console.log('🎫 ClientTicket - ticketId:', ticketId);
    console.log('🎫 ClientTicket - ticket:', ticket);
    console.log('🎫 ClientTicket - ticket status:', ticket?.status);
    console.log('🎫 ClientTicket - isLoading:', isLoading);
    console.log('🎫 ClientTicket - error:', error);
    // Initialize notifications when component mounts
    (0, react_1.useEffect)(() => {
        console.log('🔔 ClientTicket: Initializing notifications for public access...');
        (0, notifications_1.initializeClientNotifications)()
            .then(permission => {
            console.log('🔔 ClientTicket: Notification permission:', permission);
        })
            .catch(err => {
            console.log('🔔 ClientTicket: Error initializing notifications:', err);
        });
    }, []);
    // Monitor status changes for notifications
    (0, react_1.useEffect)(() => {
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
            await (0, ticketService_1.updateTicketStatus)(ticket.id, 'requested');
            console.log('✅ ClientTicket: Status update successful');
            console.log('✅ ClientTicket: Status should now be "requested" in database');
            // Send notification
            (0, notifications_1.notifyStatusChange)('requested', ticket.ticket_number);
            toast({
                title: "طلب مقبول",
                description: "تم طلب سيارتك بنجاح. سيتم إحضارها قريباً",
            });
        }
        catch (error) {
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
        return className = "min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center";
        dir = "rtl" >
            className;
        "text-white text-center" >
            className;
        "animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" > /div>
            < div > جاري;
        تحميل;
        بيانات;
        البطاقة;
        /div>
            < div;
        className = "text-sm text-white/50 mt-2" >
            وضع;
        الوصول;
        العام - لا;
        يتطلب;
        تسجيل;
        دخول
            < /div>
            < /div>
            < /div>;
    }
};
;
// Show error state
if (error || !ticket) {
    return className = "min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center";
    dir = "rtl" >
        className;
    "text-white text-center" >
        className;
    "text-red-200 mb-4" >
        { error, message } === 'Access restricted' ? 'محدود الوصول مؤقتاً' : 'خطأ في تحميل البطاقة';
}
/div>
    < div;
className = "text-sm text-white/70 mb-4" >
    { error, message } === 'Access restricted'
    ? 'يرجى المحاولة مرة أخرى بعد قليل'
    : 'تأكد من صحة الرابط أو اتصالك بالإنترنت';
/div>
    < div;
className = "text-xs text-white/50 mb-4" >
    الوصول;
العام - لا;
يتطلب;
تسجيل;
دخول
    < /div>
    < button_1.Button;
onClick = {}();
window.location.reload();
className = "bg-blue-600 hover:bg-blue-700"
    >
        إعادة;
المحاولة
    < /Button>
    < /div>
    < /div>;
;
// Helper functions
const formatEnglishDate = (date) => {
    const options = {
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
const getStatusText = (status) => {
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
const getStatusColor = (status) => {
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
return className = "min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900";
dir = "rtl" >
    { /* Header with public access indicator */}
    < div;
className = "absolute top-4 left-4 z-10" >
    className;
"text-xs text-white/50 bg-black/20 px-2 py-1 rounded" >
    وضع;
عام - بدون;
تسجيل;
دخول
    < /div>
    < /div>;
{ /* Main Content */ }
className;
"flex flex-col items-center px-4 pt-12 pb-4" >
    className;
"w-full max-w-sm" >
    className;
"bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden" >
    { /* Ticket Information Section */}
    < div;
className = "p-6 pb-4" >
    { /* Ticket Information */}
    < div;
className = "space-y-4 text-right text-white" >
    className;
"flex justify-between items-center" >
    className;
"text-white/80" > ;
رقم;
البطاقة < /span>
    < span;
className = "font-bold text-lg" > { String(ticket) { }, : .ticket_number, : .padStart(2, '0') } < /span>
    < /div>
    < div;
className = "flex justify-between items-center" >
    className;
"text-white/80" > ;
رقم;
اللوحة < /span>
    < span;
className = "font-bold text-lg" > { ticket, : .plate_number } < /span>
    < /div>
    < div;
className = "flex justify-between items-center" >
    className;
"text-white/80" > ;
موديل;
السيارة < /span>
    < span;
className = "font-bold text-lg" > { ticket, : .car_model } < /span>
    < /div>
    < div;
className = "flex justify-between items-center" >
    className;
"text-white/80" > ;
وقت;
الدخول < /span>
    < span;
className = "font-bold text-sm" > { formatEnglishDate(ticket) { }, : .created_at.toDate() } < /span>
    < /div>
    < div;
className = "flex justify-between items-center" >
    className;
"text-white/80" > ;
الحالة < /span>
    < span;
className = {} `font-bold ${getStatusColor(ticket.status)}`;
 >
    { getStatusText(ticket) { }, : .status }
    < /span>
    < /div>
    < /div>;
{ /* Action Button */ }
className;
"mt-8 flex justify-center" >
    className;
"w-3/4" >
    onClick;
{
    handleRequestCar;
}
disabled = {};
canRequestCar;
className = {} `w-full py-4 text-lg rounded-xl border border-white/20 ${canRequestCar
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-gray-500 cursor-not-allowed text-gray-300'}`;
    >
        className;
"h-5 w-5 mr-2" /  >
    { canRequestCar, 'اطلب سيارتك': 'تم الطلب بالفعل' }
    < /Button>
    < /div>
    < /div>
    < /div>;
{ /* Voice Messages Section */ }
className;
"border-t border-white/30 bg-black/10" >
    className;
"p-4" >
    { /* Voice Chat */}
    < div;
className = "h-[280px] bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10" >
    ticketId;
{
    ticket.id;
}
ticketNumber = { ticket, : .ticket_number };
userRole = "client"
    /  >
    /div>
    < /div>
    < /div>
    < /div>
    < /div>
    < /div>
    < /div>;
;
;
exports.default = ClientTicket;
