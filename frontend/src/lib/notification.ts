export class NotificationService {
  private user_id: number;

  private static instance: NotificationService | null;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor(user_id: number) {
    this.user_id = user_id;
  }

  static getInstance(user_id: number): NotificationService {
    if (!NotificationService.instance) {
        console.log("DI GET INSTANCE User ID:", user_id);
        NotificationService.instance = new NotificationService(user_id);
        NotificationService.instance.init();
    }
    return NotificationService.instance;
  }

  async init(): Promise<void> {
    console.log("Initializing Notification Service"); // debug
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("what is this") // debug
      throw new Error("Push notifications not supported");
    }

    console.log("Registering service worker..."); // debug

    try {
      this.registration =
        await navigator.serviceWorker.register("/public/service-worker.ts"); // need to adjust this
        console.log("Service worker registered"); // debug
    //   await navigator.serviceWorker.ready;
        await this.waitForServiceWorkerReady();
        console.log("Service worker ready"); // debug
    } catch (error) {
      throw new Error(`Service Worker registration failed: ${error}`);
    }
  }

  async requestPermission(): Promise<boolean> {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  async subscribeToPush(): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
        console.log("Service Worker not ready, initializing...");
        await this.init();
    }
    
    if (!this.registration) {
      throw new Error("Service Worker not registered");
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_VAPID_PUBLIC_KEY,
      });
      console.log("User IDDD:", this.user_id);

      const subscriptionJson = subscription.toJSON();
      return {
        endpoint: subscriptionJson.endpoint || "",
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")!),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")!),
        },
        user_id: this.user_id,
      };
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
      return null;
    }
  }

  async unsubscribeFromPush(): Promise<void> {
    if (!this.registration) {
      throw new Error("Service Worker not registered");
    }
  
    const subscription = await this.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log("Unsubscribed from push notifications");
  
      await fetch("/api/notifications/unsubscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: this.user_id }),
      });
    }
  }  

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  }

  // function to check if service worker is registered
  async isServiceWorkerRegistered(): Promise<boolean> {
    return !!this.registration;
  }

  async waitForServiceWorkerReady(): Promise<void> {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Workers are not supported in this browser.");
    }
  
    let attempts = 0;
    while (!this.registration && attempts < 10) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        console.log("Service Worker is ready.");
      } catch (error) {
        console.log("Waiting for Service Worker to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }
    }
  
    if (!this.registration) {
      throw new Error("Failed to initialize Service Worker after multiple attempts.");
    }
  }  

  static resetInstance(): void {
    NotificationService.instance = null;
  }  

}
