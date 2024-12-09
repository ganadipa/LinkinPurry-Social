import { useNotifications } from '@/hooks/notification';
import { useEffect } from 'react';

export function NotificationPrompt() {
  const { isSupported, isGranted, isSubscribed, isLoading, subscribe } = useNotifications();

  useEffect(() => {
    if (!isSupported && isLoading) {
      console.log('NotificationPrompt: not supported or loading', isSupported, isLoading);
      return;
    }
  
    if (isGranted && isSubscribed) {
      console.log('NotificationPrompt: granted and subscribed', isGranted, isSubscribed);
      return;
    }

    if (!isGranted) {
      console.log('NotificationPrompt: not granted');
      subscribe();
    }
    
  }, [isGranted, isSubscribed, subscribe]);


  return null;
}