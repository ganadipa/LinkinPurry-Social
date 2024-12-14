// import { useEffect } from 'react';
// import { useNotification } from '@/hooks/notification';

// export function NotificationManager() {
//   const { isEnabled, isLoading, enableNotifications } = useNotifications();

//   useEffect(() => {
//     if (!isEnabled && !isLoading) {
//       enableNotifications();
//     }
//   }, [isEnabled, isLoading, enableNotifications]);

//   return null; // This is a utility component, it doesn't render anything
// }