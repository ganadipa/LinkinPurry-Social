import React, { useState, useEffect } from 'react';
import { X, MessageSquare, UserPlus, Bell } from 'lucide-react';

// types.ts
export type NotificationType = 'message' | 'connection' | 'post';

export interface INotification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
}

// ToastNotification.tsx
interface ToastNotificationProps {
  notification: INotification;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  notification, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show notification with a slight delay for animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow exit animation to complete
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [onClose]);

  const getIcon = (type: NotificationType): JSX.Element => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'connection':
        return <UserPlus className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const handleClose = (): void => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-blue-600 bg-blue-50 p-2 rounded-full">
            {getIcon(notification.type)}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {notification.content}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// NotificationManager.tsx
export const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const addNotification = (notification: Omit<INotification, 'id'>): void => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id: number): void => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Example of how to trigger notifications
  useEffect(() => {
    // Simulate receiving a new notification
    setTimeout(() => {
      addNotification({
        type: 'message',
        title: 'New Message',
        content: 'Agent Smith sent you a message: "Hello, Mr. Anderson"',
      });
    }, 1000);

    // Simulate another notification
    setTimeout(() => {
      addNotification({
        type: 'connection',
        title: 'New Connection Request',
        content: 'Agent Jones wants to connect with you',
      });
    }, 3000);
  }, []);

  return (
    <>
      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};
