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
  user_id: number;
  endpoint: string;
  keys: PushSubscriptionKeys;
}