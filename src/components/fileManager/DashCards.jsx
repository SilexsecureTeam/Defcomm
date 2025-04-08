import React from "react";
import { useNavigate } from "react-router-dom";

const DashCards = ({files, groups}) => {
  const navigate=useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div onClick={()=>navigate('/dashboard/file-manager')} className="cursor-pointer bg-white p-4 min-h-28">
        <div className="flex flex-col justify-between h-full">
        <p className="text-lg font-semibold">Files</p>
        <h2 className="text-3xl font-extrabold">{files?.length ?? 0}</h2>
        </div>

      </div>
      <div onClick={()=>navigate('/dashboard/groups')} className="cursor-pointer bg-[#b6f382] text-black p-4 min-h-28">
      <div className="flex flex-col justify-between h-full">
        <p className="text-lg font-semibold">Groups</p>
        <h2 className="text-3xl font-extrabold">{groups?.length ?? 0}</h2>
        </div>
      </div>
      <div className="bg-[#b6f382] text-black p-4 min-h-28">
        <p className="text-lg font-semibold underline">File Summary</p>
        <div className="flex flex-wrap gap-2 text-sm mt-2">
          <div className="flex items-end gap-2 font-bold text-lg min-w-20">
            <div className="bg-black h-6 w-6"></div>...
          </div> 
          <div className="flex items-end gap-2 font-bold text-lg min-w-20">
            <div className="bg-black h-6 w-6"></div>...
          </div> 
          <div className="flex items-end gap-2 font-bold text-lg min-w-20">
            <div className="bg-black h-6 w-6"></div>...
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashCards;
