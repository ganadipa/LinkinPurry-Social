// frontend/src/types/service-worker.d.ts

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    data?: {
      url?: string;
      type: 'chat' | 'post' | 'connection';
      id?: number;
    };
  }
  
  interface PushSubscriptionKeys {
    p256dh: string;
    auth: string;
  }
  
  interface PushSubscriptionData {
    endpoint: string;
    keys: PushSubscriptionKeys;
  }