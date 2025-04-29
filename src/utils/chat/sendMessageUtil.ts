import { UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { onFailure } from "../../utils/notifications/OnFailure";

interface SendMessageParams {
  client: AxiosInstance;
  message: string;
  file: File | null;
  chat_user_type: string;
  chat_user_id: string;
  chat_id: string;
  sendMessageMutation: UseMutationResult<any, unknown, FormData, unknown>;
}

export const sendMessageUtil = ({
  client,
  message,
  file,
  chat_user_type,
  chat_user_id,
  chat_id,
  sendMessageMutation,
}: SendMessageParams) => {
  if (!message.trim() && !file) return; // Prevent empty message submission

  const formData = new FormData();
  if (file) {
    formData.append("message", file);
    formData.append("is_file", "yes");
    formData.append("file_type", file.type);
  } else {
    formData.append("message", message);
    formData.append("is_file", "no");
  }

  formData.append("current_chat_user_type", chat_user_type);
  formData.append("current_chat_user", chat_user_id);
  formData.append("chat_id", chat_id);

  sendMessageMutation.mutate(formData);
};
