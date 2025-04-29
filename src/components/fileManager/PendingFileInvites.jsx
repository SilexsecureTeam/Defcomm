import React, { useEffect } from "react";
import { FaFile } from 'react-icons/fa6'
import {CiSearch } from 'react-icons/ci'
import defIcon from '../../assets/logo-icon.png'
import PendingFileInvitationsTab from "./PendingFileInvitationsTab";
import useFileManager from "../../hooks/useFileManager";
const PendingFileInvites = () => {

  const {
    fileRequests,
    refetchFileRequests,
    shareFile,
  } = useFileManager();

  useEffect(() => {
      refetchFileRequests();
  }, []);
  
  return (
    <div className="bg-[#2a4b14] text-white p-4 mb-6">
      <section className="py-3 flex flex-wrap justify-between gap-2">
        <h2 className="font-bold mb-4 flex items-center gap-5 text-xl">
          <FaFile size={30} />
          <span>Pending File Invitation</span></h2>
        <div className="flex justify-between items-center gap-3 mb-2 text-black font-medium px-3 py-1 bg-[#b6f382] rounded-full">
          <CiSearch size={20} />
          <input type="text" placeholder="Search File" className="flex-1 bg-transparent px-2 rounded-full placeholder:text-inherit focus:ring-0 focus:border-0 focus:outline-0" />
        </div>
      </section>
      <PendingFileInvitationsTab invitations={fileRequests} />
    </div>
  );
};

export default PendingFileInvites;
