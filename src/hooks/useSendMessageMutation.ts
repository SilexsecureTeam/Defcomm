import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { queryClient } from "../services/query-client";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";

export const useSendMessageMutation = (
  client: AxiosInstance,
  clearMessageInput?: () => void
): UseMutationResult<any, unknown, FormData, unknown> => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await client.post("/user/chat/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries([
        "chatMessages",
        variables.get("current_chat_user"), // Use dynamic ID from formData
      ]);
     clearMessageInput();
    },
    onError: (err) => {
      console.error("Failed to send message:", err);
      onFailure({
        message: "Message not sent",
        error: extractErrorMessage(err) || "Failed to send message. Please try again.",
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
