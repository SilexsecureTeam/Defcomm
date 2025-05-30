import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaFileAlt } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { FiPlus, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useDrive from "../hooks/useDrive";
import Modal from "../components/modal/Modal";
import CreateFolderForm from "../components/drive/CreateFolderForm";

const pastelColors = [
  "bg-pink-200", "bg-green-200", "bg-blue-200", "bg-yellow-200",
  "bg-purple-200", "bg-red-200", "bg-indigo-200", "bg-teal-200"
];
const textColors = [
  "text-pink-500", "text-green-500", "text-blue-500", "text-yellow-500",
  "text-purple-500", "text-red-500", "text-indigo-500", "text-teal-500"
];

function getColorByIndex(index) {
  return {
    bg: pastelColors[index % pastelColors.length],
    text: textColors[index % textColors.length]
  };
}

const recentFiles = [
  { name: "Avala Project", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "3MB", color: "bg-blue-500" },
  { name: "Design Sprint", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "5MB", color: "bg-green-500" },
  { name: "Atomic Design", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "10MB", color: "bg-red-500" },
  { name: "UX Research", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "2MB", color: "bg-yellow-500" },
];

const MyDrive = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [folderForm, setFolderForm] = useState(null); // null means new folder

  const { getFoldersQuery, deleteFolderMutation } = useDrive();
  const { data: folders, isLoading, error } = getFoldersQuery;

  const toggleOptions = (index) => {
    setShowMore(showMore === index ? null : index);
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

  const handleAddNew = () => {
    setFolderForm(null); // clear form for new
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-transparent">

      {/* Modal */}
      <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-black">
            <h2 className="text-lg font-bold mb-4">
              {folderForm ? "Update Folder" : "Create New Folder"}
            </h2>
            <CreateFolderForm
              folder={folderForm}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      </Modal>

      {/* My Drive Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">My Drive</h2>
        <button
          onClick={handleAddNew}
          className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200"
        >
          + Add New
        </button>
      </div>

      {/* Folders Section */}
      <div className="min-h-[160px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-oliveGreen">
            <FaSpinner className="animate-spin text-4xl text-oliveHover" />
            <p className="mt-4 text-sm">Loading your folders...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            Failed to load folders. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-responsive-sm gap-6">
            {folders?.length > 0 ? (
              folders.map((folder, index) => {
                const { bg, text } = getColorByIndex(index);
                const used = 120; // Dummy
                const total = 200;
                const percentUsed = (used / total) * 100;

                return (
                  <motion.div
                    onClick={() => navigate(`/dashboard/drive/${folder?.id}`)}
                    key={folder.id || index}
                    className="cursor-pointer bg-white rounded-lg p-4 shadow-md w-full min-h-48 flex flex-col justify-between relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="flex items-center space-x-3">
                        <motion.figure
                          whileHover={{ scale: 1.1 }}
                          className={`p-3 rounded-lg ${bg} flex items-center justify-center`}
                        >
                          <div className={`text-2xl ${text}`}>
                            <FaFileAlt />
                          </div>
                        </motion.figure>
                        <h3 className="text-lg font-medium text-gray-900">
                          {folder.name}
                        </h3>
                      </div>

                      <div className="relative">
                        <IoIosMore
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOptions(index);
                          }}
                          className="text-xl text-gray-500 hover:text-black cursor-pointer"
                        />
                        {showMore === index && (
                          <div
                            className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10"
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
                              {deleteFolderMutation.isPending ? "Deleting...":"Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {folder.description || "No description"}
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${text} h-2 rounded-full`}
                          style={{ width: `${percentUsed}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 flex justify-between">
                        {total}GB &nbsp;
                        <span className="text-gray-400">{used}GB used</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-white text-center">No folders found.</p>
            )}
          </div>
        )}
      </div>

      {/* Recent Files Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Recent Files</h2>
          <button className="text-gray-400 hover:text-white">View All</button>
        </div>
        <div className="space-y-4">
          {recentFiles.map((file, index) => (
            <motion.div
              key={index}
              className="flex flex-wrap min-[800px]:flex-nowrap items-center justify-between gap-2 bg-white rounded-lg p-4 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-lg ${file.color}/30`}
                >
                  <FaFileAlt className={`${file.color} text-lg`} />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              </div>

              <section
                className={`${
                  index === showMore ? "flex" : "hidden"
                } order-1 basis-full min-[800px]:flex min-[800px]:basis-auto min-[800px]:order-0 flex-1 items-center justify-around gap-2`}
              >
                <p className="text-gray-500 text-sm">{file.owner}</p>
                <p className="text-gray-500 text-sm">{file.date}</p>
                <p className="text-gray-500 text-sm">{file.size}</p>
              </section>

              <div className="flex space-x-4 text-gray-500 min-[800px]:order-1">
                <motion.div whileHover={{ scale: 1.2 }}>
                  <FiPlus className="cursor-pointer hover:text-black" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <FiSend className="cursor-pointer hover:text-black" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} onClick={() => toggleOptions(index)}>
                  <IoIosMore className="cursor-pointer hover:text-black" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDrive;            
