import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";

import { onNewNotificationToast } from "../utils/notifications/onNewMessageToast";
import receiverTone from "../assets/audio/receiver.mp3";
import audioController from "../utils/audioController";
import { queryClient } from "../services/query-client";

import { ChatContext } from "../context/ChatContext";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";

const usePusherChannel = ({
  userId,
  token,
  onNewMessage,
  showToast = true,
}) => {
  const pusherRef = useRef(null);
  const navigate = useNavigate();

  const { authDetails } = useContext(AuthContext);
  const { setTypingUsers, setCallMessage, chatVisibility } =
    useContext(ChatContext);
  const { addNotification, markAsSeen } = useContext(NotificationContext);

  useEffect(() => {
    if (!userId || !token) return;

    // Clean previous connection
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
      const isCall = data?.state === "call";
      console.log(newMessage);

      // Callback for external usage
      onNewMessage(newMessage);

      // 🔔 Handle call messages
      if (isCall) {
        const meetingId = newMessage?.message?.split("CALL_INVITE:")[1];
        setCallMessage({
          msg_id: newMessage?.data?.id,
          ...data?.mss_chat,
          meetingId,
          name: newMessage?.sender?.name || `User ${newMessage?.data?.user_id}`,
          phone: newMessage?.sender?.phone,
          user_id: newMessage?.data?.user_id,
          status: "ringing",
        });
        audioController.playRingtone(receiverTone, true);
      }

      const senderId = newMessage?.sender?.id_en;

      const isMyChat = newMessage.data.user_id === authDetails?.user?.id;
      const cacheKeyUserId = isMyChat
        ? newMessage?.receiver?.id_en // I sent it → save under receiver
        : senderId; // They sent it → save under sender

      // ✅ Cache update always (multi-device sync)
      queryClient.setQueryData(["chatMessages", cacheKeyUserId], (old) => {
        if (!old || !Array.isArray(old.data)) {
          return {
            data: [
              {
                ...newMessage.data,
                message: newMessage?.message,
                is_my_chat: isMyChat ? "yes" : "no",
              },
            ],
          };
        }

        const exists = old.data.some((msg) => msg.id === newMessage.data.id);
        if (exists) return old;

        return {
          ...old,
          data: [
            ...old.data,
            {
              ...newMessage.data,
              message: newMessage?.message,
              is_my_chat: isMyChat ? "yes" : "no",
            },
          ].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          ),
        };
      });

      // 🔔 Show toast only if not my message
      const shouldToast =
        showToast &&
        data?.state !== "not_typing" &&
        data?.state !== "is_typing" &&
        data?.state !== "callUpdate" &&
        !isMyChat;

      if (shouldToast) {
        addNotification(newMessage);
        onNewNotificationToast({
          message: newMessage?.message,
          senderName:
            newMessage?.sender?.name?.split(" ")[0] ||
            `User ${newMessage?.data?.user_id}`,
          onClick: () => {
            markAsSeen(newMessage?.data?.id);
            navigate(`/dashboard/user/${newMessage?.data?.user_id}/chat`, {
              state: {
                contact_id_encrypt: newMessage?.sender?.id_en,
                contact_id: newMessage?.sender?.id,
                contact_name: newMessage?.sender?.name,
              },
              isChatVisible: chatVisibility,
            });
          },
        });
      }

      // Typing indicators
      if (newMessage?.state === "is_typing") {
        setTypingUsers((prev) => {
          if (prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: true };
        });
        return;
      } else if (newMessage?.state === "not_typing") {
        setTypingUsers((prev) => {
          if (!prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: false };
        });
        return;
      }

      // Handle call updates
      if (newMessage?.state === "callUpdate") {
        queryClient.setQueryData(["chatMessages", cacheKeyUserId], (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((msg) =>
              msg.id === newMessage?.mss?.id
                ? {
                    ...msg,
                    call_state: newMessage?.call?.call_state,
                    call_duration: newMessage?.call?.call_duration,
                  }
                : msg
            ),
          };
        });
        return;
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
