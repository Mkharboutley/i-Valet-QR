
// Enhanced notification service with detailed logging

export const initializeClientNotifications = async (): Promise<NotificationPermission> => {
  console.log('🔔 Starting notification initialization...');
  
  if (!('Notification' in window)) {
    console.error('🔔 Browser does not support notifications');
    throw new Error('This browser does not support notifications');
  }

  console.log('🔔 Current permission status:', Notification.permission);

  if (Notification.permission === 'granted') {
    console.log('🔔 Notification permission already granted');
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    console.warn('🔔 Notification permission denied by user');
    return 'denied';
  }

  console.log('🔔 Requesting notification permission...');
  const permission = await Notification.requestPermission();
  console.log('🔔 Permission request result:', permission);
  
  return permission;
};

export const notifyStatusChange = (status: string, ticketNumber: number) => {
  console.log('🔔 Local notification triggered:', { status, ticketNumber });
  
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.warn('🔔 Cannot show local notification - permission not granted');
    return;
  }

  let title = '';
  let body = '';

  switch (status) {
    case 'requested':
      title = 'طلب مقبول';
      body = `تم طلب سيارتك رقم ${ticketNumber} بنجاح`;
      break;
    case 'assigned':
      title = 'سيارتك في الطريق!';
      body = `جاري إحضار سيارتك رقم ${ticketNumber}`;
      break;
    case 'completed':
      title = 'سيارتك جاهزة!';
      body = `وصل السائق مع سيارتك رقم ${ticketNumber}`;
      break;
    default:
      title = 'تحديث حالة السيارة';
      body = `تم تحديث حالة سيارتك رقم ${ticketNumber}`;
  }

  console.log('🔔 Showing local notification:', { title, body });
  
  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `ticket-${ticketNumber}`,
      data: {
        ticketNumber,
        status,
        timestamp: new Date().toISOString()
      }
    });

    notification.onclick = () => {
      console.log('🔔 Notification clicked');
      window.focus();
      notification.close();
    };

    setTimeout(() => {
      notification.close();
    }, 5000);
    
  } catch (error) {
    console.error('🔔 Error showing notification:', error);
  }
};

// Function to log client token registration
export const logClientTokenRegistration = (ticketId: string, clientToken: string) => {
  console.log('🔔 Client token registration:', {
    ticketId,
    clientToken,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};

// Function to test push notification setup
export const testPushNotificationSetup = async (ticketId: string) => {
  console.log('🧪 Testing push notification setup for ticket:', ticketId);
  
  // Check notification permission
  const permission = await initializeClientNotifications();
  console.log('🧪 Notification permission:', permission);
  
  // Check if service worker is registered
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      console.log('🧪 Service worker registration:', registration);
    } catch (error) {
      console.error('🧪 Service worker check failed:', error);
    }
  }
  
  // Test local notification
  if (permission === 'granted') {
    console.log('🧪 Testing local notification...');
    notifyStatusChange('assigned', parseInt(ticketId));
  }
  
  return {
    permission,
    serviceWorkerSupported: 'serviceWorker' in navigator,
    notificationSupported: 'Notification' in window
  };
};
