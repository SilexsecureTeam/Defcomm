import React from "react";
import { useNavigate } from "react-router-dom";
import img1 from '../../assets/arcticons_google-files.png'
import img2 from '../../assets/Vector.png'
import { FaFilePdf } from "react-icons/fa";
const DashCards = ({ files, groups }) => {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div onClick={() => navigate('/dashboard/file-manager')} className="cursor-pointer bg-white text-black p-4 min-h-28 flex justify-between items-center gap-2">
        <div className="flex flex-col justify-between h-full">
          <p className="text-lg font-semibold">Files</p>
          <h2 className="text-3xl font-extrabold">{files?.length ?? 0}</h2>
        </div>
        <img src={img1} className="w-12 h-12" />
      </div>
      <div onClick={() => navigate('/dashboard/groups')} className="cursor-pointer bg-[#b6f382] text-black p-4 min-h-28 flex justify-between items-center gap-2">
        <div className="flex flex-col justify-between h-full">
          <p className="text-lg font-semibold">Groups</p>
          <h2 className="text-3xl font-extrabold">{groups?.length ?? 0}</h2>
        </div>
        <img src={img2} className="w-12 h-12" />
      </div>
      <div className="bg-[#b6f382] text-black p-4 min-h-28">
        <p className="text-lg font-semibold underline">File Summary</p>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          {files?.slice(-3)?.map(file=>(
            <div onClick={() => navigate('/dashboard/file-manager')} className="truncate cursor-pointer flex items-end gap-1 text-sm min-w-20 hover:underline">
            <FaFilePdf size={28} />
            {file?.name?.length > 5 ? `${file?.name?.slice(0,5)}...`:file?.name} 
          </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default DashCards;
