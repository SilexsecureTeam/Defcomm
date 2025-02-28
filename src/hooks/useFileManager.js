import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import DOMPurify from "dompurify";

const useFileManager = () => {
  const [myFiles, setMyFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [fileRequests, setFileRequests] = useState([]);
  const [pendingFileRequests, setPendingFileRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [fileContent, setFileContent] = useState(""); // State to store the HTML content

  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);

  useEffect(() => {
    fetchFiles();
    fetchContacts();
  }, []);

  // Function to fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const [
        myFilesRes,
        otherFilesRes,
        fileRequestsRes,
        pendingFileRequestsRes,
      ] = await Promise.all([
        client.get("/user/file"),
        client.get("/user/file/other"),
        client.get("/user/file/request"),
        client.get("/user/file/pending"),
      ]);
      console.log(
        "my files:",
        myFilesRes.data.data,
        "other files:",
        otherFilesRes.data.data,
        "file requests:",
        fileRequestsRes.data.data,
        "pending file requests:",
        pendingFileRequestsRes.data.data
      );

      setMyFiles(myFilesRes.data.data);
      setOtherFiles(otherFilesRes.data.data);
      setFileRequests(fileRequestsRes.data.data);
      setPendingFileRequests(pendingFileRequestsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch files. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  //Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await client.get("/user/contact");
      setContacts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch contacts. Please try again.", error);
    }
  };

  const viewFile = async (fileId) => {
    try {
      const response = await client.get(`/user/file/${fileId}/view`, {
        responseType: "text",
      });

      // Sanitize the HTML response
      //const sanitizedHTML = DOMPurify.sanitize(response.data);

      // Store sanitized HTML in state
      setFileContent(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file. Please try again.");
    }
  };

  //Function to Share a File
  const shareFile = async (fileId, selectedContacts) => {
    if (!fileId) {
      toast.error("Invalid file");
      return;
    }
    if (!selectedContacts.length) {
      toast.error("No contacts selected.");
      return;
    }
    const toastId = toast.loading("Sharing...");
    try {
      const payload = {
        id: fileId,
        users: JSON.stringify(selectedContacts), // Ensure users are sent as a string
      };

      const result = await client.post("/user/file/share", payload);
      console.log("File sharing response:", result.data);
      toast.success(result.data.message || "File shared successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error("Error sharing file:", error);
      toast.error(error.response?.data?.message || "Failed to share file.", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const acceptFile = async (fileId) => {
    const toastId = toast.loading("Accepting file...");
    try {
      const response = await client.get(`/user/file/${fileId}/accept`);
      console.log(response.data);
      toast.success(response.data.message || "File accepted successfully!", {
        id: toastId,
      });
      await fetchFiles(); // Fetch files to update files
    } catch (error) {
      console.error("Error accepting file:", error);
      toast.error(error.response?.data?.message || "Failed to accept file.", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const declineFile = async (fileId) => {
    const toastId = toast.loading("Declining file...");
    try {
      const response = await client.get(`/user/file/${fileId}/decline`);
      console.log(response.data);
      toast.success(response.data.message || "File declined successfully!", {
        id: toastId,
      });
      await fetchFiles(); // Fetch files to update files
    } catch (error) {
      console.error("Error declining file:", error);
      toast.error(error.response?.data?.message || "Failed to decline file.", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    myFiles,
    otherFiles,
    fileRequests,
    pendingFileRequests,
    loading,
    viewFile,
    fileContent,
    contacts,
    shareFile,
    acceptFile,
    declineFile,
    fetchFiles,
  };
};

export default useFileManager;
