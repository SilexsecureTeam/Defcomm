import { useEffect, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { onNewNotificationToast } from "../utils/notifications/onNewMessageToast";
import notificationSound from "../assets/audio/bell.mp3";
import audioController from "../utils/audioController"; // Import the shared audio controller
import receiverTone from "../assets/audio/receiver.mp3";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";

import { ChatContext } from "../context/ChatContext";
import { NotificationContext } from "../context/NotificationContext";

const usePusherChannel = ({
  userId,
  token,
  onNewMessage,
  showToast = true,
}) => {
  const pusherRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedChatUser, setCallMessage } = useContext(ChatContext);
  const { addNotification, markAsSeen } = useContext(NotificationContext);
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

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
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
      console.log(data);
      const isCall = data?.state === "call";
      onNewMessage(newMessage);
      if (isCall) {
        const meetingId = newMessage?.message?.split("CALL_INVITE:")[1]; // Extract meetingId

        setCallMessage({
          msg_id: newMessage?.data?.id,
          ...data?.mss_chat,
          meetingId, // ✅ Ensure this gets passed
          name: newMessage?.sender?.name || `User ${newMessage?.data?.user_id}`,
          phone: newMessage?.sender?.phone,
          user_id: newMessage?.data?.user_id,
          status: "ringing", // initial
        });
        audioController.playRingtone(receiverTone, true);
        // onNewNotificationToast({
        //   message: newMessage?.message,
        //   senderName:
        //     newMessage?.sender?.name?.split(" ")[0] ||
        //     `User ${newMessage?.data?.user_id}`,
        //   type: "call",
        //   onClick: () => {
        //     setSelectedChatUser({
        //       contact_id: newMessage?.data?.user_id,
        //       contact_name:
        //         newMessage?.sender?.name || `User ${newMessage?.data?.user_id}`,
        //       contact_phone:
        //         newMessage?.data?.phone || `User ${newMessage?.data?.user_id}`,
        //     });
        //     navigate("/dashboard/chat");
        //   },
        // });
        return; // prevent further toast/audio
      }

      const shouldToast =
        showToast &&
        data?.state !== "not_typing" &&
        data?.state !== "is_typing" &&
        data?.state !== "callUpdate" &&
        data?.data?.user_id !== userId;

      if (shouldToast) {
        const notificationPayload = {
          id: newMessage?.data?.id,
          senderName: newMessage?.sender?.name,
          phone: newMessage?.sender?.phone,
          message: newMessage?.message,
          time: new Date().toISOString(),
          user_id: newMessage?.data?.user_id,
          type: "message", // or "call"
        };

        addNotification(notificationPayload); // ✅ Add to context
        audioController.playRingtone(notificationSound);
        onNewNotificationToast({
          message: newMessage?.message,
          senderName:
            newMessage?.sender?.name?.split(" ")[0] ||
            `User ${newMessage?.data?.user_id}`,
          onClick: () => {
            markAsSeen(newMessage?.data?.id);
            setSelectedChatUser({
              contact_id: newMessage?.data?.user_id,
              contact_name:
                newMessage?.sender?.name || `User ${newMessage?.data?.user_id}`,
              contact_phone:
                newMessage?.sender?.phone ||
                `User ${newMessage?.data?.user_id}`,
            });
            navigate("/dashboard/chat");
          },
        });
      }
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
