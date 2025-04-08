import React from "react";
import { FaFile } from 'react-icons/fa6'
import {CiSearch } from 'react-icons/ci'
import defIcon from '../../assets/logo-icon.png'
const PendingFileInvites = () => {
  
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
      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[700px] text-left">
        <thead>
          <tr className="text-sm border-b *:p-3">
            <th>NAME</th>
            <th>SIZE</th>
            <th>INVITATION CODE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2].map((_, idx) => (
            <tr key={idx} className="text-sm *:p-3">
              <td className="flex items-center gap-2">
                <img src={defIcon} alt="icon" className="w-8 h-8" />
                Joshua Damilare
              </td>
              <td>10kb</td>
              <td>XXXXXXXXXXXXXXX</td>
              <td>
                <button className="bg-oliveGreen font-medium text-black px-4 py-1">Actions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PendingFileInvites;
