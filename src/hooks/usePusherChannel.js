import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { onNewMessageToast } from "../utils/notifications/onNewMessageToast";

import Pusher from "pusher-js";
const usePusherChannel = ({ userId, token, onNewMessage, showToast = true }) => {
  const pusherRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) return;

    if (pusherRef.current) {
      try {
        pusherRef.current.disconnect();
      } catch (e) {
        console.warn("Pusher disconnect error:", e);
      }
      pusherRef.current = null;
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

    channel.bind("private.message.sent", ({ data }) => {
      const newMessage = data;
      console.log(data)
      if (showToast && (data?.state !== "not_typing" || data?.state !== "is_typing")) onNewMessageToast({message:newMessage?.message, senderName: newMessage?.data?.sender_name ||`User ${newMessage?.data?.user_id}`});
      onNewMessage?.(newMessage);
    });

    channel.bind("pusher:subscription_error", (status) => {
      console.error("Pusher subscription error:", status);
    });

    return () => {
      try {
        pusher.disconnect();
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [userId, token]);
};


export default usePusherChannel;
