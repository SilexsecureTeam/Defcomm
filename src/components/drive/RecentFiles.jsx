import React, { useEffect, useState } from 'react'
import useFileManager from '../../hooks/useFileManager';
import ShareFileModal from '../fileManager/shareFileModal/ShareFileModal';
import { motion } from 'framer-motion';
import { FaSpinner, FaFileAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/formmaters';
import { FiPlus, FiSend } from 'react-icons/fi';
import { IoIosMore } from 'react-icons/io';

const RecentFiles = () => {
    const [shareModal, setShareModal] = useState(false);
    const [fileToShare, setFileToShare] = useState(null);
    const [showMore, setShowMore] = useState(null);
    // Fetch myFiles and loading state from file manager
    const { myFiles, isLoadingMyFiles, refetchMyFiles, errorMyFiles } = useFileManager();
    useEffect(() => {
        // Refetch folders when component mounts
        refetchMyFiles();
    }, []);

    const toggleOptions = (index) => {
    setShowMore(showMore === index ? null : index);
  };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">Recent Files</h2>
                <button className="text-gray-400 hover:text-white">View All</button>
            </div>
            <div className="space-y-4">
                {isLoadingMyFiles ? (
                    <div className="flex flex-col items-center justify-center py-20 text-oliveGreen">
                        <FaSpinner className="animate-spin text-4xl text-oliveHover" />
                        <p className="mt-4 text-sm">Loading your files...</p>
                    </div>
                ) : errorMyFiles ? (
                    <div className="text-red-500 text-center py-8">
                        Failed to load files. Please try again.
                    </div>
                ) : myFiles.map((file, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-wrap min-[1000px]:flex-nowrap items-center justify-between gap-2 bg-white rounded-lg p-4 shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`p-2 rounded-lg ${file.color || "text-black"}/30`}
                            >
                                <FaFileAlt className={`${file.color || "text-black"} text-lg`} />
                            </motion.div>
                            <h3 className="text-sm font-medium text-gray-900 w-1/2 max-w-40 truncate">{file.name}</h3>
                        </div>

                        <section
                            className={`${index === showMore ? "flex" : "hidden"
                                } order-1 basis-full min-[1000px]:flex min-[1000px]:basis-auto min-[1000px]:order-0 flex-1 items-center justify-around gap-2`}
                        >
                            <p className="text-gray-500 text-sm">{file.uploaded_by}</p>
                            <p className="text-gray-500 text-sm">{formatDate(file?.updated_at)}</p>
                            <p className="text-gray-500 text-sm">{file.size}</p>
                        </section>

                        <div className="flex space-x-4 text-gray-500 min-[1000px]:order-1">
                            <motion.div whileHover={{ scale: 1.2 }}>
                                <FiPlus className="cursor-pointer hover:text-black" />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.2 }} onClick={() => {
                                setFileToShare({ file_id: file.id, file_name: file.name });
                                setShareModal(true);
                            }}>
                                <FiSend className="cursor-pointer hover:text-black" />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.2 }} onClick={() => toggleOptions(index)}>
                                <IoIosMore className="cursor-pointer hover:text-black" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <ShareFileModal isOpen={shareModal} onClose={() => setShareModal(false)} file={fileToShare} />
        </div>
    )
}

export default RecentFiles
