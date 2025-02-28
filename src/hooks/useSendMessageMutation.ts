import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { queryClient } from "../services/query-client";
import { onFailure } from "../utils/notifications/OnFailure";

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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([
        "chatMessages",
        variables.get("current_chat_user"), // Use dynamic ID from formData
      ]);
      if (clearMessageInput) clearMessageInput(); // Only call if defined
    },
    onError: (err) => {
      console.error("Failed to send message:", err);
      onFailure({
        message: "Message not sent",
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to send message. Please try again.",
      });
    },
  });
};
