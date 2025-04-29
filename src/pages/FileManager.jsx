import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiUpload } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import { TbArrowsMaximize } from "react-icons/tb";
import { FaBook, FaTrash } from "react-icons/fa";
import { GrSort } from "react-icons/gr";
import SEOHelmet from "../engine/SEOHelmet";
import UploadFileModal from "../components/fileManager/uploadFileModal/UploadFileModal";
import ShareFileModal from "../components/fileManager/shareFileModal/ShareFileModal";
import PdfViewer from "../components/fileManager/pdfViewer/PdfViewer";

// Import the separate tab components
import MyFilesTab from '../components/fileManager/MyFilesTab';
import PendingFileInvitationsTab from '../components/fileManager/PendingFileInvitationsTab';
import OtherFileTab from '../components/fileManager/OtherFileTab';
import MyFileRequestsTab from '../components/fileManager/MyFileRequestsTab';
import useFileManager from "../hooks/useFileManager";

const tabs = ["My Files", "Other File", "My File Requests", "Pending File Invitations"];

const FileManager = () => {
    const [activeTab, setActiveTab] = useState("My Files");
    const [fileModalsDisplay, setFileModalsDisplay] = useState({
        isUploadFileModal: false,
        isShareFileModal: false,
    });
    const [fileToShare, setFileToShare] = useState(null);

    const closeUploadFileModal = () => setFileModalsDisplay({ ...fileModalsDisplay, isUploadFileModal: false });
    const closeShareFileModal = () => setFileModalsDisplay({ ...fileModalsDisplay, isShareFileModal: false });

    const {
        myFiles, refetchMyFiles, isFetching: fetchingMyFiles,
        otherFiles, refetchOtherFiles, isFetching: fetchingOtherFiles,
        fileRequests, refetchFileRequests, isFetching: fetchingFileRequests,
        pendingFileRequests, refetchPendingFileRequests, isFetching: fetchingPendingFileRequests,
        error, fileContent, viewFile
    } = useFileManager();


    // Data, refetch, and loading map per tab
    const fileData = {
        "My Files": myFiles,
        "Other File": otherFiles,
        "My File Requests": pendingFileRequests,
        "Pending File Invitations": fileRequests,
    };

    const refetchData = {
        "My Files": refetchMyFiles,
        "Other File": refetchOtherFiles,
        "My File Requests": refetchPendingFileRequests,
        "Pending File Invitations": refetchFileRequests,
    };

    const fetchingMap = {
        "My Files": fetchingMyFiles,
        "Other File": fetchingOtherFiles,
        "My File Requests": fetchingFileRequests,
        "Pending File Invitations": fetchingPendingFileRequests,
    };
    // Handle tab change and refetch the corresponding data
    useEffect(() => {
        if (refetchData[activeTab]) {
            refetchData[activeTab]();  // Trigger refetch for active tab
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen text-white">
            {/* SEO Content */}
            <SEOHelmet title="File Manager" />
            <div className="mx-auto">
                {/* Search and Header Section */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                    <h2 className="text-2xl font-semibold w-full md:w-max text-[#DDF2AB]">File Manager</h2>
                    <section className="flex items-center gap-2">
                        <div className="relative w-60 text-gray-800">
                            <input
                                type="text"
                                placeholder="Search documents"
                                className="text-sm p-2 rounded-lg focus:outline-none w-full pl-10 font-medium"
                            />
                            <FiSearch className="absolute left-3 top-0 bottom-0 my-auto text-gray-400" />
                        </div>
                        <p className="text-sm px-2 mr-2">Sort by</p>
                        <GrSort size={20} className="hover:text-olive cursor-pointer" />
                    </section>
                </div>

                {/* Icons */}
                <div className="flex gap-4 items-center my-4">
                    {[FiUpload, TbArrowsMaximize, FaBook, FaTrash, BsPlusLg].map((Icon, index) => (
                        <motion.p
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 border border-[#DDDFE1] rounded bg-transparent text-[#DDF2AB] last:text-white last:ml-auto last:bg-olive flex items-center justify-center cursor-pointer"
                            onClick={() => {
                                if (index === 0) setFileModalsDisplay({ ...fileModalsDisplay, isUploadFileModal: true });
                            }}
                        >
                            <Icon />
                        </motion.p>
                    ))}
                </div>

                {/* File Upload and file Share Modal */}
                <UploadFileModal isOpen={fileModalsDisplay.isUploadFileModal} onClose={closeUploadFileModal} />
                <ShareFileModal isOpen={fileModalsDisplay.isShareFileModal} onClose={closeShareFileModal} fileId={fileToShare} />

                {/* File viewer */}
                {fileContent && <PdfViewer fileContent={fileContent} />}

                {/* Tab Section */}
                <div className="bg-[#DDF2AB] rounded-md p-4 text-[#233015] my-2">
                    <div className="flex gap-4 font-medium text-sm border-b border-white/50 pb-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-2 ${activeTab === tab ? "text-black font-semibold" : "text-gray-500"}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 bottom-0 w-full h-[2px] bg-black"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Loading state per tab */}
                    {fetchingMap[activeTab] ? (
                        <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
                            <FaSpinner className="animate-spin text-2xl" /> Loading {activeTab}...
                        </div>
                    ) : (
                        <div className="mt-4">
                            {activeTab === "My Files" && (
                                <MyFilesTab
                                    files={fileData["My Files"]}
                                    onShare={(fileId) => {
                                        setFileToShare(fileId);
                                        setFileModalsDisplay({ ...fileModalsDisplay, isShareFileModal: true });
                                    }}
                                />
                            )}
                            {activeTab === "Pending File Invitations" && (
                                <PendingFileInvitationsTab
                                    invitations={fileData["Pending File Invitations"]}
                                />
                            )}
                            {activeTab === "Other File" && (
                                <OtherFileTab 
                                files={fileData["Other File"]}
                                onShare={(fileId) => {
                                        setFileToShare(fileId);
                                        setFileModalsDisplay({ ...fileModalsDisplay, isShareFileModal: true });
                                    }} />
                            )}
                            {activeTab === "My File Requests" && (
                                <MyFileRequestsTab fileRequests={fileData["My File Requests"]} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileManager;
