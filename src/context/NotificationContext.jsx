import React, { createContext, useState, useEffect } from "react";
import useChat from "../hooks/useChat";
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { markMessageAsRead } = useChat();
  const [notifications, setNotifications] = useState(() => {
    const saved = sessionStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotificationModal = () => {
    // if (!notificationOpen) markAllAsSeen();
    setNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
    sessionStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = { ...notif, seen: false };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
  };

  const markAsSeen = async (id) => {
    // Mark in local state
    setNotifications((prev) =>
      prev.map((n) => (n?.data?.id === id ? { ...n, seen: true } : n))
    );

    // Also mark as read on the backend
    try {
      await markMessageAsRead(id);
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    sessionStorage.removeItem("notifications");
  };

  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsSeen,
        clearNotifications,
        unseenCount,
        notificationOpen,
        setNotificationOpen,
        toggleNotificationModal,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
