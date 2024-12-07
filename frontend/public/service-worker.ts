// frontend/public/service-worker.ts
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const payload = event.data.json();
  console.log('Received push notification:', payload);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/public/linkedin.png',
      data: payload.data,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const baseUrl = self.location.origin;
  const chatUrl = `${baseUrl}/chat`;

  event.waitUntil(
    clients.openWindow(chatUrl)
  );
});