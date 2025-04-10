import React, { useState } from 'react';
import { CgFileDocument } from 'react-icons/cg';
import { BsEye, BsShare } from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import useFileManager from '../../hooks/useFileManager';
import { FaSpinner } from 'react-icons/fa6';
const MyFileRequestsTab = ({ fileRequests, onShare }) => {
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = useState({});

  // Fetch myFiles and loading state from file manager
  const { acceptFile, declineFile } = useFileManager();
  const handleAccept = async (id) => {
          setLoadingStates((prev) => ({ ...prev, [id]: "accepting" }));
          try{
              await acceptFile(id);
          }finally{
              setLoadingStates((prev) => ({ ...prev, [id]: null }));
          }
      };
  
      const handleDecline = async (id) => {
          setLoadingStates((prev) => ({ ...prev, [id]: "declining" }));
          try{
              await declineFile(id);
          }finally{
              setLoadingStates((prev) => ({ ...prev, [id]: null }));
          }
      };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/50 *:p-2 *:mx-2 *:min-w-24 text-sm">
            <th></th>
            <th>Name</th>
            <th>Size</th>
            <th>Shared By</th>
            <th>Shared Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(fileRequests) ? fileRequests : [])?.map((request, i) => (
            <tr key={request?.file_id} className="border-b border-white/50 text-sm *:p-2 *:mx-2 ">
              <td className="w-5">
                <CgFileDocument size={30} className="text-gray-400 bg-white rounded-lg p-2" />
              </td>
              <td className="min-w-24">
                <div>
                  <p>{request?.file_name}</p>
                  <span className="text-gray-500">{request?.upload_date?.split('T')[0]}</span>
                </div>
              </td>
              {/* <td className="min-w-24">
              <div className="flex gap-3 items-center">
                <span className={`${request?.file_ext === "pdf" ? "bg-green-500" : "bg-black"} w-3 h-3 rounded-full border-[2px] border-white`}></span>
                <p >{request?.file_ext}</p>
              </div>
            </td> */}
              <td className="min-w-24">{request?.file_size}</td>
              <td className="min-w-24">{request?.shared_by}</td>
              <td className="min-w-24">{request?.shared_date?.split('T')[0]}</td>
              <td className="min-w-24">
                <div className="flex gap-2 font-medium">
                  <button
                    onClick={() => handleAccept(request?.id)}
                    className="bg-oliveLight hover:bg-oliveDark text-oliveHover px-4 py-2 rounded-lg flex items-center gap-2"
                    disabled={loadingStates[request?.id] === "accepting"}
                  >
                    {loadingStates[request?.id] === "accepting" && (
                      <FaSpinner className="animate-spin text-oliveHover" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(request?.id)}
                    className="bg-red-500 hover:bg-red-600 text-red-100 px-4 py-2 rounded-lg flex items-center gap-2"
                    disabled={loadingStates[request?.id] === "declining"}
                  >
                    {loadingStates[request?.id] === "declining" && (
                      <FaSpinner className="animate-spin text-red-100" />
                    )}
                    Decline
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default MyFileRequestsTab;
