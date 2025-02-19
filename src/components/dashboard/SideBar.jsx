import React, { useContext, useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
// import mainLogo from "../../assets/svgs/main-logo.svg";
// import mainLogoTwo from "../../assets/pngs/main-logo-icon.png";
import { MdClose } from "react-icons/md";

function SideBar({
  children,
  authDetails,
  toogleIsOpen,
  isMenuOpen,
}) {
 
  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 bg-oliveLight text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Defcomm Panel
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-4">
            {children[0]}

          </ul>
          <ul className="space-y-4">
            {children[1]}
          </ul>
        </nav>
        <button className="flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg mx-4 my-4">
          <FiLogOut size={20} /> Logout
        </button>
      </aside>
    </>
  );
}

export default React.memo(SideBar);
