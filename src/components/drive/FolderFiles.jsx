import React, { useState } from 'react'
import { initialFiles } from '../../utils/dummies';
import { motion } from 'framer-motion';
import { IoMdAdd } from 'react-icons/io';
import ToggleSwitch from '../ToggleSwitch';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const FolderFiles = ({ data, loading, error, addFile }) => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]); // Track selected files
    const [files, setFiles] = useState(initialFiles);
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
        <>
            <div className="py-4 h-max flex items-center justify-between gap-2">
                <section>
                    <h2 className="text-lg font-semibold">
                        Your files | {files.length} Files
                    </h2>
                    <p className="text-xs mb-4">Click on a file to preview the file</p>

                </section>
                <motion.p
                    whileHover={{ scale: 1.1 }}
                    onClick={addFile}
                    className="w-12 h-12 rounded-lg bg-olive text-white ml-auto flex items-center justify-center cursor-pointer"
                >
                    <IoMdAdd strokeWidth={2} />
                </motion.p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-oliveGreen">
                    <FaSpinner className="animate-spin text-4xl text-oliveHover" />
                    <p className="mt-4 text-sm">Loading your folders...</p>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">
                    Failed to load folders. Please try again.
                </div>
            ) : data?.length > 0 ?
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
                                    onClick={() => navigate(`/dashboard/file-view/${btoa(import.meta.env.VITE_FILE)}`)}
                                    whileHover={{ scale: 1.01 }}
                                    className={`${index === 0
                                        ? "bg-oliveGreen/80 text-black"
                                        : (index + 1) % 2 === 0
                                            ? "bg-white text-black" // Every 3rd row is always white
                                            : "bg-oliveLight/70 text-white" // Even index rows
                                        } cursor-pointer`}
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
                                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                        <ToggleSwitch
                                            isChecked={file.important}
                                            onToggle={(e) => toggleImportant(index)}
                                            inactiveBg="bg-oliveLight"
                                        />
                                    </td>
                                    <td className="p-3">{file.date}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div> : <div className="text-center text-gray-400 py-10">
                    <p className="text-lg font-semibold mb-2">There are no files in this folder</p>
                    <p className="text-sm">Start by uploading files</p>
                </div>}
        </>
    )
}

export default FolderFiles