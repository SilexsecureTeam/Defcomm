import { useContext, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";

const useGroupChannel = ({ groupId, token }) => {
  const pusherRef = useRef(null);
  const { authDetails } = useContext(AuthContext);
  const { activeGroup, setGroupUserTyping } = useContext(GroupContext);
  const queryClient = useQueryClient();

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

    channel.bind("group.message.sent", ({ data }) => {
      console.log(data);

      const senderId = data?.data?.user_id;

      // Typing indicators
      if (data?.state === "is_typing") {
        setGroupUserTyping?.((prev) =>
          prev[data?.sender_id] ? prev : { ...prev, [data?.sender_id]: true }
        );
        return;
      } else if (data?.state === "not_typing") {
        setGroupUserTyping?.((prev) =>
          !prev[data?.sender_id] ? prev : { ...prev, [data?.sender_id]: false }
        );
        return;
      }

      if (!senderId) return;

      const existingData = queryClient.getQueryData(["groupMessages", groupId]);

      // No cached messages yet → refetch
      if (!existingData) {
        queryClient.invalidateQueries(["groupMessages", groupId]);
        return;
      }

      // Append new message if not already there
      queryClient.setQueryData(["groupMessages", groupId], (old) => {
        if (!old?.data) return old;
        const exists = old.data.some((msg) => msg.id === data.data.id);
        const isMyChat = data.data.user_id === authDetails?.user?.id;
        return exists
          ? old
          : {
              ...old,
              data: [
                ...old.data,
                {
                  ...data.data,
                  message: data?.message,
                  is_my_chat: isMyChat ? "yes" : "no",
                },
              ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
            };
      });
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
