import { useContext } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { queryClient } from "../services/query-client";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import { ChatContext } from "../context/ChatContext";

export const useSendMessageMutation = (
  client: AxiosInstance,
  clearMessageInput: () => void = () => {}
): UseMutationResult<any, unknown, FormData, unknown> => {
  const { setCallMessage } = useContext(ChatContext);

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await client.post("/user/chat/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },

    onSuccess: async (response, variables) => {
      console.log("✅ Message sent:", response);

      const messageData = response?.data?.mss_chat;
      const recipientId = response?.data?.recieve_user_id;

      // If it's a call message, store the message in context
      if (variables?.get("mss_type") === "call") {
        setCallMessage({
          ...messageData,
          recieve_user_id: recipientId,
        });
      }

      // Invalidate messages for the specific chat user
      const chatUser = variables.get("current_chat_user");
      if (chatUser) {
        await queryClient.invalidateQueries(["chatMessages", chatUser]);
      }

      // Clear input field if provided
      clearMessageInput();
    },

    onError: (error) => {
      console.error("❌ Message send error:", error);
      onFailure({
        message: "Message not sent",
        error:
          extractErrorMessage(error) || "Failed to send message. Try again.",
      });
    },
  });
};

export const useTypingStatus = (client: AxiosInstance) => {
  return useMutation({
    mutationFn: ({ current_chat_user, typing }: any) =>
      client.post("/user/messages/typing", {
        current_chat_user,
        typing,
      }),
  });
};
