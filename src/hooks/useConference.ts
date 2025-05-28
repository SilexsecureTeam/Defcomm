import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { extractErrorMessage } from "../utils/formmaters";

const useConference = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // Fetch Conferences
  const getMeetingInviteQuery = useQuery({
    queryKey: ["meetingInvitations"],
    queryFn: async () => {
      const { data } = await client.get("/user/meetingInvitationlist");
      console.log(data);
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const getMyMeetingsQuery = useQuery({
    queryKey: ["myMeetings"],
    queryFn: async () => {
      const { data } = await client.get(`/user/getmeeting`);
      console.log(data);
      return data?.data || [];
    },
    enabled: !!authDetails,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Create Meeting Mutation
  const createMeetingMutation = useMutation({
    mutationFn: (payload) =>
      client.post("/user/meeting/create", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["meetings"]);
      onSuccess({ message: "Meeting successfully created!", success: "New meeting added" });
    },
    onError: (err) => {
      onFailure({ message: "Failed to create meeting", error: extractErrorMessage(err) });
    }
  });

  return {
    getMeetingInviteQuery,
    getMyMeetingsQuery,
    createMeetingMutation,
  };
};

export default useConference;
