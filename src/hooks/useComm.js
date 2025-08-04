import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";

const useComm = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // 🔁 Fetch Walkie-Talkie Channels
  const getChannelList = useQuery({
    queryKey: ["channelList"],
    queryFn: async () => {
      const { data } = await client.get("/walkietalkie/channecreatellist");
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // ➕ Create New Comm Channel
  const createChannelMutation = useMutation({
    mutationFn: (payload) =>
      client.post("/walkietalkie/channelcreate", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelList"]);
      onSuccess({
        message: "Comm channel successfully created!",
        success: "New channel added",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to create comm channel",
        error: extractErrorMessage(err),
      });
    },
  });

  return {
    getChannelList,
    createChannelMutation,
  };
};

export default useComm;
