// src/utils/utils-firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJMd7_nWRZQTNb0j4fcD6APntFHM9UDvY",
  authDomain: "dei-champions-5a7c2.firebaseapp.com",
  projectId: "dei-champions-5a7c2",
  storageBucket: "dei-champions-5a7c2.firebasestorage.app",
  messagingSenderId: "190245592165",
  appId: "1:190245592165:web:b2bfa087f8623778c5fa8c",
  measurementId: "G-XC72W4XT63",
};

// ✅ Initialize app safely (prevent multiple in Next.js hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export messaging safely (only if supported and on client)
export let messaging = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      } else {
        console.warn("🚫 Firebase messaging not supported in this browser.");
      }
    })
    .catch((err) => console.error("🔥 Messaging support check failed:", err));
}

// ✅ Request permission and get FCM token
export const requestForToken = async () => {
  if (typeof window === "undefined") return null; // SSR guard

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");

      if (!messaging) {
        const supported = await isSupported();
        if (supported) {
          messaging = getMessaging(app);
        } else {
          console.warn("🚫 Firebase messaging not supported.");
          return null;
        }
      }

      const token = await getToken(messaging, {
        vapidKey:
          "BAYwZhReJNaFOMfYF-q7RfNS304iUfwa6Ol2b-NC6jxg0BeS1ICqmrCMZCE0oLuWxaJMNwjGn5iSDLnqlpWGsMc",
      });

      if (token) {
        console.log("📲 FCM Token:", token);
        return token;
      } else {
        console.warn("⚠️ No registration token available.");
        return null;
      }
    } else {
      console.warn("🚫 Notification permission denied.");
      return null;
    }
  } catch (err) {
    console.error("🔥 Error getting FCM token:", err);
    return null;
  }
};



export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);
      resolve(payload);
    });
  });