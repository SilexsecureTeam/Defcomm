import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaFolder,
  FaRegFileAlt,
  FaRegFolderOpen,
  FaTh,
  FaList,
  FaSpinner,
} from "react-icons/fa";
import { IoMdAdd, IoMdMore } from "react-icons/io";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useLocation, useParams } from "react-router-dom";
import useDrive from "../hooks/useDrive";
import Modal from "../components/modal/Modal";
import CreateFolderForm from "../components/drive/CreateFolderForm";
import FolderFiles from "../components/drive/FolderFiles";
import UploadFileModal from "../components/fileManager/uploadFileModal/UploadFileModal";

const DriveContent = () => {
  const location = useLocation();
  const { folderId } = location.state;
  const [view, setView] = useState("timeline");

  const [isGrid, setIsGrid] = useState(true);
  const [folderForm, setFolderForm] = useState(null); // null means new folder
  const [showModal, setShowModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showMore, setShowMore] = useState(null);
  const toggleOptions = (index) => {
    setShowMore(showMore === index ? null : index);
  };
  const { getFolderByIdQuery, deleteFolderMutation } = useDrive();
  const { data, isLoading, error } = getFolderByIdQuery(folderId);

  const handleAddNew = () => {
    setFolderForm(null); // clear form for new
    setShowModal(true);
  };
  const handleDelete = (folderId) => {
    //console.log("Delete folder:", folderId);
    deleteFolderMutation.mutate(folderId, {
      onSuccess: () => {
        setShowMore(null);
      },
    });
    // TODO: trigger mutation to delete
  };

  const handleUpdate = (folder) => {
    setFolderForm(folder);
    setShowModal(true);
    setShowMore(null);
  };

  return (
    <div className="text-white">
      {/* Modal */}
      <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-black">
            <h2 className="text-lg font-bold mb-4">
              {folderForm ? "Update Subfolder" : "Create New Subfolder"}
            </h2>
            <CreateFolderForm
              folder={folderForm}
              folderRel={folderId}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      </Modal>
      {/* Header Buttons */}
      <div className="flex flex-wrap gap-4 justify-around items-center mb-6">
        <div className="flex rounded-3xl">
          <button
            onClick={() => setView("explorer")}
            className={`px-6 py-2 ${
              view === "explorer"
                ? "bg-white text-gray-500"
                : "bg-oliveLight text-white"
            } rounded-l-3xl text-[15px] flex justify-between gap-2 items-center min-w-40`}
          >
            Explorer View
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`px-6 py-2 ${
              view === "timeline"
                ? "bg-white text-gray-500"
                : "bg-oliveLight text-white"
            } rounded-r-3xl text-[15px] flex justify-between gap-2 items-center min-w-40`}
          >
            Timeline View
          </button>
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-oliveGreen hover:bg-olive text-[15px] font-medium flex justify-between gap-2 items-center min-w-40">
            <FaRegFileAlt /> Upload File
          </button>
          <button className="px-3 md:px-6 py-2 bg-oliveGreen hover:bg-olive text-[15px] font-medium flex justify-between gap-2 items-center min-w-40">
            <FaRegFolderOpen /> Upload Folder
          </button>
        </div>
      </div>

      {/* Folders Section */}
      <div className="py-4 h-max flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">
          Your folders | {data?.length || 0}{" "}
          {data?.length === 1 ? "Folder" : "Folders"}
        </h2>
        <section className="flex items-center gap-2">
          {/* Toggle Button with Motion */}
          <motion.div
            className="flex bg-white shadow-lg rounded-xl overflow-hidden border-2 border-gray-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <button
              className={`p-2 rounded-l-xl border-4 transition-all duration-300 ${
                !isGrid
                  ? "border-oliveGreen bg-black text-oliveGreen scale-110"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setIsGrid(false)}
            >
              <FaList size={18} />
            </button>
            <button
              className={`p-2 rounded-r-xl border-4 transition-all duration-300 ${
                isGrid
                  ? "border-oliveGreen bg-black text-oliveGreen scale-110"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setIsGrid(true)}
            >
              <TbLayoutDashboardFilled size={18} />
            </button>
          </motion.div>
          <motion.p
            onClick={handleAddNew}
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-lg bg-olive text-white ml-auto flex items-center justify-center cursor-pointer"
          >
            <IoMdAdd strokeWidth={2} />
          </motion.p>
        </section>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-oliveGreen">
          <FaSpinner className="animate-spin text-4xl text-oliveHover" />
          <p className="mt-4 text-sm">Loading your folders...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          Failed to load folders. Please try again.
        </div>
      ) : data?.folder?.length > 0 ? (
        <div className="grid grid-cols-responsive gap-4 mb-6">
          {data?.folder?.map((folder, index) => (
            <motion.div
              key={folder?.id ?? index}
              whileHover={{ scale: 1.05 }}
              className="relative p-4 bg-white rounded-lg text-center min-h-60 flex flex-col items-center justify-center"
            >
              <div className="absolute top-2 right-2">
                <IoMdMore
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOptions(index);
                  }}
                  className="text-xl text-gray-800 hover:text-black cursor-pointer"
                />
                {showMore === index && (
                  <div
                    onMouseLeave={() => setShowMore(null)}
                    className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleUpdate(folder)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Update
                    </button>
                    <button
                      disabled={deleteFolderMutation.isPending}
                      onClick={() => handleDelete(folder.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      {deleteFolderMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                )}
              </div>
              <FaFolder size={60} className="flex-1 mb-2 text-oliveDark" />
              <div className="mt-auto py-3">
                <p className="font-bold text-oliveLight">{folder.name}</p>
                <p className="text-sm text-gray-400">
                  {folder?.files ?? 0} Files | {folder?.subFolders ?? 0} Folders
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg font-semibold mb-2">
            There are no subfolders in this folder
          </p>
          <p className="text-sm">
            Start by uploading folders or creating a new subfolder.
          </p>
        </div>
      )}

      {/* Files Table */}
      <FolderFiles
        data={data?.file}
        loading={isLoading}
        error={error}
        addFile={() => setShowUpload(true)}
      />
      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        folderRel={folderId}
      />
    </div>
  );
};

export default DriveContent;
