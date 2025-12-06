import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore"; 

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBQWkUg45kBrLPOAvc4ntODTUmhnbT0uo",
  authDomain: "dei-champions.firebaseapp.com",
  projectId: "dei-champions",
  storageBucket: "dei-champions.appspot.com",
  messagingSenderId: "325714813742",
  appId: "1:325714813742:web:c3a57e4f17ba6ec7be90bf",
  measurementId: "G-RE9GG4MKJK"
};

// ✅ Initialize app safely (prevent multiple in Next.js hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firestore (for notifications)
export const webFirestore = getFirestore(app);

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
          "BNP6mjppL6V2lSzMZ7OoEDPPmvYSEQn8Y-UyKYZ2vlnqCNSQH_9VX1Kb-zhsOeFGrFXdFnk2g91xpU26RNIo9D4",
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