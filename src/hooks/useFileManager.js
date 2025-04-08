import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosClient } from "../services/axios-client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useFileManager = () => {
  const [fileContent, setFileContent] = useState("");
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);
  const queryClient = useQueryClient();

  const fetcher = (url) => client.get(url).then((res) => res.data.data);

  // 🔹 My Files
  const {
    data: myFiles = [],
    refetch: refetchMyFiles,
    isLoading: isLoadingMyFiles,
    isFetching: isFetchingMyFiles,
    error: errorMyFiles,
  } = useQuery({
    queryKey: ["myFiles"],
    queryFn: () => fetcher("/user/file"),
    enabled: false,
  });

  // 🔹 Other Files
  const {
    data: otherFiles = [],
    refetch: refetchOtherFiles,
    isLoading: isLoadingOtherFiles,
    isFetching: isFetchingOtherFiles,
    error: errorOtherFiles,
  } = useQuery({
    queryKey: ["otherFiles"],
    queryFn: () => fetcher("/user/file/other"),
    enabled: false,
  });

  // 🔹 File Requests
  const {
    data: fileRequests = [],
    refetch: refetchFileRequests,
    isLoading: isLoadingFileRequests,
    isFetching: isFetchingFileRequests,
    error: errorFileRequests,
  } = useQuery({
    queryKey: ["fileRequests"],
    queryFn: () => fetcher("/user/file/request"),
    enabled: false,
  });

  // 🔹 Pending File Requests
  const {
    data: pendingFileRequests = [],
    refetch: refetchPendingFileRequests,
    isLoading: isLoadingPendingFileRequests,
    isFetching: isFetchingPendingFileRequests,
    error: errorPendingFileRequests,
  } = useQuery({
    queryKey: ["pendingFileRequests"],
    queryFn: () => fetcher("/user/file/pending"),
    enabled: false,
  });

  // 🔹 Contacts
  const {
    data: contacts = [],
    refetch: refetchContacts,
    isLoading: isLoadingContacts,
    isFetching: isFetchingContacts,
    error: errorContacts,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => fetcher("/user/contact"),
    enabled: false,
  });

  // 🔹 View file content
  const viewFile = async (fileId) => {
    try {
      const res = await client.get(`/user/file/${fileId}/view`, {
        responseType: "text",
      });
      setFileContent(res.data);
    } catch (error) {
      toast.error("Failed to view file. Please try again.");
      console.error(error);
    }
  };

  // 🔹 Share file
  const shareFileMutation = useMutation({
    mutationFn: ({ fileId, selectedContacts }) => {
      const payload = {
        id: fileId,
        users: JSON.stringify(selectedContacts),
      };
      return client.post("/user/file/share", payload);
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "File shared successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to share file.");
    },
  });

  // 🔹 Accept file
  const acceptFileMutation = useMutation({
    mutationFn: (fileId) => client.get(`/user/file/${fileId}/accept`),
    onSuccess: (data) => {
      toast.success(data.data.message || "File accepted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myFiles"] });
      queryClient.invalidateQueries({ queryKey: ["fileRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to accept file.");
    },
  });

  // 🔹 Decline file
  const declineFileMutation = useMutation({
    mutationFn: (fileId) => client.get(`/user/file/${fileId}/decline`),
    onSuccess: (data) => {
      toast.success(data.data.message || "File declined successfully!");
      queryClient.invalidateQueries({ queryKey: ["fileRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to decline file.");
    },
  });

  return {
    // 📁 Data
    myFiles,
    otherFiles,
    fileRequests,
    pendingFileRequests,
    contacts,
    fileContent,

    // 📥 File actions
    viewFile,
    shareFile: shareFileMutation.mutateAsync,
    acceptFile: acceptFileMutation.mutate,
    declineFile: declineFileMutation.mutate,

    // 🔄 Refetchers
    refetchMyFiles,
    refetchOtherFiles,
    refetchFileRequests,
    refetchPendingFileRequests,
    refetchContacts,

    // 🔄 Loaders
    isLoadingMyFiles,
    isFetchingMyFiles,
    isLoadingOtherFiles,
    isFetchingOtherFiles,
    isLoadingFileRequests,
    isFetchingFileRequests,
    isLoadingPendingFileRequests,
    isFetchingPendingFileRequests,
    isLoadingContacts,
    isFetchingContacts,

    // ⚠️ Errors
    errorMyFiles,
    errorOtherFiles,
    errorFileRequests,
    errorPendingFileRequests,
    errorContacts,
  };
};

export default useFileManager;
