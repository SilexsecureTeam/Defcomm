import { useContext, useEffect, useRef, useCallback } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";

const useGroupChannel = ({ groupId, token }) => {
  const pusherRef = useRef(null);
  const { authDetails } = useContext(AuthContext);
  const { activeGroup } = useContext(GroupContext);
  const user = authDetails?.user;

  useEffect(() => {
    if (!groupId || !token) return;

    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: "mt1",
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    const channelName = `private-group.${groupId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      toast.success(`Connected to ${activeGroup?.group_meta?.name} group`);
    });

    channel.bind("group.message.sent", async ({ data }) => {
      console.log(data);
    });

    pusherRef.current = pusher;

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [groupId, token]);

  return () => {
    try {
      pusherRef.current?.disconnect();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
  };
};

export default useGroupChannel;
