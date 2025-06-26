import React, { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import useFileManager from "../../../hooks/useFileManager";
import { queryClient } from "../../../services/query-client";
import { useParams } from "react-router-dom";

const UploadFileModal = ({ isOpen, onClose, folderRel = "" }) => {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);
  const { id } = useParams();

  const [form, setForm] = useState({
    fileLabel: "",
    description: "",
    file: null,
    rel: folderRel,
  });

  const resetForm = () => {
    setForm({
      fileLabel: "",
      description: "",
      file: null,
      rel: folderRel,
    });
  };

  const handleFormChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB. Please select a smaller file.");
      return;
    }
    setForm({ ...form, file: selectedFile });
  };

  const uploadFileMutation = useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("name", payload.fileLabel);
      formData.append("description", payload.description);
      formData.append("file", payload.file);
      formData.append("folder_id", folderRel);

      const res = await client.post("/user/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
    onMutate: () => {
      return toast.loading("Uploading...");
    },
    onSuccess: async (_data, _variables, contextId) => {
      toast.update(contextId, {
        render: _data.message || "File uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      if (folderRel) {
        queryClient.invalidateQueries(["folder", folderRel]);
      } else {
        queryClient.invalidateQueries(["myFiles"]);
      }
      resetForm();
      onClose();
    },
    onError: (err, _vars, contextId) => {
      toast.update(contextId, {
        render:
          err?.response?.data?.message ||
          "Failed to upload file. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const handleSubmit = () => {
    if (!form.file || !form.fileLabel) {
      toast.error("File and File Label are required!");
      return;
    }
    uploadFileMutation.mutate(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-[90%] max-w-[650px] text-[#071437]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="-mx-6 px-6 mb-10 border-b border-b-[rgb(241,241,244)]">
          <h2 className="text-lg font-semibold mb-4">
            Upload File {folderRel && `to ${id}`}
          </h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="fileLabel">
            File Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fileLabel"
            name="fileLabel"
            value={form.fileLabel}
            onChange={handleFormChange}
            className="w-full rounded-lg py-2.5 px-3 focus:outline-none bg-[rgb(249,249,249)] text-sm"
            placeholder="File Label"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="fileInput">
            File <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              type="file"
              id="fileInput"
              name="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
            />
            <div className="w-full flex items-center justify-between bg-[rgb(249,249,249)] rounded-lg py-2.5 px-3 cursor-pointer border border-gray-300">
              <span className="text-gray-500">
                {form.file ? form.file.name : "Choose file"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={1}
            className="w-full rounded-lg py-2.5 px-3 focus:outline-none bg-[rgb(249,249,249)] text-sm"
            placeholder="Type in description"
          ></textarea>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={uploadFileMutation.isLoading}
          >
            Discard
          </button>
          <button
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={uploadFileMutation.isLoading}
          >
            {uploadFileMutation.isLoading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
