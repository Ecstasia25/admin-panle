// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js")

const firebaseConfig = {
  apiKey: "AIzaSyDTs0UzUU6EE60xE-TkM0XIs4bfk3MiI20",
  authDomain: "agrios-4f389.firebaseapp.com",
  projectId: "grios-4f389",
  storageBucket: "agrios-4f389.appspot.com",
  messagingSenderId: "1067138386254",
  appId: "1:1067138386254:web:18e0ee3e08d2b61c28b61f",
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked', event)
  event.notification.close()

  // Get the action URL from various possible sources
  const clickAction = event.notification.data?.url || 
                     event.notification.data?.clickAction || 
                     '/'

  // Handle action button clicks
  if (event.action === 'view') {
    event.waitUntil(clients.openWindow(clickAction))
    return
  }

  // Handle direct notification clicks
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If a window exists already, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === clickAction && 'focus' in client) {
            return client.focus()
          }
        }
        // If no window exists, open new one
        return clients.openWindow(clickAction)
      })
  )
})

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png', // Use icon for notification icon
    image: payload.notification.image, // Use image for large notification image
    badge: payload.notification.badge || '/badge.png',
    data: payload.data || {}, // Store data for click handling
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Now',
        icon: '/view-icon.png'
      }
    ],
    // Add vibration pattern
    vibrate: [100, 50, 100],
    // Add timestamp
    timestamp: Date.now()
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})