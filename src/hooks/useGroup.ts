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
  const token = authDetails?.access_token;

  // Fetch groups
  const useFetchGroups = () =>
    useQuery<Group[]>({
      queryKey: ["groups"],
      queryFn: async () => {
        const client = axiosClient(token);
        const { data } = await client.get("/user/group");
        return data?.data || [];
      },
      enabled: !!authDetails, // Fetch only when authenticated
      staleTime: 0, // Forces refetching every time you visit the page
      cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when the page is focused
    });

     // Fetch [pending] groups
  const useFetchPendingGroups = () =>
    useQuery<Group[]>({
      queryKey: ["pendingInvitations"],
      queryFn: async () => {
        const client = axiosClient(token);
        const { data } = await client.get("/user/group/pending");
        return data?.data || [];
      },
      enabled: !!authDetails, // Fetch only when authenticated
      staleTime: 0, // Forces refetching every time you visit the page
      cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when the page is focused
    });

  // Fetch members of a specific group
  const useFetchGroupMembers = (groupId: string | null) =>
    useQuery({
      queryKey: ["groupMembers", groupId], // Ensure unique cache per groupId
      queryFn: async () => {
        if (!groupId) return [];
        const client = axiosClient(token);
        const { data } = await client.get(`/user/group/member/${groupId}`);
        return data?.data || [];
      },
      enabled: !!authDetails && !!groupId, // Fetch only when authenticated and groupId is provided
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

  return { useFetchGroups, useFetchGroupMembers, useFetchPendingGroups };
};

export default useGroups;
