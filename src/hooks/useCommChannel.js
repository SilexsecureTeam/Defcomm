import { useContext, useEffect, useRef, useCallback } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { CommContext } from "../context/CommContext";

const useCommChannel = ({ channelId, token, onTransmit, onStatus }) => {
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const lastConnectedChannelRef = useRef(null);

  const {
    setIsCommActive,
    activeChannel,
    setConnectingChannelId, // 🆕
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

    // Show connecting indicator
    setConnectingChannelId(channelId);
    setIsCommActive(false);

    // Clean up previous channel
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

    // Setup new Pusher
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
      lastConnectedChannelRef.current = channelName;
      setIsCommActive(true); // ✅ Only set to true after success
      setConnectingChannelId(null); // ✅ Done connecting
    });

    channel.bind("transmit", stableOnTransmit);
    channel.bind("walkie.message.sent", ({ data }) => {
      const newMessage = data;
      console.log("New message received:", newMessage);
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
      setConnectingChannelId(null); // ✅ Reset even on cleanup
    };
  }, [channelId, token]);

  return () => {
    try {
      pusher.disconnect();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
  };
};

export default useCommChannel;
