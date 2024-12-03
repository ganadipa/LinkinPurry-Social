// frontend/src/components/NotificationPrompt.tsx
import { useNotifications } from '@/hooks/notification';

export function NotificationPrompt() {
  const { isSupported, isGranted, isSubscribed, isLoading, subscribe } = useNotifications();

  if (!isSupported && isLoading) {
    console.log('NotificationPrompt: not supported or loading', isSupported, isLoading);
    return null;
  }

  if (isGranted && isSubscribed) {
    console.log('NotificationPrompt: granted and subscribed', isGranted, isSubscribed);
    return <p>Notifications enabled</p>;
  }

  return (
    <button 
      onClick={subscribe}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Enable Notifications
    </button>
  );
}