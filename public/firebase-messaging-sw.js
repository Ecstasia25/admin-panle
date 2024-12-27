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

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  )
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
