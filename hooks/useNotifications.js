// hooks/useNotifications.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  updateDoc,
  writeBatch
} from "firebase/firestore";
import { webFirestore } from "@/utils/firebase";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?._id) {
      console.log("❌ No user ID found");
      setLoading(false);
      return;
    }

    console.log("🔔 Setting up notification listener for user:", user._id);
    console.log("🔍 User ID type:", typeof user._id);
    console.log("🔍 User ID value:", user._id.toString());

    // Create query for user's notifications
    const notificationsRef = collection(webFirestore, "notifications");
    
    // Try without orderBy first to test if index is the issue
    const q = query(
      notificationsRef,
      where("receiver", "==", user._id.toString()),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    console.log("📡 Starting Firestore listener...");

    // Real-time listener - automatically updates when data changes!
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("📦 Snapshot received! Total docs:", snapshot.size);
        
        const notificationsList = [];
        let unreadCounter = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("📄 Document:", {
            id: doc.id,
            receiver: data.receiver,
            title: data.title,
            isRead: data.isRead
          });
          
          notificationsList.push({
            id: doc.id,
            ...data,
          });

          if (!data.isRead) {
            unreadCounter++;
          }
        });

        console.log("✅ Loaded notifications:", notificationsList.length);
        console.log("📊 Unread count:", unreadCounter);
        console.log("📋 Notifications data:", notificationsList);

        setNotifications(notificationsList);
        setUnreadCount(unreadCounter);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error fetching notifications:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);
        
        // If index error, provide helpful message
        if (error.code === 'failed-precondition' || error.message.includes('index')) {
          console.error("🔥 INDEX MISSING! Click this link to create it:");
          console.error(error.message);
        }
        
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up notification listener");
      unsubscribe();
    };
  }, [user?._id]);

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(webFirestore, "notifications", notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: Date.now(),
      });
      console.log("✅ Marked as read:", notificationId);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(webFirestore);
      const unreadNotifications = notifications.filter((n) => !n.isRead);

      unreadNotifications.forEach((notification) => {
        const notificationRef = doc(webFirestore, "notifications", notification.id);
        batch.update(notificationRef, {
          isRead: true,
          readAt: Date.now(),
        });
      });

      await batch.commit();
      console.log("✅ Marked all as read:", unreadNotifications.length);
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
    }
  };

  // Helper: Get icon based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      job_apply: "📄",
      interview: "📅",
      message: "💬",
      success: "✅",
      info: "👁️",
      job_status: "🔔",
      profile_view: "👀",
      application: "📄",
      default: "🔔",
    };
    return icons[type] || icons.default;
  };

  // Helper: Get color based on notification type
  const getNotificationColor = (type) => {
    const colors = {
      job_apply: "#3b82f6",
      interview: "#f59e0b",
      message: "#8b5cf6",
      success: "#10b981",
      info: "#6366f1",
      job_status: "#ec4899",
      profile_view: "#06b6d4",
      application: "#3b82f6",
      default: "#6b7280",
    };
    return colors[type] || colors.default;
  };

  // Helper: Format timestamp to relative time
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
    getTimeAgo,
  };
};