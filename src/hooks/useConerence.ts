import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { extractErrorMessage } from "../utils/formmaters";

interface Group {
  id: string;
  name: string;
  description?: string;
}

const useConference = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();
  // Fetch groups
  const getAllMeetings = () =>
    useQuery<Group[]>({
      queryKey: ["meetings"],
      queryFn: async () => {
        const { data } = await client.get(`/user/getmeetingid/${authDetails?.encrypt_id}/user`);
        return data?.data || [];
      },
      enabled: !!authDetails?.encrypt_id, // Fetch only when authenticated
      staleTime: 0, // Forces refetching every time you visit the page
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when the page is focused
    });


  // Add to contact mutation
  const addContactMutation = useMutation({
    mutationFn: (userId: string) =>
      client.get(`/user/contact/add/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
      onSuccess({ message: "Contact Successfully Saved!", success: "user has been added to contact" });
    },
    onError: (err) => {
      onFailure({ message: "Failed to accept invitation", error: extractErrorMessage(err)});
      return false; // Return something to handle failure
    }
  });

  
  return {
    getAllMeetings,
    addContactMutation
  };
};

export default useConference;
