import React from 'react';
import { CgFileDocument } from 'react-icons/cg';
import { BsEye, BsShare } from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
const OtherFileTab = ({ files, onShare }) => {
  const navigate = useNavigate();
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
          {files?.map((file, i) => (
            <tr key={file?.file_id} className="border-b border-white/50 text-sm *:p-2 *:mx-2 ">
              <td className="w-5">
                <CgFileDocument size={30} className="text-gray-400 bg-white rounded-lg p-2" />
              </td>
              <td className="min-w-24">
                <div>
                  <p>{file?.file_name}</p>
                  <span className="text-gray-500">{file?.upload_date?.split('T')[0]}</span>
                </div>
              </td>
              {/* <td className="min-w-24">
              <div className="flex gap-3 items-center">
                <span className={`${file?.file_ext === "pdf" ? "bg-green-500" : "bg-black"} w-3 h-3 rounded-full border-[2px] border-white`}></span>
                <p >{file?.file_ext}</p>
              </div>
            </td> */}
              <td className="min-w-24">{file?.file_size}</td>
              <td className="min-w-24">{file?.shared_by}</td>
              <td className="min-w-24">{file?.shared_date?.split('T')[0]}</td>
              <td className="min-w-24">
                <div className="flex items-center text-white">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-olive px-3 py-2 text-sm flex items-center gap-1"
                    // onClick={() => navigate(`/dashboard/file-view/${btoa(file?.file)}`, {state:{fileId:file?.file_id}})}
                    onClick={() => navigate(`/dashboard/view/${file?.file_id}`)}
                  >
                    <span><BsEye /></span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-oliveDark px-3 py-2 text-sm flex items-center gap-1"
                    onClick={() => onShare({file_id: file?.file_id, file_name: file?.file_name})}
                  >
                    <span><BsShare /></span>
                  </motion.button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default OtherFileTab;
