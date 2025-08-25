import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useDeviceSettings = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // ✅ Fetch device login logs
  const getDeviceLogsQuery = useQuery({
    queryKey: ["deviceLogs"],
    queryFn: async () => {
      const { data } = await client.get("/auth/logindevicelog");
      return data?.data || [];
    },
    enabled: !!authDetails,
    refetchOnMount: true,
    staleTime: 0,
  });

  // ✅ Fetch active devices
  const getDevicesQuery = (type) =>
    useQuery({
      queryKey: [`${type}Devices`],
      queryFn: async () => {
        const { data } = await client.get(`/auth/logindevice/${type}`);
        return data?.data || [];
      },
      enabled: !!authDetails && !!type,
      refetchOnMount: true,
      staleTime: 0,
    });

  // ✅ Mutation to update device status
  const updateDeviceStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await client.get(
        `/auth/logindevicestatus/${id}/${status}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Refetch queries to refresh UI
      queryClient.invalidateQueries(["deviceLogs"]);
      queryClient.invalidateQueries([`${variables?.status}Devices`]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    getDeviceLogsQuery,
    getDevicesQuery,
    updateDeviceStatusMutation, // ✅ added mutation
  };
};

export default useDeviceSettings;
