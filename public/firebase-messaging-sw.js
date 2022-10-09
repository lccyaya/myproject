self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('push', function (e) {
  const { notification: { title, body }, data } = e.data.json();
  const options = {
    body: body,
    data,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (e) {
  try {
    e.notification.close();
    const { url } = e.notification.data;
    const query = new URLSearchParams(url.split('?')[1]);
    const matchId = query.get('matchId');
    const target = `https://${self.location.hostname}/details/${matchId}`;
    const promise = self.clients.matchAll().then(function (clis) {
      const client = clis.find((c) => c.visibilityState === 'visible');
      if (client !== undefined) {
        client.navigate(target);
        client.focus();
      } else {
        self.clients.openWindow(target);
      }
    });
    e.waitUntil(promise);
  } catch (e) {
    console.error('error in handle notificationclick:', e);
  }
});
