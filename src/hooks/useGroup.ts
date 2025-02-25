import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface Group {
  id: string;
  name: string;
  description?: string;
}


const useGroups = () => {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);

  const useFetchGroups = () =>
    useQuery<Group[]>({
      queryKey: ["groups"],
      queryFn: async () => {
        const { data } = await client.get("/user/group");
        return data?.data || [];
      },
      enabled: !!authDetails, // Fetch only when authenticated
      staleTime: 0, // Forces refetching every time you visit the page
      cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes, but still refetch on navigation
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when the page is focused
      // refetchOnReconnect: true, // Refetch when the network reconnects
    });
  

  // Fetch members of a specific group
  const useFetchGroupMembers = (groupId: string | null) =>
    useQuery({
      queryKey: ["groupMembers", groupId],
      queryFn: async () => {
        if (!groupId) return [];
        const { data } = await client.get(`/groups/${groupId}/members`);
        return data?.data || [];
      },
      enabled: !!authDetails && !!groupId, // Fetch only when groupId exists
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

  return { useFetchGroups, useFetchGroupMembers };
};

export default useGroups;
