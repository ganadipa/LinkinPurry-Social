// frontend/src/services/notification.service.ts

export class NotificationService {
    private static instance: NotificationService;
    private registration: ServiceWorkerRegistration | null = null;
  
    private constructor() {}
  
    static getInstance(): NotificationService {
      if (!NotificationService.instance) {
        NotificationService.instance = new NotificationService();
      }
      return NotificationService.instance;
    }
  
    async init(): Promise<void> {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported');
      }
  
      try {
        this.registration = await navigator.serviceWorker.register('/public/service-worker.ts');
        await navigator.serviceWorker.ready;
      } catch (error) {
        throw new Error(`Service Worker registration failed: ${error}`);
      }
    }
  
    async requestPermission(): Promise<boolean> {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  
    async subscribeToPush(): Promise<PushSubscriptionData | null> {
      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }
  
      try {
        const subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_VAPID_PUBLIC_KEY
        });
  
        const subscriptionJson = subscription.toJSON();
        return {
          endpoint: subscriptionJson.endpoint || '',
          keys: {
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
          }
        };
      } catch (error) {
        console.error('Failed to subscribe to push:', error);
        return null;
      }
    }
  
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
    }
  }