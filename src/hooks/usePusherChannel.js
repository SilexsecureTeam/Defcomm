import { useEffect, useRef } from "react";
import Pusher from "pusher-js";

/**
 * Custom hook to subscribe to a Pusher private channel and receive messages.
 *
 * @param {Object} params
 * @param {string | number} params.userId - The authenticated user's ID
 * @param {string} params.token - Bearer token for auth
 * @param {(message: any) => void} params.onNewMessage - Callback when a new message is received
 */
const usePusherChannel = ({ userId, token, onNewMessage }) => {
  const pusherRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) return;

    // 🔁 Always clean up previous instance
    if (pusherRef.current) {
      try {
        pusherRef.current.disconnect();
      } catch (e) {
        console.warn("Pusher disconnect error:", e);
      }
      pusherRef.current = null;
    }

    if (import.meta.env.DEV) {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: "mt1",
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    pusherRef.current = pusher;

    const channel = pusher.subscribe(`private-chat.${userId}`);

    channel.bind("private.message.sent", (data) => {
      const newMessage = data?.message;
      console.log(data)
      /*if (!newMessage?.id || !newMessage?.sender_id) {
        console.warn("Invalid message format from Pusher:", data);
        return;
      }*/

      console.log("New Pusher message received:", newMessage);
      onNewMessage?.(newMessage);
    });

    channel.bind("pusher:subscription_error", (status) => {
      console.error("Pusher subscription error:", status);
    });

    return () => {
      try {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      } catch (e) {
        console.warn("Pusher cleanup error:", e);
      }
      pusherRef.current = null;
    };
  }, [userId, token, onNewMessage]);
};

export default usePusherChannel;
