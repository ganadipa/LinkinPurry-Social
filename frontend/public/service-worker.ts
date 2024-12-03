// frontend/public/service-worker.ts

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const payload: NotificationPayload = event.data.json();

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon.png',
      data: payload.data,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      const existingWindow = windowClients.find(client => 
        new URL(client.url).pathname === new URL(url, self.location.origin).pathname
      );

      if (existingWindow) {
        return existingWindow.focus();
      }
      return self.clients.openWindow(url);
    })()
  );
});