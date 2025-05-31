import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import Pusher from "pusher-js";

const useChat = () => {
    const { authDetails } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const groupId = authDetails?.user?.company_id;
    const userId = authDetails?.user?.id;
    const token = authDetails?.access_token;
    const client = axiosClient(token);

    const useFetchContacts = () =>
        useQuery({
            queryKey: ["contacts"],
            queryFn: async () => {
                const { data } = await client.get("/user/contact");
                return data?.data || [];
            },
            enabled: !!authDetails, // Fetch only when authenticated
        });

    // Fetch Contacts Manually
    const fetchContacts = async () => {
        const { data } = await client.get(`/user/contact`);
        return data?.data || [];
    };
    // Fetch Contacts Manually
    const fetchChatHistory = async () => {
        const { data } = await client.get(`/user/chat/history`);
        return data?.data || [];
    };

    // Fetch Group Members Manually
    const fetchGroupMembers = async () => {
        if (!groupId) return [];
        const { data } = await client.get(`/user/group/member/${groupId}`);
        return data || [];
    };

    // Fetch Chat Messages Manually
    const fetchChatMessages = async (memberId) => {
        if (!memberId) return [];
        const { data } = await client.get(`/user/chat/messages/${memberId}/user`);
        return data || [];
    };

    const usePusherChat = (onNewMessage) => {
        const pusherRef = useRef(null);

        useEffect(() => {
            if (!userId || !token || pusherRef.current) return;

            const pusher = new Pusher("l4ewjdxj5hilgin4smsv", {
                wsHost: "backend.defcomm.ng",
                cluster: "MY_CLUSTER",
                wsPort: 443,
                wssPort: 443,
                forceTLS: true,
                encrypted: true,
                disableStats: true,
                enabledTransports: ["ws", "wss"],
                authEndpoint: "https://backend.defcomm.ng/api/broadcasting/auth",
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });

            pusherRef.current = pusher;

            const channel = pusher.subscribe(`private-chat.${userId}`);

            channel.bind("private.message.sent", (data) => {
                const newMessage = data.message;
                const senderId = newMessage?.sender_id;

                console.log("Private message received:", newMessage);

                // Optional callback for UI updates
                onNewMessage?.(newMessage);

                // Update cached messages manually
                queryClient.setQueryData(["chatMessages", senderId], (old = []) => {
                    // Avoid duplicates
                    const alreadyExists = old.some((msg) => msg.id === newMessage.id);
                    return alreadyExists ? old : [...old, newMessage];
                });
            });


            channel.bind("pusher:subscription_error", (status) => {
                console.error("Pusher subscription error:", status);
            });

            return () => {
                channel.unbind_all();
                channel.unsubscribe();
                pusher.disconnect();
                pusherRef.current = null; // clear reference
            };
        }, [userId, token]);
    };

    return {
        fetchContacts,
        fetchChatHistory,
        fetchGroupMembers,
        fetchChatMessages,
        usePusherChat,
    };
};

export default useChat;
