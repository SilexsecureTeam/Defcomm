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
  const getActiveDevicesQuery = useQuery({
    queryKey: ["activeDevices"],
    queryFn: async () => {
      const { data } = await client.get("/auth/logindevice/active");
      return data?.data || [];
    },
    enabled: !!authDetails,
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
    onSuccess: () => {
      // Refetch queries to refresh UI
      queryClient.invalidateQueries(["deviceLogs"]);
      queryClient.invalidateQueries(["activeDevices"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    getDeviceLogsQuery,
    getActiveDevicesQuery,
    updateDeviceStatusMutation, // ✅ added mutation
  };
};

export default useDeviceSettings;
