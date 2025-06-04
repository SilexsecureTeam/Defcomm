import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { onNewMessageToast } from "../utils/notifications/onNewMessageToast";
import notificationSound from "../assets/audio/bell.mp3";
import audioController from "../utils/audioController"; // Import the shared audio controller
import receiverTone from "../assets/audio/receiver.mp3";

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
  
  const isCall = data?.message?.startsWith("CALL_INVITE");
   onNewMessage(newMessage);
  if (isCall) {
    audioController.playRingtone(receiverTone, true);
    return; // prevent further toast/audio
  }

  const shouldToast =
    showToast &&
    data?.state !== "not_typing" &&
    data?.state !== "is_typing" &&
    data?.data?.user_id !== userId;

  if (shouldToast) {
    audioController.playRingtone(notificationSound);
    onNewMessageToast({
      message: newMessage?.message,
      senderName:
        newMessage?.data?.sender_name || `User ${newMessage?.data?.user_id}`,
    });
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
