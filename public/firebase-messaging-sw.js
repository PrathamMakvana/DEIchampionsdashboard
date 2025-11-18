/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyBBQWkUg45kBrLPOAvc4ntODTUmhnbT0uo",
  authDomain: "dei-champions.firebaseapp.com",
  projectId: "dei-champions",
  storageBucket: "dei-champions.appspot.com",
  messagingSenderId: "325714813742",
  appId: "1:325714813742:web:c3a57e4f17ba6ec7be90bf",
  measurementId: "G-RE9GG4MKJK"
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