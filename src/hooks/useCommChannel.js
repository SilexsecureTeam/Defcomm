import { useContext, useEffect, useRef, useCallback } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { CommContext } from "../context/CommContext";
import { formatLocalTime } from "../utils/formmaters";
import { AuthContext } from "../context/AuthContext";

const useCommChannel = ({ channelId, token, onTransmit, onStatus }) => {
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const { authDetails } = useContext(AuthContext);
  const user = authDetails?.user;

  const {
    setIsCommActive,
    activeChannel,
    setConnectingChannelId,
    setWalkieMessages,
    setRecentMessages,
    setCurrentSpeaker, // 🆕 use setter
  } = useContext(CommContext);

  const stableOnTransmit = useCallback(
    (data) => {
      if (onTransmit) onTransmit(data);
    },
    [onTransmit]
  );

  const stableOnStatus = useCallback(
    (data) => {
      if (onStatus) onStatus(data);
      toast.info(`${data.name} ${data.status}`);
    },
    [onStatus]
  );

  useEffect(() => {
    if (!channelId || !token) return;

    setConnectingChannelId(channelId);
    setIsCommActive(false);

    // Cleanup old connection
    if (channelRef.current) {
      channelRef.current.unbind("transmit", stableOnTransmit);
      channelRef.current.unbind("status", stableOnStatus);
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelRef.current.name);
        pusherRef.current.disconnect();
      }
      setIsCommActive(false);
      pusherRef.current = null;
      channelRef.current = null;
    }

    // Setup Pusher
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

    const channelName = `private-walkie.${channelId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      toast.success(`Connected to ${activeChannel?.name || channelName}`);
      setIsCommActive(true);
      setConnectingChannelId(null);
    });

    channel.bind("transmit", stableOnTransmit);

    // Handle received walkie message
    channel.bind("walkie.message.sent", ({ data }) => {
      const msg = data.mss_chat;
      console.log("Received walkie message:", data);

      setWalkieMessages((prev) => [...prev, msg]);
      setRecentMessages((prev) => {
        const updated = [msg, ...prev];
        return updated.slice(0, 2);
      });

      if (msg?.record && data?.sender?.id !== user?.id) {
        // Set current speaker immediately
        setCurrentSpeaker({
          name: msg.user_name || "Unknown",
          time: formatLocalTime(),
        });

        const audioUrl = `${import.meta.env.VITE_BASE_URL}/${msg.record}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(console.warn);

        audio.onended = () => {
          setCurrentSpeaker(null);
        };
      }
    });

    channel.bind("status", stableOnStatus);

    pusherRef.current = pusher;
    channelRef.current = channel;

    return () => {
      channel.unbind("transmit", stableOnTransmit);
      channel.unbind("status", stableOnStatus);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      setIsCommActive(false);
      setConnectingChannelId(null);
    };
  }, [channelId, token]);

  return () => {
    try {
      pusherRef.current?.disconnect();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
  };
};

export default useCommChannel;
