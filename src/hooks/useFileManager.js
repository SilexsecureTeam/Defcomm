import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import DOMPurify from "dompurify";

const useFileManager = () => {
  const [myFiles, setMyFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [fileRequests, setFileRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [fileContent, setFileContent] = useState(""); // State to store the HTML content

  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const [myFilesRes, otherFilesRes, fileRequestsRes] = await Promise.all([
          client.get("/user/file"),
          client.get("/user/file/other"),
          client.get("/user/file/request"),
        ]);
        console.log(
          "my files:",
          myFilesRes.data.data,
          "other files:",
          otherFilesRes.data.data,
          "file requests:",
          fileRequestsRes.data.data
        );

        setMyFiles(myFilesRes.data.data);
        setOtherFiles(otherFilesRes.data.data);
        setFileRequests(fileRequestsRes.data.data);
      } catch (error) {
        toast.error("Failed to fetch files. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
    fetchContacts();
  }, []);

  // 🔹 Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await client.get("/user/contact");
      //console.log("Contacts fetched:", response.data.data);
      setContacts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch contacts. Please try again.");
    }
  };

  const viewFile = async (fileId) => {
    try {
      const response = await client.get(`/user/file/${fileId}/view`, {
        responseType: "text",
      });

      // Sanitize the HTML response
      const sanitizedHTML = DOMPurify.sanitize(response.data);

      // Store sanitized HTML in state
      setFileContent(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file. Please try again.");
    }
  };

  // 🔹 Function to Share a File
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

  return {
    myFiles,
    otherFiles,
    fileRequests,
    loading,
    viewFile,
    fileContent,
    contacts,
    shareFile,
  };
};

export default useFileManager;
