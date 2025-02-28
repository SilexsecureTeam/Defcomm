import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiUpload } from "react-icons/fi";
import { BsEye, BsPlusLg, BsShare } from "react-icons/bs";
import { TbArrowsMaximize } from "react-icons/tb";
import { FaBook, FaTrash } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { GrSort } from "react-icons/gr";
import SEOHelmet from "../engine/SEOHelmet";
import UploadFileModal from "../components/fileManager/uploadFileModal/UploadFileModal";
import useFileManager from "../hooks/useFileManager";
import ShareFileModal from "../components/fileManager/shareFileModal/ShareFileModal";
import PdfViewer from "../components/fileManager/pdfViewer/PdfViewer";

const tabs = ["My Files", "Other File", "My File Requests", "Pending File Invitations"];

const FileManager = () => {
    const [activeTab, setActiveTab] = useState("My Files");
    const [fileModalsDisplay, setFileModalsDisplay] = useState({
        isUploadFileModal: false,
        isShareFileModal: false,
    })
    const [fileToShare, setFileToShare] = useState(null);
    const closeUploadFileModal = () => setFileModalsDisplay({...fileModalsDisplay, isUploadFileModal: false });
    const closeShareFileModal = () => setFileModalsDisplay({...fileModalsDisplay, isShareFileModal: false });

    const { myFiles, otherFiles, fileRequests, pendingFileRequests, loading, error, viewFile, fileContent, acceptFile, declineFile } = useFileManager();    

    const fileData = {
        "My Files": myFiles,
        "Other File": otherFiles,
        "My File Requests": fileRequests,
        "Pending File Invitations": pendingFileRequests,
    };
    
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
                                if (index === 0) setFileModalsDisplay({...fileModalsDisplay, isUploadFileModal: true });
                            }}
                        >
                            <Icon />
                        </motion.p>
                    ))}
                </div>

                {/* File Upload and file Share Modal */}
                <UploadFileModal isOpen={fileModalsDisplay.isUploadFileModal} onClose={closeUploadFileModal} />
                <ShareFileModal isOpen={fileModalsDisplay.isShareFileModal} onClose={closeShareFileModal} fileId={fileToShare} />


                
                {/* Loading files data */}
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
      
                {/* {fileContent && (
                    <div style={{ marginTop: "20px" }}>
                        <div dangerouslySetInnerHTML={{ __html: fileContent }} />
                    </div>
                )} */}
                {fileContent && (
                    <PdfViewer fileContent={fileContent} />
                )}


                
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

                    {/* Table Section */}
                    <div className="mt-4 overflow-x-auto">
                        {activeTab === "My Files" ? (
                            // My Files: Different layout without table headers
                            <div className="">
                                {fileData["My Files"] && (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/50 *:p-2 *:mx-2 *:min-w-24 text-sm">
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fileData["My Files"].map((file, i) => (
                                                <tr key={i} className="border-b border-white/50 text-sm *:p-2 *:mx-2 ">
                                                    <td className="w-5">
                                                        <CgFileDocument size={30} className="text-gray-400 bg-white rounded-lg p-2" />
                                                    </td>
                                                    <td className="min-w-24">
                                                        <div>
                                                            <p>{file.name}</p>
                                                            <span className="text-gray-500">{file.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="min-w-24">
                                                        <div className="flex gap-3 items-center">
                                                            <span className={`${file?.file_ext === "pdf" ? "bg-green-500" : "bg-black"} w-3 h-3 rounded-full border-[2px] border-white`}></span>
                                                            <p >{file.file_ext}</p>
                                                        </div>
                                                    </td>
                                                    <td className="min-w-24">{file.created_at.split('T')[0]}</td>
                                                    <td className="min-w-24">{file.file_size}</td>
                                                    <td className="min-w-24">{file.uploaded_by}</td>
                                                    <td className="min-w-24">
                                                        <div className="flex items-center text-white">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                className="bg-olive px-3 py-2 text-sm flex items-center gap-1"
                                                                //Disable the view file button for now
                                                                /* onClick={() => viewFile(file.id)} */
                                                            >
                                                                <span><BsEye /></span>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                className="bg-oliveDark px-3 py-2 text-sm flex items-center gap-1"
                                                                onClick={() => {
                                                                    setFileToShare(file.id)
                                                                    setFileModalsDisplay({ ...fileModalsDisplay, isShareFileModal: true })                                                                    
                                                                }}
                                                            >
                                                                <span><BsShare /></span>
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                )}
                            </div>
                        ) :                                                     
                            activeTab === "Pending File Invitations" ? (
                                // Pending File Invitations: Different layout with actions to accept or reject rather than view or share
                                <div className="">
                                    {fileData["Pending File Invitations"] && (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/50 *:p-2 *:mx-2 *:min-w-20 text-sm">
                                                    <th></th>
                                                    <th>Name</th>
                                                    <th>Invitation Date</th>
                                                    <th>Size</th>
                                                    <th>Uploaded by</th>
                                                    <th>Shared by</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fileData["Pending File Invitations"].map((file, i) => (
                                                    <tr key={i} className="border-b border-white/50 text-sm *:p-2 *:mx-2 ">
                                                        <td className="w-5">
                                                            <CgFileDocument size={30} className="text-gray-400 bg-white rounded-lg p-2" />
                                                        </td>
                                                        <td className="min-w-20">
                                                            <div>
                                                                <p>{file.file_name}</p>                                                                
                                                            </div>
                                                        </td>
                                                        <td className="min-w-20" >
                                                            <span className="text-gray-500">{file.shared_date.split('T')[0]}</span>
                                                        </td>
                                                        <td className="min-w-20">{file.file_size}</td>
                                                        <td className="min-w-20">{file.uploaded_by}</td>
                                                        <td className="min-w-20">{file.shared_by}</td>
                                                        <td className="min-w-20">
                                                            <div className="flex items-center text-white">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="bg-olive px-3 py-2 text-sm flex items-center gap-1"                                                                    
                                                                    onClick={() => acceptFile(file.file_id)}
                                                                >
                                                                    <span className="block md:hidden"><BsEye /></span> <span className="hidden md:block">Accept</span>
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="bg-oliveDark px-3 py-2 text-sm flex items-center gap-1"
                                                                    onClick={() => {
                                                                        declineFile(file.file_id)
                                                                    }}
                                                                >
                                                                    <span className="block md:hidden"><BsShare /></span> <span className="hidden md:block">Decline</span>
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ) :
                                (
                                    // Other File & My File Requests: Table Layout                                    
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/50 *:p-2 *:mx-2 *:min-w-24 text-sm">
                                                <th></th>
                                                <th>Name</th>
                                                <th>Size</th>
                                                <th>Uploaded by</th>
                                                <th>Uploaded Date</th>
                                                <th>Expired Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fileData[activeTab].map((file, i) => (
                                                <tr key={i} className="border-b border-white/50 text-sm *:p-2 *:mx-2 *:min-w-24">
                                                    <td>
                                                        <CgFileDocument size={30} className="text-gray-400 bg-white rounded-lg p-2" />
                                                    </td>
                                                    <td>{file.file_name}</td>
                                                    <td>{file.file_size}</td>
                                                    <td>{file.uploaded_by}</td>
                                                    <td>{file.file_upload_date.split('T')[0]}</td>
                                                    <td>{file.expiredDate}</td>
                                                    <td>
                                                        <div className="flex items-center text-white">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                className="bg-olive px-3 py-2 text-sm flex items-center gap-1"
                                                                //Disable the view file button for now
                                                                /* onClick={() => viewFile(file.file_id)} */
                                                            >
                                                                <span className="block md:hidden"><BsEye /></span> <span className="hidden md:block">View</span>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                className="bg-oliveDark px-3 py-2 text-sm flex items-center gap-1"
                                                                onClick={() => {
                                                                    setFileToShare(file.file_id)
                                                                    setFileModalsDisplay({ ...fileModalsDisplay, isShareFileModal: true })                                                                    
                                                                }}
                                                            >
                                                                <span className="block md:hidden"><BsShare /></span> <span className="hidden md:block">Request to share</span>
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>                                
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileManager;
