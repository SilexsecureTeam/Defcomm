import { motion } from "framer-motion";
import { useState } from "react";
import { FaFolder, FaRegFileAlt, FaRegFolderOpen, FaTh, FaList } from "react-icons/fa";
import ToggleSwitch from "../components/ToggleSwitch"; // Importing the reusable ToggleSwitch component
import { initialFiles, folders } from "../utils/dummies";
import { IoMdAdd } from "react-icons/io";
import { TbLayoutDashboardFilled } from "react-icons/tb";



const DriveContent = () => {
    const [view, setView] = useState("timeline");
    const [files, setFiles] = useState(initialFiles);
    const [selectedFiles, setSelectedFiles] = useState([]); // Track selected files
    const [isGrid, setIsGrid] = useState(true);

    const toggleImportant = (index) => {
        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = { ...updatedFiles[index], important: !updatedFiles[index].important };
            return updatedFiles;
        });
    };


    const toggleSelection = (index) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(index)
                ? prevSelected.filter((i) => i !== index)
                : [...prevSelected, index]
        );
    };

    return (
        <div className="p-2 md:p-5 text-white">
            {/* Header Buttons */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div className="flex justify-center rounded-3xl">
                    <button
                        onClick={() => setView("explorer")}
                        className={`px-6 py-2 ${view === "explorer"
                            ? "bg-white text-gray-400"
                            : "bg-oliveLight text-white"
                            } rounded-l-3xl text-[15px] flex justify-between gap-2 items-center min-w-40`}
                    >
                        Explorer View
                    </button>
                    <button
                        onClick={() => setView("timeline")}
                        className={`px-6 py-2 ${view === "timeline"
                            ? "bg-white text-gray-400"
                            : "bg-oliveLight text-white"
                            } rounded-r-3xl text-[15px] flex justify-between gap-2 items-center min-w-40`}
                    >
                        Timeline View
                    </button>
                </div>
                <div className="flex justify-center space-x-4">
                    <button className="px-5 py-2 bg-oliveGreen hover:bg-olive text-xs md:text-[15px] font-medium flex justify-between gap-2 items-center min-w-40">
                        <FaRegFileAlt /> Upload File
                    </button>
                    <button className="px-6 py-2 bg-oliveGreen hover:bg-olive text-xs md:text-[15px] font-medium flex justify-between gap-2 items-center min-w-40">
                        <FaRegFolderOpen /> Upload Folder
                    </button>
                </div>
            </div>

            {/* Folders Section */}
            <div className="py-4 h-max flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                    Your folders | {folders.length} Folders
                </h2>
                <section className="flex items-center gap-2">
                    {/* Toggle Button */}
                    {/* Toggle Button with Motion */}
                    <motion.div
                        className="flex bg-white shadow-lg rounded-xl overflow-hidden border-2 border-gray-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <button
                            className={`p-2 rounded-l-xl border-4 transition-all duration-300 ${!isGrid
                                    ? "border-oliveHover bg-black text-oliveHover scale-110"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setIsGrid(false)}
                        >
                            <FaList size={18} />
                        </button>
                        <button
                            className={`p-2 rounded-r-xl border-4 transition-all duration-300 ${isGrid
                                    ? "border-oliveHover bg-black text-oliveHover scale-110"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setIsGrid(true)}
                        >
                            <TbLayoutDashboardFilled size={18} />
                        </button>
                    </motion.div>
                    <motion.p
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-lg bg-olive text-white ml-auto flex items-center justify-center cursor-pointer"
                    >
                        <IoMdAdd strokeWidth={2} />
                    </motion.p>
                </section>

            </div>
            <div className="grid grid-cols-responsive gap-4 mb-6">
                {folders.map((folder, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-white rounded-lg text-center min-h-60 flex flex-col items-center justify-center"
                    >
                        <FaFolder size={60} className="flex-1 mb-2 text-oliveDark" />
                        <div className="mt-auto py-3">
                            <p className="font-bold text-oliveLight">{folder.name}</p>
                            <p className="text-sm text-gray-400">
                                {folder.files} Files | {folder.subFolders} Folders
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Files Table */}
            <div className="py-4 h-max flex items-center justify-between gap-2">
                <section>
                    <h2 className="text-lg font-semibold">
                        Your files | {files.length} Files
                    </h2>
                    <p className="text-xs mb-4">Click on a file to preview the file</p>

                </section>
                <motion.p
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-lg bg-olive text-white ml-auto flex items-center justify-center cursor-pointer"
                >
                    <IoMdAdd strokeWidth={2} />
                </motion.p>
            </div>
            <div className="rounded-lg overflow-x-auto">
                <table className="min-w-[700px] w-full text-left">
                    <thead>
                        <tr className="bg-oliveLight text-white">
                            <th className="p-3 pr-0">
                                <input
                                    type="checkbox"
                                    onChange={() => setSelectedFiles(selectedFiles.length === files.length ? [] : files.map((_, i) => i))}
                                    checked={selectedFiles.length === files.length}
                                    className="cursor-pointer w-[14px] h-[14px] rounded-md border-gray-400 focus:ring-oliveLight"
                                />
                            </th>
                            <th className="p-3">File Name</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">File Type</th>
                            <th className="p-3">Important</th>
                            <th className="p-3">Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <motion.tr
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                className={`${index === 0
                                    ? "bg-oliveGreen/80 text-black"
                                    : (index + 1) % 2 === 0
                                        ? "bg-white text-black" // Every 3rd row is always white
                                        : "bg-oliveLight/70 text-white" // Even index rows
                                    }`}
                            >
                                <td className="p-3 pr-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.includes(index)}
                                        onChange={() => toggleSelection(index)}
                                        className="cursor-pointer w-[14px] h-[14px] rounded-md border-gray-400 focus:ring-oliveLight"
                                    />
                                </td>
                                <td className="p-3">{file.name}</td>
                                <td className="p-3">{file.location}</td>
                                <td className="p-3">{file.type}</td>
                                <td className="p-3">
                                    <ToggleSwitch
                                        isChecked={file.important}
                                        onToggle={() => toggleImportant(index)}
                                        inactiveBg="bg-oliveLight"
                                    />
                                </td>
                                <td className="p-3">{file.date}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriveContent;
