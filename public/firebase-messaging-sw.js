/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBJMd7_nWRZQTNb0j4fcD6APntFHM9UDvY",
  authDomain: "dei-champions-5a7c2.firebaseapp.com",
  projectId: "dei-champions-5a7c2",
  storageBucket: "dei-champions-5a7c2.firebasestorage.app",
  messagingSenderId: "190245592165",
  appId: "1:190245592165:web:b2bfa087f8623778c5fa8c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
