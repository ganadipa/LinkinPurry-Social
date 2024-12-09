import { useState, useEffect } from 'react';
import { NotificationService } from '@/lib/notification';
import { useAuth } from '@/hooks/auth';

export function useNotifications() {
  const user = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('User IDs:', user.user?.id);

  useEffect(() => {
    checkNotificationStatus();
  }, [user.user?.id]);

  const checkNotificationStatus = async () => {
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setIsGranted(Notification.permission === 'granted');
      const userId = user.user?.id || 0;
      console.log('User ID:', userId);
      const service = NotificationService.getInstance(userId);
      try {
        await service.init();
        setIsSubscribed(true);
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    }

    setIsLoading(false);
  };

  const subscribe = async () => {
    if (!isSupported) return false;

    try {
      setIsLoading(true);
      const userId = user.user?.id || 0;
      console.log('User IDee:', userId);
      const service = NotificationService.getInstance(userId);
      
      const permissionGranted = await service.requestPermission();
      setIsGranted(permissionGranted);
      
      if (permissionGranted) {
        const subscription = await service.subscribeToPush();
        if (subscription) {
          console.log(JSON.stringify(subscription));
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          });
          
          setIsSubscribed(true);    
          console.log('Subscribed successfully', subscription);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isGranted,
    isSubscribed,
    isLoading,
    subscribe
  };
}