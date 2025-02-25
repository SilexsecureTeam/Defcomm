import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";

const useChat = () => {
    const { authDetails } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const groupId = authDetails?.user?.company_id;
    const userId = authDetails?.user?.id;
    const token = authDetails?.access_token;
    const client = axiosClient(token);

    // Fetch Contacts Manually
    const fetchContacts = async () => {
        const { data } = await client.get(`/user/contact`);
        return data || [];
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

    // Send Message
    const { mutate: sendMessage, isLoading: sending } = useMutation({
        mutationFn: async ({ receiverId, message }) => {
            const { data } = await client.post("/user/chat/messages/send", { receiverId, message });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["chats", variables.receiverId]); // Refresh chat messages
        },
    });

    return {
        fetchContacts,
        fetchGroupMembers,
        fetchChatMessages,
        sendMessage,
        isLoading: sending,
    };
};

export default useChat;
