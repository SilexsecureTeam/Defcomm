import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { queryClient } from "../services/query-client";

const useChat = () => {
    const [messages, setMessages] = useState([]);
    const { authDetails } = useContext(AuthContext);
    const groupId=authDetails?.user?.company_id;
    const userId=authDetails?.user?.id;
    const token=authDetails?.access_token?.split("|")[1];
    const client = axiosClient(token);

    // Fetch Group Members Manually
    const fetchGroupMembers = async () => {
        if (!groupId) return [];
        const { data } = await client.get(`/user/group/member/${token}`);
        return data?.members || data || [];
    };

    // Fetch Chat Messages Manually
    const fetchChatMessages = async (params = {}) => {
        if (!userId) return [];
        const { data } = await client.get(`/chats/${userId}`, { params });
        setMessages(data?.messages || data || []);
        return data?.messages || data || [];
    };

    // Send Message
    const { mutate: sendMessage, isLoading: sending } = useMutation({
        mutationFn: async ({ receiverId, message }) => {
            const { data } = await client.post("/chats/send", { receiverId, message });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["chats", variables.receiverId]); // Refresh chat manually
        },
    });

    return {
        messages,
        fetchGroupMembers, // Call this manually when needed
        fetchChatMessages, // Call this manually when needed
        sendMessage,
        isLoading: sending,
    };
};

export default useChat;
